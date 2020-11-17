package gw.cucumber.context.impl.smoketest.common

uses com.google.inject.Inject
uses cucumber.api.DataTable
uses gw.api.database.Queries
uses gw.api.database.Query
uses gw.api.database.Relop
uses gw.api.databuilder.ExposureBuilder
uses gw.api.locale.DisplayKey
uses gw.api.util.LocaleUtil
uses gw.cucumber.CucumberStepBase
uses gw.cucumber.context.api.common.ExposureContext
uses gw.cucumber.context.impl.smoketest.util.Navigation
uses gw.cucumber.setup.PolicyDataSet
uses gw.cucumber.testdata.DataWrapper
uses gw.cucumber.transformer.TypelistTransformer
uses gw.cucumber.util.common.UIHelper
uses org.fest.assertions.Condition
uses pcftest.NewExposure

@SuppressWarnings("unused")
class ExposureContextImpl extends CucumberStepBase implements ExposureContext {
  @Inject
  var _policyDataSetWrapper : DataWrapper<PolicyDataSet>

  @Inject
  var _claimWrapper : DataWrapper<Claim>

  @Inject
  var _exposureWrapper : DataWrapper<Exposure>

  override function createExposureForCoverageType(coverageTypeText : String) {
    var coverageType = CoverageType.getTypeKeys(false).singleWhere(\coverageType ->
        (coverageType.DisplayName.equalsIgnoreCase(coverageTypeText) or coverageType.getDisplayName(LocaleUtil.toLanguage(LanguageType.getTypeKey("en_US"))).equalsIgnoreCase(coverageTypeText)) and
            coverageType.Categories.whereTypeIs(PolicyType).hasMatch(\policyType -> policyType == _policyDataSetWrapper.get().PolicyType)
    )
    var claim = _claimWrapper.get()
    var exposure : Exposure
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      exposure = ExposureBuilder.uiReadyForCoverageType(coverageType).onClaim(claim).create(bundle)
      if (exposure.Incident typeis VehicleIncident) {
        exposure.Incident.ChildSafetySeat_Ext = ChildSafetySeat_Ext.TC_UNKNOWN
      }
      claim.Bundle.commit()
    }, CurrentUser)
    _exposureWrapper.set(exposure)
  }

  override function createBodilyInjuryExposure() {
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      _exposureWrapper.set(ExposureBuilder.uiReadyForCoverageType(CoverageType.TC_BOD_INJ_PA_EXT)
          .create(bundle))
    }, CurrentUser)
  }

  override function closeExposure() {
    var exposure = _exposureWrapper.get()?:_claimWrapper.get().Exposures.single()
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      exposure = bundle.add(exposure)
      exposure.close(ExposureClosedOutcomeType.TC_COMPLETED, "testing purpose")
    }, CurrentUser)
    _exposureWrapper.set(exposure)
  }

  override function closeAllOpenExposures() {
    var claim = _claimWrapper.get()
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      claim = bundle.add(claim)
      claim.Exposures.each(\exposure -> {
        if (!exposure.isClosed()) {
          exposure.close(ExposureClosedOutcomeType.TC_COMPLETED, "testing purpose")
        }
      })
    }, User.util.UnrestrictedUser) // Using unrestricted user here to close exposures that assigned to users other than the current user
    _claimWrapper.set(claim)
  }

  override function createComprehensiveExposure() {
    var newExp = new Navigation<NewExposure>(_proxy).ensureOnPage(\tabBar ->
        tabBar.goToClaim(_claimWrapper.get()).goToNewExposureByCoverageSubtype(CoverageSubtype.TC_COMP_EXT),
        CurrentUser)
    var vehicleDamageDV = newExp.NewExposureScreen.NewExposureDV_Vehicledamage.NewClaimVehicleDamageDV
    vehicleDamageDV.Claimant_Picker.selectFirstValidOption()
    vehicleDamageDV.Claimant_Type.selectFirstValidOption()

    var popup = vehicleDamageDV.Vehicle_Incident.NewClaimVehicleDamageDV_NewIncidentMenuItem.click()
    var popupDetails = popup.NewVehicleIncidentScreen.VehIncidentDetailDV.VehicleIncidentDV
    popupDetails.Vehicle_Picker.getOptionByLabel("New...").click()
    popupDetails.Vehicle_Make.Value = "Toyota"
    popupDetails.Vehicle_Model.Value = "Corolla"
    popupDetails.Vehicle_Year.Value = "2001"
    popupDetails.Driver_Picker.getOption(1).click()
    popupDetails.Description.Value = "test vehicle incident"
    var location = popup.NewVehicleIncidentScreen.Update.click()
    UIHelper.assertNoMessages(location)

    var exps = newExp.update()

    var order = exps.ClaimExposuresScreen.ExposuresLV._Entries.max(\elt -> Integer.valueOf(elt.Order.Text))
    var exp = Queries.createQuery<Exposure>(Exposure)
        .compare(Exposure#Claim, Relop.Equals, _claimWrapper.get())
        .compare(Exposure#ClaimOrder, Relop.Equals, order)
        .select().single()
    _exposureWrapper.set(exp)
  }

  override function verifyExposure(coverageOrExposureTypeText : String) {
    var claim = _claimWrapper.get()

    assertThat(claim.Exposures).as("No Exposure found matching ${coverageOrExposureTypeText}. Actual: Coverages: [${claim.Exposures*.PrimaryCoverage.join(", ")}], " +
        "Exposure Types: [${claim.Exposures*.ExposureType.join(", ")}]").satisfies(new Condition<Exposure[]>() {
      override function matches(exposures : Exposure[]) : boolean {
        return exposures.hasMatch(\exposure -> exposure.PrimaryCoverage.DisplayName.equalsIgnoreCase(coverageOrExposureTypeText) or
            exposure.ExposureType.DisplayName.equalsIgnoreCase(coverageOrExposureTypeText))
      }
    })
  }

  override function setValidationLevel(validationLevel : ValidationLevel) {
    var exposure = (_exposureWrapper.get() ?: _claimWrapper.get().Exposures.single()) as Exposure
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      exposure = bundle.add(exposure)
      exposure.Incident.Description = "testing purpose"
      exposure.ValidationLevel = validationLevel
    }, CurrentUser)
    _exposureWrapper.set(exposure)
  }

  override function anExposureShouldExistOnTheClaim(table : DataTable) {
    var claim = _claimWrapper.get()

    for (row in table.asMaps(String, String)) {
      var coverage = new TypelistTransformer<CoverageType>().transform(row.get(DisplayKey.get("Web.ExposureRules.Action.CreateExposure.CoverageType")), _policyDataSetWrapper.get().PolicyType)
      var coverageSubtype = new TypelistTransformer<CoverageSubtype>().transform(row.get(DisplayKey.get("Web.ExposureRules.Action.CreateExposure.CoverageSubtype")), coverage)
      assertThat(claim.Exposures.firstWhere(\exp -> exp.Coverage.Type == coverage and exp.CoverageSubType == coverageSubtype))
          .as("Expected exposure on the claim with coverage ${row.get("Coverage")} and coverage subtype ${row.get("Coverage Subtype")}")
          .isNotNull()
    }
  }

  override function anExposureShouldNotExistOnTheClaim(table : DataTable) {
    var claim = _claimWrapper.get()

    for (row in table.asMaps(String, String)) {
      var coverage = new TypelistTransformer<CoverageType>().transform(row.get(DisplayKey.get("Web.ExposureRules.Action.CreateExposure.CoverageType")), _policyDataSetWrapper.get().PolicyType)
      var coverageSubtype = new TypelistTransformer<CoverageSubtype>().transform(row.get(DisplayKey.get("Web.ExposureRules.Action.CreateExposure.CoverageSubtype")), coverage)
      assertThat(claim.Exposures.firstWhere(\exp -> exp.Coverage.Type == coverage and exp.CoverageSubType == coverageSubtype))
          .as("Unexpected exposure found on the claim with coverage ${row.get("Coverage")} and coverage subtype ${row.get("Coverage Subtype")}")
          .isNull()
    }
  }

  override function verifyExposureSegment(exposureSegmentText : String) {
    var segment = new TypelistTransformer<ClaimSegment>().transform(exposureSegmentText)
    var exposures : Exposure[]
    if (_exposureWrapper.get() != null) {
      exposures = {_exposureWrapper.get()}
    } else if (_claimWrapper.get() != null) {
      exposures = Query.make(Claim).compare(Claim#ID, Equals, _claimWrapper.get().ID).select().single().Exposures
    }
    for (exposure in exposures) {
      assertThat(exposure.Segment).isEqualTo(segment)
    }
  }

}
package gw.cucumber.context.impl.smoketest.pa

uses com.google.inject.Inject
uses cucumber.api.DataTable
uses gw.api.database.Query
uses gw.api.databuilder.ClaimBuilder
uses gw.api.databuilder.ExposureBuilder
uses gw.api.databuilder.FixedPropertyIncidentBuilder
uses gw.api.databuilder.IncidentBuilderBase
uses gw.api.databuilder.InjuryIncidentBuilder
uses gw.api.databuilder.PolicyBuilder
uses gw.api.databuilder.VehicleBuilder
uses gw.api.databuilder.VehicleCoverageBuilder
uses gw.api.databuilder.VehicleIncidentBuilder
uses gw.api.databuilder.VehicleRUBuilder
uses gw.api.locale.DisplayKey
uses gw.api.util.DateUtil
uses gw.cucumber.context.api.pa.PAClaimContext
uses gw.cucumber.context.impl.smoketest.common.ClaimContextImpl
uses gw.cucumber.context.impl.smoketest.util.Navigation
uses gw.cucumber.setup.PolicyDataSet
uses gw.cucumber.testdata.DataWrapper
uses gw.cucumber.transformer.CurrencyAmountTransformer
uses gw.cucumber.transformer.SpecialistServiceTransformer
uses gw.cucumber.transformer.TypelistTransformer
uses gw.cucumber.util.common.UIHelper
uses gw.plugin.Plugins
uses gw.plugin.policy.search.IPolicySearchAdapter
uses gw.rest.testsupport.v1.plugin.policy.PolicyStorePlugin
uses pcftest.ClaimLossDetails
uses pcftest.ClaimPolicyGeneral
uses pcftest.FNOLContactPopup
uses pcftest.FNOLVehicleIncidentPopup
uses pcftest.NewFixedPropertyIncidentPopup
uses pcftest.OtherServiceRequestPopup

@SuppressWarnings("unused")
class PAClaimContextImpl extends ClaimContextImpl implements PAClaimContext {
  @Inject
  protected var _vehicleDisplayNameWrapper : DataWrapper<String>

  @Inject
  protected var _exposureWrapper : DataWrapper<Exposure>

  override function createPolicyDataSet() {
    var policy = new PolicyBuilder()
        .uiReadyPersonalAuto()
        .withVerified(true)
        .withRiskUnit(new VehicleRUBuilder()
            .withRUNumber(1)
            .withVehicle(new VehicleBuilder().uiReadyVehicle())
            .withCoverage(new VehicleCoverageBuilder()
                .withIncidentLimit(15000bd.ofDefaultCurrency())
                .withType(TC_COL_PA_EXT)))
        .create()
    (_policyDataSetWrapper.get() as PolicyDataSet).PolicyNumber = policy.PolicyNumber

    var policyPlugin = Plugins.get(IPolicySearchAdapter) as PolicyStorePlugin
    policyPlugin.addPolicy(policy)
  }

  override function createUnverifiedPolicy() {
    var wizard = Wizard
    var policyNumber = PolicyBuilder.nextPolicyNumber()
    wizard.FindPolicy.FNOLWizard_FindPolicyScreen.createPolicyWithDates(policyNumber, PolicyType.TC_PERSONALAUTO, "Auto", DateUtil.currentDate())
    var policyGeneralPanelSetAuto = wizard.FindPolicy.FNOLWizard_FindPolicyScreen.FNOLWizardFindPolicyPanelSet_Create.NewClaimPolicyGeneralPanelSet_Auto
    var newContactPopup = policyGeneralPanelSetAuto.NewClaimPolicyGeneralDV.Insured_Name.ClaimNewContactPickerMenuItemSet.NewContactPickerMenuItemSet_NewPerson.click()
    newContactPopup.PersonLastName.Value = "Created by PAClaimContext"
    var location = newContactPopup.customUpdate()
    UIHelper.assertNoMessages(location)

    (_policyDataSetWrapper.get() as PolicyDataSet).PolicyNumber = policyNumber
  }

  override function createClaim() {
    var claim : Claim
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      claim = ClaimBuilder.uiReadyAuto()
          .withPolicy(new PolicyBuilder()
              .uiReadyPersonalAuto()
              .withVerified(true)
              .withRiskUnit(new VehicleRUBuilder()
                  .withRUNumber(1)
                  .withVehicle(new VehicleBuilder().uiReadyVehicle())
                  .withCoverage(new VehicleCoverageBuilder()
                      .withIncidentLimit(15000bd.ofDefaultCurrency())
                      .withType(TC_COL_PA_EXT))
                  .withCoverage(new VehicleCoverageBuilder()
                      .withIncidentLimit(15000bd.ofDefaultCurrency())
                      .withType(TC_COM_PA_EXT)
                  )
              )
          )
          .withNonConflictingClaimNumber()
          .create(bundle)
    }, CurrentUser)
    captureNewlyCreatedClaim(claim)
  }

  override function startFilingAutoFirstAndFinal() {
    var wizard = _proxy.TabBar.goToNewClaim()
    if (_policyDataSetWrapper.get() != null) {
      wizard.SelectPolicy.findPolicy(_policyDataSetWrapper.get().PolicyNumber, Date.Today)
      wizard.SelectPolicy.FNOLWizardFindPolicyPanelSet_Search.ClaimMode.clickByLabelSubstr(DisplayKey.get("Wizard.NewClaimWizard.AutoFirstAndFinal.Label"))
    }
  }

  override function setLossCause(lossCauseText : String) {
    var lossCause = new TypelistTransformer<LossCause>().transform(lossCauseText)
    var wizard = Wizard
    wizard.goToLossDetailsAuto()
    wizard.LossDetailsAUTO.LossDetailsAddressDV.Claim_LossCause.TypeKeyValue = lossCause
  }

  override function createInjuryIncident(lossPartyTypeText : String) {
    var lossPartyType = new TypelistTransformer<LossPartyType>().transform(lossPartyTypeText)
    var wizard = Wizard
    wizard.goToLossDetailsAuto()

    var fnolContactPopup : FNOLContactPopup
    if (lossPartyType == LossPartyType.TC_THIRD_PARTY) {
      fnolContactPopup = wizard.LossDetailsAUTO.AddPedestrianButton.click()
      fnolContactPopup.addInjuredContact(lossPartyType, SeverityType.TC_MINOR, "Phillips")
    } else {
      if (wizard.LossDetailsAUTO.VehicleIncidentIterator._Entries.Count == 0) {
        var vehicleIncidentPopup = wizard.LossDetailsAUTO.AddVehicleButton.click()
        vehicleIncidentPopup.FNOLVehicleIncidentScreen.LossParty.BoolValue = true // set vehicle loss party to insured's loss
        vehicleIncidentPopup.FNOLVehicleIncidentScreen.Vehicle_Picker.selectFirstValidOption()
        fnolContactPopup = vehicleIncidentPopup.FNOLVehicleIncidentScreen.OccupantLV_tb.AddDriverButton.click() as pcftest.FNOLContactPopup
        fnolContactPopup.addInjuredContact(lossPartyType, SeverityType.TC_MINOR, "Edgar")
        var location = vehicleIncidentPopup.FNOLVehicleIncidentScreen.Update.click()
        UIHelper.assertNoMessages(location)
      } else if (wizard.LossDetailsAUTO.VehicleIncidentIterator._Entries.Count == 1) {
        var vehicleIncidentPopup = wizard.LossDetailsAUTO.VehicleIncidentIterator._Entries.single().VehicleIncidentDV.VehicleName.EditVehicleMenu.click()
        if (vehicleIncidentPopup.FNOLVehicleIncidentScreen.OccupantLV_tb.AddDriverButton.Visible) {
          fnolContactPopup = vehicleIncidentPopup.FNOLVehicleIncidentScreen.OccupantLV_tb.AddDriverButton.click() as FNOLContactPopup
        } else {
          fnolContactPopup = vehicleIncidentPopup.FNOLVehicleIncidentScreen.OccupantLV_tb.AddPassengerButton.click() as FNOLContactPopup
        }
        fnolContactPopup.addInjuredContact(lossPartyType, SeverityType.TC_MINOR, "Smith")
        if (vehicleIncidentPopup.FNOLVehicleIncidentScreen.Description.Enabled) {
          vehicleIncidentPopup.FNOLVehicleIncidentScreen.Description.Value = "Test Description"
        }
        var location = vehicleIncidentPopup.FNOLVehicleIncidentScreen.Update.click()
        UIHelper.assertNoMessages(location)
      } else {
        throw new UnsupportedOperationException()
      }
    }
  }

  override function createCheckDuringAutoFirstAndFinal(checkAmount : String, payeeName : String) {
    var currencyAmount = _currencyAmountTransformer.transform(checkAmount)

    var wizard = Wizard
    wizard.goToAutoFirstAndFinal()
    var autoFirstAndFinalScreen = wizard.QuickClaimAutoFirstAndFinal.FNOLWizard_AutoFirstAndFinalScreen
    autoFirstAndFinalScreen.FNOLWizardCheckDV_ready.Payee_Picker.clickByLabelSubstr(payeeName)
    autoFirstAndFinalScreen.FNOLWizardCheckDV_ready.PayeeRole.getOptionByLabel("Other").click()
    autoFirstAndFinalScreen.FNOLWizardCheckDV_ready.CheckAmount.Value = currencyAmount.Amount.toString()
    autoFirstAndFinalScreen.FNOLWizardCheckDV_ready.ApplyDeductible.BoolValue = false
    autoFirstAndFinalScreen.FNOLWizardCheckDV_ready.CheckMailTo.Value = "Temp address"
    autoFirstAndFinalScreen.FNOLWizardCheckDV_ready.MailingAddressInputSet.CCAddressInputSet.setAddress("200 Somewhere Street", "San Mateo", TC_CA, "94404")
  }

  override function addThirdPartyVehicle(table : DataTable) {
    Wizard.goToLossDetailsAuto()

    for (row in table.asMaps(String, String)) {
      var popup = Wizard.LossDetailsAUTO.AddVehicleButton.click() as FNOLVehicleIncidentPopup
      var screen = popup.FNOLVehicleIncidentScreen
      screen.LossParty.setBoolValue(false)
      screen.Vehicle_VehicleType.getOptionByLabel(row.get(DisplayKey.get("Web.VehicleIncidentDV.Vehicle.Type"))).click()
      screen.Vehicle_Year.setValue(row.get(DisplayKey.get("Web.VehicleIncidentDV.Vehicle.Year")))
      screen.Vehicle_Make.setValue(row.get(DisplayKey.get("Web.VehicleIncidentDV.Vehicle.Make")))
      screen.Vehicle_Model.setValue(row.get(DisplayKey.get("Web.VehicleIncidentDV.Vehicle.Model")))
      screen.Description.setValue(row.get(DisplayKey.get("Web.VehicleIncidentDV.Description")))
      screen.TotalLoss.setBoolValue(row.get(DisplayKey.get("Web.FNOLVehicleIncidentPopup.PossibleTotalLoss.Label")) == "Yes")
      screen.Operable.setBoolValue(row.get(DisplayKey.get("Web.VehicleIncidentDV.Operable")) == "Yes")
      screen.Exposure_AirbagsDeployed.setBoolValue(row.get(DisplayKey.get("Web.VehicleIncidentDV.AirbagsDeployed")) == "Yes")
      screen.Exposure_EquipmentFailure.setBoolValue(row.get(DisplayKey.get("Web.VehicleIncidentDV.EquipmentFailure")) == "Yes")
      screen.Update.click()
    }
  }

  override function addAPropertyDamageLiability(table : DataTable) {
    var wizard = Wizard
    wizard.goToLossDetailsAuto()

    var lossDetails = wizard.LossDetailsAUTO
    var popup = lossDetails.AddPropertyDamageButton.click() as NewFixedPropertyIncidentPopup
    var dv = popup.NewFixedPropertyIncidentScreen.FixPropIncidentDetailDV.FixedPropertyIncidentDV
    for (row in table.asMaps(String, String)) {
      dv.CCAddressInputSet.Address_Picker.getOptionByLabel(DisplayKey.get("Web.Financials.ReserveLineInputSet.ReserveLine.New")).click()
      UIHelper.setFieldValues(dv, row)
      dv.LossEstimate.setValue(row.get(DisplayKey.get("Web.FixedPropertyIncident.LossEstimate")))
      popup.NewFixedPropertyIncidentScreen.Update.click()
    }
    UIHelper.assertNoMessages(popup)
  }

  override function selectReadyToPay(readyToPayText : String) {
    throw new UnsupportedOperationException("Ready to Pay cannot be set for 'full wizard' claims")
  }

  override function finishFilingClaim() {
    var wizard = Wizard
    wizard.goToAssignAndSaveAuto()
    var newClaimSaved = wizard.finishSuccessfully()
    captureNewlyCreatedClaim(newClaimSaved.ClaimEntity)
  }

  override function submitClaimsForAdjudication(noOfClaims : String) {
    var policyDataSet = _policyDataSetWrapper.get()
    for (i in 1..noOfClaims.toInt()) {
      var wizard = _proxy.TabBar.goToNewClaim()
      if (policyDataSet != null && policyDataSet.PolicyNumber != null) {
        var policyNumber = policyDataSet.PolicyNumber
        wizard.SelectPolicy.findPolicy(policyNumber, Date.Today)
        wizard.SelectPolicy.SearchPanel.Search.click()
        wizard.goToAssignAndSaveAuto()
        var newClaimSaved = wizard.finishSuccessfully()
        captureNewlyCreatedClaim(newClaimSaved.ClaimEntity)
      }
    }
  }

  override function reportedByInsured() {
    var wizard = Wizard
    wizard.goToBasicInfoAuto()
    wizard.BasicInfoAUTO.setReportedByToInsured()
  }

  override function reportedByThirdParty() {
    var wizard = Wizard
    wizard.goToBasicInfoAuto()
    wizard.BasicInfoAUTO.setReportedByToThirdParty()
  }

  override function setInsuredAsClaimant() {
    throw new UnsupportedOperationException("Claimants should be set per exposure for 'full wizard' claims")
  }

  override function addClaimLevelServices(serviceName : String, serviceRequestKindText : String) {
    var serviceRequestKind = new TypelistTransformer<ServiceRequestKind>().transform(serviceRequestKindText)
    var service = new SpecialistServiceTransformer().transform(serviceName)
    var wizard = Wizard
    wizard.goToServicesAuto()
    if (wizard.ServicesAUTO.FirstIncidentAddOtherServicesAvailable) {
      wizard.ServicesAUTO.clickFirstIncidentAddOtherServices().addOtherServiceRequest(service, serviceRequestKind, null)
    } else {
      //There are not involved vehicles
      wizard.ServicesAUTO.OtherServicesLVInputGroupInputSet.OtherServicesInputGroup._checkbox.click()
      var otherServicesPopup = wizard.ServicesAUTO.OtherServicesLVInputGroupInputSet.OtherServicesInputGroup.OtherServicesLVInputSet.OtherServicesLV_tb.AddServiceRequest.click() as OtherServiceRequestPopup
      otherServicesPopup.addOtherServiceRequest(service, serviceRequestKind, null)
    }
  }

  override function verifyClaimLossCause(lossCauseText : String) {
    var lossCause = new TypelistTransformer<LossCause>().transform(lossCauseText)
    var claimLossDetails = new Navigation<ClaimLossDetails>(_proxy)
        .ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToLossDetails(), CurrentUser)

    assertThat(claimLossDetails.ClaimLossDetailsScreen.LossDetailsPanelSet_default.LossDetailsCardCV.LossDetailsDV_Auto.LossCause.TypeKeyValue)
        .as("The claim loss cause should be ${lossCause}")
        .isEqualTo(lossCause)
  }

  override function setLossLocationInState(stateText : String) {
    var state = new TypelistTransformer<State>().transform(stateText)
    var wizard = Wizard
    wizard.goToLossDetailsAuto()
    wizard.LossDetailsAUTO.LossDetailsAddressDV.AddressDetailInputSetRef.CCAddressInputSet.setAddress("123 St", "San Mateo", state, "94400")
  }

  override function addInjuryExposure(coverageSubtype : CoverageSubtype = null) {
    var wizard = Wizard
    wizard.goToAssignAndSaveAuto()
    super.addInjuryExposure(coverageSubtype ?: CoverageSubtype.TC_UNI_MOT_INJ_EXT)
  }

  override function addCollisionExposure(coverageSubtype : CoverageSubtype = null) {
    var wizard = Wizard
    wizard.goToAssignAndSaveAuto()
    super.addCollisionExposure(coverageSubtype ?: CoverageSubtype.TC_COL_PA_EXT)
  }

  override function selectInvolvedVehicle(indexString : String) {
    var index = indexString.substring(0, 1).toInt() - 1

    var wizard = Wizard
    wizard.goToBasicInfoAuto()
    wizard.BasicInfoAUTO.RightColumnAUTO.toggleVehicleCheckboxByIndex(index)
    var vehicleDisplayName = wizard.BasicInfoAUTO.RightColumnAUTO._Entries.get(index).InsuredVehicleDV.InsuredVehicleInputGroup._checkbox.Text
    _vehicleDisplayNameWrapper.set(vehicleDisplayName)
  }

  override function addRepairShop(name : String) {
    var wizard = Wizard
    wizard.goToServicesAuto()
    wizard.ServicesAUTO.FirstIncidentAutobodyInputGroup._checkbox.click()
    var newContactPopup = wizard.ServicesAUTO.FirstIncidentAutobodyInputGroup.RepairShop.ClaimNewRepairShopOnlyPickerMenuItemSet.NewContactPickerMenuItemSet_AutoRepairShop.click()
    var contactBasicsDV_repairShop = newContactPopup.ContactDetailScreen.ContactBasicsDV_AutoRepairShop
    contactBasicsDV_repairShop.OrganizationName.GlobalContactNameInputSet_default.Name.Value = name

    var addressInputSet = contactBasicsDV_repairShop.PrimaryAddressInputSet.CCAddressInputSet
    addressInputSet.Address_AddressLine1.Value = "Address line 1"
    addressInputSet.Address_City.Value = "San Jose"
    addressInputSet.Address_State.clickByLabelSubstr("California")
    newContactPopup.ContactDetailScreen.setRequiredFieldsIfNotPresent()
    var location = newContactPopup.update()
    UIHelper.assertNoMessages(location)
  }

  override function autoAssignClaimAndExposures() {
    Wizard.goToAssignAndSaveAuto()
    super.autoAssignClaimAndExposures()
  }

  override function autoAssignClaimIndividually() {
    Wizard.goToAssignAndSaveAuto()
    super.autoAssignClaimIndividually()
  }

  override function autoAssignExposureIndividually(coverageTypeText : String) {
    Wizard.goToAssignAndSaveAuto()
    super.autoAssignExposureIndividually(coverageTypeText)
  }

  override function assignClaimAndExposuresToGroupAndUser(groupName : String, userDisplayName : String) {
    Wizard.goToAssignAndSaveAuto()
    super.assignClaimAndExposuresToGroupAndUser(groupName, userDisplayName)
  }

  override function assignClaimIndividuallyToGroupAndUser(groupName : String, userDisplayName : String) {
    Wizard.goToAssignAndSaveAuto()
    super.assignClaimIndividuallyToGroupAndUser(groupName, userDisplayName)

    var a = 1
  }

  override function assignExposureIndividuallyToGroupAndUser(coverageTypeText : String, groupName : String, userDisplayName : String) {
    Wizard.goToAssignAndSaveAuto()
    super.assignExposureIndividuallyToGroupAndUser(coverageTypeText, groupName, userDisplayName)
  }

  function verifyDamagedVehicleOnClaim(table : DataTable) {
    for (row in table.asMaps(String, String)) {
      assertThat(_claimWrapper.get().VehicleIncidentsOnly.singleWhere(\incident ->
          incident.LossParty == LossPartyType.TC_THIRD_PARTY and
              incident.VehicleType == new TypelistTransformer<VehicleType>().transform(row.get(DisplayKey.get("Web.VehicleIncidentDV.Vehicle.Type"))) and
              incident.Vehicle.Year == row.get(DisplayKey.get("Web.VehicleIncidentDV.Vehicle.Year")).toInt() and
              incident.Vehicle.Make == row.get(DisplayKey.get("Web.VehicleIncidentDV.Vehicle.Make")) and
              incident.Vehicle.Model == row.get(DisplayKey.get("Web.VehicleIncidentDV.Vehicle.Model")) and
              incident.Description == row.get(DisplayKey.get("Web.VehicleIncidentDV.Description")) and
              incident.TotalLoss == (row.get(DisplayKey.get("Web.FNOLVehicleIncidentPopup.PossibleTotalLoss.Label")) == "Yes") and
              incident.VehicleOperable == (row.get(DisplayKey.get("Web.VehicleIncidentDV.Operable")) == "Yes") and
              incident.AirbagsDeployed == (row.get(DisplayKey.get("Web.VehicleIncidentDV.AirbagsDeployed")) == "Yes") and
              incident.EquipmentFailure == (row.get(DisplayKey.get("Web.VehicleIncidentDV.EquipmentFailure")) == "Yes")
      )).as("No vehicle incident on claim with attributes: ${row.Values.join(", ")}").isNotNull()
    }
  }

  override function verifyPropertyDamageLiability(table : DataTable) {
    for (var row in table.asMaps(String, String)) {
      assertThat(_claimWrapper.get().FixedPropertyIncidentsOnly.singleWhere(\elt ->
          elt.PropertyDesc == row.get(DisplayKey.get("Web.DwellingIncident.PropertyDescription")) and
              elt.Description == row.get(DisplayKey.get("Web.DwellingIncident.Description")) and
              elt.LossEstimate == new CurrencyAmountTransformer().transform(row.get(DisplayKey.get("Web.FixedPropertyIncident.LossEstimate"))) and
              elt.Property.Address.AddressLine1 == row.get(DisplayKey.get("Web.FixedPropertyIncident.Property.Address.AddressLine1")) and
              elt.Property.Address.City == row.get(DisplayKey.get("Web.FixedPropertyIncident.Property.Address.City")) and
              elt.Property.Address.State == new TypelistTransformer<State>().transform(row.get(DisplayKey.get("Web.FixedPropertyIncident.Property.Address.State")))
      )).as("At least one property damage incident should exist on the claim").isNotNull()
    }
  }

  override function verifyVehicleIncidentCreated() {
    var claim = _claimWrapper.get()
    assertThat(claim.VehicleIncidentsOnly.Count).isEqualTo(1)
    assertThat(claim.VehicleIncidentsOnly.single().Vehicle.DisplayName).containsIgnoringCase(_vehicleDisplayNameWrapper.get())
  }

  override function otherPartiesAreAtFault() {
    gw.transaction.Transaction.runWithNewBundle(\b -> {
      var claim = b.add(_claimWrapper.get())
      claim.FaultRating = FaultRating.TC_THIRDPARTY
    }, CurrentUser)
  }

  override function iSetAnotherPartyIsAtFault() {
    var claimLossDetails = new Navigation<ClaimLossDetails>(_proxy)
        .ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToLossDetails(), CurrentUser)
    claimLossDetails.ClaimLossDetailsScreen.Edit.click()
    claimLossDetails.ClaimLossDetailsScreen.LossDetailsPanelSet_default.LossDetailsCardCV.LossDetailsDV_Auto.Notification_Fault.getOptionByTypeKey(FaultRating.TC_THIRDPARTY).click()
    claimLossDetails.ClaimLossDetailsScreen.Update.click()
    //Update the claim in the wrapper
    _claimWrapper.set(Query.make(Claim).compare(Claim#ClaimNumber, gw.api.database.Relop.Equals, _claimWrapper.get().ClaimNumber).select().AtMostOneRow)
  }

  protected override function isPolicyVerified(claimPolicyGeneralScreen : ClaimPolicyGeneral) : boolean {
    return claimPolicyGeneralScreen.ClaimPolicyGeneralScreen.PolicyGeneralPanelSet_Auto
        .PolicyGeneralDV.Other_VerifiedPolicy.BoolValue
  }

  override function createAClaimWithMidComplexityExposure() {
    var claim : Claim
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      claim = createClaimBuilder()
          .withExposure(ExposureBuilder.uiReadyVehicleDamage().uiReadyForCoverageType(CoverageType.TC_COL_PA_EXT))
          .create(bundle)
    }, CurrentUser)
    executeSegmentationRulesOnClaim(claim)
  }

  override function getExposureBuilder(exposureMap : Map<String, String>, exposureType : ExposureType, lossPartyType : LossPartyType, severityStr : String) : ExposureBuilder {
    var exposureBuilder : ExposureBuilder
    var incidentBuilder : IncidentBuilderBase
    switch (exposureType) {
      case null:
      case ExposureType.TC_VEHICLEDAMAGE:
        exposureBuilder = ExposureBuilder.uiReadyVehicleDamage().uiReadyForCoverageType(CoverageType.TC_COL_PA_EXT)
        incidentBuilder = VehicleIncidentBuilder.uiReadyVehicleIncident()
        if (incidentBuilder typeis VehicleIncidentBuilder) {
          incidentBuilder.withTotalLoss(exposureMap.get(DisplayKey.get("Web.VehicleIncidentDV.TotalLoss")) == "true")
        }
        break
      case ExposureType.TC_BODILYINJURYDAMAGE:
        exposureBuilder = ExposureBuilder.uiReadyBodilyInjuryDamage().uiReadyForCoverageType(CoverageType.TC_BOD_INJ_PA_EXT)
        incidentBuilder = InjuryIncidentBuilder.uiReadyInjuryIncident()
        break
      case ExposureType.TC_PIPDAMAGES:
        exposureBuilder = ExposureBuilder.uiReadyPIPDamages().uiReadyForCoverageType(CoverageType.TC_PER_INJ_PRO_PA_EXT)
        incidentBuilder = InjuryIncidentBuilder.uiReadyInjuryIncident()
        break
      case ExposureType.TC_PROPERTYDAMAGE:
        exposureBuilder = ExposureBuilder.uiReadyPropertyDamage(lossPartyType).uiReadyForCoverageType(CoverageType.TC_PRO_DAM_PA_EXT)
        incidentBuilder = FixedPropertyIncidentBuilder.uiReadyFixedPropertyIncident()
        break
      case ExposureType.TC_TOWONLY:
        exposureBuilder = ExposureBuilder.uiReadyTowingAndLabor().uiReadyForCoverageType(CoverageType.TC_TOW_AND_ROA_SER_PA_EXT)
        incidentBuilder = VehicleIncidentBuilder.uiReadyVehicleIncident()
        break
      default:
        throw new UnsupportedOperationException("Not yet implemented for ${exposureType}")
    }
    addSeverityToIncident(incidentBuilder, severityStr)
    exposureBuilder.withIncident(incidentBuilder)
    exposureBuilder.withLossParty(lossPartyType)
    return exposureBuilder
  }

  private function addSeverityToIncident(incidentBuilder : IncidentBuilderBase, severityStr : String) {
    if (severityStr != null) {
      var severity = new TypelistTransformer<SeverityType>().transform(severityStr)
      incidentBuilder.withSeverity(severity)
    }
  }

  override function createClaimBuilder() : ClaimBuilder {
    return ClaimBuilder.uiReadyAuto()
        .withPolicy(new PolicyBuilder()
            .uiReadyPersonalAuto()
            .withVerified(true)
            .withRiskUnit(new VehicleRUBuilder()
                .withRUNumber(1)
                .withVehicle(new VehicleBuilder().uiReadyVehicle())
                .withCoverage(new VehicleCoverageBuilder()
                    .withIncidentLimit(15000bd.ofDefaultCurrency())
                    .withType(TC_COL_PA_EXT))))
        .withNonConflictingClaimNumber()
  }

  override function claimReferredForSubrogation() {
    gw.transaction.Transaction.runWithNewBundle(\b -> {
      var claim = b.add(_claimWrapper.get())
      claim.SubrogationSummary.SubroReferralComment = "Referring as ready for subrogation"
      claim.SubrogationSummary.referForSubrogation()
    }, CurrentUser)
  }
}

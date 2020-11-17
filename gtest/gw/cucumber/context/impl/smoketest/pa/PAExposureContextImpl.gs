package gw.cucumber.context.impl.smoketest.pa

uses com.google.inject.Inject
uses cucumber.api.DataTable
uses entity.Contact
uses entity.Incident
uses gw.api.database.Query
uses gw.api.databuilder.ClaimContactBuilder
uses gw.api.databuilder.ExposureBuilder
uses gw.api.databuilder.FixedPropertyIncidentBuilder
uses gw.api.databuilder.PersonBuilder
uses gw.api.databuilder.VehicleIncidentBuilder
uses gw.api.util.DateUtil
uses gw.cucumber.context.api.pa.PAExposureContext
uses gw.cucumber.context.impl.smoketest.common.ExposureContextImpl
uses gw.cucumber.context.impl.smoketest.util.Navigation
uses gw.cucumber.setup.PolicyDataSet
uses gw.cucumber.testdata.DataWrapper
uses gw.cucumber.transformer.CurrencyAmountTransformer
uses gw.cucumber.transformer.FixedPropertyIncidentTransformer
uses gw.cucumber.transformer.TypelistTransformer
uses gw.cucumber.util.common.UIHelper
uses pcftest.ClaimExposures
uses pcftest.ClaimLossDetails
uses pcftest.ClaimSummary
uses pcftest.ExposureDetail
uses pcftest.FNOLContactPopup
uses pcftest.FNOLWizard
uses pcftest.NewFixedPropertyIncidentPopup
uses pcftest.NewInjuryIncidentPopup
uses pcftest.NewVehicleIncidentPopup
uses pcftest.WebMessageWorksheet

@SuppressWarnings("unused")
class PAExposureContextImpl extends ExposureContextImpl implements PAExposureContext {

  @Inject
  var _policyDataSetWrapper : DataWrapper<PolicyDataSet>

  @Inject
  var _claimWrapper : DataWrapper<Claim>

  @Inject
  var _incidentWrapper : DataWrapper<Incident>

  @Inject
  var _exposureWrapper : DataWrapper<Exposure>

  @Inject
  var _contactWrapper : DataWrapper<Contact>

  override function selectFirstInvolvedVehicle() {
    var wizard = _proxy.CurrentPage as FNOLWizard
    wizard.goToBasicInfoAuto()
    wizard.BasicInfoAUTO.RightColumnAUTO.toggleVehicleCheckboxByIndex(0)
  }

  override function createCollisionExposureWithState(exposureStateText : String) {
    var claim = _claimWrapper.get()
    var exposure : Exposure
    var exposureState = new TypelistTransformer<ExposureState>().transform(exposureStateText)
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      claim = bundle.add(claim)
      exposure = ExposureBuilder.uiReadyForCoverageType(TC_COL_PA_EXT).withState(exposureState).onClaim(claim).create(bundle)
    }, CurrentUser)
    _exposureWrapper.set(exposure)
  }

  override function createCoveredVehicles(table : DataTable) {
    var vehicles = table.asMaps(String, String)
    var ruNumber = 10
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      var policy = bundle.loadBean(_claimWrapper.get().Policy.ID) as Policy
      policy.Verified = false
      for (vehicleMap in vehicles) {
        var vehicle = new Vehicle(bundle)
        vehicle.Year = Integer.valueOf(vehicleMap.get(DK_VEHICLEYEAR))
        vehicle.Make = vehicleMap.get(DK_VEHICLEMAKE)
        vehicle.Model = vehicleMap.get(DK_VEHICLEMODEL)
        var ru = new VehicleRU(bundle)
        ru.Vehicle = vehicle
        ru.RUNumber = ruNumber
        ruNumber++
        policy.addToRiskUnits(ru)
        var coverage = new VehicleCoverage(bundle)
        coverage.Type = CoverageType.TC_COL_PA_EXT
        coverage.IncidentLimit = 15000bd.ofDefaultCurrency()
        ru.addToCoverages(coverage)
      }
    }, CurrentUser)
  }

  override function createCoveredVehicle() {
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      var policy = bundle.loadBean(_claimWrapper.get().Policy.ID) as Policy
      policy.Verified = false
      var vehicle = new Vehicle(bundle)
      vehicle.Year = 2007
      vehicle.Make = "Toyota"
      vehicle.Model = "Corolla"
      var ru = new VehicleRU(bundle)
      ru.Vehicle = vehicle
      ru.RUNumber = 10
      policy.addToRiskUnits(ru)
      var coverage = new VehicleCoverage(bundle)
      coverage.Type = CoverageType.TC_COL_PA_EXT
      coverage.IncidentLimit = 15000bd.ofDefaultCurrency()
      ru.addToCoverages(coverage)
    }, CurrentUser)
  }

  override function createCoveredParties(table : DataTable) {
    var parties = table.asMaps(String, String)
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      var policy = bundle.loadBean(_claimWrapper.get().Policy.ID) as Policy
      policy.Verified = false
      for (partyMap in parties) {
        var role = policy.addEmptyRole(ContactRole.TC_COVEREDPARTY)
        var person = new Person(bundle)
        person.FirstName = partyMap.get(FIRST)
        person.LastName = partyMap.get(LAST)
        role.Contact = person
        role.CoveredPartyType = CoveredPartyType.TC_ADDINSURED
      }
    }, CurrentUser)
  }

  override function createCollisionExposureWithVehicle(vehicleText : String) {
    var claim = _claimWrapper.get()
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      _exposureWrapper.set(ExposureBuilder
          .vehicleDamage()
          .withCoverageSubType(CoverageSubtype.TC_COL_PA_EXT)
          .onClaim(claim)
          .withClaimant(claim.Insured)
          .withIncident(new VehicleIncidentBuilder()
              .onClaim(claim)
              .withVehicle(claim.Policy.Vehicles.singleWhere(\elt -> elt.Vehicle.DisplayName.contains(vehicleText)).Vehicle)
              .withLossOccurred()
              .withDriver(PersonBuilder.uiReadyPerson())
          )
          .create(bundle))
    }, CurrentUser)
  }

  override function createPropertyOnClaim(table : DataTable) {
    var data = table.asMaps(String, String)
    for (row in data) {
      _incidentWrapper.set(new FixedPropertyIncidentTransformer().transform(_claimWrapper.get(), row))
    }
  }

  override function addCollisionExposureByCoverage() {
    var claimSummary = new Navigation<ClaimSummary>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()), CurrentUser)
    claimSummary.ClaimMenuActions.click()
    var coverageMenu = claimSummary.ClaimMenuActions.ClaimMenuActions_NewExposure.NewExposureMenuItemSet_both
        .NewExposureMenuItemSet_ByCoverage
    coverageMenu.openMenu()
    var riskUnitEntry: pcftest.NewExposureMenuItemSet_both.NewExposureMenuItemSet_ByCoverage.entry
    riskUnitEntry = coverageMenu._Entries.firstWhere(\elt -> elt.item.Text == _claimWrapper.get().Policy.RiskUnits.single().DisplayName)
    if (riskUnitEntry == null) {
      riskUnitEntry = coverageMenu._Entries[0]
    }
    var coverageEntry: pcftest.NewExposureMenuItemSet_both.NewExposureMenuItemSet_ByCoverage.entry
    coverageEntry = riskUnitEntry.item._Entries.firstWhere(\elt -> elt.item.Text == CoverageSubtype.TC_COL_PA_EXT.DisplayName)
    if (coverageEntry == null) {
      coverageEntry = riskUnitEntry.item._Entries[0]
    }
    var exposureScreen = coverageEntry.item.click()

    var newClaimVehicleDamageDV = exposureScreen.NewExposureScreen.NewExposureDV_Vehicledamage.NewClaimVehicleDamageDV
    newClaimVehicleDamageDV.Claimant_Picker.selectFirstValidOption()
    newClaimVehicleDamageDV.Claimant_Type.selectFirstValidOption()
    var location = exposureScreen.NewExposureScreen.Update.click()
    UIHelper.assertNoMessages(location)
  }

  override function addFirstPartyComprehensiveExposure() {
    createExposureForCoverageType(CoverageType.TC_COM_PA_EXT.DisplayName)
  }

  override function changeClaimantForExposure() {
    selectClaimantForExposure(_claimWrapper.get().Insured, ClaimantType.TC_INSURED)
  }

  override function chooseInsuredClaimantForExposure() {
    selectClaimantForExposure(_claimWrapper.get().Insured, ClaimantType.TC_INSURED)
  }

  override function chooseThirdPartyClaimantForExposure() {
    var claim = _claimWrapper.get()
    var thirdParty = claim.Contacts.firstWhere(\claimContacts -> claimContacts.Contact != claim.Insured).Contact ?:
        new ClaimContactBuilder().onClaim(claim).withContact(PersonBuilder.uiReadyPerson().createAndCommitInNewBundle()).createAndCommitInNewBundle().Contact
    selectClaimantForExposure(thirdParty, ClaimantType.TC_OTHER)
  }

  function selectClaimantForExposure(claimant : Contact, claimantType : ClaimantType) {
    var exposures = new Navigation<ClaimExposures>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToExposures(), CurrentUser)
    var exposure = exposures.ClaimExposuresScreen.ExposuresLV._Entries.singleWhere(\elt -> elt.Order.Text == _exposureWrapper.get().ClaimOrder.toString()).Order.click()
    exposure.ExposureDetailScreen.Edit.click()

    switch (_exposureWrapper.get().ExposureType) {
      case ExposureType.TC_BODILYINJURYDAMAGE:
        exposure.BodilyInjuryDamage.Claimant.clickFirstOptionWithMatchingLabel(\label -> label.contains(claimant.DisplayName))
        exposure.BodilyInjuryDamage.ClaimantType.TypeKeyValue = claimantType
        break
      case ExposureType.TC_LOSSOFUSEDAMAGE:
        exposure.LossOfUseDamage.Claimant.clickFirstOptionWithMatchingLabel(\label -> label.contains(claimant.DisplayName))
        exposure.LossOfUseDamage.ClaimantType.TypeKeyValue = claimantType
        break
      case ExposureType.TC_MEDPAY:
        exposure.MedPay.Claimant.clickFirstOptionWithMatchingLabel(\label -> label.contains(claimant.DisplayName))
        exposure.MedPay.ClaimantType.TypeKeyValue = claimantType
        break
      case ExposureType.TC_PERSONALPROPERTYDAMAGE:
        exposure.PersonalPropertyDamage.Claimant.clickFirstOptionWithMatchingLabel(\label -> label.contains(claimant.DisplayName))
        exposure.PersonalPropertyDamage.ClaimantType.TypeKeyValue = claimantType
        break
      case ExposureType.TC_PIPDAMAGES:
        exposure.PIPDamages.Claimant.clickFirstOptionWithMatchingLabel(\label -> label.contains(claimant.DisplayName))
        exposure.PIPDamages.ClaimantType.TypeKeyValue = claimantType
        break
      case ExposureType.TC_PROPERTYDAMAGE:
        exposure.PropertyDamage.Claimant.clickFirstOptionWithMatchingLabel(\label -> label.contains(claimant.DisplayName))
        exposure.PropertyDamage.ClaimantType.TypeKeyValue = claimantType
        break
      case ExposureType.TC_TOWONLY:
        exposure.TowOnly.Claimant.clickFirstOptionWithMatchingLabel(\label -> label.contains(claimant.DisplayName))
        exposure.TowOnly.ClaimantType.TypeKeyValue = claimantType
        break
      case ExposureType.TC_VEHICLEDAMAGE:
        exposure.VehicleDamage.Claimant.clickFirstOptionWithMatchingLabel(\label -> label.contains(claimant.DisplayName))
        exposure.VehicleDamage.ClaimantType.TypeKeyValue = claimantType
        break
    }

    var location = exposure.ExposureDetailScreen.Update.click()
    UIHelper.assertNoMessages(location)
    // Querying to refresh the entire exposure entity graph
    _exposureWrapper.set(Query.make(Exposure).compare(Exposure#ID, Equals, _exposureWrapper.get().ID).select().single())
    _contactWrapper.set(claimant)
  }

  override function changeInvolvedVehicleTo(vehicleName : String) {
    var lossDetails = new Navigation<ClaimLossDetails>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToLossDetails(), CurrentUser)
    var popup = lossDetails.ClaimLossDetailsScreen.LossDetailsPanelSet_default.LossDetailsCardCV.LossDetailsDV_Auto.EditableVehicleIncidentsLV._Entries.single().Make.click()
    popup.EditVehicleIncidentScreen.Edit.click()
    var vehicleIncidentDV = popup.EditVehicleIncidentScreen.VehIncidentDetailDV.VehicleIncidentDV
    vehicleIncidentDV.Vehicle_Picker.clickByLabelSubstr(vehicleName)
    vehicleIncidentDV.Driver_Picker.selectFirstValidOption()
    vehicleIncidentDV.Child_Safety_Seat_Ext.clickByLabelSubstr("Unknown")
    vehicleIncidentDV.RelationToInsured.clickByLabelSubstr("Other")
    if (vehicleIncidentDV.Description.Text.isEmpty()) {
      vehicleIncidentDV.Description.Value = "Test Description"
    }
    lossDetails = popup.EditVehicleIncidentScreen.Update.click() as ClaimLossDetails
    UIHelper.assertNoMessages(lossDetails)
  }

  override function changeDriverForInvolvedVehicleTo(driverName : String) {
    var lossDetails = new Navigation<ClaimLossDetails>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToLossDetails(), CurrentUser)
    var popup = lossDetails.ClaimLossDetailsScreen.LossDetailsPanelSet_default.LossDetailsCardCV.LossDetailsDV_Auto.EditableVehicleIncidentsLV._Entries.single().Make.click()
    popup.EditVehicleIncidentScreen.Edit.click()
    popup.EditVehicleIncidentScreen.VehIncidentDetailDV.VehicleIncidentDV.Driver_Picker.clickByLabelSubstr(driverName)
    lossDetails = popup.EditVehicleIncidentScreen.Update.click() as ClaimLossDetails
    UIHelper.assertNoMessages(lossDetails)
  }

  override function addDriverToInvolvedVehicle() {
    var wizard = _proxy.CurrentPage as FNOLWizard
    if (not wizard.LossDetails.Current) {
      wizard.goToLossDetailsAuto()
    }

    var editVehicleIncident = wizard.LossDetailsAUTO.VehicleIncidentIterator._Entries.single().VehicleIncidentDV.VehicleName.EditVehicleMenu.click()
    var addDriver = editVehicleIncident.FNOLVehicleIncidentScreen.OccupantLV_tb.AddDriverButton.click() as FNOLContactPopup
    addDriver.FNOLContactScreen.ContactDV.FNOLContactInputSet.GlobalPersonNameInputSet_default.LastName.setValue("test123")
    addDriver.update()
    editVehicleIncident.FNOLVehicleIncidentScreen.Update.click()
  }

  override function addPassengerToInvolvedVehicle() {
    var wizard = _proxy.CurrentPage as FNOLWizard
    if (not wizard.LossDetails.Current) {
      wizard.goToLossDetailsAuto()
    }

    var editVehicleIncident = wizard.LossDetailsAUTO.VehicleIncidentIterator._Entries.single().VehicleIncidentDV.VehicleName.EditVehicleMenu.click()
    var addDriver = editVehicleIncident.FNOLVehicleIncidentScreen.OccupantLV_tb.AddPassengerButton.click() as FNOLContactPopup
    addDriver.FNOLContactScreen.ContactDV.FNOLContactInputSet.GlobalPersonNameInputSet_default.LastName.setValue("test123")
    addDriver.update()
    editVehicleIncident.FNOLVehicleIncidentScreen.Update.click()
  }

  override function addDamageDescriptionToInvolvedVehicle() {
    var wizard = _proxy.CurrentPage as FNOLWizard
    if (not wizard.LossDetails.Current) {
      wizard.goToLossDetailsAuto()
    }
    var editVehicleIncident = wizard.LossDetailsAUTO.VehicleIncidentIterator._Entries.single().VehicleIncidentDV.VehicleName.EditVehicleMenu.click()
    editVehicleIncident.FNOLVehicleIncidentScreen.Description.setValue("Damage description set by PAClaimContextImpl")
    editVehicleIncident.FNOLVehicleIncidentScreen.Update.click()
  }

  override function addPropertyDamage() {
    var wizard = _proxy.CurrentPage as FNOLWizard
    if (not wizard.LossDetails.Current) {
      wizard.goToLossDetailsAuto()
    }

    var newProperty = wizard.LossDetailsAUTO.AddPropertyDamageButton.click()
    var addressPicker = newProperty.NewFixedPropertyIncidentScreen.FixPropIncidentDetailDV.FixedPropertyIncidentDV.CCAddressInputSet.Address_Picker
    addressPicker.selectFirstValidOption()
    newProperty.update()
  }

  override function verifyVehicleHasDriver() {
    var claim = _claimWrapper.get()
    assertThat(claim.VehicleIncidentsOnly.first().driver).isNotNull()
  }

  override function verifyVehicleHasPassenger() {
    var claim = _claimWrapper.get()
    assertThat(claim.VehicleIncidentsOnly.first().passenger).isNotEmpty()
  }

  override function verifyVehicleHasDamageDescription() {
    var claim = _claimWrapper.get()
    assertThat(claim.VehicleIncidentsOnly.first().Description).isNotNull()
  }

  override function verifyClaimHasFixedPropertyDamage() {
    var claim = _claimWrapper.get()
    assertThat(claim.FixedPropertyIncidentsOnly.Count).isGreaterThanOrEqualTo(1)
  }

  override function updateLossDetails(table : DataTable) {
    var lossDetails = new Navigation<ClaimLossDetails>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToLossDetails(), CurrentUser)
    lossDetails.ClaimLossDetailsScreen.Edit.click()
    var dv = lossDetails.ClaimLossDetailsScreen.LossDetailsPanelSet_default.LossDetailsCardCV.LossDetailsDV_Auto
    var data = table.asMaps(String, String)
    for (row in data) {
      UIHelper.setFieldValues(dv, row)
    }
    lossDetails.ClaimLossDetailsScreen.Update.click()
    UIHelper.assertNoMessages(lossDetails)
  }

  override function updateNotificationDetails(table : DataTable) {
    var lossDetails = new Navigation<ClaimLossDetails>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToLossDetails(), CurrentUser)
    lossDetails.ClaimLossDetailsScreen.Edit.click()
    var dv = lossDetails.ClaimLossDetailsScreen.LossDetailsPanelSet_default.LossDetailsCardCV.LossDetailsDV_Auto
    var data = table.asMaps(String, String)
    for (row in data) {
      dv.Notification_FirstNoticeSuit.setBoolValue(row.get(DK_FIRSTNOTICESUIT) == YesNo.TC_YES.DisplayName)
      UIHelper.setFieldValues(dv, row)
      dv.Notification_MainContactType.setTypeKeyValue(new TypelistTransformer<PersonRelationType>().transform(row.get(CONTACT_RTI)))
      dv.Notification_ReportedByType.setTypeKeyValue(new TypelistTransformer<PersonRelationType>().transform(row.get(REPORTER_RTI)))
    }
    lossDetails.ClaimLossDetailsScreen.Update.click()
    UIHelper.assertNoMessages(lossDetails)
  }

  override function addWitnessToClaim(table : DataTable) {
    var lossDetails = new Navigation<ClaimLossDetails>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToLossDetails(), CurrentUser)
    lossDetails.ClaimLossDetailsScreen.Edit.click()
    var dv = lossDetails.ClaimLossDetailsScreen.LossDetailsPanelSet_default.LossDetailsCardCV.LossDetailsDV_Auto
    var data = table.asMaps(String, String)
    for (row in data) {
      dv.EditableWitnessesLV_tb.Add.click()
      var entry = dv.EditableWitnessesLV._Entries.last()
      entry.Contact.selectFirstValidOption()
      entry.EditableWitnesses_WitnessStatementInd.setTypeKeyValue(new TypelistTransformer<YesNo>().transform(row.get(DK_STATEMENTOBTAINED)))
      entry.EditableWitnesses_WitnessPosition.setTypeKeyValue(new TypelistTransformer<WitnessPosition>().transform(row.get(DK_WITNESSPOSITION)))
      entry.EditableWitnesses_WitnessPerspective.setValue(row.get(DK_WITNESSPERSPECTIVE))
    }
    lossDetails.ClaimLossDetailsScreen.Update.click()
  }

  override function addContributingFactors(table : DataTable) {
    var lossDetails = new Navigation<ClaimLossDetails>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToLossDetails(), CurrentUser)
    lossDetails.ClaimLossDetailsScreen.Edit.click()
    var dv = lossDetails.ClaimLossDetailsScreen.LossDetailsPanelSet_default.LossDetailsCardCV.LossDetailsDV_Auto
    var data = table.asMaps(String, String)
    for (row in data) {
      dv.EditableContributingFactorsLV_tb.Add.click()
      var entry = dv.EditableContributingFactorsLV._Entries.last()
      entry.EditableContributingFactors_contribprimary.setTypeKeyValue(new TypelistTransformer<PriContributingFactors>().transform(row.get(DK_PRIMARYCONTRIBFACTORS)))
      entry.EditableContributingFactors_contribsecond.setTypeKeyValue(new TypelistTransformer<SecContributingFactors>().transform(row.get(DK_SECONDARYCONTRIBFACTORS)))
      entry.EditableContributingFactors_contribresult.setTypeKeyValue(new TypelistTransformer<ResContributingFactors>().transform(row.get(DK_RESULTCONTRIBFACTORS)))
    }
    lossDetails.ClaimLossDetailsScreen.Update.click()
  }

  override function addNewVehicleToClaim(table : DataTable) {
    var lossDetails = new Navigation<ClaimLossDetails>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToLossDetails(), CurrentUser)
    lossDetails.ClaimLossDetailsScreen.Edit.click()
    var dv = lossDetails.ClaimLossDetailsScreen.LossDetailsPanelSet_default.LossDetailsCardCV.LossDetailsDV_Auto
    var data = table.asMaps(String, String)
    for (row in data) {
      var vehiclePopup = dv.EditableVehicleIncidentsLV_tb.Add.click() as NewVehicleIncidentPopup
      var vehicleDv = vehiclePopup.NewVehicleIncidentScreen.VehIncidentDetailDV
      vehicleDv.VehicleIncidentDV.Vehicle_Picker.getOptionByLabel(DK_NEW).click()
      vehicleDv.VehicleIncidentDV.Vehicle_Year.setValue(row.get(DK_VEHICLEYEAR))
      vehicleDv.VehicleIncidentDV.Vehicle_Make.setValue(row.get(DK_VEHICLEMAKE))
      vehicleDv.VehicleIncidentDV.Vehicle_Model.setValue(row.get(DK_VEHICLEMODEL))
      vehicleDv.VehicleIncidentDV.Driver_Picker.getOptionByLabel(row.get(DK_DRIVER)).click()
      vehicleDv.VehicleIncidentDV.Child_Safety_Seat_Ext.clickByLabelSubstr("Unknown")
      vehicleDv.VehicleIncidentDV.Description.setValue("Damage Description")
      UIHelper.assertNoMessages(vehiclePopup.NewVehicleIncidentScreen.Update.click())
    }
    UIHelper.assertNoMessages(lossDetails.ClaimLossDetailsScreen.Update.click())
  }

  override function addNewInjuryIncident(table : DataTable) {
    var lossDetails = new Navigation<ClaimLossDetails>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToLossDetails(), CurrentUser)
    lossDetails.ClaimLossDetailsScreen.Edit.click()
    var dv = lossDetails.ClaimLossDetailsScreen.LossDetailsPanelSet_default.LossDetailsCardCV.LossDetailsDV_Auto
    var data = table.asMaps(String, String)
    for (row in data) {
      var injuryPopup = dv.EditableInjuryIncidentsLV_tb.Add.click() as NewInjuryIncidentPopup
      var injuryDv = injuryPopup.NewInjuryIncidentScreen.InjuryIncidentDV
      injuryDv.Injured_Picker.getOptionByLabel(row.get(DK_INJUREDPERSON)).click()
      injuryDv.InjuryIncidentInputSet.LossParty.getOptionByLabel(row.get(DK_LOSSPARTY)).click()
      //Disabled as part of Toggle R1
      //injuryDv.InjuryIncidentInputSet.Severity.getOptionByLabel(row.get(DK_SEVERITY)).click()
      injuryDv.InjuryIncidentInputSet.PrimaryInjuryType.clickByLabelSubstr(row.get(DK_GENERALINJURY))
      injuryDv.InjuryIncidentInputSet.DetailedInjuryType.clickByLabelSubstr(row.get(DK_DETAILEDINJURY))
      injuryDv.InjuryIncidentInputSet.InjuryDescription.Value = "Test Injury Description"
      injuryPopup.NewInjuryIncidentScreen.Update.click()
    }
    lossDetails.ClaimLossDetailsScreen.Update.click()
  }

  private function createExposureWithIncident(type : CoverageSubtype, table : DataTable) {
    var data = table.asMaps(String, String)
    for (row in data) {
      _incidentWrapper.set(getIncident(type, row.get(DK_PROPERTYNAME)))
      gw.transaction.Transaction.runWithNewBundle(\bundle -> {
        var exposure = createNewExposureBuilder(type, row)
            .withIncident(_incidentWrapper.get())
            .create(bundle)
        _exposureWrapper.set(exposure)
      }, User.util.UnrestrictedUser)
    }
  }

  private function getIncident(type : CoverageSubtype, name : String) : Incident {
    var claim = _claimWrapper.get()
    if (type == CoverageSubtype.TC_PRO_DAM_VEH_EXT) {
      return new FixedPropertyIncidentBuilder()
          .onClaim(claim)
          .withProperty(claim.Policy.PolicyLocations.firstWhere(\elt ->
              elt.DisplayName.containsIgnoreCase(name)
          )).createAndCommitInNewBundle()
    } else {
      return _incidentWrapper.get()
    }
  }

  private function createExposure(type : CoverageSubtype, table : DataTable) {
    var data = table.asMaps(String, String)
    for (row in data) {
      var exposure = createNewExposureBuilder(type, row)
          .createAndCommitInNewBundle()
      _exposureWrapper.set(exposure)
    }
  }

  private function createNewExposureBuilder(type : CoverageSubtype, row : Map<String, String>) : ExposureBuilder {
    var claim = _claimWrapper.get()
    return ExposureBuilder.uiReadyForCoverageSubtype(type)
        .onClaim(claim)
        .withCoverage(claim.Policy.AllCoverages.firstWhere(\elt -> elt.DisplayName == row.get(DK_COVERAGE)))
        .withClaimant(Query.make(Person).compare(Person#Name, Equals, row.get(DK_CLAIMANT)).select().AtMostOneRow)
        .withClaimantType(new TypelistTransformer<ClaimantType>().transform(row.get(DK_CLAIMANTTYPE)))
  }

  override function addNewBodilyInjuryExposure(table : DataTable) {
    createExposureWithIncident(CoverageSubtype.TC_BOD_INJ_PA_EXT, table)
  }

  override function addNewMedPayExposure(table : DataTable) {
    createExposureWithIncident(CoverageSubtype.TC_MED_COVR_EXT, table)
  }

  override function addPipExposure(table : DataTable) {
    createExposureWithIncident(CoverageSubtype.TC_PER_INJ_PRO_FRM_EXT, table)
  }

  override function addPropertyDamageExposure(table : DataTable) {
    createExposureWithIncident(CoverageSubtype.TC_PRO_DAM_PRO_EXT, table)
  }

  override function addTowingAndLaborExposure(table : DataTable) {
    createExposure(CoverageSubtype.TC_TOW_AND_ROA_SER_EXT, table)
  }

  override function addNewProperty(table : DataTable) {
    var lossDetails = new Navigation<ClaimLossDetails>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToLossDetails(), CurrentUser)
    lossDetails.ClaimLossDetailsScreen.Edit.click()
    var dv = lossDetails.ClaimLossDetailsScreen.LossDetailsPanelSet_default.LossDetailsCardCV.LossDetailsDV_Auto
    var data = table.asMaps(String, String)
    for (row in data) {
      var propertyPopup = dv.Claim_Properties.EditableFixedPropertyIncidentsLV_tb.Add.click() as NewFixedPropertyIncidentPopup
      var propertyDv = propertyPopup.NewFixedPropertyIncidentScreen.FixPropIncidentDetailDV.FixedPropertyIncidentDV
      propertyDv.CCAddressInputSet.Address_Picker.getOptionByLabel(DK_NEW).click()
      UIHelper.setFieldValues(propertyDv, row)
      propertyDv.LossEstimate.setValue(row.get(DK_LOSSESTIMATE))
      propertyPopup.NewFixedPropertyIncidentScreen.Update.click()
      UIHelper.assertNoMessages(propertyPopup)
    }
    lossDetails.ClaimLossDetailsScreen.Update.click()
    UIHelper.assertNoMessages(lossDetails)
  }

  private function verifyExposureOnClaimWithoutIncident(type : ExposureType, table : DataTable) {
    _claimWrapper.set(Query.make(Claim).compare(Claim#ClaimNumber, Equals, _claimWrapper.get().ClaimNumber).select().AtMostOneRow)
    var data = table.asMaps(String, String)
    for (row in data) {
      var coverage = row.get(DK_COVERAGE)
      assertThat(_claimWrapper.get().Exposures.firstWhere(\elt ->
          elt.ExposureType == type and
              coverage == NONE ? elt.Coverage == null : elt.Coverage.DisplayName.contains(coverage) and
              elt.Claimant == Query.make(Person).compare(Person#Name, Equals, row.get(DK_CLAIMANT)).select().AtMostOneRow and
              elt.ClaimantType == new TypelistTransformer<ClaimantType>().transform(row.get(DK_CLAIMANTTYPE))
      )).as("No ${type.DisplayName} exposure exists on the claim that matches: ${row.Values.join(",")}").isNotNull()
    }
  }

  private function verifyExposureOnClaimWithIncident(type : ExposureType, table : DataTable) {
    _claimWrapper.set(Query.make(Claim).compare(Claim#ClaimNumber, Equals, _claimWrapper.get().ClaimNumber).select().AtMostOneRow)
    var data = table.asMaps(String, String)
    for (row in data) {
      var coverage : String
      if (type == ExposureType.TC_PIPDAMAGES) {
        coverage = row.get(DK_TITLECOVERAGE)
      } else {
        coverage = row.get(DK_COVERAGE)
      }
      assertThat(_claimWrapper.get().Exposures.firstWhere(\elt ->
          elt.ExposureType == type and
              coverage == NONE ? elt.Coverage == null : elt.Coverage.DisplayName.contains(coverage) and
              elt.Claimant == Query.make(Person).compare(Person#Name, Equals, row.get(DK_CLAIMANT)).select().AtMostOneRow and
              elt.ClaimantType == new TypelistTransformer<ClaimantType>().transform(row.get(DK_CLAIMANTTYPE)) and
              elt.Incident == _incidentWrapper.get()
      )).as("No ${type.DisplayName} exposure exists on the claim that matches: ${row.Values.join(",")}").isNotNull()
    }
  }

  function verifyTowingAndLaborExposure(table : DataTable) {
    verifyExposureOnClaimWithoutIncident(ExposureType.TC_TOWONLY, table)
  }

  override function verifyPropertyDamageExposureOnClaim(table : DataTable) {
    verifyExposureOnClaimWithIncident(TC_PROPERTYDAMAGE, table)
  }

  override function verifyBodilyInjuryExposureOnClaim(table : DataTable) {
    verifyExposureOnClaimWithIncident(TC_BODILYINJURYDAMAGE, table)
  }

  override function verifyMedPayExposureOnClaim(table : DataTable) {
    verifyExposureOnClaimWithIncident(TC_MEDPAY, table)
  }

  override function verifyPipExposure(table : DataTable) {
    verifyExposureOnClaimWithIncident(TC_PIPDAMAGES, table)
  }

  override function verifyPropertyExistsOnClaim(table : DataTable) {
    _claimWrapper.set(Query.make(Claim).compare(Claim#ClaimNumber, Equals, _claimWrapper.get().ClaimNumber).select().AtMostOneRow)
    var data = table.asMaps(String, String)
    for (row in data) {
      assertThat(_claimWrapper.get().FixedPropertyIncidentsOnly.firstWhere(\incident ->
          incident.PropertyDesc == row.get(DK_PROPERTYDESC) and
              incident.Description == row.get(DK_DAMAGEDESC) and
              incident.LossEstimate == new CurrencyAmountTransformer().transform(row.get(DK_LOSSESTIMATE)) and
              incident.Property.Address.AddressLine1 == row.get(DK_ADDRESS1) and
              incident.Property.Address.City == row.get(DK_CITY) and
              incident.Property.Address.State == new TypelistTransformer<State>().transform(row.get(DK_STATE))
      )).as("No matching fixed property incident exists on the claim; ${row.Values.join(",")}").isNotNull()
    }
  }

  override function verifyInjuryIncidentOnClaim(table : DataTable) {
    _claimWrapper.set(Query.make(Claim).compare(Claim#ClaimNumber, Equals, _claimWrapper.get().ClaimNumber).select().AtMostOneRow)
    var data = table.asMaps(String, String)
    for (row in data) {
      assertThat(_claimWrapper.get().InjuryIncidentsOnly.firstWhere(\incident ->
          incident.injured.DisplayName == row.get(DK_INJUREDPERSON) and
              incident.LossParty == new TypelistTransformer<LossPartyType>().transform(row.get(DK_LOSSPARTY)) and
              incident.GeneralInjuryType == new TypelistTransformer<InjuryType>().transform(row.get(DK_GENERALINJURY)) and
              incident.DetailedInjuryType == new TypelistTransformer<DetailedInjuryType>().transform(row.get(DK_DETAILEDINJURY))
      )).as("No matching injury incident exists on the claim; ${row.Values.join(",")}").isNotNull()
    }
  }

  override function verifyVehicleExistsOnClaim(table : DataTable) {
    _claimWrapper.set(Query.make(Claim).compare(Claim#ClaimNumber, Equals, _claimWrapper.get().ClaimNumber).select().AtMostOneRow)
    var data = table.asMaps(String, String)
    var vehicleIncidentsOnly = _claimWrapper.get().VehicleIncidentsOnly
    for (row in data) {
      assertThat(vehicleIncidentsOnly.firstWhere(\incident ->
          incident.Vehicle.Year == row.get(DK_VEHICLEYEAR).toInt() and
              incident.Vehicle.Make == row.get(DK_VEHICLEMAKE) and
              incident.Vehicle.Model == row.get(DK_VEHICLEMODEL) and
              incident.driver.DisplayName == row.get(DK_DRIVER)
      )).as("No matching vehicle incident exists on the claim; ${row.Values.join(",")}").isNotNull()
    }
  }

  override function verifyMetropolitanReport(table : DataTable) {
    var data = table.asMaps(String, String)
    var metroReports = _claimWrapper.get().MetroReports
    for (row in data) {
      assertThat(metroReports.firstWhere(\report ->
          report.MetroReportType == new TypelistTransformer<MetroReportType>().transform(row.get(DK_METROREPORTTYPE)) and
              report.AgentCity == row.get(DK_INVESTIGATINGCITY) and
              report.AgentState == new TypelistTransformer<State>().transform(row.get(DK_INVESTIGATINGSTATE)) and
              report.VehicleIncident.Vehicle.DisplayName == row.get(DK_INSUREDVEHICLE)
      )).as("No matching metro report exists on the claim; ${row.Values.join(",")}").isNotNull()
    }
  }

  override function verifyContributingFactors(table : DataTable) {
    _claimWrapper.set(Query.make(Claim).compare(Claim#ClaimNumber, Equals, _claimWrapper.get().ClaimNumber).select().AtMostOneRow)
    var data = table.asMaps(String, String)
    var contribFactors = _claimWrapper.get().ContribFactors
    for (row in data) {
      assertThat(contribFactors.firstWhere(\factor ->
          factor.PriContributingFactors == new TypelistTransformer<PriContributingFactors>().transform(row.get(DK_PRIMARYCONTRIBFACTORS)) and
              factor.SecContributingFactors == new TypelistTransformer<SecContributingFactors>().transform(row.get(DK_SECONDARYCONTRIBFACTORS)) and
              factor.ResContributingFactors == new TypelistTransformer<ResContributingFactors>().transform(row.get(DK_RESULTCONTRIBFACTORS))
      )).as("No matching contributing factor exists on the claim; ${row.Values.join(",")}").isNotNull()
    }
  }

  override function verifyWitnessOnClaim(table : DataTable) {
    var lossDetails = new Navigation<ClaimLossDetails>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToLossDetails(), CurrentUser)
    var dv = lossDetails.ClaimLossDetailsScreen.LossDetailsPanelSet_default.LossDetailsCardCV.LossDetailsDV_Auto
    var data = table.asMaps(String, String)
    for (row in data) {
      assertThat(dv.EditableWitnessesLV._Entries.firstWhere(\witness ->
          witness.EditableWitnesses_WitnessStatementInd.TypeKeyValue == new TypelistTransformer<YesNo>().transform(row.get(DK_STATEMENTOBTAINED)) and
              witness.EditableWitnesses_WitnessPosition.TypeKeyValue == new TypelistTransformer<WitnessPosition>().transform(row.get(DK_WITNESSPOSITION)) and
              witness.EditableWitnesses_WitnessPerspective.Value == row.get(DK_WITNESSPERSPECTIVE)
      )).as("No matching witness exists on the claim; ${row.Values.join(",")}").isNotNull()
    }
  }

  override function verifyLossDetailsMatch(table : DataTable) {
    var data = table.asMaps(String, String)
    for (row in data) {
      assertThat(_claimWrapper.get().Weather == new TypelistTransformer<WeatherType>().transform(row.get(DK_WEATHER)))
      assertThat(_claimWrapper.get().FaultRating == new TypelistTransformer<FaultRating>().transform(row.get(DK_FAULTRATING)))
    }
  }

  override function verifyNotificationDetails(table : DataTable) {
    var lossDetails = new Navigation<ClaimLossDetails>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToLossDetails(), CurrentUser)
    var dv = lossDetails.ClaimLossDetailsScreen.LossDetailsPanelSet_default.LossDetailsCardCV.LossDetailsDV_Auto
    var data = table.asMaps(String, String)
    for (row in data) {
      assertThat(dv.Notification_FirstNoticeSuit.BoolValue).isEqualTo(row.get(DK_FIRSTNOTICESUIT) == YesNo.TC_YES.DisplayName)
      assertThat(dv.Notification_HowReported.TypeKeyValue).isEqualTo(new TypelistTransformer<HowReportedType>().transform(row.get(DK_HOWREPORTED)))
      assertThat(dv.ReportedBy_Picker.Text).isEqualTo(row.get(DK_REPORTEDBY))
      assertThat(dv.Notification_ReportedByType.TypeKeyValue).isEqualTo(new TypelistTransformer<PersonRelationType>().transform(row.get(REPORTER_RTI)))
      assertThat(dv.MainContact_Picker.Text).isEqualTo(row.get(DK_MAINCONTACT))
      assertThat(dv.Notification_MainContactType.TypeKeyValue).isEqualTo(new TypelistTransformer<PersonRelationType>().transform(row.get(CONTACT_RTI)))
    }
  }

  override function verifyVehicleIncident(table : DataTable) {
    _claimWrapper.set(Query.make(Claim).compare(Claim#ClaimNumber, Equals, _claimWrapper.get().ClaimNumber).select().AtMostOneRow)
    var data = table.asMaps(String, String)
    var vehicleIncidentsOnly = _claimWrapper.get().VehicleIncidentsOnly
    for (row in data) {
      assertThat(vehicleIncidentsOnly.firstWhere(\inc ->
          inc.Vehicle.DisplayName.contains(row.get(DK_VEHICLE)) and
              inc.Vehicle.LicensePlate == row.get(DK_LICENSEPLATE) and
              inc.Description == row.get(DK_DAMAGEDESC) and
              inc.driver.DisplayName == row.get(DK_DRIVERNAME)
      )).as("Expected to find vehicle incident on claim with values: ${row.Values.join(",")}").isNotNull()
    }
  }

  override function verifyVehicleIncident() {
    verifyClaimHasVehicleIncidentAmount("1")
  }

  override function iSetVehicleIncidentAsTotalLoss() {
    var claimLossDetails = new Navigation<ClaimLossDetails>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToLossDetails(), CurrentUser)
    var vehicleIncidentsLV = claimLossDetails.ClaimLossDetailsScreen.LossDetailsPanelSet_default.LossDetailsCardCV.LossDetailsDV_Auto.EditableVehicleIncidentsLV
    var editVehicleIncidentPopup = vehicleIncidentsLV._Entries.first().Make.click()
    editVehicleIncidentPopup.EditVehicleIncidentScreen.Edit.click()
    var vehicleIncidentDV = editVehicleIncidentPopup.EditVehicleIncidentScreen.VehIncidentDetailDV.VehicleIncidentDV
    vehicleIncidentDV.Driver_Picker.selectFirstValidOption()
    vehicleIncidentDV.RelationToInsured.selectFirstValidOption()
    vehicleIncidentDV.TotalLoss.setBoolValue(Boolean.TRUE)
    var location = editVehicleIncidentPopup.EditVehicleIncidentScreen.Update.click()
    UIHelper.assertNoMessages(location)
  }

  override function theVehicleIncidentIsIndicatedAsTotalLoss() {
    var exposure = _exposureWrapper.get()
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      exposure = bundle.add(exposure)
      exposure.VehicleIncident.TotalLoss = Boolean.TRUE
    }, CurrentUser)
    _exposureWrapper.set(exposure)
  }

  override function theVehicleRecoveryDateShouldBeUpdated() {
    var exposure = Query.make(Exposure).compare(Exposure#ID, Equals, _exposureWrapper.get().ID).select().single()
    assertThat(DateUtil.compareIgnoreTime(exposure.VehicleIncident.DateVehicleRecovered, Date.CurrentDate)).isEqualTo(0)
  }

  override function aVehicleSalvageShouldBecomeAvailableForEditing() {
    var exposures = new Navigation<ClaimExposures>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToExposures(), CurrentUser)
    var exposure = exposures.ClaimExposuresScreen.ExposuresLV._Entries.singleWhere(\elt -> elt.Order.Text == _exposureWrapper.get().ClaimOrder.toString()).Order.click()
    assertThat(exposure.ExposureDetailScreen.ExposureDetailDV_Vehicledamage.VehicleDamage_VehicleSalvageCardTab.Visible).isTrue()
  }

  override function verifyClaimHasVehicleIncidentAmount(number : String) {
    assertThat(_claimWrapper.get().VehicleIncidentsOnly)
        .as("Expected to have ${number} vehicle incidents on the claim, but found ${_claimWrapper.get().VehicleIncidentsOnly.Count}")
        .hasSize(Integer.parseInt(number))
    _incidentWrapper.set(_claimWrapper.get().VehicleIncidentsOnly.single())
  }

  override function verifyExposureReferenceVehicleIncident() {
    var claim = _claimWrapper.get()
    var exposure = _exposureWrapper.get() ?: claim.Exposures.single()
    var claimExposures = new Navigation<ClaimExposures>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(claim).goToExposures(), CurrentUser)
    var exposureDetail = claimExposures.ClaimExposuresScreen.ExposuresLV._Entries.singleWhere(\e -> e.Order.Text == exposure.ClaimOrder.toString()).Order.click()
    assertThat(exposureDetail.ExposureDetailScreen.ExposureDetailDV_Vehicledamage.VehicleDamageDV.Vehicle_Incident.Text)
        .isEqualTo(_incidentWrapper.get().DisplayName)
  }

  override function verifyExposureClaimantIsInsured() {
    var exposure = new Navigation<ExposureDetail>(_proxy).ensureOnPage(\tabBar ->
        tabBar
            .goToClaim(_claimWrapper.get())
            .goToExposures()
            .ClaimExposuresScreen.ExposuresLV._Entries.singleWhere(\elt -> elt.Order.Text == _exposureWrapper.get().ClaimOrder.toString()).Order.click(),
        CurrentUser)
    assertThat(exposure.ExposureDetailScreen.ExposureDetailDV_Vehicledamage.VehicleDamageDV.Claimant_Picker.Text).isEqualTo(_claimWrapper.get().Insured.DisplayName)
  }

  override function verifyInvolvedVehicleIs(vehicleName : String) {
    var exposure = new Navigation<ExposureDetail>(_proxy).ensureOnPage(\tabBar ->
        tabBar
            .goToClaim(_claimWrapper.get())
            .goToExposures()
            .ClaimExposuresScreen.ExposuresLV._Entries.singleWhere(\elt -> elt.Order.Text == _exposureWrapper.get().ClaimOrder.toString()).Order.click(),
        CurrentUser)
    assertThat(exposure.ExposureDetailScreen.ExposureDetailDV_Vehicledamage.VehicleDamageDV.Vehicle_Incident.Text).isEqualTo(vehicleName)
  }

  override function verifyInvolvedVehicleDriverIs(driverName : String) {
    var exposure = new Navigation<ExposureDetail>(_proxy).ensureOnPage(\tabBar ->
        tabBar
            .goToClaim(_claimWrapper.get())
            .goToExposures()
            .ClaimExposuresScreen.ExposuresLV._Entries.singleWhere(\elt -> elt.Order.Text == _exposureWrapper.get().ClaimOrder.toString()).Order.click(),
        CurrentUser)
    assertThat(exposure.ExposureDetailScreen.ExposureDetailDV_Vehicledamage.VehicleDamageDV.Incident_Driver.Text).isEqualTo(driverName)
  }

  override function createVehicleIncident(table : DataTable) {
    var claimLossDetails = new Navigation<ClaimLossDetails>(_proxy).ensureOnPage(\tabBar ->
        tabBar.goToClaim(_claimWrapper.get()).goToLossDetails(), CurrentUser)
    claimLossDetails.ClaimLossDetailsScreen.edit()
    var data = table.asMaps(String, String)
    for (row in data) {
      var newVehicleIncident = claimLossDetails.ClaimLossDetailsScreen.goToNewVehicleIncidentPopup()
      var dv = newVehicleIncident.NewVehicleIncidentScreen.VehIncidentDetailDV.VehicleIncidentDV
      dv.Vehicle_Picker.clickFirstOptionWithMatchingLabel(\txt -> txt.contains(row.get(DK_VEHICLE)))
      dv.Vehicle_LicensePlate.setValue(row.get(DK_LICENSEPLATE))
      dv.Driver_Picker.clickFirstOptionWithMatchingLabel(\txt -> txt.contains(row.get(DK_DRIVERNAME)))
      dv.Description.setValue(row.get(DK_DAMAGEDESC))
      dv.Child_Safety_Seat_Ext.clickByLabelSubstr("Unknown")
      dv.RelationToInsured.selectFirstValidOption()
      newVehicleIncident.update()
      UIHelper.assertNoMessages(newVehicleIncident)
      _claimWrapper.set(Query.make(Claim).compare(Claim#ID, Equals, _claimWrapper.get().ID).select().AtMostOneRow)
      _incidentWrapper.set(_claimWrapper.get().VehicleIncidentsOnly.first())
    }
    claimLossDetails.ClaimLossDetailsScreen.update()
    var warningMessages = (_proxy.CurrentWorksheet as WebMessageWorksheet).WebMessageWorksheetScreen.grpMsgs.WarningMessages
    if (warningMessages.HasElements) {
      claimLossDetails.ClaimLossDetailsScreen.update() //UI Warning: Validation errors ... This claims policy is unverified
    }
    UIHelper.assertNoMessages(claimLossDetails)
  }
}
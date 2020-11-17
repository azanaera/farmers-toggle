package gw.cucumber.context.impl.smoketest.hop

uses cucumber.api.DataTable
uses entity.Incident
uses gw.api.databuilder.ClaimBuilder
uses gw.api.databuilder.DwellingIncidentBuilder
uses gw.api.databuilder.DwellingRoomDamageBuilder
uses gw.api.databuilder.ExposureBuilder
uses gw.api.databuilder.FixedPropertyIncidentBuilder
uses gw.api.databuilder.IncidentBuilderBase
uses gw.api.databuilder.MobilePropertyIncidentBuilder
uses gw.api.databuilder.OtherStructureIncidentBuilder
uses gw.api.databuilder.PolicyBuilder
uses gw.api.databuilder.PropertyIncidentBuilder
uses gw.api.claim.IncidentUIHelpers
uses gw.api.database.Query
uses gw.api.databuilder.InjuryIncidentBuilder
uses gw.api.util.DateUtil
uses gw.cucumber.context.api.hop.HOPClaimContext
uses gw.cucumber.context.impl.smoketest.common.ClaimContextImpl
uses gw.cucumber.context.impl.smoketest.util.Navigation
uses gw.cucumber.setup.PolicyDataSet
uses gw.cucumber.transformer.CurrencyAmountTransformer
uses gw.cucumber.transformer.SpecialistServiceTransformer
uses gw.cucumber.transformer.TypelistTransformer
uses gw.cucumber.util.common.UIHelper
uses pcftest.ChoosePropertyContentsScheduledItemPopup
uses pcftest.ClaimLossDetails
uses pcftest.ClaimPolicyGeneral
uses pcftest.NewFixedPropertyIncidentPopup
uses pcftest.EditDwellingIncidentPopup
uses pcftest.EditInjuryIncidentPopup
uses pcftest.NewDwellingIncidentPopup
uses pcftest.NewInjuryIncidentPopup
uses pcftest.NewLivingExpensesIncidentPopup
uses pcftest.NewOtherStructureIncidentPopup
uses pcftest.NewPropertyContentsIncidentPopup
uses pcftest.PolicyLocationPopup

@SuppressWarnings("unused")
class HOPClaimContextImpl extends ClaimContextImpl implements HOPClaimContext {
  override function createPolicyDataSet() {
    (_policyDataSetWrapper.get() as PolicyDataSet).PolicyNumber = "73-235676"
  }

  override function createUnverifiedPolicy() {
    var wizard = Wizard
    var policyNumber = PolicyBuilder.nextPolicyNumber()

    wizard.FindPolicy.FNOLWizard_FindPolicyScreen
        .createPolicyWithDates(policyNumber, PolicyType.TC_HOPHOMEOWNERS, LossType.TC_PR.DisplayName, DateUtil.currentDate())

    var findPolicyPanelSetCreate = wizard.FindPolicy.FNOLWizard_FindPolicyScreen.FNOLWizardFindPolicyPanelSet_Create
    var policyGeneralPanelSetPr = findPolicyPanelSetCreate.NewClaimPolicyGeneralPanelSet_Pr
    var newContactPopup = policyGeneralPanelSetPr.NewClaimPolicyGeneralDV
        .Insured_Name.ClaimNewContactPickerMenuItemSet.NewContactPickerMenuItemSet_NewPerson.click()
    newContactPopup.PersonLastName.Value = "Created by HOPClaimContext"
    var location = newContactPopup.customUpdate()
    UIHelper.assertNoMessages(location)

    var policyLocationPopup = findPolicyPanelSetCreate.PolicyLocationLDV_tb.Add.click() as PolicyLocationPopup
    policyLocationPopup.PolicyLocationScreen.CCAddressInputSet.Address_City.Value = "Little Rock"
    policyLocationPopup.PolicyLocationScreen.CCAddressInputSet.Address_State.getOptionByLabel("Arkansas").click()
    location = policyLocationPopup.PolicyLocationScreen.Update.click()
    UIHelper.assertNoMessages(location)

    (_policyDataSetWrapper.get() as PolicyDataSet).PolicyNumber = policyNumber
  }

  override function createClaim() {
    var claim : Claim
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      claim = ClaimBuilder
          .uiReadyHOPHomeowners()
          .withNonConflictingClaimNumber()
          .create(bundle)
    }, CurrentUser)
    captureNewlyCreatedClaim(claim)
  }

  override function setLossCause(lossCauseText : String) {
    var lossCause = new TypelistTransformer<LossCause>().transform(lossCauseText)
    var wizard = Wizard
    wizard.goToLossDetailsHomeowners()
    wizard.LossDetailsHomeowners.NewLossDetailsHomeownersDV.Claim_LossCause.TypeKeyValue = lossCause
  }

  override function setLossLocationInState(stateText : String) {
    var state = new TypelistTransformer<State>().transform(stateText)
    var wizard = Wizard
    wizard.goToLossDetailsHomeowners()
    wizard.LossDetailsHomeowners.NewLossDetailsHomeownersDV.OtherLocationChoice_Choice.click()
    wizard.LossDetailsHomeowners.NewLossDetailsHomeownersDV.AddressDetailInputSetRef.CCAddressInputSet.setAddress("123 St", "San Mateo", state, "94400")
  }

  override function createInjuryIncident(lossPartyTypeText : String) {
    var lossPartyType = new TypelistTransformer<LossPartyType>().transform(lossPartyTypeText)
    var wizard = Wizard
    wizard.goToLossDetailsHomeowners()
    var injuryIncidentPopup = wizard.LossDetailsHomeowners.IncidentPanelRef.InjuryAndFixedPropertyIncidentsPanelSet_tb.AddInjuryButton.click()
    injuryIncidentPopup.FNOLInjuryIncidentScreen.ContactDV.ClaimContactPerson.getOptionByLabel(DK_NEWPERSON).click()
    injuryIncidentPopup.FNOLInjuryIncidentScreen.ContactDV.FNOLContactInputSet.GlobalPersonNameInputSet_default.LastName.Value = "Smith"
    injuryIncidentPopup.FNOLInjuryIncidentScreen.ContactDV.InjuryIncidentInputSet.InjuryDescription.Value = "new injury incident"
    injuryIncidentPopup.FNOLInjuryIncidentScreen.ContactDV.InjuryIncidentInputSet.LossParty.TypeKeyValue = lossPartyType
    var location = injuryIncidentPopup.FNOLInjuryIncidentScreen.Update.click()
    UIHelper.assertNoMessages(location)
  }

  override function addClaimLevelServices(serviceName : String, serviceRequestKindText : String) {
    var serviceRequestKind = new TypelistTransformer<ServiceRequestKind>().transform(serviceRequestKindText)
    var service = new SpecialistServiceTransformer().transform(serviceName)
    var wizard = Wizard
    wizard.goToServicesHomeowners()
    wizard.ServicesHomeowners.clickAddOtherService().addOtherServiceRequest(service, serviceRequestKind, null)
  }

  override function addInjuryExposure(coverageSubtype : CoverageSubtype = null) {
    var wizard = Wizard
    wizard.goToAssignAndSaveHomeowners()
    super.addInjuryExposure(coverageSubtype ?: CoverageSubtype.TC_HOPCOVEBI)
  }

  override function finishFilingClaim() {
    var wizard = Wizard
    wizard.goToAssignAndSaveHomeowners()
    var newClaimSaved = wizard.finishSuccessfully()
    _claimWrapper.set(newClaimSaved.ClaimEntity)
  }

  override function reportedByInsured() {
    var wizard = Wizard
    wizard.goToBasicInfoHomeowners()
    wizard.BasicInfoHomeowners.setReportedByToInsured()
  }

  override function reportedByThirdParty() {
    var wizard = Wizard
    wizard.goToBasicInfoHomeowners()
    wizard.BasicInfoHomeowners.setReportedByToThirdParty()
  }

  override function verifyClaimLossCause(lossCauseText : String) {
    var lossCause = new TypelistTransformer<LossCause>().transform(lossCauseText)
    var claimLossDetails = new Navigation<ClaimLossDetails>(_proxy)
        .ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToLossDetails(), CurrentUser)

    assertThat(claimLossDetails.ClaimLossDetailsScreen.LossDetailsPanelSet_Homeowners.LossDetailsDV.Claim_LossCause.TypeKeyValue)
        .as("The claim loss cause should be ${lossCause}")
        .isEqualTo(lossCause)
  }

  protected override function isPolicyVerified(claimPolicyGeneralScreen : ClaimPolicyGeneral) : boolean {
    return claimPolicyGeneralScreen.ClaimPolicyGeneralScreen.PolicyGeneralPanelSet_Pr
        .PolicyGeneralDV.Other_VerifiedPolicy.BoolValue
  }

  override function addDwellingIncident(table : DataTable) {
    var wizard = Wizard
    wizard.goToLossDetailsHomeowners()

    var lossDetails = wizard.LossDetailsHomeowners
    lossDetails.DwellingInputGroup._checkbox.BoolValue = true
    UIHelper.setFieldValues(lossDetails.DwellingInputGroup, table.asMap(String, String))
  }

  override function addPersonalPropertyIncident(table : DataTable) {
    var wizard = Wizard
    wizard.goToLossDetailsHomeowners()

    var lossDetails = wizard.LossDetailsHomeowners
    lossDetails.PropertyContentsInputGroup._checkbox.BoolValue = true
    var personalPropertyIncident = table.asMap(String, String)
    lossDetails.PropertyContentsInputGroup.PropertyContentsDamageDescription.setValue(personalPropertyIncident.get(DK_PROPERTYCONTENTSDAMAGEDESC))
  }

  override function addLivingExpensesIncident(table : DataTable) {
    var wizard = Wizard
    wizard.goToLossDetailsHomeowners()

    var lossDetails = wizard.LossDetailsHomeowners
    lossDetails.LivingExpensesInputGroup._checkbox.BoolValue = true
    UIHelper.setFieldValues(lossDetails.LivingExpensesInputGroup, table.asMap(String, String))
  }

  override function addAPropertyDamageLiability(table : DataTable) {
    var wizard = Wizard
    wizard.goToLossDetailsHomeowners()

    var lossDetails = wizard.LossDetailsHomeowners
    var popup = lossDetails.IncidentPanelRef.InjuryAndFixedPropertyIncidentsPanelSet_tb.AddPropertyDamageButton.click() as NewFixedPropertyIncidentPopup
    var dv = popup.NewFixedPropertyIncidentScreen.FixPropIncidentDetailDV.FixedPropertyIncidentDV
    for (row in table.asMaps(String, String)) {
      dv.CCAddressInputSet.Address_Picker.getOptionByLabel(DK_NEW).click()
      UIHelper.setFieldValues(dv, row)
      dv.LossEstimate.setValue(row.get(DK_LOSSESTIMATE))
      popup.NewFixedPropertyIncidentScreen.Update.click()
    }
    UIHelper.assertNoMessages(popup)
  }

  override function setDamageTypeTo(type : String) {
    var wizard = Wizard
    wizard.goToLossDetailsHomeowners()

    var lossDetails = wizard.LossDetailsHomeowners
    if (not lossDetails.NewLossDetailsHomeownersDV.DamageTypeChooser.isOptionWithLabelSelected(type)) {
      lossDetails.NewLossDetailsHomeownersDV.DamageTypeChooser.getOptionByLabel(type).click()
    }
  }

  override function answerFireQuestions(table : DataTable) {
    var wizard = Wizard
    wizard.goToLossDetailsHomeowners()

    var lossDetails = wizard.LossDetailsHomeowners
    for (row in table.asMaps(String, String)) {
      UIHelper.setFieldValues(lossDetails.FireDamageQuestionsPanelSet.FireDamageQuestionsPanelSet, row)
    }
  }

  override function answerWaterQuestions(table : DataTable) {
    var wizard = Wizard
    wizard.goToLossDetailsHomeowners()

    var lossDetails = wizard.LossDetailsHomeowners
    var panelSet = lossDetails.WaterDamageQuestionsPanelSet.WaterDamageQuestionsPanelSet
    for (row in table.asMaps(String, String)) {
      panelSet.WaterSource.setTypeKeyValue(
          new TypelistTransformer<WaterSource>().transform(row.get(DK_WATERSOURCE))
      )
      if (panelSet.HasWaterBeenTurnedOff.Visible) {
        panelSet.HasWaterBeenTurnedOff.setBoolValue(
            row.get(DK_WATERTURNEDOFF) == YesNo.TC_YES.DisplayName
        )
      }
      if (panelSet.IsRoofCovered.Visible) {
        panelSet.IsRoofCovered.setBoolValue(
            row.get(DK_ISROOFCOVERED) == YesNo.TC_YES.DisplayName
        )
      }
    }
  }

  override function autoAssignClaimAndExposures() {
    Wizard.goToAssignAndSaveHomeowners()
    super.autoAssignClaimAndExposures()
  }

  override function autoAssignClaimIndividually() {
    Wizard.goToAssignAndSaveHomeowners()
    super.autoAssignClaimIndividually()
  }

  override function autoAssignExposureIndividually(coverageTypeText : String) {
    Wizard.goToAssignAndSaveHomeowners()
    super.autoAssignExposureIndividually(coverageTypeText)
  }

  override function assignClaimAndExposuresToGroupAndUser(groupName : String, userDisplayName : String) {
    Wizard.goToAssignAndSaveHomeowners()
    super.assignClaimAndExposuresToGroupAndUser(groupName, userDisplayName)
  }

  override function assignClaimIndividuallyToGroupAndUser(groupName : String, userDisplayName : String) {
    Wizard.goToAssignAndSaveHomeowners()
    super.assignClaimIndividuallyToGroupAndUser(groupName, userDisplayName)
  }

  override function assignExposureIndividuallyToGroupAndUser(coverageTypeText : String, groupName : String, userDisplayName : String) {
    var coverageType = new TypelistTransformer<CoverageType>().transform(coverageTypeText)
    Wizard.goToAssignAndSaveHomeowners()
    super.assignExposureIndividuallyToGroupAndUser(coverageTypeText, groupName, userDisplayName)
  }

  override function createDwellingIncident() {
    var incident : Incident
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      incident = DwellingIncidentBuilder.uiReadyHOPDwellingIncident().onClaim(_claimWrapper.get()).create(bundle)
    }, CurrentUser)
    _incidentWrapper.set(incident)
  }

  override function createDwellingIncidentForLivingRoomFireAfterACandleFell() {
    var incident : Incident
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      incident = DwellingIncidentBuilder.uiReadyHOPDwellingIncident()
          .onClaim(_claimWrapper.get())
          .withDescription("Fire in the living room after a candle fell")
          .withDwellingRoomDamages(new DwellingRoomDamageBuilder().withRoomType(RoomType.TC_LIVINGROOM).withNumberOfRooms(1).create())
          .create(bundle)
    }, CurrentUser)
    _incidentWrapper.set(incident)
  }

  override function verifyWaterQuestionsOnClaim(table : DataTable) {
    for (row in table.asMaps(String, String)) {
      assertThat(_claimWrapper.get().PropertyWaterDamage.WaterSource)
          .isEqualTo(new TypelistTransformer<WaterSource>().transform(row.get(DK_WATERSOURCE)))

      if (row.get(DK_WATERTURNEDOFF) != null) {
        assertThat(_claimWrapper.get().PropertyWaterDamage.HasWaterBeenTurnedOff)
            .isEqualTo(row.get(DK_WATERTURNEDOFF) == YesNo.TC_YES.DisplayName)
      }

      if (row.get(DK_ISROOFCOVERED) != null) {
        assertThat(_claimWrapper.get().PropertyWaterDamage.IsRoofProtected)
            .isEqualTo(row.get(DK_ISROOFCOVERED) == YesNo.TC_YES.DisplayName)
      }
    }
  }

  override function verifyFireQuestionsOnClaim(table : DataTable) {
    for (row in table.asMaps(String, String)) {
      assertThat(_claimWrapper.get().PropertyFireDamage.Arson).isEqualTo(row.get(DK_ARSONINVOLVED) == YesNo.TC_YES.DisplayName)
      assertThat(_claimWrapper.get().PropertyFireDamage.FireSource).isEqualTo(row.get(DK_FIRESOURCE))
      assertThat(_claimWrapper.get().PropertyFireDamage.HowWasFireDiscovered).isEqualTo(row.get(DK_HOWWASFIREDISCOVERED))
      assertThat(_claimWrapper.get().PropertyFireDamage.FireDeptResponded).isEqualTo(row.get(DK_FIREDEPTRESPONDED) == YesNo.TC_YES.DisplayName)
      assertThat(_claimWrapper.get().PropertyFireDamage.IsAnyoneInjured).isEqualTo(row.get(DK_ANYONEINJURED) == YesNo.TC_YES.DisplayName)
      assertThat(_claimWrapper.get().PropertyFireDamage.SmokeDamageOnly).isEqualTo(row.get(DK_SMOKEDAMAGEONLY) == YesNo.TC_YES.DisplayName)
      assertThat(_claimWrapper.get().PropertyFireDamage.IsHomeHabitable).isEqualTo(row.get(DK_ISHOMEHABITABLE) == YesNo.TC_YES.DisplayName)
      assertThat(_claimWrapper.get().PropertyFireDamage.IsHomeSecure).isEqualTo(row.get(DK_ISHOMESECURE) == YesNo.TC_YES.DisplayName)
    }
  }

  override function verifyPropertyDamageLiability(table : DataTable) {
    for (var row in table.asMaps(String, String)) {
      assertThat(_claimWrapper.get().FixedPropertyIncidentsOnly.firstWhere(\elt ->
          elt.PropertyDesc == row.get(DK_PROPERTYDESCRIPTION) and
              elt.Description == row.get(DK_DAMAGEDESCRIPTION) and
              elt.LossEstimate == new CurrencyAmountTransformer().transform(row.get(DK_LOSSESTIMATE)) and
              elt.Property.Address.AddressLine1 == row.get(DK_ADDRESS1) and
              elt.Property.Address.City == row.get(DK_CITY) and
              elt.Property.Address.State == new TypelistTransformer<State>().transform(row.get(DK_STATE))
      )).as("The expected FixedPropertyIncidentsOnly (${row}), incident could not be found on the claim").isNotNull()
    }
  }

  override function verifyASpecificPersonalPropertyIncidentOnClaim(table : DataTable) {
    var personalPropertyIncident = table.asMap(String, String)
    assertThat(_claimWrapper.get().Incidents.firstWhere(\inc ->
        inc.Subtype == typekey.Incident.TC_PROPERTYCONTENTSINCIDENT and
            inc.Description == personalPropertyIncident.get(DK_DAMAGEDESCRIPTION)
    )).as("The expected Property Contents incident (${personalPropertyIncident}), could not be found on the claim").isNotNull()
  }

  override function verifyLivingExpensesOnClaim(table : DataTable) {
    var livingExpenses = table.asMap(String, String)
      assertThat(_claimWrapper.get().Incidents.firstWhere(\inc ->
          inc.Subtype == typekey.Incident.TC_LIVINGEXPENSESINCIDENT and
              inc.Description == livingExpenses.get(DK_DESCRIPTION)
      )).as("The expected Living Expenses incident (${livingExpenses}), could not be found on the claim").isNotNull()
  }

  override function createBodilyInjuryIncident() {
    var incident : Incident
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      incident = InjuryIncidentBuilder.uiReadyInjuryIncident().onClaim(_claimWrapper.get()).create(bundle)
    }, CurrentUser)
    _incidentWrapper.set(incident)
  }

  override function createBodilyInjuryIncidentForSkinBurns() {
    var incident : Incident
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      incident = InjuryIncidentBuilder.uiReadyInjuryIncident().onClaim(_claimWrapper.get())
          .withLossParty(LossPartyType.TC_INSURED)
          .withSeverity(SeverityType.TC_MODERATE_PROP)
          .withDescription("Insured has suffered important burns")
          .create(bundle)
    }, CurrentUser)
    _incidentWrapper.set(incident)
  }

  override function verifyADwellingIncidentExists() {
    var claim = _claimWrapper.get()
    assertThat(claim.Incidents.whereTypeIs(DwellingIncident))
        .as("Expected to have a DwellingIncident on the claim but found none")
        .isNotEmpty()
  }

  override function verifyASpecificDwellingIncidentExists(table : DataTable) {
    var claim = _claimWrapper.get()
    var dwellingIncident = table.asMap(String, String)
    assertThat(claim.Incidents.firstWhere(\incident ->
        incident.Subtype == typekey.Incident.TC_DWELLINGINCIDENT and
            incident.AsDwellingIncident.PropertyDesc == dwellingIncident.get(DK_PROPERTYDESCRIPTION) and
            incident.AsDwellingIncident.Description == dwellingIncident.get(DK_DAMAGEDESCRIPTION) and
            incident.AsDwellingIncident.MaterialsDamaged == dwellingIncident.get(DK_MATERIALSDAMAGED) and
            incident.AsDwellingIncident.EstimatesReceivedBoolean == (dwellingIncident.get(DK_ESTIMATESRECEIVED) == YesNo.TC_YES.DisplayName) and
            incident.AsDwellingIncident.AlreadyRepaired == (dwellingIncident.get(DK_ALREADYREPAIRED) == YesNo.TC_YES.DisplayName)
    )).as("The expected Dwelling incident (${dwellingIncident}), could not be found on the claim").isNotNull()
  }

  override function createClaimBuilder() : ClaimBuilder {
    return ClaimBuilder.uiReadyHOPHomeowners()
        .withPolicy(new PolicyBuilder()
            .uiReadyHOPHomeowners()
            .verified())
        .withNonConflictingClaimNumber()
  }

  override function getExposureBuilder(exposureMap : Map<String, String>, exposureType : ExposureType, lossPartyType : LossPartyType, severityStr : String) : ExposureBuilder {
    var exposureBuilder : ExposureBuilder
    var incidentBuilder : IncidentBuilderBase
    switch (exposureType) {
      case TC_PERSONALPROPERTYDAMAGE:
        exposureBuilder = ExposureBuilder.uiReadyPersonalPropertyDamage()
        incidentBuilder = new MobilePropertyIncidentBuilder()
        break
      case TC_PROPERTYDAMAGE:
        exposureBuilder = ExposureBuilder.uiReadyPropertyDamage(lossPartyType)
        incidentBuilder = FixedPropertyIncidentBuilder.uiReadyFixedPropertyIncident()
        break
      case TC_LOSSOFUSEDAMAGE:
        exposureBuilder = ExposureBuilder.uiReadyLossOfUseDamages()
        incidentBuilder = PropertyIncidentBuilder.uiReadyPropertyIncident()
        break
      case TC_OTHERSTRUCTURE:
        exposureBuilder = ExposureBuilder.uiReadyHOPOtherStructure()
        incidentBuilder = OtherStructureIncidentBuilder.uiReadyHOPOtherStructureIncident()
        break
      case TC_DWELLING:
        exposureBuilder = ExposureBuilder.uiReadyHOPDwelling()
        incidentBuilder = DwellingIncidentBuilder.uiReadyHOPDwellingIncident()
        break
      default:
        throw new UnsupportedOperationException("Not yet implemented for ${exposureType}")
    }
    addSeverityToIncident(incidentBuilder, severityStr)
    exposureBuilder.withIncident(incidentBuilder)
    exposureBuilder.withLossParty(lossPartyType)
    return exposureBuilder
  }

  override function createAClaimWithMidComplexityExposure() {
    var claim : Claim
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      claim = createClaimBuilder()
          .withExposure(ExposureBuilder.uiReadyHOPContent())
          .create(bundle)
    }, CurrentUser)
    executeSegmentationRulesOnClaim(claim)
  }

  private function addSeverityToIncident(incidentBuilder : IncidentBuilderBase, severityStr : String) {
    if (severityStr != null) {
      var severity = new TypelistTransformer<SeverityType>().transform(severityStr)
      incidentBuilder.withSeverity(severity)
    }
  }

  override function verifyLivingExpensesIncidentExists() {
    var claim = _claimWrapper.get()
    assertThat(claim.Incidents.whereTypeIs(LivingExpensesIncident))
        .as("Expected to have a LivingExpensesIncident on the claim but found none")
        .isNotEmpty()
  }

  override function verifyOtherStructuresIncidentExists() {
    var claim = _claimWrapper.get()
    assertThat(claim.Incidents.whereTypeIs(OtherStructureIncident))
        .as("Expected to have an OtherStructureIncident on the claim but found none")
        .isNotEmpty()
  }

  override function addDwellingIncident() {
    var claimLossDetails = new Navigation<ClaimLossDetails>(_proxy)
        .ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToLossDetails(), CurrentUser)
    var newDwellingIncidentPopup = claimLossDetails.goToNewIncidentPopup(IncidentUIHelpers.DWELLING.CreateLabel) as NewDwellingIncidentPopup
    newDwellingIncidentPopup.NewDwellingIncidentScreen.DwellingIncidentCV.DwellingIncidentPanelSet.DamageDV.Description.Value = "Dwelling incident description"
    newDwellingIncidentPopup.NewDwellingIncidentScreen.DwellingIncidentCV.DwellingIncidentPanelSet.DamageDV.FireDamageInfoInputSet.MaterialsDamaged.Value = "Wood"
    newDwellingIncidentPopup.NewDwellingIncidentScreen.DwellingIncidentCV.DwellingIncidentPanelSet.DwellingAttributeInputSet.DwellingAttribute_ClassType.selectFirstValidOption()
    newDwellingIncidentPopup.NewDwellingIncidentScreen.DwellingIncidentCV.DwellingIncidentPanelSet.DwellingAttributeInputSet.DwellingAttribute_NumStories.Value = "2"
    newDwellingIncidentPopup.update()
    claimLossDetails.ClaimLossDetailsScreen.Update.click()
    _claimWrapper.set(Query.make(Claim).compare(Claim#ID, Equals, _claimWrapper.get().ID).select().single())
    if (_incidentWrapper.get() == null) {
      _incidentWrapper.set(_claimWrapper.get().DwellingIncidentsOnly.first())
    }
  }

  override function addABodilyInjuryIncidentWithPersonAndInjuryDetails() {
    var claim = _claimWrapper.get()
    var claimLossDetails = new Navigation<ClaimLossDetails>(_proxy)
        .ensureOnPage(\tabBar -> tabBar.goToClaim(claim).goToLossDetails(), CurrentUser)
    var description = "Injury incident description"
    var newInjuryIncidentPopup = claimLossDetails.goToNewIncidentPopup(IncidentUIHelpers.INJURY.CreateLabel) as NewInjuryIncidentPopup
    newInjuryIncidentPopup.NewInjuryIncidentScreen.InjuryIncidentDV.Injured_Picker.selectFirstValidOption()
    newInjuryIncidentPopup.NewInjuryIncidentScreen.InjuryIncidentDV.InjuryIncidentInputSet.LossParty.selectFirstValidOption()
    //Disabled as part of Toggle R1
    //newInjuryIncidentPopup.NewInjuryIncidentScreen.InjuryIncidentDV.InjuryIncidentInputSet.Severity.selectFirstValidOption()
    newInjuryIncidentPopup.NewInjuryIncidentScreen.InjuryIncidentDV.InjuryIncidentInputSet.InjuryDescription.Value = description
    newInjuryIncidentPopup.update()
    claimLossDetails.ClaimLossDetailsScreen.Update.click()
    _claimWrapper.set(Query.make(Claim).compare(Claim#ID, Equals, claim.ID).select().single())
    if (_incidentWrapper.get() == null) {
      _incidentWrapper.set(claim.InjuryIncidentsOnly.singleWhere(\elt -> elt.Description == description))
    }
  }

  override function addALivingExpensesIncidentForMealAndLodging() {
    var claimLossDetails = new Navigation<ClaimLossDetails>(_proxy)
        .ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToLossDetails(), CurrentUser)
    var newLivingExpensesIncidentPopup = claimLossDetails.goToNewIncidentPopup(IncidentUIHelpers.LIVING_EXPENSES.CreateLabel) as NewLivingExpensesIncidentPopup
    newLivingExpensesIncidentPopup.NewLivingExpensesIncidentScreen.LivingExpensesIncidentPanelSet.Description.Value = "Living expenses incident description"
    newLivingExpensesIncidentPopup.NewLivingExpensesIncidentScreen.LivingExpensesIncidentPanelSet.MealsDays.Value = "10"
    newLivingExpensesIncidentPopup.NewLivingExpensesIncidentScreen.LivingExpensesIncidentPanelSet.MealsPeople.Value = "3"
    newLivingExpensesIncidentPopup.NewLivingExpensesIncidentScreen.LivingExpensesIncidentPanelSet.MealsRate.Value = "300"

    var lodgingProvider = newLivingExpensesIncidentPopup.NewLivingExpensesIncidentScreen.LivingExpensesIncidentPanelSet.LodgingProviderLV
    if (lodgingProvider.LodgingProviderLV._Entries.Empty) {
      lodgingProvider.LodgingProviderLV_tb.Add.click()
    }
    var firsLodgingProvider = lodgingProvider.LodgingProviderLV._Entries.first()
    firsLodgingProvider.StartDate.setDateValue(Date.Today)
    firsLodgingProvider.EndDate.setDateValue(Date.Today.addDays(10))
    firsLodgingProvider.Rate.setValue("50")
    firsLodgingProvider.Comments.Value = "Comments on the lodging provider"

    newLivingExpensesIncidentPopup.NewLivingExpensesIncidentScreen.Update.click()
    claimLossDetails.ClaimLossDetailsScreen.Update.click()
    _claimWrapper.set(Query.make(Claim).compare(Claim#ID, Equals, _claimWrapper.get().ID).select().single())
    if (_incidentWrapper.get() == null) {
      _incidentWrapper.set(_claimWrapper.get().LivingExpensesIncidentsOnly.first())
    }
  }

  override function addOtherStructuresIncident() {
    var claimLossDetails = new Navigation<ClaimLossDetails>(_proxy)
        .ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToLossDetails(), CurrentUser)
    var newOtherStructureIncidentPopup = claimLossDetails.goToNewIncidentPopup(IncidentUIHelpers.OTHER_STRUCTURE.CreateLabel) as NewOtherStructureIncidentPopup

    var otherStructureIncidentPanelSet = newOtherStructureIncidentPopup.NewOtherStructureIncidentScreen.OtherStructureIncidentCV.OtherStructureIncidentPanelSet
    otherStructureIncidentPanelSet.Description.Value = "Other structures incident description"
    otherStructureIncidentPanelSet.LossEstimate.Value = "1000"

    newOtherStructureIncidentPopup.NewOtherStructureIncidentScreen.Update.click()
    claimLossDetails.ClaimLossDetailsScreen.Update.click()
    _claimWrapper.set(Query.make(Claim).compare(Claim#ID, Equals, _claimWrapper.get().ID).select().single())
    if (_incidentWrapper.get() == null) {
      _incidentWrapper.set(_claimWrapper.get().OtherStructureIncidentsOnly.first())
    }
  }

  override function addPersonalPropertyIncident() {
    var claimLossDetails = new Navigation<ClaimLossDetails>(_proxy)
        .ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToLossDetails(), CurrentUser)
    var newPropertyContentsIncidentPopup = claimLossDetails.goToNewIncidentPopup(IncidentUIHelpers.PROPERTY_CONTENTS.CreateLabel) as NewPropertyContentsIncidentPopup
    var propertyContents = newPropertyContentsIncidentPopup.NewPropertyContentsIncidentScreen.PropertyContentsIncidentPanelSet
    propertyContents.Description.Value = "Personal property incident description"

    var chooseProperty = propertyContents.PropertyContentsScheduledItemsLV_tb.Add.click() as ChoosePropertyContentsScheduledItemPopup
    assertThat(chooseProperty.PropertyItemsLV._Entries).as("None scheduled item exists on the property").isNotEmpty()
    chooseProperty.PropertyItemsLV._Entries.first()._Checkbox.click()
    chooseProperty.AddCheckedItems.click()

    if (propertyContents.PropertyContentsLineItemsLV._Entries.Empty) {
      propertyContents.PropertyContentsLineItemsLV_tb.Add.click()
    }
    propertyContents.PropertyContentsLineItemsLV._Entries.first().LineItemName.Value = "Line item name"

    newPropertyContentsIncidentPopup.NewPropertyContentsIncidentScreen.Update.click()
    claimLossDetails.ClaimLossDetailsScreen.Update.click()
    _claimWrapper.set(Query.make(Claim).compare(Claim#ID, Equals, _claimWrapper.get().ID).select().single())
    if (_incidentWrapper.get() == null) {
      _incidentWrapper.set(_claimWrapper.get().PropertyContentsIncidentsOnly.first())
    }
  }

  override function updateDwellingIncident(table : DataTable) {
    var claimLossDetails = new Navigation<ClaimLossDetails>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToLossDetails(), CurrentUser)
     var editDwellingIncidentPopup = claimLossDetails.goToEditIncidentPopup(IncidentUIHelpers.DWELLING.getInstanceDisplayName(_incidentWrapper.get())) as EditDwellingIncidentPopup
    var dwellingIncident = table.asMap(String, String)
    UIHelper.setFieldValues(editDwellingIncidentPopup.EditDwellingIncidentScreen.DwellingIncidentCV.DwellingIncidentPanelSet, dwellingIncident)
    editDwellingIncidentPopup.EditDwellingIncidentScreen.Update.click()
    claimLossDetails.ClaimLossDetailsScreen.Update.click()
    _claimWrapper.set(Query.make(Claim).compare(Claim#ID, Equals, _claimWrapper.get().ID).select().single())
  }

  override function updateBodilyInjuryIncident(table : DataTable) {
    var claimLossDetails = new Navigation<ClaimLossDetails>(_proxy)
        .ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToLossDetails(), CurrentUser)
    var editInjuryIncidentPopup = claimLossDetails.goToEditIncidentPopup(IncidentUIHelpers.INJURY.getInstanceDisplayName(_incidentWrapper.get())) as EditInjuryIncidentPopup
    var incident = table.asMap(String, String)
    UIHelper.setFieldValues(editInjuryIncidentPopup.EditInjuryIncidentScreen.InjuryIncidentDV.InjuryIncidentInputSet, incident)
    editInjuryIncidentPopup.EditInjuryIncidentScreen.Update.click()
    claimLossDetails.ClaimLossDetailsScreen.Update.click()
    _claimWrapper.set(Query.make(Claim).compare(Claim#ID, Equals, _claimWrapper.get().ID).select().single())
  }

  override function verifyASpecificBodilyInjuryIncidentExist(table : DataTable) {
    var claim = _claimWrapper.get()
    var expectedIncident = table.asMap(String, String)
    assertThat(claim.Incidents.hasMatch(\incident ->
        incident.Subtype == typekey.Incident.TC_INJURYINCIDENT and
            incident.AsInjuryIncident.Description == expectedIncident.get(DK_DESCRIBEINJURIES) and
            incident.AsInjuryIncident.LossParty == new TypelistTransformer<LossPartyType>().transform(expectedIncident.get(DK_LOSSPARTY)) and
            incident.AsInjuryIncident.Severity == new TypelistTransformer<SeverityType>().transform(expectedIncident.get(DK_SEVERITY)) and
            incident.AsInjuryIncident.GeneralInjuryType == new TypelistTransformer<InjuryType>().transform(expectedIncident.get(DK_INJURYTYPE))
    )).as("The expected Bodily Injury incident (${expectedIncident}), could not be found on the claim").isTrue()
  }

  override function verifyAPersonalPropertyIncidentExists() {
    var claim = _claimWrapper.get()
    assertThat(claim.Incidents.whereTypeIs(PropertyContentsIncident))
        .as("Expected to have a PersonalPropertyIncident on the claim but found none")
        .isNotEmpty()
  }

}
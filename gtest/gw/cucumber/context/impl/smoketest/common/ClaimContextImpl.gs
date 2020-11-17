package gw.cucumber.context.impl.smoketest.common

uses com.google.inject.Inject
uses cucumber.api.DataTable
uses gw.api.database.Query
uses gw.api.databuilder.AddressBuilder
uses gw.api.databuilder.ClaimAssociationBuilder
uses gw.api.databuilder.ClaimBuilder
uses gw.api.databuilder.InjuryIncidentBuilder
uses gw.api.databuilder.MatterBuilder
uses gw.api.databuilder.PropertyItemBuilder
uses gw.api.databuilder.UniqueKeyGenerator
uses gw.api.locale.DisplayKey
uses gw.api.util.DateUtil
uses gw.cucumber.CucumberStepBase
uses gw.cucumber.context.api.common.ClaimContext
uses gw.cucumber.context.impl.smoketest.util.Navigation
uses gw.cucumber.setup.PolicyDataSet
uses gw.cucumber.testdata.DataWrapper
uses gw.cucumber.transformer.DateTransformer
uses gw.cucumber.transformer.TypelistTransformer
uses gw.cucumber.util.common.UIHelper
uses gw.smoketest.platform.web.PCFLocation
uses org.fest.assertions.Condition
uses pcftest.ClaimAssociations
uses pcftest.ClaimPolicyGeneral
uses pcftest.ClaimStatus
uses pcftest.ClaimSummary
uses pcftest.FNOLWizard
uses pcftest.NewClaimSaved
uses pcftest.NewContactPopup
uses pcftest.NewSubroAdversePartyPopup
uses pcftest.SubrogationGeneral
uses pcftest.WebMessageWorksheet

@SuppressWarnings("unused")
abstract class ClaimContextImpl extends CucumberStepBase implements ClaimContext {
  @Inject
  protected var _policyDataSetWrapper : DataWrapper<PolicyDataSet>

  @Inject
  protected var _claimWrapper : DataWrapper<Claim>

  @Inject
  protected var _claimsWrapper : DataWrapper<List<Claim>>

  @Inject
  protected var _incidentWrapper : DataWrapper<Incident>

  @Inject
  protected var _claimAssociationWrapper : DataWrapper<ClaimAssociation>

  @Inject
  protected var _assertionErrorWrapper : DataWrapper<AssertionError>

  @Inject
  private var searchCriteria : DataWrapper<Map<String, String>>

  private var _policySearchData = setPolicySearchData()

  private function setPolicySearchData() : Map<String, Map<String, String>> {
    var policySearch1 = {"First Name" -> "Ray", "Last Name" -> "Newton", "SSN or Tax ID" -> "123-45-6789", "VIN" -> "1GV234TV347463345"}
    var policySearch2 = {"Organization Name" -> "Worthy Farmer's Supply"}
    var policySearch3 = {"Country" -> "United States", "City" -> "Shelby"}
    var policySearch4 = {"Policy Type" -> "Workers' Compensation"}
    var policySearch5 = {"Country" -> "United States", "State" -> "Illinois"}
    var policySearch6 = {"Country" -> "United States", "ZIP Code" -> "28150"}
    return {"Search by name, SSN and VIN" -> policySearch1, "Search by Organization Name" -> policySearch2, "Search by City" -> policySearch3,
        "Search by Policy Type" -> policySearch4, "Search by State" -> policySearch5, "Search by Zip Code" -> policySearch6}
  }

  protected property get Wizard() : FNOLWizard {
    return _proxy.CurrentPage as FNOLWizard
  }

  override function startFilingClaim() {
    var wizard = _proxy.TabBar.goToNewClaim()
    var policyDataSet = _policyDataSetWrapper.get()
    if (policyDataSet != null && policyDataSet.PolicyNumber != null) {
      var policyNumber = policyDataSet.PolicyNumber
      wizard.SelectPolicy.findPolicy(policyNumber, Date.Today)
      wizard.SelectPolicy.SearchPanel.Search.click()
    }
  }

  override function setLossDate(lossDateText : String) {
    var lossDate = DateTransformer.transform(lossDateText)
    var wizard = Wizard
    wizard.goToFindPolicy()
    if (wizard.FindPolicy.FNOLWizard_FindPolicyScreen.FNOLWizardFindPolicyPanelSet_Search.Claim_LossDate.Enabled) {
      if (wizard.FindPolicy.FNOLWizard_FindPolicyScreen.ScreenMode.BoolValue) {
        wizard.FindPolicy.FNOLWizard_FindPolicyScreen.FNOLWizardFindPolicyPanelSet_Search.Claim_LossDate.DateValue = lossDate
        wizard.FindPolicy.FNOLWizard_FindPolicyScreen.FNOLWizardFindPolicyPanelSet_Search.Claim_lossTime.TimeValue = lossDate
      } else {
        wizard.FindPolicy.FNOLWizard_FindPolicyScreen.FNOLWizardFindPolicyPanelSet_Create.Claim_LossDate.DateValue = lossDate
        wizard.FindPolicy.FNOLWizard_FindPolicyScreen.FNOLWizardFindPolicyPanelSet_Create.Claim_lossTime.TimeValue = lossDate
      }
    }
  }

  override function claimHasInjuryIncident(table : DataTable) {
    var maps = table.asMaps(String, String)
    gw.transaction.Transaction.runWithNewBundle(\bund -> {
      var builder = InjuryIncidentBuilder.uiReadyInjuryIncident()
          .onClaim(_claimWrapper.get())

      for (var row in maps) {
        builder.withLossParty(new TypelistTransformer<LossPartyType>().transform(row.get(DisplayKey.get("Web.Admin.Workload.WorkloadClassification.ExposuresLV.LossParty"))))
        builder.withGeneralInjuryType(new TypelistTransformer<InjuryType>().transform(row.get(DisplayKey.get("Web.InjuryIncidentInputSet.GeneralInjuryType.Label"))))
        builder.withDetailedInjuryType(new TypelistTransformer<DetailedInjuryType>().transform(row.get(DisplayKey.get("Web.InjuryIncidentInputSet.DetailedInjuryType.Label"))))
        if (row.get(DisplayKey.get("Web.InjuryIncidentDV.Injured.Picker")) != null) {
          builder.withInjured(_claimWrapper.get().ClaimContactsForAllRoles.firstWhere(\elt -> elt.DisplayName == row.get(DisplayKey.get("Web.InjuryIncidentDV.Injured.Picker"))).Person)
        }
      }

      _incidentWrapper.set(builder.create(bund))
    }, User.util.UnrestrictedUser)
  }

  override function verifyClaimIsCreated(policyTypeText : String) {
    var policyType = new TypelistTransformer<PolicyType>().transform(policyTypeText)
    var claim = _claimWrapper.get()
    var policyDataSet = _policyDataSetWrapper.get()

    assertThat(_proxy.CurrentPage typeis NewClaimSaved).isTrue()
    assertThat(claim.Policy.PolicyType).isEqualTo(policyType)
    assertThat(claim.Policy.PolicyNumber).isEqualTo(policyDataSet.PolicyNumber)
  }

  override function verifyClaimsIsAssignedToUsersViaRoundRobin(groupName : String) {
    var claims = _claimsWrapper.get()
    var adjusters : HashMap<String, Integer> = {}
    var groupQuery = Query.make(Group).compare(Group#Name, Equals, groupName).select().AtMostOneRow
    var usrCount = groupQuery.Users.Count
    var cycle = claims.Count / usrCount
    var excessCount = claims.Count % usrCount

    groupQuery.Users.each(\usr ->
        adjusters.put(usr.User.DisplayName, 0)
    )

    for (claim in claims) {
      var key = claim.AssigneeDisplayString
      adjusters.put(key, adjusters.get(key) + 1)
    }

    assertThat(adjusters.values().toList().where(\elt -> elt == cycle).Count == (usrCount - excessCount)).isTrue()
    assertThat(adjusters.values().toList().where(\elt -> elt == (cycle + 1)).Count == (excessCount)).isTrue()
  }

  override function verifyPolicyIsUnverified() {
    var claimPolicyGeneralScreen = new Navigation<ClaimPolicyGeneral>(_proxy)
        .ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToPolicy(), CurrentUser)

    assertThat(isPolicyVerified(claimPolicyGeneralScreen))
        .as("The claim policy should be unverified")
        .isFalse()
  }

  override function verifyInjuryIncidentExists() {
    var claim = _claimWrapper.get()
    assertThat(claim.Incidents.whereTypeIs(InjuryIncident))
        .as("At least one injury incident should exist on the claim")
        .isNotEmpty()
  }

  override function verifyInjuryIncidentMatchesTable(table : DataTable) {
    for (row in table.asMaps(String, String)) {
      assertThat(_claimWrapper.get().InjuryIncidentsOnly.firstWhere(\inc ->
          inc.injured.DisplayName == row.get(DisplayKey.get("Web.InjuryIncidentDV.Injured.Picker")) and
              inc.LossParty == new TypelistTransformer<LossPartyType>().transform(row.get(DisplayKey.get("Web.Admin.Workload.WorkloadClassification.ExposuresLV.LossParty"))) and
              inc.Severity == new TypelistTransformer<SeverityType>().transform(row.get(DisplayKey.get("Web.InjuryIncidentInputSet.Severity.Label"))) and
              inc.GeneralInjuryType == new TypelistTransformer<InjuryType>().transform(row.get(DisplayKey.get("Web.InjuryIncidentInputSet.GeneralInjuryType.Label"))) and
              inc.DetailedInjuryType == new TypelistTransformer<DetailedInjuryType>().transform(row.get(DisplayKey.get("Web.InjuryIncidentInputSet.DetailedInjuryType.Label")))
      )).as("At least one injury incident should exist on the claim with values: ${row.Values.join(",")}").isNotNull()
    }
  }

  override function verifyInjuryIncidentLossPartyType(lossPartyTypeText : String) {
    var lossPartyType = new TypelistTransformer<LossPartyType>().transform(lossPartyTypeText)
    var claim = _claimWrapper.get()
    assertThat(claim.InjuryIncidentsOnly.single().LossParty)
        .as("There should be an injury loss part type of ${lossPartyType}")
        .isEqualTo(lossPartyType)
  }

  override function addInjuryExposure(coverageSubtype : CoverageSubtype = null) {
    var wizard = Wizard
    var covTypeMenu = wizard.AssignSave.NewExposureLV_tb.AddExposure.NewExposureMenuItemSet_ByCoverageType
    var newExposure = wizard.AssignSave.findItemForCoverageSubtypeLevel0(covTypeMenu, coverageSubtype)
    var bodilyinjurydamage = newExposure.NewClaimWizard_ExposurePageScreen.NewClaimExposureDV_Bodilyinjurydamage
    bodilyinjurydamage.Claimant_Picker.selectFirstValidOption()
    bodilyinjurydamage.Claimant_Type.TypeKeyValue = ClaimantType.TC_OTHER
    bodilyinjurydamage.BIDamageInputSet.Injury_Incident.selectFirstValidOption()
    var location = newExposure.update()
    UIHelper.assertNoMessages(location)
  }

  override function addCollisionExposure(coverageSubtype : CoverageSubtype = null) {
    var wizard = Wizard
    var covTypeMenu = wizard.AssignSave.NewExposureLV_tb.AddExposure.NewExposureMenuItemSet_ByCoverageType
    var newExposure = wizard.AssignSave.findItemForCoverageSubtypeLevel0(covTypeMenu, coverageSubtype)
    var collision = newExposure.NewClaimWizard_ExposurePageScreen.NewClaimExposureDV_Vehicledamage
    collision.NewClaimVehicleDamageDV.Claimant_Picker.selectFirstValidOption()
    collision.NewClaimVehicleDamageDV.Claimant_Type.TypeKeyValue = ClaimantType.TC_OTHER
    collision.NewClaimVehicleDamageDV.Vehicle_Incident.selectFirstValidOption()
    var location = newExposure.update()
    UIHelper.assertNoMessages(location)
  }

  override function addNote() {
    var wizard = Wizard
    wizard.FNOLMenuActions.click()
    var worksheet = wizard.FNOLMenuActions.NewClaimMenuActions_NewNote.click()
    worksheet.FNOLWizard_NewNoteScreen.DocumentNoteDV.Body.Value = "note body text"
    var location = worksheet.FNOLWizard_NewNoteScreen.NewClaimWizard_NewNoteWorksheet_UpdateButton.click()
    UIHelper.assertNoMessages(location)
  }

  override function addAWitness(table : DataTable) {
    var wizard = Wizard
    wizard.goToLossDetailsPage()

    var witnessLV = wizard.LossDetails.FNOLWizard_NewLossDetailsScreen_default.AtTheSceneDV.WitnessLV
    for (row in table.asMaps(String, String)) {
      witnessLV.EditableWitnessesLV_tb.Add.click()
      var entry = witnessLV.EditableWitnessesLV._Entries.last()
      var optionLabels = entry.Contact.OptionLabels

      if (optionLabels.contains(row.get(DisplayKey.get("LV.Claim.EditableOfficials.Name")))) {
        entry.Contact.getOptionByLabel(row.get(DisplayKey.get("LV.Claim.EditableOfficials.Name"))).click()
      } else {
        var nameInfo = row.get(DisplayKey.get("LV.Claim.EditableOfficials.Name")).split(' ')

        var newContactPopup = entry
            .Contact
            .ClaimNewContactPickerMenuItemSet
            .NewContactPickerMenuItemSet_NewPerson
            .click()

        var personNameInputSet = newContactPopup
            .ContactDetailScreen
            .ContactBasicsDV_Person
            .PersonNameInputSet
            .GlobalPersonNameInputSet_default

        personNameInputSet.FirstName.Value = nameInfo[0]
        personNameInputSet.LastName.Value = nameInfo[1]

        newContactPopup.update()
      }

      entry.EditableWitnesses_WitnessStatementInd.getOptionByLabel(row.get(DisplayKey.get("LV.Claim.EditableWitnesses.WitnessStatementInd"))).click()
      entry.EditableWitnesses_WitnessPosition.getOptionByLabel(row.get(DisplayKey.get("LV.Claim.EditableWitnesses.WitnessPosition"))).click()
      entry.EditableWitnesses_WitnessPerspective.setValue(row.get(DisplayKey.get("LV.Claim.EditableWitnesses.WitnessPerspective")))
    }
  }

  /**
   * This functionality has been disabled as part of Toggle R1
   *
   * @param officialType - the type of official making the report
   * @param table        - Name      - String  - Name of official
   *                     - Report #  - Number  - The report number/ID
   *                     e.g
   *                     | Name              | Report # |
   */
  override function addAnOfficial(officialType : String, table : DataTable) {
//    var wizard = Wizard
//    wizard.goToLossDetailsPage()
//
//    var officialsLV = wizard.LossDetails.FNOLWizard_NewLossDetailsScreen_default.AtTheSceneDV.Claim_Officials
//    for (row in table.asMaps(String, String)) {
//      officialsLV.EditableOfficialsLV_tb.Add.click()
//      officialsLV.EditableOfficialsLV._Entries.last().OfficialType.getOptionByLabel(officialType).click()
//      officialsLV.EditableOfficialsLV._Entries.last().Name.setValue(row.get(DisplayKey.get("LV.Claim.EditableOfficials.Name")))
//      officialsLV.EditableOfficialsLV._Entries.last().ReportNumber.setValue(row.get(DisplayKey.get("LV.Claim.EditableOfficials.ReportNumber")))
//    }
  }

  /**
   * This functionality has been disabled as part of Toggle R1
   *
   * @param table - Metro Report Type              - String (MetroReportType)      - The type of police report
   *              - City of Investigating Agency   - String                        - The city the police are based
   *              - State of Investigating Agency  - String                        - The state the police are based
   *              - Insured Vehicle                - String (Year Make Model)      - The year, make and model of the insured vehicle
   *              e.g
   *              | Metro Report Type | City of Investigating Agency | State of Investigating Agency | Insured Vehicle     |
   */
  override function addAPoliceReport(table : DataTable) {
//    var wizard = Wizard
//    wizard.goToLossDetailsPage()
//
//    var dv = wizard.LossDetails.FNOLWizard_NewLossDetailsScreen_default.AtTheSceneDV
//    for (row in table.asMaps(String, String)) {
//      var policeReportPopup = dv.PoliceReportLV.MetroReportsLV_tb.Add.click() as NewMetroReportDetailsPopup
//      var popupDv = policeReportPopup.MetroReportDetailsScreen.MetroReportDetailsDV
//      popupDv.MetroReportType.getOptionByLabel(row.get(DisplayKey.get("Web.MetroReportDV.Summary.Type"))).click()
//      popupDv.MetroInvestAgencyCity.setValue(row.get(DisplayKey.get("Web.MetroReportDV.Investigate.AgencyCity")))
//      popupDv.MetroInvestAgencyState.getOptionByLabel(row.get(DisplayKey.get("Web.MetroReportDV.Investigate.AgencyState"))).click()
//      popupDv.InsuredVehicle.clickFirstOptionWithMatchingLabel(\text -> text.contains(row.get(DisplayKey.get("Web.MetroReportDV.Vehicle.Insured"))))
//      policeReportPopup.MetroReportDetailsScreen.Update.click()
//    }
  }

  function setFaultRating(faultRating : String) {
    var wizard = Wizard
    wizard.goToLossDetailsPage()

    var faultTk = new TypelistTransformer<FaultRating>().transform(faultRating)
    wizard.LossDetailsAUTO.CategorizationDV.Notification_Fault.getOptionByTypeKey(faultTk).click()
  }

  override function autoAssignClaimAndExposures() {
    var wizard = Wizard
    wizard.AssignSave.CommonAssignChoice_Choice.click()
    wizard.AssignSave.CommonAssign.clickByLabelSubstr(DisplayKey.get("Java.Assign.AssignByRules"))
  }

  override function autoAssignClaimIndividually() {
    var wizard = Wizard
    wizard.AssignSave.IndividualAssignChoice_Choice.click()
    wizard.AssignSave.CommonAssign.clickByLabelSubstr(DisplayKey.get("Java.Assign.AssignByRules"))
  }

  override function autoAssignExposureIndividually(coverageTypeText : String) {
    var wizard = Wizard
    wizard.AssignSave.IndividualAssignChoice_Choice.click()
    var exposureEntry = wizard.AssignSave.NewExposureLV._Entries.singleWhere(\e -> e.Exposures_Coverage.Text == coverageTypeText)
    exposureEntry.Exposures_Assignee.clickByLabelSubstr(DisplayKey.get("Java.Assign.AssignByRules"))
  }

  override function assignClaimAndExposuresToGroupAndUser(groupName : String, userDisplayName : String) {
    var wizard = Wizard
    wizard.AssignSave.CommonAssignChoice_Choice.click()
    var assigneePickerPopup = wizard.AssignSave.CommonAssign.CommonAssign_PickerButton.click()
    assigneePickerPopup.pickGroupAndUser(groupName, userDisplayName)
  }

  override function assignClaimIndividuallyToGroupAndUser(groupName : String, userDisplayName : String) {
    var wizard = Wizard
    wizard.AssignSave.IndividualAssignChoice_Choice.click()
    var assigneePickerPopup = wizard.AssignSave.ClaimAssign.ClaimAssign_PickerButton.click()
    assigneePickerPopup.pickGroupAndUser(groupName, userDisplayName)
  }

  override function assignExposureIndividuallyToGroupAndUser(coverageTypeText : String, groupName : String, userDisplayName : String) {
    var wizard = Wizard
    wizard.AssignSave.IndividualAssignChoice_Choice.click()
    var exposureEntry = wizard.AssignSave.NewExposureLV._Entries.singleWhere(\e -> e.Exposures_Coverage.Text.equalsIgnoreCase(coverageTypeText))
    var assigneePickerPopup = exposureEntry.Exposures_Assignee.Exposures_Assignee_PickerButton.click()
    assigneePickerPopup.pickGroupAndUser(groupName, userDisplayName)
  }

  override function addPersonContactWithRole(contactRoleName : String) {
    var contactRole = new TypelistTransformer<ContactRole>().transform(contactRoleName)
    var wizard = Wizard
    wizard.goToPartiesInvolved()

    var wizardPartiesInvolvedScreen = wizard.IndependentWizardStepSet.PartiesInvolved.NewClaimWizard_PartiesInvolvedScreen
    var partyInvolvedPopup = wizardPartiesInvolvedScreen.NewClaimPeopleInvolvedDetailedLV_tb.NewClaimWizard_PartiesInvolvedScreen_CreateNewContactButton
        .NewClaimPartiesInvoled_Person.NewClaimPartiesInvoled_OtherPerson.click() as pcftest.NewClaimWizard_PartyInvolvedPopup

    partyInvolvedPopup.NewClaimWizard_PartyInvolvedScreen.ContactBasicsDV_Person.PersonNameInputSet.GlobalPersonNameInputSet_default.LastName.Value = "Smith"
    var contactBasicsHeaderInputSet = partyInvolvedPopup.NewClaimWizard_PartyInvolvedScreen.ContactBasicsDV_Person.ContactBasicsHeaderInputSet
    contactBasicsHeaderInputSet.EditableClaimContactRolesLV_tb.Add.click()
    contactBasicsHeaderInputSet.EditableClaimContactRolesLV._Entries.last().Role.clickByLabelSubstr(contactRole.DisplayName)

    var updateLocation = partyInvolvedPopup.NewClaimWizard_PartyInvolvedScreen.CustomUpdateButton.click()
    UIHelper.assertNoMessages(updateLocation)
    (_proxy.CurrentPage as FNOLWizard).goToFindPolicy()
    UIHelper.assertNoMessages(_proxy.CurrentPage as PCFLocation)
    (_proxy.CurrentPage as FNOLWizard).assertOnPage()
  }

  override function setClaimSegment(claimSegmentText : String) {
    var claimSegment = new TypelistTransformer<ClaimSegment>().transform(claimSegmentText)
    var claim = _claimWrapper.get()
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      claim = bundle.add(claim)
      claim.Segment = claimSegment
    }, CurrentUser)
    _claimWrapper.set(claim)
  }

  override function setClaimLossLocationState(stateText : String) {
    var state = new TypelistTransformer<State>().transform(stateText)
    var claim = _claimWrapper.get()
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      claim = bundle.add(claim)
      claim.LossLocation = AddressBuilder.uiReadyUSA().withState(state).create(bundle)
    }, CurrentUser)
    _claimWrapper.set(claim)
  }

  override function closeAllMatters() {
    var claim = _claimWrapper.get()
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      claim = bundle.add(claim)
      claim.Matters.each(\matter -> {
        if (!matter.isClosed()) {
          matter.close(ResolutionType.TC_SO, "testing purpose")
        }

      })
    }, User.util.UnrestrictedUser) // Using unrestricted user here to close matters that assigned to users other than the current user
    _claimWrapper.set(claim)
  }

  override function closeSubrogation() {
    var claim = _claimWrapper.get()
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      claim = bundle.add(claim)
      if (claim.SubrogationSummary.Subrogations.HasElements and claim.SubrogationSummary.Status != SubrogationStatus.TC_CLOSED) {
        claim.SubrogationSummary.Status = SubrogationStatus.TC_CLOSED
        claim.SubrogationSummary.SubroReferralDate = DateUtil.currentDate()
      }
    }, CurrentUser)
    _claimWrapper.set(claim)
  }

  override function determineFaultRating() {
    var claim = _claimWrapper.get()
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      claim = bundle.add(claim)
      claim.FaultRating = FaultRating.TC_NOFAULT
    }, CurrentUser)
    _claimWrapper.set(claim)
  }

  override function setClaimStatusToClosed() {
    var claim = _claimWrapper.get()
    claim = claim.refresh() as Claim
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      claim = bundle.add(claim)
      if (!claim.Closed) {
        claim.close(ClaimClosedOutcomeType.TC_COMPLETED, "testing purpose")
      }
    }, CurrentUser)
    _claimWrapper.set(claim)
  }

  override function closeClaim() {
    var claim = _claimWrapper.get()
    var claimSummary = new Navigation<ClaimSummary>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(claim), CurrentUser)
    var closeClaimPopup = claimSummary.ClaimMenuActions.goToCloseClaim()
    closeClaimPopup.CloseClaimScreen.CloseClaimInfoDV.Outcome.setTypeKeyValue(ClaimClosedOutcomeType.TC_DENIAL_EXT)
    var location = closeClaimPopup.CloseClaimScreen.Update.click()
    UIHelper.assertNoMessages(location)
    UIHelper.assertNoMessages(_proxy.CurrentWorksheet as WebMessageWorksheet)
    // Querying to refresh the entire claim entity graph
    claim = Query.make(Claim).compare(Claim#ID, Equals, claim.ID).select().single()
    assertThat(claim.State).isEqualTo(ClaimState.TC_CLOSED)
    _claimWrapper.set(claim)
  }

  override function tryToCloseTheClaim() {
    try {
      closeClaim()
    } catch (assertionError : AssertionError) {
      _assertionErrorWrapper.set(assertionError)
    }
  }

  override function iCouldNotCloseClaim() {
    assertThat(_assertionErrorWrapper.get()).isNotNull()
  }

  override function reopenClaim() {
    var claimSummary = new Navigation<ClaimSummary>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()), CurrentUser)
    var reopenClaimPopup = claimSummary.ClaimMenuActions.goToReopenClaim()
    var location = reopenClaimPopup.ReopenClaimScreen.Update.click()
    UIHelper.assertNoMessages(location)
  }

  override function updateAssociationType(name : String, type : String) {
    var claimAssociations = new Navigation<ClaimAssociations>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToAssociations(), CurrentUser)
    var associationEntry = claimAssociations.ClaimAssociationsScreen.AssociatedClaimsLV._Entries.firstWhere(\elt -> elt.Association.Text.contains(name))
    assertThat(associationEntry).isNotNull().as("No claim association exists with the name ${name}")
    var association = associationEntry.Association.click()
    association.ClaimAssociationDetailScreen.Edit.click()
    association.ClaimAssociationDetailScreen.ClaimAssociationDetailDV.Type.getOptionByLabel(type).click()
    association.ClaimAssociationDetailScreen.Update.click()
  }

  override function deleteAssociationOnClaim(name : String) {
    var claimAssociations = new Navigation<ClaimAssociations>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToAssociations(), CurrentUser)
    claimAssociations.ClaimAssociationsScreen.AssociatedClaimsLV._Entries.firstWhere(\elt -> elt.Association.Text.contains(name))._Checkbox.click()
    claimAssociations.ClaimAssociationsScreen.ClaimAssociations_DeleteButton.click()
  }

  override function verifyLossDate(dateStr : String) {
    if (dateStr == "Today") {
      assertThat(Date.CurrentDate.compareIgnoreTime(_claimWrapper.get().LossDate))
    } else {
      var date = new DateTransformer().transform(dateStr)
      assertThat(date.compareIgnoreTime(_claimWrapper.get().LossDate))
    }
  }

  override function verifyLossLocationInState(state : String) {
    assertThat(_claimWrapper.get().LossLocation.State).isEqualTo(new TypelistTransformer<State>().transform(state))
  }

  override function verifyClaimStatus(claimStateText : String) {
    var claimState = new TypelistTransformer<ClaimState>().transform(claimStateText)
    var claimStatus = new Navigation<ClaimStatus>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToClaimStatus(), CurrentUser)
    assertThat(claimStatus.ClaimStatus.TypeKeyValue).isEqualTo(claimState)
  }

  override function verifyClaimHasExposureOfType(exposureTypeText : String) {
    var exposureType = new TypelistTransformer<ExposureType>().transform(exposureTypeText)
    var claim = _claimWrapper.get()
    assertThat(claim.Exposures).satisfies(new Condition<Exposure[]>() {
      override function matches(exposures : Exposure[]) : boolean {
        return exposures.hasMatch(\exposure -> exposure.ExposureType == exposureType)
      }
    })
  }

  override function verifyClaimSegment(claimSegmentText : String) {
    var claimSegment = new TypelistTransformer<ClaimSegment>().transform(claimSegmentText)
    var claim = _claimWrapper.get()
    assertThat(claim.Segment).isEqualTo(claimSegment)
  }

  override function associatedClaims(associationTitle : String) {
    ClaimAssociationBuilder.uiReadyAssociationWithClaims(_claimsWrapper.get().toTypedArray())
        .withTitle("${associationTitle}+${UniqueKeyGenerator.get().nextID()}").createAndCommitInNewBundle()
  }

  override function associateClaims(associationTitle : String) {
    var otherClaims = _claimsWrapper.get().disjunction({_claimWrapper.get()})
    var claimAssociations = new Navigation<ClaimAssociations>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToAssociations(), CurrentUser)
    var newClaimAssociation = claimAssociations.goToNewAssociation()
    var title = "${associationTitle}+${UniqueKeyGenerator.get().nextID()}"
    newClaimAssociation.Title.Value = title
    newClaimAssociation.ClaimAssociationDetailScreen.ClaimAssociationDetailDV.Type.setTypeKeyValue(ClaimAssocType.TC_GENERAL)

    for (otherClaim in otherClaims) {
      var entry = newClaimAssociation.add()
      var popup = entry.Claim.SelectClaim.click()
      popup.ClaimSearchScreen.ClaimSearchDV.ClaimSearchRequiredInputSet.ClaimNumber.Value = otherClaim.ClaimNumber
      var location = popup.ClaimSearchScreen.ClaimSearchDV.ClaimSearchAndResetInputSet.Search.click()
      popup.ClaimSearchScreen.ClaimSearchResultsLV_active._Entries.single().select()
    }
    var location = newClaimAssociation.update()
    UIHelper.assertNoMessages(location)
  }

  override function verifyAssociationWithNameExists(associationTitle : String) {
    var claims = _claimsWrapper.get()
    for (claim in claims) {
      // Querying to refresh the entire claim entity graph
      claim = Query.make(Claim).compare(Claim#ID, Equals, claim.ID).select().single()
      assertThat(claim.Associations.where(\association -> association.Title.startsWithIgnoreCase(associationTitle))).isNotEmpty()
    }
  }

  override function createClaimWithNoExposure() {
    var claim : Claim
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      claim = createClaimBuilder()
          .create(bundle)
    }, CurrentUser)
    executeSegmentationRulesOnClaim(claim)
  }

  override function iCreateAClaimWithAnExposure(table : DataTable) {
    var claim : Claim
    var exposures = table.asMaps(String, String)
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      var claimBuilder = createClaimBuilder()
      for (exposure in exposures) {
        addExposureToClaimBuilder(claimBuilder, exposure)
      }
      claim = claimBuilder.create(bundle)
    }, CurrentUser)
    _claimWrapper.set(claim)

    executeSegmentationRulesOnClaim(claim)
  }

  override function addExposureToClaimBuilder(claimBuilder : ClaimBuilder, exposureMap : Map<String, String>) {
    var exposureStr = exposureMap.get(DisplayKey.get("Web.BizRules.Rule.ApplicabilityCriteria.ExposureType"))
    var exposureType = new TypelistTransformer<ExposureType>().transform(exposureStr, true)
    var lossPartyType = exposureMap.get(DisplayKey.get("Web.Admin.Workload.WorkloadClassification.ExposuresLV.LossParty")) != null ?
        new TypelistTransformer<LossPartyType>().transform(exposureMap.get(DisplayKey.get("Web.Admin.Workload.WorkloadClassification.ExposuresLV.LossParty"))) : LossPartyType.TC_INSURED
    var severityStr = exposureMap.get(DisplayKey.get("Web.Admin.Workload.WorkloadClassification.ExposureIncidentSeveritiesLV.IncidentSeverity"))

    var exposureBuilder = getExposureBuilder(exposureMap, exposureType, lossPartyType, severityStr)
    claimBuilder.withExposure(exposureBuilder)
  }

  override function executeSegmentationRulesOnClaim(claim : Claim) {
    // Querying to refresh the entire claim entity graph
    claim = Query.make(Claim).compare(Claim#ID, Equals, claim.ID).select().single()
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      bundle.add(claim)
      for (var exposure in claim.Exposures) {
        rules.Segmentation.ExposureSegmentationRules.invoke(exposure)
      }
      rules.Segmentation.ClaimSegmentationRules.invoke(claim)
    }, CurrentUser)
    _claimWrapper.set(claim)
  }

  override function setClaimLossCause(lossCauseStr : String) {
    var lossCause = new TypelistTransformer<LossCause>().transform(lossCauseStr)
    var claim : Claim
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      claim = bundle.add(_claimWrapper.get())
      claim.LossCause = lossCause
    }, CurrentUser)
    _claimWrapper.set(claim)
  }

  override function setScheduledItems(table : DataTable) {
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      var policy = bundle.add(_claimWrapper.get().Policy)
      if (policy.PolicyLocations.IsEmpty) {
        policy.PolicyLocations = {new gw.api.databuilder.PolicyLocationBuilder().create(bundle)}
      }
      var scheduledItems = table.asList(String).map(\elt -> new PropertyItemBuilder().withDescription(elt).create(bundle)).toTypedArray()
      policy.PolicyLocations.first().HighValueItems = scheduledItems
    }, CurrentUser)
    _claimWrapper.set(Query.make(Claim).compare(Claim#ID, Equals, _claimWrapper.get().ID).select().single())
  }

  override function createAClaimWithMidComplexityExposure() {
    throw new UnsupportedOperationException("Not implemented for ${_policyDataSetWrapper.get().PolicyType}")
  }

  override function verifyAssociationWithNameAndTypeExists(associationTitle : String, type : String) {
    var claims = _claimsWrapper.get()
    for (claim in claims) {
      // Querying to refresh the entire claim entity graph
      claim = Query.make(Claim).compare(Claim#ID, Equals, claim.ID).select().single()
      assertThat(claim.Associations.hasMatch(\association ->
          association.Title.startsWithIgnoreCase(associationTitle) and
              association.ClaimAssocType == new TypelistTransformer<ClaimAssocType>().transform(type))
      ).as("Claim association should exist with name ${associationTitle} and type ${type}")
    }
  }

  override function verifyAssociationDoesNotExist(associationTitle : String) {
    var claims = _claimsWrapper.get()
    for (claim in claims) {
      // Querying to refresh the entire claim entity graph
      claim = Query.make(Claim).compare(Claim#ID, Equals, claim.ID).select().single()

      assertThat(not claim.Associations.hasMatch(\association ->
          association.Title.startsWithIgnoreCase(associationTitle))
      ).as("Claim association should not exist with name ${associationTitle}")
    }
  }

  function verifyClaimLossLocationInState(lossState : String) {
    var claim = _claimWrapper.get()
    assertThat(claim.LossLocation.State.DisplayName).isEqualTo(lossState)
  }

  override function verifyClaimHasAWitnessReport(table : DataTable) {
    var claim = _claimWrapper.get()
    var witnesses = claim.getClaimContactRolesByRole(ContactRole.TC_WITNESS)
    for (row in table.asMaps(String, String)) {
      assertThat(witnesses.singleWhere(\elt ->
          elt.Contact.DisplayName == row.get(DisplayKey.get("LV.Claim.EditableOfficials.Name")) and
              elt.WitnessStatementInd == new TypelistTransformer<YesNo>().transform(row.get(DisplayKey.get("LV.Claim.EditableWitnesses.WitnessStatementInd"))) and
              elt.WitnessPosition == new TypelistTransformer<WitnessPosition>().transform(row.get(DisplayKey.get("LV.Claim.EditableWitnesses.WitnessPosition"))) and
              elt.WitnessPerspective == row.get(DisplayKey.get("LV.Claim.EditableWitnesses.WitnessPerspective"))
      )).as("Cannot find witness on claim with attributes: ${row.Values.join(", ")}").isNotNull()
    }
  }

  override function verifyClaimHasAPoliceReport(table : DataTable) {
    var claim = _claimWrapper.get()
    for (row in table.asMaps(String, String)) {
      assertThat(claim.MetroReports.singleWhere(\report ->
          report.MetroReportType == new TypelistTransformer<MetroReportType>().transform(row.get(DisplayKey.get("Web.MetroReportDV.Summary.Type"))) and
              report.AgentCity == row.get(DisplayKey.get("Web.MetroReportDV.Investigate.AgencyCity")) and
              report.AgentState == new TypelistTransformer<State>().transform(row.get(DisplayKey.get("Web.MetroReportDV.Investigate.AgencyState"))) and
              report.VehicleIncident.DisplayName.contains(row.get(DisplayKey.get("Web.MetroReportDV.Vehicle.Insured")))
      )).as("Cannot find police report on claim with attributes: ${row.Values.join(", ")}").isNotNull()
    }
  }

  function verifyClaimHasAOfficialReportWithType(officialType : String, table : DataTable) {
    var claim = _claimWrapper.get()
    var tk = new TypelistTransformer<OfficialType>().transform(officialType)
    for (row in table.asMaps(String, String)) {
      assertThat(claim.Officials.singleWhere(\official ->
          official.OfficialType == tk and
              official.Name == row.get(DisplayKey.get("LV.Claim.EditableOfficials.Name")) and
              official.ReportNumber == row.get(DisplayKey.get("LV.Claim.EditableOfficials.ReportNumber"))
      )).as("Cannot find official on claim of type ${officialType} with attributes: ${row.Values.join(", ")}").isNotNull()
    }
  }

  function verifyClaimHasFaultRating(reportType : String) {
    var claim = _claimWrapper.get()
    assertThat(claim.FaultRating).isEqualTo(new TypelistTransformer<FaultRating>().transform(reportType))
  }


  override function verifyInjuryIncidentCreated() {
    var claim = _claimWrapper.get()
    assertThat(claim.InjuryIncidentsOnly.Count).isGreaterThanOrEqualTo(1)
  }

  override function setPolicyType(policyType : String) {
    var type = new TypelistTransformer<PolicyType>().transform(policyType)
    var wizard = _proxy.TabBar.goToNewClaim()
    wizard.FindPolicy.FNOLWizard_FindPolicyScreen.setPolicyType(type)
  }

  override function searchForAPolicyByPolicyNumber() {
    var wizard = _proxy.TabBar.goToNewClaim()
    var policyDataSet = _policyDataSetWrapper.get()
    assertThat(policyDataSet).as("Policy data set should not be null").isNotNull()
    assertThat(policyDataSet.PolicyNumber).as("Policy number should not be null").isNotNull()
    var policyNumber = policyDataSet.PolicyNumber
    wizard.SelectPolicy.findPolicy(policyNumber)
  }

  override function verifyPoliciesMatchAGivenPolicyNumber() {
    var policyDataSet = _policyDataSetWrapper.get()
    assertThat(Wizard.FindPolicy.FNOLWizard_FindPolicyScreen.verifyPoliciesMatchAGivenPolicyNumber(policyDataSet.PolicyNumber)).isTrue()
  }

  override function searchForPoliciesByCriteria() {
    var wizard = _proxy.TabBar.goToNewClaim()

    var criteria = searchCriteria.get()

    wizard.SelectPolicy.setToFindMode()
    wizard.SelectPolicy.setFirstName(criteria.get(DisplayKey.get("Web.ContactDetail.Person.FirstName")))
    wizard.SelectPolicy.setLastName(criteria.get(DisplayKey.get("Web.ContactDetail.Person.LastName")))
    wizard.SelectPolicy.setOrganizationName(criteria.get(DisplayKey.get("Web.AddressBook.Search.OrganizationName")))
    wizard.SelectPolicy.setPolicyType(criteria.get(DisplayKey.get("NVV.Policy.PolicySearch.Policy.PolicyType")))
    wizard.SelectPolicy.setCountry(criteria.get(DisplayKey.get("entity.Address.County")))
    wizard.SelectPolicy.setCity(criteria.get(DisplayKey.get("entity.Address.City")))
    wizard.SelectPolicy.setState(criteria.get(DisplayKey.get("entity.Address.State")))
    wizard.SelectPolicy.setZip(criteria.get(DisplayKey.get("Web.Address.Default.ZIP")))
    wizard.SelectPolicy.setVIN(criteria.get(DisplayKey.get("entity.Vehicle.Vin")))

    wizard.SelectPolicy.SearchPanel.Search.click()
  }

  override function policiesFoundMatchTheCriteria() {
    var entries = Wizard.FindPolicy.FNOLWizard_FindPolicyScreen.FNOLWizardFindPolicyPanelSet_Search.PolicyResultLV._Entries
    assertThat(entries.HasElements).isTrue()
    var criteria = searchCriteria.get()
    assertThat(entries.allMatch(\policy -> policy.verifyMatchesCriteria(criteria))).isTrue()
  }

  override function setSearchCriteria(table : DataTable) {
    searchCriteria.set(_policySearchData.get(table.asMaps(String, String).first().get("Search Data")))
  }

  @SuppressWarnings("Method2Property")
  protected abstract function isPolicyVerified(claimPolicyGeneralScreen : ClaimPolicyGeneral) : boolean

  protected function captureNewlyCreatedClaim(claim : Claim) {
    if (_claimsWrapper.get() == null) {
      _claimsWrapper.set(new ArrayList<Claim>())
    }
    _claimsWrapper.get().add(claim)
    _claimWrapper.set(claim)
  }

  override function createOpenMatter() {
    var claim = _claimWrapper.get()
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      _claimWrapper.set(MatterBuilder
          .uiReadyMatter(claim)
          .assignedTo(CurrentUser)
          .create(bundle).getClaim()
      )
    }, CurrentUser)
  }

  override function addResponsiblePartiesLiability(table : DataTable) {
    var subrogationGeneral = new Navigation<SubrogationGeneral>(_proxy)
        .ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToSubrogationGeneral(), CurrentUser)
    subrogationGeneral.ClaimSubroSummaryScreen.SubrogationMainPanelSet.Edit.click()

    var responsibles = table.asMaps(String, String)
    for (responsible in responsibles) {
      var newSubroAdversePartyPopup = subrogationGeneral.ClaimSubroSummaryScreen.SubrogationMainPanelSet.AdversePartyInfo.EditableAdverseGeneralLV_tb.AddResponsibleParty.click() as NewSubroAdversePartyPopup
      var newSubroAdversePartyScreen = newSubroAdversePartyPopup.NewSubroAdversePartyScreen

      var newContactPopup = newSubroAdversePartyScreen.SubrogationPartyDetailDV.Adverse.ClaimNewContactPickerMenuItemSet.NewContactPickerMenuItemSet_NewPerson.click() as NewContactPopup
      newContactPopup.ContactDetailScreen.ContactBasicsDV_Person.PersonNameInputSet.GlobalPersonNameInputSet_default.LastName.Value = responsible.get(DK_RESPONSIBLE_PARTY)
      newContactPopup.update()

      newSubroAdversePartyScreen.SubrogationPartyDetailDV.LiabilityPercentage.Value = responsible.get(DK_LIABILITY)
      newSubroAdversePartyScreen.SubrogationPartyDetailDV.ExpectedRecovery.Value = responsible.get(DK_LIABILITY)
      newSubroAdversePartyScreen.SubrogationPartyDetailDV_tb.Update.click()
    }
    subrogationGeneral.ClaimSubroSummaryScreen.SubrogationMainPanelSet.Update.click()
    //Update the claim in the wrapper
    _claimWrapper.set(Query.make(Claim).compare(Claim#ClaimNumber, gw.api.database.Relop.Equals, _claimWrapper.get().ClaimNumber).select().AtMostOneRow)
  }

}

package gw.cucumber.context.impl.smoketest.cp

uses cucumber.api.DataTable
uses gw.api.databuilder.ClaimBuilder
uses gw.api.databuilder.ExposureBuilder
uses gw.api.databuilder.FixedPropertyIncidentBuilder
uses gw.api.databuilder.PolicyBuilder
uses gw.api.util.DateUtil
uses gw.cucumber.context.api.cp.CPClaimContext
uses gw.cucumber.context.impl.smoketest.common.ClaimContextImpl
uses gw.cucumber.context.impl.smoketest.util.Navigation
uses gw.cucumber.setup.PolicyDataSet
uses gw.cucumber.transformer.CurrencyAmountTransformer
uses gw.cucumber.transformer.DateTransformer
uses gw.cucumber.transformer.SpecialistServiceTransformer
uses gw.cucumber.transformer.TypelistTransformer
uses gw.cucumber.util.common.UIHelper
uses gw.smoketest.platform.web.PCFLocation
uses pcftest.ClaimLossDetails
uses pcftest.ClaimPolicyGeneral
uses pcftest.EditFixedPropertyIncidentPopup
uses pcftest.EditInjuryIncidentPopup
uses pcftest.NewContactPopup
uses pcftest.NewFixedPropertyIncidentPopup
uses pcftest.NewInjuryIncidentPopup
uses pcftest.PolicyLocationPopup

class CPClaimContextImpl extends ClaimContextImpl implements CPClaimContext {

  protected override function isPolicyVerified(claimPolicyGeneralScreen : ClaimPolicyGeneral) : boolean {
    return claimPolicyGeneralScreen.ClaimPolicyGeneralScreen.PolicyGeneralPanelSet_Pr.PolicyGeneralDV.Other_VerifiedPolicy.BoolValue
  }

  override function createPolicyDataSet() {
    (_policyDataSetWrapper.get() as PolicyDataSet).PolicyNumber = "23-502011"
  }

  override function autoAssignClaimAndExposures() {
    var wizard = Wizard
    wizard.goToAssignAndSaveCommercialProperty()
    wizard.AssignSave.CommonAssignChoice_Choice.click()
    wizard.AssignSave.CommonAssign.clickByLabelSubstr(DK_USE_AUTO_ASSIGNMENT)
  }

  override function autoAssignClaimIndividually() {
    var wizard = Wizard
    wizard.goToAssignAndSaveCommercialProperty()
    wizard.AssignSave.IndividualAssignChoice_Choice.click()
    wizard.AssignSave.CommonAssign.clickByLabelSubstr(DK_USE_AUTO_ASSIGNMENT)
  }

  override function autoAssignExposureIndividually(coverageTypeText : String) {
    var wizard = Wizard
    wizard.goToAssignAndSaveCommercialProperty()
    wizard.AssignSave.IndividualAssignChoice_Choice.click()
    var exposureEntry = wizard.AssignSave.NewExposureLV._Entries.singleWhere(\e -> e.Exposures_Coverage.Text == coverageTypeText)
    exposureEntry.Exposures_Assignee.clickByLabelSubstr(DK_USE_AUTO_ASSIGNMENT)
  }

  override function assignClaimAndExposuresToGroupAndUser(groupName : String, userDisplayName : String) {
    var wizard = Wizard
    wizard.goToAssignAndSaveCommercialProperty()
    wizard.AssignSave.CommonAssignChoice_Choice.click()
    var assigneePickerPopup = wizard.AssignSave.CommonAssign.CommonAssign_PickerButton.click()
    assigneePickerPopup.pickGroupAndUser(groupName, userDisplayName)
  }

  override function assignClaimIndividuallyToGroupAndUser(groupName : String, userDisplayName : String) {
    var wizard = Wizard
    wizard.goToAssignAndSaveCommercialProperty()
    wizard.AssignSave.IndividualAssignChoice_Choice.click()
    var assigneePickerPopup = wizard.AssignSave.ClaimAssign.ClaimAssign_PickerButton.click()
    assigneePickerPopup.pickGroupAndUser(groupName, userDisplayName)
  }

  override function assignExposureIndividuallyToGroupAndUser(coverageTypeText : String, groupName : String, userDisplayName : String) {
    var wizard = Wizard
    wizard.goToAssignAndSaveCommercialProperty()
    wizard.AssignSave.IndividualAssignChoice_Choice.click()
    var exposureEntry = wizard.AssignSave.NewExposureLV._Entries.singleWhere(\e -> e.Exposures_Coverage.Text.equalsIgnoreCase(coverageTypeText))
    var assigneePickerPopup = exposureEntry.Exposures_Assignee.Exposures_Assignee_PickerButton.click()
    assigneePickerPopup.pickGroupAndUser(groupName, userDisplayName)
  }

  override function createUnverifiedPolicy() {
    var wizard = Wizard
    var policyNumber = PolicyBuilder.nextPolicyNumber()

    wizard.FindPolicy.FNOLWizard_FindPolicyScreen
        .createPolicyWithDates(policyNumber, PolicyType.TC_COMMERCIALPROPERTY, LossType.TC_PR.DisplayName, DateUtil.currentDate())

    var findPolicyPanelSetCreate = wizard.FindPolicy.FNOLWizard_FindPolicyScreen.FNOLWizardFindPolicyPanelSet_Create
    var policyGeneralPanelSetPr = findPolicyPanelSetCreate.NewClaimPolicyGeneralPanelSet_Pr
    var newContactPopup = policyGeneralPanelSetPr.NewClaimPolicyGeneralDV
        .Insured_Name.ClaimNewContactPickerMenuItemSet.NewContactPickerMenuItemSet_NewPerson.click()
    newContactPopup.PersonLastName.Value = "Created by CPClaimContext"
    var location = newContactPopup.customUpdate()
    UIHelper.assertNoMessages(location)

    var policyLocationPopup = findPolicyPanelSetCreate.PolicyLocationLDV_tb.Add.click() as PolicyLocationPopup
    policyLocationPopup.PolicyLocationScreen.CCAddressInputSet.Address_City.Value = "Little Rock"
    policyLocationPopup.PolicyLocationScreen.CCAddressInputSet.Address_State.getOptionByLabel("Arkansas").click()
    location = policyLocationPopup.PolicyLocationScreen.Update.click()
    UIHelper.assertNoMessages(location)

    (_policyDataSetWrapper.get() as PolicyDataSet).PolicyNumber = policyNumber
  }

  override function claimHasPropertyIncident() {
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      _incidentWrapper.set(
          FixedPropertyIncidentBuilder.uiReadyFixedPropertyIncident()
              .onClaim(_claimWrapper.get())
              .create(bundle)
      )
    }, User.util.UnrestrictedUser)
  }

  override function createClaim() {
    var claim : Claim
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      claim = ClaimBuilder
          .uiReadyProperty()
          .withNonConflictingClaimNumber()
          .create(bundle)
    }, CurrentUser)
    captureNewlyCreatedClaim(claim)
  }

  override function finishFilingClaim() {
    var wizard = Wizard
    wizard.goToAssignAndSaveCommercialProperty()
    var newClaimSaved = wizard.finishSuccessfully()
    _claimWrapper.set(newClaimSaved.ClaimEntity)
  }

  override function reportedByInsured() {
    var wizard = Wizard
    wizard.goToBasicInfoCommercialProperty()
    wizard.BasicInfoCommercialProperty.setReportedByToInsured()
  }

  override function reportedByThirdParty() {
    var wizard = Wizard
    wizard.goToBasicInfoCommercialProperty()
    wizard.BasicInfoCommercialProperty.setReportedByToThirdParty()
  }

  override function setLossCause(lossCauseText : String) {
    var lossCause = new TypelistTransformer<LossCause>().transform(lossCauseText)
    var wizard = Wizard
    wizard.goToLossDetailsCommercialProperty()
    wizard.LossDetailsCommercialProperty.Claim_LossCause.TypeKeyValue = lossCause

  }

  override function setLossLocationInState(stateText : String) {
    var state = new TypelistTransformer<State>().transform(stateText)
    var wizard = Wizard
    wizard.goToLossDetailsCommercialProperty()
    wizard.LossDetailsCommercialProperty.CCAddressInputSet.setAddress("1 Main Street", "San Francisco", state, "91230")
  }

  override function addPropertyIncident(table : DataTable) {
    var claimLossDetails = new Navigation<ClaimLossDetails>(_proxy)
        .ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToLossDetails(), CurrentUser)
    claimLossDetails.ClaimLossDetailsScreen.Edit.click()
    var dv = claimLossDetails.ClaimLossDetailsScreen.LossDetailsPanelSet_default.LossDetailsCardCV.LossDetailsDV_Pr
    var popup = dv.EditableFixedPropertyIncidentsLV_tb.Add.click() as NewFixedPropertyIncidentPopup
    for (row in table.asMaps(String, String)) {
      var popupDv = popup.NewFixedPropertyIncidentScreen.FixPropIncidentDetailDV.FixedPropertyIncidentDV
      popupDv.PropertyDescription.setValue(row.get(DK_PROPERTY_DESCRIPTION))
      popupDv.Description.setValue(row.get(DK_DAMAGE_DESCRIPTION))
      popupDv.LossEstimate.setValue("${new CurrencyAmountTransformer().transform(row.get(DK_LOSS_ESTIMATE)).Amount}")
      popupDv.CCAddressInputSet.setAddress(
          row.get(DK_ADDRESS1),
          row.get(DK_CITY),
          new TypelistTransformer<State>().transform(row.get(DK_STATE)),
          "12345"
      )
    }
    popup.NewFixedPropertyIncidentScreen.Update.click()
    UIHelper.assertNoMessages(_proxy.CurrentPage as PCFLocation)
    claimLossDetails.ClaimLossDetailsScreen.Update.click()
    UIHelper.assertNoMessages(_proxy.CurrentPage as PCFLocation)
  }

  override function addInjuryIncident(table : DataTable) {
    var wizard = Wizard
    wizard.goToLossDetailsCommercialProperty()
    for (row in table.asMaps(String, String)) {
      var popup = wizard.LossDetailsCommercialProperty.EditableInjuryIncidentsLV_tb.Add.click() as NewInjuryIncidentPopup
      var dv = popup.NewInjuryIncidentScreen.InjuryIncidentDV
      UIHelper.setFieldValues(dv, row)
      dv.InjuryIncidentInputSet.PrimaryInjuryType.setTypeKeyValue(new TypelistTransformer<InjuryType>().transform(row.get(DK_GENERAL_INJURY_TYPE)))
      var location = popup.NewInjuryIncidentScreen.Update.click()
      UIHelper.assertNoMessages(location)
    }
  }

  override function addInjuryIncidentToClaim(table : DataTable) {
    var claimLossDetails = new Navigation<ClaimLossDetails>(_proxy)
        .ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToLossDetails(), CurrentUser)
    claimLossDetails.ClaimLossDetailsScreen.Edit.click()
    var dv = claimLossDetails.ClaimLossDetailsScreen.LossDetailsPanelSet_default.LossDetailsCardCV.LossDetailsDV_Pr
    var popup = dv.EditableInjuryIncidentsLV_tb.Add.click() as NewInjuryIncidentPopup
    var popupDv = popup.NewInjuryIncidentScreen.InjuryIncidentDV
    for (row in table.asMaps(String, String)) {
      var firstName = row.get(DK_INJURED_PERSON + " First Name")
      var lastName = row.get(DK_INJURED_PERSON + " Last Name")
      if (popupDv.Injured_Picker.OptionLabels.contains("${firstName} ${lastName}")) {
        popupDv.Injured_Picker.getOptionByLabel("${firstName} ${lastName}").click()
      }
      else {
        var contactPopup = popupDv.Injured_Picker.ClaimNewPersonOnlyPickerMenuItemSet.ClaimNewPersonOnlyPickerMenuItemSet_NewPersonMenuItem.click() as NewContactPopup
        var inputSet = contactPopup.ContactDetailScreen.ContactBasicsDV_Person.PersonNameInputSet.GlobalPersonNameInputSet_default
        inputSet.FirstName.setValue(firstName)
        inputSet.LastName.setValue(lastName)
        contactPopup.ContactDetailScreen.update()
      }
      UIHelper.setFieldValues(popupDv, row)
    }

    popup.NewInjuryIncidentScreen.Update.click()
    UIHelper.assertNoMessages(_proxy.CurrentPage as PCFLocation)
    claimLossDetails.ClaimLossDetailsScreen.Update.click()
    UIHelper.assertNoMessages(_proxy.CurrentPage as PCFLocation)
  }

  override function updatePropertyIncident(table : DataTable) {
    var claimLossDetails = new Navigation<ClaimLossDetails>(_proxy)
        .ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToLossDetails(), CurrentUser)
    claimLossDetails.ClaimLossDetailsScreen.Edit.click()
    var dv = claimLossDetails.ClaimLossDetailsScreen.LossDetailsPanelSet_default.LossDetailsCardCV.LossDetailsDV_Pr
    var popup = dv.EditableFixedPropertyIncidentsLV._Entries.single().City.click() as EditFixedPropertyIncidentPopup
    for (row in table.asMaps(String, String)) {
      var popupDv = popup.EditFixedPropertyIncidentScreen.FixPropIncidentDetailDV.FixedPropertyIncidentDV
      var lossEstimate = new CurrencyAmountTransformer().transform(row.get(DK_LOSS_ESTIMATE))
      popupDv.PropertyDescription.setValue(row.get(DK_PROPERTY_DESCRIPTION))
      popupDv.Description.setValue(row.get(DK_DAMAGE_DESCRIPTION))
      popupDv.LossEstimate.setValue("${lossEstimate.Amount}")
      popupDv.CCAddressInputSet.setAddress(
          row.get(DK_ADDRESS1),
          row.get(DK_CITY),
          new TypelistTransformer<State>().transform(row.get(DK_STATE)),
          "12345"
      )
    }
    popup.EditFixedPropertyIncidentScreen.Update.click()
    UIHelper.assertNoMessages(_proxy.CurrentPage as PCFLocation)
    claimLossDetails.ClaimLossDetailsScreen.Update.click()
    UIHelper.assertNoMessages(_proxy.CurrentPage as PCFLocation)
  }

  override function updateInjuryIncident(table : DataTable) {
    var claimLossDetails = new Navigation<ClaimLossDetails>(_proxy)
        .ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToLossDetails(), CurrentUser)
    claimLossDetails.ClaimLossDetailsScreen.Edit.click()
    var dv = claimLossDetails.ClaimLossDetailsScreen.LossDetailsPanelSet_default.LossDetailsCardCV.LossDetailsDV_Pr
    var popup = dv.EditableInjuryIncidentsLV._Entries.single().Name.click() as EditInjuryIncidentPopup
    var popupDv = popup.EditInjuryIncidentScreen.InjuryIncidentDV
    for (row in table.asMaps(String, String)) {
      UIHelper.setFieldValues(popupDv, row)
    }

    popup.EditInjuryIncidentScreen.Update.click()
    UIHelper.assertNoMessages(_proxy.CurrentPage as PCFLocation)
    claimLossDetails.ClaimLossDetailsScreen.Update.click()
    UIHelper.assertNoMessages(_proxy.CurrentPage as PCFLocation)
  }

  override function addClaimLevelServices(serviceName : String, serviceRequestKindText : String) {
    var serviceRequestKind = new TypelistTransformer<ServiceRequestKind>().transform(serviceRequestKindText)
    var service = new SpecialistServiceTransformer().transform(serviceName)
    var wizard = Wizard
    wizard.goToServicesCommercialProperty()
    wizard.ServicesCommercialProperty.addOtherService().addOtherServiceRequest(service, serviceRequestKind, null)
  }

  override function createInjuryIncident(lossPartyTypeText : String) {
    var lossPartyType = new TypelistTransformer<LossPartyType>().transform(lossPartyTypeText)
    var wizard = Wizard
    wizard.goToLossDetailsCommercialProperty()
    var injuryIncidentPopup = wizard.LossDetailsCommercialProperty.EditableInjuryIncidentsLV_tb.Add.click() as NewInjuryIncidentPopup
    injuryIncidentPopup.NewInjuryIncidentScreen.InjuryIncidentDV.Injured_Picker.selectFirstValidOption()
    injuryIncidentPopup.NewInjuryIncidentScreen.InjuryIncidentDV.InjuryIncidentInputSet.LossParty.TypeKeyValue = lossPartyType
    var location = injuryIncidentPopup.NewInjuryIncidentScreen.Update.click()
    UIHelper.assertNoMessages(location)
  }

  override function createPropertyDamageIncident(table : DataTable) {
    var wizard = Wizard
    wizard.goToLossDetailsCommercialProperty()
    for (row in table.asMaps(String, String)) {
      var popup = wizard.LossDetailsCommercialProperty.EditableFixedPropertyIncidentsLV_tb.Add.click() as NewFixedPropertyIncidentPopup
      var lossEstimate = new CurrencyAmountTransformer().transform(row.get(DK_LOSS_ESTIMATE))
      var dv = popup.NewFixedPropertyIncidentScreen.FixPropIncidentDetailDV.FixedPropertyIncidentDV
      dv.PropertyDescription.setValue(row.get(DK_PROPERTY_DESCRIPTION))
      dv.Description.setValue(row.get(DK_DAMAGE_DESCRIPTION))
      dv.LossEstimate.setValue("${lossEstimate.Amount}")
      dv.CCAddressInputSet.setAddress(
          row.get(DK_ADDRESS1),
          row.get(DK_CITY),
          new TypelistTransformer<State>().transform(row.get(DK_STATE)),
          "12345"
      )
      var location = popup.NewFixedPropertyIncidentScreen.Update.click()
      UIHelper.assertNoMessages(location)
    }
  }

  override function verifyClaimExposurePropertyAddressInState(state : String) {
    assertThat(_claimWrapper.get().FixedPropertyIncidentsOnly.firstWhere(\elt ->
      elt.Property.Address.State == new TypelistTransformer<State>().transform(state)
    )).as("Cannot find property incident in ${state}").isNotNull()
  }

  override function setDateOfNotice(dateStr : String) {
    var wizard = Wizard
    var date = DateTransformer.transform(dateStr)
    wizard.goToLossDetailsCommercialProperty()
    wizard.LossDetailsCommercialProperty.Notification_ReportedDate.setDateValue(date)
  }

  override function verifyClaimDateOfNotice(dateStr : String) {
    var date : Date
    if (dateStr == "Today") {
      date = DateUtil.currentDate()
    }
    else {
      date = DateTransformer.transform(dateStr)
    }

    var reportedDate = _claimWrapper.get().ReportedDate
    assertThat(reportedDate.compareIgnoreTime(date)).as("Expected claim reported date to equal ${date.toString()}, instead it equals ${reportedDate.toString()}").isEqualTo(0)
  }

  override function verifyClaimReportedBy(roleStr : String) {
    var role = new TypelistTransformer<ContactRole>().transform(roleStr)
    var roles = {ContactRole.TC_REPORTER, role}
    assertThat(_claimWrapper.get().getContactsByRoles(roles.toTypedArray()))
        .as("Cannot find contact on claim with roles reporter and ${role.DisplayName}CCCommonBehaviorCucumberSuite.gs").isNotNull()
  }

  override function verifyClaimantTypeIs(type : String) {
    assertThat(_claimWrapper.get().Contacts.firstWhere(\elt ->
        elt.RoleNames.contains(DK_CLAIMANT) and
        elt.RoleNames.contains(type)
    )).as("Expected contact with Claimant role and ${type} role").isNotNull()
  }

  override function selectCoveredProperty(prop : String) {
    var wizard = Wizard
    wizard.goToInvolvedPropertiesCommercialProperty()
    var list = wizard.InvolvedPropertiesCommercialProperty.PolicySummaryPropertyLV._Entries
    list.each(\elt -> elt.PropertySelected.setBoolValue(false))
    var entry = list.singleWhere(\elt -> Integer.parseInt(elt.PropertyNumber.Value) == Integer.parseInt(prop.replaceAll("[^0-9]", "")))
    entry.PropertySelected.setBoolValue(true)
  }

  override function verifyPropertyDamageIncidentExists(table : DataTable) {
    for (row in table.asMaps(String, String)) {
      assertThat(_claimWrapper.get().FixedPropertyIncidentsOnly.firstWhere(\inc ->
          inc.Property.Address.AddressLine1 == row.get(DK_ADDRESS1) and
          inc.Property.Address.City == row.get(DK_CITY) and
          inc.Property.Address.State == new TypelistTransformer<State>().transform(row.get(DK_STATE)) and
          inc.PropertyDesc == row.get(DK_PROPERTY_DESCRIPTION) and
          inc.Description == row.get(DK_DAMAGE_DESCRIPTION) and
          inc.LossEstimate == new CurrencyAmountTransformer().transform(row.get(DK_LOSS_ESTIMATE))
      )).as("Expected fixed property incident with values: ${row.Values.join(",")}").isNotNull()
    }
  }

  override function addAPropertyDamageLiability(table : DataTable) {
    throw new UnsupportedOperationException("Not supported in commercial property")
  }

  override function createClaimBuilder() : ClaimBuilder {
    throw new UnsupportedOperationException("Not supported in commercial property")
  }

  override function getExposureBuilder(exposureMap : Map<String, String>, exposureType : ExposureType, lossPartyType : LossPartyType, severityStr : String) : ExposureBuilder {
    throw new UnsupportedOperationException("Not supported in commercial property")
  }

  override function verifyPropertyIncidentOnClaim(table : DataTable) {
    for (row in table.asMaps(String, String)) {
      assertThat(_claimWrapper.get().FixedPropertyIncidentsOnly.firstWhere(\inc ->
          inc.PropertyDesc == row.get(DK_PROPERTY_DESCRIPTION) and
          inc.Description == row.get(DK_DAMAGE_DESCRIPTION) and
          inc.LossEstimate == new CurrencyAmountTransformer().transform(row.get("Loss Estimate")) and
          inc.Property.Address.AddressLine1 == row.get(DK_ADDRESS1) and
          inc.Property.Address.City == row.get(DK_CITY) and
          inc.Property.Address.State == new TypelistTransformer<State>().transform(row.get(DK_STATE))
      )).as("No fixed property incident found matching: ${row.Values.join(",")}").isNotNull()
    }
  }

  override function verifyInjuryIncidentOnClaim(table : DataTable) {
    for (row in table.asMaps(String, String)) {
      assertThat(_claimWrapper.get().InjuryIncidentsOnly.firstWhere(\inc ->
          inc.injured.DisplayName ==
              row.get(DK_INJURED_PERSON + " First Name") + " " +
              row.get(DK_INJURED_PERSON + " Last Name") and
          inc.LossParty == new TypelistTransformer<LossPartyType>().transform(row.get(DK_LOSS_PARTY)) and
          inc.Severity == new TypelistTransformer<SeverityType>().transform(row.get(DK_SEVERITY)) and
          inc.GeneralInjuryType == new TypelistTransformer<InjuryType>().transform(row.get(DK_GENERAL_INJURY_TYPE)) and
          inc.DetailedInjuryType == new TypelistTransformer<DetailedInjuryType>().transform(row.get(DK_DETAILED_INJURY_TYPE))
      )).as("No injury incident found matching: ${row.Values.join(",")}").isNotNull()
    }
  }

  override function verifyInjuryIncidentUpdated(table : DataTable) {
    for (row in table.asMaps(String, String)) {
      assertThat(_claimWrapper.get().InjuryIncidentsOnly.firstWhere(\inc ->
          inc.LossParty == new TypelistTransformer<LossPartyType>().transform(row.get(DK_LOSS_PARTY)) and
          inc.Severity == new TypelistTransformer<SeverityType>().transform(row.get(DK_SEVERITY)) and
          inc.GeneralInjuryType == new TypelistTransformer<InjuryType>().transform(row.get(DK_GENERAL_INJURY_TYPE)) and
          inc.DetailedInjuryType == new TypelistTransformer<DetailedInjuryType>().transform(row.get(DK_DETAILED_INJURY_TYPE))
      )).as("No injury incident found matching: ${row.Values.join(",")}").isNotNull()
    }
  }

  override function verifyClaimLossCause(lossCauseText : String) {
    var lossCause = new TypelistTransformer<LossCause>().transform(lossCauseText)
    var claimLossDetails = new Navigation<ClaimLossDetails>(_proxy)
        .ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToLossDetails(), CurrentUser)
    var lossCauseOnScreen = claimLossDetails.ClaimLossDetailsScreen.LossDetailsPanelSet_default.LossDetailsCardCV.LossDetailsDV_Pr.LossCause.TypeKeyValue

    assertThat(lossCauseOnScreen)
        .as("Excepted Loss Cause to be ${lossCause}, instead was ${lossCauseOnScreen}")
        .isEqualTo(lossCause)
  }
}
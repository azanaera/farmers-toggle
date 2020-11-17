package gw.cucumber.context.impl.smoketest.wc

uses cucumber.api.DataTable
uses gw.api.databuilder.ClaimBuilder
uses gw.api.databuilder.ExposureBuilder
uses gw.api.databuilder.PolicyBuilder
uses gw.api.util.DateUtil
uses gw.cucumber.context.api.wc.WCClaimContext
uses gw.cucumber.context.impl.smoketest.common.ClaimContextImpl
uses gw.cucumber.context.impl.smoketest.util.Navigation
uses gw.cucumber.setup.PolicyDataSet
uses gw.cucumber.transformer.DateTransformer
uses gw.cucumber.transformer.TypelistTransformer
uses gw.cucumber.util.common.UIHelper
uses pcftest.ClaimLossDetails
uses pcftest.ClaimPolicyGeneral

@SuppressWarnings("unused")
class WCClaimContextImpl extends ClaimContextImpl implements WCClaimContext {

  protected override function isPolicyVerified(claimPolicyGeneralScreen : ClaimPolicyGeneral) : boolean {
    return claimPolicyGeneralScreen.ClaimPolicyGeneralScreen.PolicyGeneralPanelSet_Wc
        .PolicyGeneralDV.Other_VerifiedPolicy.BoolValue
  }

  override function createPolicyDataSet() {
    (_policyDataSetWrapper.get() as PolicyDataSet).PolicyNumber = "34-123436"
  }

  override function createUnverifiedPolicy() {
    var wizard = Wizard
    var policyNumber = PolicyBuilder.nextPolicyNumber()

    wizard.FindPolicy.FNOLWizard_FindPolicyScreen
        .createPolicyWithDates(policyNumber, PolicyType.TC_WORKERSCOMP, "Workers' Comp", DateUtil.currentDate())

    var findPolicyPanelSetCreate = wizard.FindPolicy.FNOLWizard_FindPolicyScreen.FNOLWizardFindPolicyPanelSet_Create
    var policyGeneralPanelSetPr = findPolicyPanelSetCreate.NewClaimPolicyGeneralPanelSet_Wc
    var newContactPopup = policyGeneralPanelSetPr.NewClaimPolicyGeneralDV
        .Insured_Name.ClaimNewContactPickerMenuItemSet.NewContactPickerMenuItemSet_NewPerson.click()
    newContactPopup.PersonLastName.Value = "Created by WCClaimContext"
    var location = newContactPopup.customUpdate()
    UIHelper.assertNoMessages(location)
    (_policyDataSetWrapper.get() as PolicyDataSet).PolicyNumber = policyNumber
  }

  override function createClaim() {
    var claim : Claim
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      claim = ClaimBuilder
          .uiReadyWorkersComp()
          .withNonConflictingClaimNumber()
          .create(bundle)
    }, CurrentUser)
    captureNewlyCreatedClaim(claim)
  }

  override function addInjuredWorker() {
    var wizard = Wizard
    wizard.goToBasicInfoWorkersComp()
    wizard.BasicInfoWC.setNewClaimant("Jane", "Worker")
  }

  override function setLossDate(lossDateText : String) {
    var lossDate = DateTransformer.transform(lossDateText)
    var wizard = Wizard
    wizard.goToFindPolicy()
    wizard.FindPolicy.FNOLWizard_FindPolicyScreen.FNOLWizardFindPolicyPanelSet_Search.Claim_LossDate.DateValue = lossDate
  }


  override function reportedByInsured() {
    var wizard = Wizard
    wizard.goToBasicInfoWorkersComp()
    wizard.BasicInfoWC.setReportedByToInsured()
  }

  override function reportedByThirdParty() {
    var wizard = Wizard
    wizard.goToBasicInfoWorkersComp()
    wizard.BasicInfoWC.setReportedByToThirdParty()
  }

  override function setDateEmployerNotified(employerNotifiedDateText : String) {
    var employerNotifiedDate = DateTransformer.transform(employerNotifiedDateText)
    var wizard = Wizard
    wizard.goToLossDetailsWorkersComp()
    wizard.LossDetailsWC.DateReportedtoEmployer.DateValue = employerNotifiedDate
  }

  override function setIncidentLocation() {
    var wizard = Wizard
    wizard.goToLossDetailsWorkersComp()
    wizard.LossDetailsWC.CCAddressInputSet.globalAddressContainer.Address_Picker.selectFirstValidOption()
  }

  override function setLossCause(lossCauseText : String) {
    var lossCause = new TypelistTransformer<LossCause>().transform(lossCauseText)
    var wizard = Wizard
    wizard.goToLossDetailsWorkersComp()
    wizard.LossDetailsWC.Claim_InjuryIllnessCause.setTypeKeyValue(lossCause)
  }

  override function setPrimaryInjuryType(injuryTypeText : String) {
    var injuryType = new TypelistTransformer<InjuryType>().transform(injuryTypeText)
    var wizard = Wizard
    wizard.goToLossDetailsWorkersComp()
    wizard.LossDetailsWC.Claim_PrimaryInjury.setTypeKeyValue(injuryType)
  }

  override function setDetailedInjuryType(detailedInjuryTypeText : String) {
    var detailedInjuryType = new TypelistTransformer<DetailedInjuryType>().transform(detailedInjuryTypeText)
    var wizard = Wizard
    wizard.goToLossDetailsWorkersComp()
    wizard.LossDetailsWC.Claim_DetailedInjury.setTypeKeyValue(detailedInjuryType)
  }

  override function setLostTimeFromWork() {
    var wizard = Wizard
    wizard.goToLossDetailsWorkersComp()
    wizard.LossDetailsWC.InjurySeverity_TimeLossReport.setBoolValue(true)
  }

  override function autoAssignClaimAndExposures() {
    Wizard.goToAssignAndSaveWC()
    super.autoAssignClaimAndExposures()
  }

  override function autoAssignClaimIndividually() {
    Wizard.goToAssignAndSaveWC()
    super.autoAssignClaimIndividually()
  }

  override function autoAssignExposureIndividually(coverageTypeText : String) {
    Wizard.goToAssignAndSaveWC()
    super.autoAssignExposureIndividually(coverageTypeText)
  }

  override function assignClaimAndExposuresToGroupAndUser(groupName : String, userDisplayName : String) {
    Wizard.goToAssignAndSaveWC()
    super.assignClaimAndExposuresToGroupAndUser(groupName, userDisplayName)
  }

  override function assignClaimIndividuallyToGroupAndUser(groupName : String, userDisplayName : String) {
    Wizard.goToAssignAndSaveWC()
    super.assignClaimIndividuallyToGroupAndUser(groupName, userDisplayName)
  }

  override function assignExposureIndividuallyToGroupAndUser(coverageTypeText : String, groupName : String, userDisplayName : String) {
    var coverageType = new TypelistTransformer<CoverageType>().transform(coverageTypeText)
    Wizard.goToAssignAndSaveWC()
    super.assignExposureIndividuallyToGroupAndUser(coverageTypeText, groupName, userDisplayName)
  }

  override function addAPropertyDamageLiability(table : DataTable) {
    throw new UnsupportedOperationException("Not yet implemented for Workers Comp")
  }

  override function finishFilingClaim() {
    var wizard = Wizard
    wizard.goToAssignAndSaveWC()
    var newClaimSaved = wizard.finishSuccessfully()
    captureNewlyCreatedClaim(newClaimSaved.ClaimEntity)
  }

  override function setLossLocationInState(stateText : String) {
    var state = new TypelistTransformer<State>().transform(stateText)
    var wizard = Wizard
    wizard.goToLossDetailsWorkersComp()
    wizard.LossDetailsWC.CCAddressInputSet.setAddress("123 St", "San Mateo", state, "94400")
  }

  override function addClaimLevelServices(serviceName : String, serviceRequestKindText : String) {
    throw new UnsupportedOperationException("Invalid for Workers Comp")
  }

  override function createInjuryIncident(lossPartyTypeText : String) {
    throw new UnsupportedOperationException("Invalid for Workers Comp")
  }

  override function setLoseTimeFromWork() {
    var claim = _claimWrapper.get()
    assertThat(claim.State).isNotEqualTo(ClaimState.TC_DRAFT)
    var claimLossDetails = new Navigation<ClaimLossDetails>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToLossDetails(), CurrentUser)

    if (!claimLossDetails.ClaimLossDetailsScreen.LossDetailsPanelSet_default.LossDetailsCardCV.LossDetailsDV_Wc.InjurySeverity_TimeLossReport.Editable) {
      if (!(claimLossDetails.ClaimLossDetailsScreen.Edit.Visible || claimLossDetails.ClaimLossDetailsScreen.Edit.Enabled)) {
        throw new Exception("Unable switch to edit mode to update ${claimLossDetails.ClaimLossDetailsScreen.LossDetailsPanelSet_default.LossDetailsCardCV.LossDetailsDV_Wc.InjurySeverity_TimeLossReport.Id} (${claimLossDetails.ClaimLossDetailsScreen.LossDetailsPanelSet_default.LossDetailsCardCV.LossDetailsDV_Wc.InjurySeverity_TimeLossReport.Label}). Please confirm the user ${CurrentUser} has permissions to edit ${claim.ClaimNumber}")
      }
      claimLossDetails.ClaimLossDetailsScreen.Edit.click()
    }

    claimLossDetails.ClaimLossDetailsScreen.LossDetailsPanelSet_default.LossDetailsCardCV.LossDetailsDV_Wc.InjurySeverity_TimeLossReport.setBoolValue(true)
    var location = claimLossDetails.ClaimLossDetailsScreen.Update.click()
    UIHelper.assertNoMessages(location)
  }

  override function verifyClaimLossCause(lossCauseText : String) {
    var lossCause = new TypelistTransformer<LossCause>().transform(lossCauseText)
    var claimLossDetails = new Navigation<ClaimLossDetails>(_proxy)
        .ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToLossDetails(), CurrentUser)

    assertThat(claimLossDetails.ClaimLossDetailsScreen.LossDetailsPanelSet_default.LossDetailsCardCV.LossDetailsDV_Wc.Claim_InjuryIllnessCause.TypeKeyValue)
        .as("The cause of injury should be ${lossCause}")
        .isEqualTo(lossCause)
  }

  override function createClaimBuilder() : ClaimBuilder {
    throw new UnsupportedOperationException("Invalid for Workers Comp. Not yet implemented.")
  }

  override function getExposureBuilder(exposureMap : Map<String, String>, exposureType : ExposureType, lossPartyType : LossPartyType, severityStr : String) : ExposureBuilder {
    throw new UnsupportedOperationException("Invalid for Workers Comp. Not yet implemented.")
  }
}
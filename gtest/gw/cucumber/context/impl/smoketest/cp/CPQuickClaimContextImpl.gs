package gw.cucumber.context.impl.smoketest.cp

uses gw.cucumber.context.api.cp.CPQuickClaimContext
uses gw.cucumber.transformer.DateTransformer
uses gw.cucumber.transformer.TypelistTransformer

class CPQuickClaimContextImpl extends CPClaimContextImpl implements CPQuickClaimContext {

  override function fileQuickClaimProperty() {
    var wizard = _proxy.TabBar.goToNewClaim()
    var policyDataSet = _policyDataSetWrapper.get()
    if (policyDataSet != null && policyDataSet.PolicyNumber != null) {
      var policyNumber = policyDataSet.PolicyNumber
      wizard.SelectPolicy.findPolicy(policyNumber, Date.Today)
    }
    wizard.FindPolicy.FNOLWizard_FindPolicyScreen.SearchPanel.ClaimMode.setValue("${DK_PROPERTY} - ${DK_QUICK_CLAIM_PR}")
  }

  override function finishFilingClaim() {
    var wizard = Wizard

    wizard.goToQuickClaimProperty()
    var newClaimSaved = wizard.finishSuccessfully()
    captureNewlyCreatedClaim(newClaimSaved.ClaimEntity)
  }

  override function setLossCause(lossCauseText : String) {
    var lossCause = new TypelistTransformer<LossCause>().transform(lossCauseText)
    var wizard = Wizard
    wizard.goToQuickClaimProperty()
    wizard.QuickClaimPr.NewClaimWizard_QuickClaimScreen.QuickClaimDV_QuickClaimProperty.Claim_LossCause.TypeKeyValue = lossCause
  }

  override function setLossLocationInState(stateText : String) {
    var state = new TypelistTransformer<State>().transform(stateText)
    var wizard = Wizard
    wizard.goToQuickClaimProperty()
    wizard.QuickClaimPr.NewClaimWizard_QuickClaimScreen.QuickClaimDV_QuickClaimProperty.CCAddressInputSet.setAddress(
        "1 Main Street", "San Francisco", state, "91230"
    )
  }

  override function setReportedByContactTo(type : String) {
    var wizard = Wizard
    wizard.goToQuickClaimProperty()
    var dv = wizard.QuickClaimPr.NewClaimWizard_QuickClaimScreen.QuickClaimDV_QuickClaimProperty
    dv.ReportedBy_Name.selectFirstValidOption()
    dv.Claim_ReportedByType.clickFirstOptionWithMatchingLabel(\txt -> txt.contains(type))
  }

  override function setExposurePropertyAddressState(state : String) {
    var wizard = Wizard
    wizard.goToQuickClaimProperty()
    wizard.QuickClaimPr.NewClaimWizard_QuickClaimScreen.QuickClaimDV_QuickClaimProperty.IncidentLocation.CCAddressInputSet.setAddress(
        "1 Test Street", "San Bruno", new TypelistTransformer<State>().transform(state), "12345"
    )
  }

  override function setDateOfNotice(dateStr : String) {
    var wizard = Wizard
    var date = DateTransformer.transform(dateStr)
    wizard.goToQuickClaimProperty()
    wizard.QuickClaimPr.NewClaimWizard_QuickClaimScreen.QuickClaimDV_QuickClaimProperty.Notification_ReportedDate.setDateValue(date)
  }

  override function setClaimantTo(role : String) {
    var wizard = Wizard
    wizard.goToQuickClaimProperty()
    var dv = wizard.QuickClaimPr.NewClaimWizard_QuickClaimScreen.QuickClaimDV_QuickClaimProperty
    dv.Claimant_Picker.selectFirstValidOption()
    dv.Claimant_Type.setTypeKeyValue(new TypelistTransformer<ClaimantType>().transform(role))
  }

}
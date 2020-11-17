package gw.enhancement.claim.FNOL

uses gw.api.util.CurrencyUtil

enhancement FNOLWizard_FindPolicyScreenTestEnhancement : pcftest.FNOLWizard_FindPolicyScreen {

  function createPolicy(policyNumber : String, policyType : PolicyType, claimMode : String, lossDate : Date) {
    this.ScreenMode.BoolValue = false
    var createPanel = this.FNOLWizardFindPolicyPanelSet_Create
    createPanel.PolicyNumber.Value = policyNumber
    createPanel.Type.TypeKeyValue = policyType
    createPanel.ClaimLossType.Value = claimMode
    createPanel.Claim_LossDate.DateValue = lossDate
    if (claimMode.startsWithIgnoreCase(LossType.TC_AUTO.DisplayName)) {
      createPanel.NewClaimPolicyGeneralPanelSet_Auto.NewClaimPolicyGeneralDV.Currency.TypeKeyValue = CurrencyUtil.getDefaultCurrency()
    }
  }

  function createPolicyWithDates(policyNumber : String, policyType : PolicyType, claimMode : String, lossDate : Date) {
    createPolicy(policyNumber, policyType, claimMode, lossDate)

    if (claimMode.startsWithIgnoreCase(LossType.TC_AUTO.DisplayName)) {
      var generalPanelSetAuto = this.FNOLWizardFindPolicyPanelSet_Create.NewClaimPolicyGeneralPanelSet_Auto
      generalPanelSetAuto.NewClaimPolicyGeneralDV.EffectiveDate.DateValue = lossDate.addBusinessDays(-1)
      generalPanelSetAuto.NewClaimPolicyGeneralDV.ExpirationDate.DateValue = lossDate.addBusinessDays(1)
    } else if (claimMode.startsWithIgnoreCase(LossType.TC_PR.DisplayName)) {
      var generalPanelSetPr = this.FNOLWizardFindPolicyPanelSet_Create.NewClaimPolicyGeneralPanelSet_Pr
      generalPanelSetPr.NewClaimPolicyGeneralDV.EffectiveDate.DateValue = lossDate.addBusinessDays(-1)
      generalPanelSetPr.NewClaimPolicyGeneralDV.ExpirationDate.DateValue = lossDate.addBusinessDays(1)
    }
  }
}
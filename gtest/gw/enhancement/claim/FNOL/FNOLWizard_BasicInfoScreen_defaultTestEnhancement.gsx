package gw.enhancement.claim.FNOL

uses junit.framework.Assert
uses pcftest.FNOLWizard_BasicInfoScreen_default

enhancement FNOLWizard_BasicInfoScreen_defaultTestEnhancement : FNOLWizard_BasicInfoScreen_default {

  function assertOnStep() {
    Assert.assertTrue("Should be on default basic info wizard step",
        this.Wizard.BasicInfo.Current)
  }

  function setRequiredFieldsIfNotPresent() {
    var dv = this.PanelRow.BasicInfoDetailViewPanelDV
    if (dv.ReportedBy_Name.Enabled and dv.ReportedBy_Name.Value.isEmpty()) {
      dv.ReportedBy_Name.selectFirstValidOption()
    }
    if (dv.Claim_ReportedByType.Enabled and dv.Claim_ReportedByType.Value.isEmpty()) {
      dv.Claim_ReportedByType.getOptionByValue(PersonRelationType.TC_SELF as String).click()
    }
  }
}
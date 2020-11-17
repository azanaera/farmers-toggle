package gw.enhancement.claim.FNOL

enhancement FNOLWizard_BasicInfoScreen_defaultBaseEnhancement : pcftest.FNOLWizard_BasicInfoScreen_default {

  property get Wizard() : pcftest.FNOLWizard {
    return this.SmokeTest.CurrentPage as pcftest.FNOLWizard
  }

  function setReportedByToInsured() {
    var dv = this.PanelRow.BasicInfoDetailViewPanelDV
    dv.ReportedBy_Name.getOptionByLabel(Wizard.InsuredName).click()
    dv.Claim_ReportedByType.getOptionByValue(PersonRelationType.TC_SELF as String).click()
  }

  function setReportedByToThirdParty() {
    var dv = this.PanelRow.BasicInfoDetailViewPanelDV
    var popup = dv.ReportedBy_Name.ClaimNewPersonOnlyPickerMenuItemSet.ClaimNewPersonOnlyPickerMenuItemSet_NewPersonMenuItem.click()
    popup.ContactDetailScreen.setRequiredFieldsIfNotPresent()
    popup.update()
    dv.Claim_ReportedByType.getOptionByValue(PersonRelationType.TC_CLAIMANT as String).click()
  }

  property get RightColumnAUTO() : pcftest.FNOLWizard_BasicInfoRightPanelSet_Auto {
    return this.PanelRow.RightPanel.FNOLWizard_BasicInfoRightPanelSet_Auto
  }

}

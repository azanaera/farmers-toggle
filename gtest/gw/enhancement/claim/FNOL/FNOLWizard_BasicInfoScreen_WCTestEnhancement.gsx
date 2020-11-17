package gw.enhancement.claim.FNOL

uses org.junit.Assert
uses pcftest.NewContactPopup

enhancement FNOLWizard_BasicInfoScreen_WCTestEnhancement : pcftest.FNOLWizard_BasicInfoScreen_WC {

  function assertOnStep() {
    Assert.assertTrue("Should be on basic info screen", this.Wizard.FullWizardStepSet.BasicInfo.Current)
    Assert.assertTrue("Should be on WC basic info screen", this.ReportedBy_Name.Visible)
  }

  property get Wizard() : pcftest.FNOLWizard {
    return this.SmokeTest.CurrentPage as pcftest.FNOLWizard
  }

  function setReportedByToInsured() {
    this.ReportedBy_Name.getOptionByLabel(Wizard.InsuredName).click()
    this.Claim_ReportedByType.getOptionByValue(PersonRelationType.TC_SELF as String).click()
  }

  function setReportedByToThirdParty() {
    var popup = this.ReportedBy_Name.ClaimNewPersonOnlyPickerMenuItemSet.ClaimNewPersonOnlyPickerMenuItemSet_NewPersonMenuItem.click()
    popup.ContactDetailScreen.setRequiredFieldsIfNotPresent()
    popup.update()
    this.Claim_ReportedByType.getOptionByValue(PersonRelationType.TC_CLAIMANT as String).click()
  }

  function setRequiredFieldsIfNotPresent() {
    if (this.ReportedBy_Name.Value.isEmpty()){
      setReportedByFromPolicy()
    }
    if (this.Claimant_Name.Value.isEmpty()) {
      setNewClaimantFromPolicy()
    }
  }

  function setReportedByFromPolicy() {
    this.ReportedBy_Name.selectFirstValidOption()
    this.Claim_ReportedByType.getOptionByLabel("Claimant").click()
  }

  function setNewClaimantFromPolicy() {
    this.Claimant_Name.selectFirstValidOption()
  }

  function setNewClaimant(firstName : String, lastName : String) {
    var newPersonPopup = createClaimantPerson()
    newPersonPopup.PersonFirstName.setValue(firstName)
    newPersonPopup.PersonLastName.setValue(lastName)
    newPersonPopup.PersonTaxID.setValue("123-22-3456")
    newPersonPopup.customUpdate()
  }

  function createClaimantPerson() : NewContactPopup  {
    return this.Claimant_Name.ClaimNewPersonOnlyPickerMenuItemSet.ClaimNewPersonOnlyPickerMenuItemSet_NewPersonMenuItem.click()
  }

}
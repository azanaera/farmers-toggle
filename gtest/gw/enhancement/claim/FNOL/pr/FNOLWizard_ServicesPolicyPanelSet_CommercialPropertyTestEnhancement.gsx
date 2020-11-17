package gw.enhancement.claim.FNOL.pr

uses org.junit.Assert
uses pcftest.FNOLWizard_ServicesPolicyPanelSet_CommercialProperty

enhancement FNOLWizard_ServicesPolicyPanelSet_CommercialPropertyTestEnhancement : FNOLWizard_ServicesPolicyPanelSet_CommercialProperty {

  property get Wizard() : pcftest.FNOLWizard {
    return this.SmokeTest.CurrentPage as pcftest.FNOLWizard
  }

  function assertOnStep() {
    Assert.assertTrue("Should be on services step", Wizard.FullWizardStepSet.Services.Current)
  }

  property set OtherServicesCheckboxValue(checkboxValue: boolean) {
    this.OtherServicesLVInputGroupInputSet.OtherServicesInputGroup._checkbox.setBoolValue(checkboxValue)
  }

  function addOtherService(): pcftest.OtherServiceRequestPopup {
    OtherServicesCheckboxValue = true
    return this.OtherServicesLVInputGroupInputSet.OtherServicesInputGroup.OtherServicesLVInputSet.OtherServicesLV_tb.AddServiceRequest.click()
  }

}

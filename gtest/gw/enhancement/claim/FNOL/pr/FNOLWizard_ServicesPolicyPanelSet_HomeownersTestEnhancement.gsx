package gw.enhancement.claim.FNOL.pr

uses junit.framework.Assert

enhancement FNOLWizard_ServicesPolicyPanelSet_HomeownersTestEnhancement : pcftest.FNOLWizard_ServicesPolicyPanelSet_Homeowners {

  property get Wizard() : pcftest.FNOLWizard {
    return this.SmokeTest.CurrentPage as pcftest.FNOLWizard
  }

  function assertOnStep() {
    Assert.assertTrue("Should be on services step", Wizard.FullWizardStepSet.Services.Current)
  }

  function enableDebrisRemovalAndFillRequiredFields(companyName : String = null) {
    this.HomeownersPanelSet.enableDebrisRemovalAndFillRequiredFields(companyName)
  }

  function enableMakeSafeAndFillRequiredFields(companyName : String) {
    this.HomeownersPanelSet.enableMakeSafeAndFillRequiredFields(companyName)
  }

  property get MakeSafeCheckboxValue() : boolean {
    return this.HomeownersPanelSet.MakeSafeCheckboxValue
  }

  property set MakeSafeCheckboxValue(checkboxValue: boolean) {
    this.HomeownersPanelSet.MakeSafeCheckboxValue = checkboxValue
  }

  property get DebrisRemovalCheckboxValue() : boolean {
    return this.HomeownersPanelSet.DebrisRemovalCheckboxValue
  }

  property set DebrisRemovalCheckboxValue(checkboxValue: boolean) {
    this.HomeownersPanelSet.DebrisRemovalCheckboxValue = checkboxValue
  }

  property get OtherServicesCheckboxValue() : boolean {
    return this.HomeownersPanelSet.OtherServicesCheckboxValue
  }

  property set OtherServicesCheckboxValue(checkboxValue: boolean) {
    this.HomeownersPanelSet.OtherServicesCheckboxValue = checkboxValue
  }

  property get EMSMakeSafeInputGroup() :  pcftest.HomeownersEmergencyMakeSafeDV.EMSMakeSafeInputGroup {
    return this.HomeownersPanelSet.EMSMakeSafeInputGroup
  }

  property get EMSDebrisRemovalInputGroup() :  pcftest.HomeownersEmergencyDebrisRemovalDV.EMSDebrisRemovalInputGroup {
    return this.HomeownersPanelSet.EMSDebrisRemovalInputGroup
  }
  property get OtherServicesInputGroup(): pcftest.OtherServicesLVInputGroupInputSet.OtherServicesInputGroup {
    return this.HomeownersPanelSet.OtherServicesLVInputGroupInputSet.OtherServicesInputGroup
  }

  property get OtherServices(): pcftest.OtherServicesLV.entry[] {
    return this.HomeownersPanelSet.OtherServices
  }

  function clickAddOtherService(): pcftest.OtherServiceRequestPopup {
    OtherServicesCheckboxValue = true
    return OtherServicesInputGroup.OtherServicesLVInputSet.OtherServicesLV_tb.AddServiceRequest.click()
  }
}

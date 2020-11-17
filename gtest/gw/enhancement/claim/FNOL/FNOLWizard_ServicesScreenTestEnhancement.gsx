package gw.enhancement.claim.FNOL

uses junit.framework.Assert

enhancement FNOLWizard_ServicesScreenTestEnhancement : pcftest.FNOLWizard_ServicesScreen {
  
  property get Wizard() : pcftest.FNOLWizard {
    return this.SmokeTest.CurrentPage as pcftest.FNOLWizard
  }
  
  function assertOnStep() {
    Assert.assertTrue("Should be on services step", Wizard.FullWizardStepSet.Services.Current)
  }
  
}

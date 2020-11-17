package gw.enhancement.claim.FNOL

uses junit.framework.Assert

enhancement NewClaimWizard_PartiesInvolvedScreenTestEnhancement : pcftest.NewClaimWizard_PartiesInvolvedScreen {

  property get Wizard() : pcftest.FNOLWizard {
    return this.SmokeTest.CurrentPage as pcftest.FNOLWizard
  }

  function assertOnStep() {
    Assert.assertTrue("Should be on parties involved wizard step", Wizard.IndependentWizardStepSet.PartiesInvolved.Current)
  }
}
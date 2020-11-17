package gw.enhancement.claim.FNOL.pr

uses junit.framework.Assert

enhancement FNOLWizard_NewLossDetailsPanelSet_homeownersTestEnhancement : pcftest.FNOLWizard_NewLossDetailsPanelSet_homeowners {

  property get Wizard() : pcftest.FNOLWizard {
    return this.SmokeTest.CurrentPage as pcftest.FNOLWizard
  }

  function assertOnStep() {
    Assert.assertTrue("Should be on default basic info wizard step",
        Wizard.LossDetails.Current)
  }

  property set LossCause(c : LossCause) {
    this.NewLossDetailsHomeownersDV.Claim_LossCause.getOptionByTypeKey(c).click()
  }

  function setRequiredFieldsIfNotPresent() {
    if (this.NewLossDetailsHomeownersDV.Claim_LossCause.Value.isEmpty()) {
      this.LossCause = typekey.LossCause.TC_FIRE
    }
  }

}

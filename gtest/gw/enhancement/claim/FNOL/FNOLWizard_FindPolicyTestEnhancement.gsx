package gw.enhancement.claim.FNOL

uses org.junit.Assert

enhancement FNOLWizard_FindPolicyTestEnhancement : pcftest.FNOLWizard.FindPolicy {

  function assertOnStep() {
    Assert.assertTrue("Should be on default basic info wizard step",
        this.Wizard.FindPolicy.Current)
  }

}

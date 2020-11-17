package gw.enhancement.claim.FNOL

enhancement FNOLWizard_FindPolicyBaseEnhancement : pcftest.FNOLWizard.FindPolicy {

  property get Wizard() : pcftest.FNOLWizard {
    return this.SmokeTest.CurrentPage as pcftest.FNOLWizard
  }

}

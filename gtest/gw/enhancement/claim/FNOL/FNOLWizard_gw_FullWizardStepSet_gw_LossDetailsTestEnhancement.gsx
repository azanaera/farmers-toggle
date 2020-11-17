package gw.enhancement.claim.FNOL

enhancement FNOLWizard_gw_FullWizardStepSet_gw_LossDetailsTestEnhancement : pcftest.FNOLWizard.FullWizardStepSet.LossDetails {
  
  property get PR() : pcftest.FNOLWizard_NewLossDetailsScreen_PR{
    return this.FNOLWizard_NewLossDetailsScreen_PR
  }

  property get WC() : pcftest.FNOLWizard_NewLossDetailsScreen_WC {
    return this.FNOLWizard_NewLossDetailsScreen_WC
  }
  
  property get Trav() : pcftest.FNOLWizard_NewLossDetailsScreen_Trav {
    return this.FNOLWizard_NewLossDetailsScreen_Trav
  }

}

package gw.enhancement.claim.FNOL

uses junit.framework.Assert

enhancement FNOLWizard_NewLossDetailsScreen_defaultBaseEnhancement : pcftest.FNOLWizard_NewLossDetailsScreen_default {

  property get Wizard() : pcftest.FNOLWizard {
    return this.SmokeTest.CurrentPage as pcftest.FNOLWizard
  }

  function assertOnStep() {
    Assert.assertTrue("Should be on loss details wizard step", Wizard.FullWizardStepSet.LossDetails.Current)
  }

  function setRequiredFields() {
    var dv = this.LossDetailsAddressDV
    dv.Description.Value = "Collided with a bus"
    dv.Claim_LossCause.Value = LossCause.TC_VEHCOLLISION.Code
    var lossLocation = dv.AddressDetailInputSetRef.CCAddressInputSet
    lossLocation.setAddress("200 Somewhere Street", "San Mateo", TC_CA, "94404")
  }

}

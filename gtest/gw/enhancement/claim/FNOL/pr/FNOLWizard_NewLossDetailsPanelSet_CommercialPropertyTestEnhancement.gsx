package gw.enhancement.claim.FNOL.pr

uses gw.api.locale.DisplayKey
uses org.junit.Assert
uses pcftest.FNOLWizard
uses pcftest.FNOLWizard_NewLossDetailsPanelSet_CommercialProperty

enhancement FNOLWizard_NewLossDetailsPanelSet_CommercialPropertyTestEnhancement : FNOLWizard_NewLossDetailsPanelSet_CommercialProperty {

  property get Wizard() : pcftest.FNOLWizard {
    return this.SmokeTest.CurrentPage as pcftest.FNOLWizard
  }

  function assertOnStep() {
    Assert.assertTrue("Expected to be on FNOL Basic Info step", Wizard.LossDetails.Current)
  }

  property set LossCause(c : LossCause) {
    this.Claim_LossCause.TypeKeyValue = c
  }

  function setRequiredFieldsIfNotPresent() {
    if (this.Claim_LossCause.Value.isEmpty()) {
      this.LossCause = typekey.LossCause.TC_FIRE
    }
    if (this.CCAddressInputSet.Address_Picker.isOptionWithLabelSelected(DisplayKey.get("Java.NameValueView.New"))) {
      this.CCAddressInputSet.setAddress("1 Main Street", "San Jose", State.TC_CA, "94025")
    }
  }

}

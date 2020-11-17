package gw.enhancement.claim.FNOL

uses gw.cucumber.util.common.UIHelper
uses org.junit.Assert

enhancement FNOLWizard_PickPolicyRiskUnitsScreenEnhancement : pcftest.FNOLWizard_PickPolicyRiskUnitsScreen {

  property get Wizard() : pcftest.FNOLWizard {
    return this.SmokeTest.CurrentPage as pcftest.FNOLWizard
  }

  function assertOnStep() {
    Assert.assertTrue("Should be on select risk units wizard step",
        Wizard.SelectRiskUnitsStep.Current)
  }

  function setRequiredFieldsIfNotPresent() {
    // Property Risk Units screen
    if (this.PolicySummaryPropertyLV.PropertySelectedHeader.Visible) {
      var entries = this.PolicySummaryPropertyLV._Entries
      if (not entries.hasMatch(\elt -> elt.PropertySelected.BoolValue)) { // if no entry selected
        entries.first().PropertySelected.click()
      }
    }
    // Vehicle Risk Units screen
    else {
      var entries = this.PolicySummaryVehicleLV._Entries
      if (not entries.hasMatch(\elt -> elt.VehicleSelected.BoolValue)) { // if no entry selected
        entries.first().VehicleSelected.click()
      }
    }
  }

}

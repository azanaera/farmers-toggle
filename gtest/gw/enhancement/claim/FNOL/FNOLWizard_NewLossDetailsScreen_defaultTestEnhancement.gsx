package gw.enhancement.claim.FNOL

uses gw.api.locale.DisplayKey

enhancement FNOLWizard_NewLossDetailsScreen_defaultTestEnhancement : pcftest.FNOLWizard_NewLossDetailsScreen_default {

  function setRequiredFieldsIfNotPresent() {
    var dv = this.LossDetailsAddressDV
    if (dv.Description.Value.isEmpty()) {
      dv.Description.Value = "Collided with a bus"
    }
    if (dv.Claim_LossCause.Value.isEmpty()) {
      dv.Claim_LossCause.Value = LossCause.TC_VEHCOLLISION.Code
    }
    var lossLocation = dv.AddressDetailInputSetRef.CCAddressInputSet
    if (lossLocation.Address_Picker.Text == "<none>" or
        lossLocation.Address_Picker.Text == DisplayKey.get("Web.Financials.ReserveLineInputSet.ReserveLine.New") or
        lossLocation.Address_Picker.Text.Empty) {
      lossLocation.setAddress("200 Somewhere Street", "San Mateo", TC_CA, "94404")
    }
  }
}
package gw.enhancement.financials

uses gw.smoketest.platform.web.PCFLocation

enhancement NewReserveSetTestEnhancement : pcftest.NewReserveSet {

  public function setRequiredFields() {
    var reservesLV = this.NewReserveSetScreen.ReservesSummaryDV.EditableReservesLV
    reservesLV._Entries.first().CostType.selectFirstValidOption()
    reservesLV._Entries.first().CostCategory.selectFirstValidOption()
    reservesLV._Entries.first().NewAmount.Value = "200"
  }

  public function update() : PCFLocation {
    return this.NewReserveSetScreen.Update.click()
  }

}



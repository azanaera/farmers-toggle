package gw.enhancement.financials

uses pcftest.NewCheckPaymentPanelSet_Single

enhancement NewCheckPaymentPanelSet_SingleTestEnhancement : NewCheckPaymentPanelSet_Single {

  function setRequiredFieldsIfNotPresent() {
    this.NewPaymentDetailDV_default.setRequiredFieldsIfNotPresent()
  }

}

package gw.enhancement.financials

uses pcftest.NewCheckPaymentPanelSet_Multi

enhancement NewCheckPaymentPanelSet_MultiTestEnhancement : NewCheckPaymentPanelSet_Multi {

  function setRequiredFieldsIfNotPresent() {
    for (paymentEntry in this.NewCheckPaymentsLV._Entries) {
      paymentEntry.viewDetail()
      this.NewPaymentDetailDV_default.setRequiredFieldsIfNotPresent()
    }
  }

}

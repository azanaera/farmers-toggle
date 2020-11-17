package gw.enhancement.financials

uses gw.smoketest.platform.web.ValueElement
uses pcftest.CheckWizard_CheckPaymentsScreen
uses pcftest.EditablePaymentLineItemsLV_default
uses pcftest.NewPaymentDetailDV_default

enhancement CheckWizard_CheckPaymentsScreenTestEnhancement : CheckWizard_CheckPaymentsScreen {

  property get AddPayment() : CheckWizard_CheckPaymentsScreen.Add {
    return this.Add
  }

  property get NewPaymentDetailDV() : NewPaymentDetailDV_default {
    if (gw.api.financials.FinancialsUtil.isAllowMultiplePayments()) {
      return this.NewCheckPaymentPanelSet_Multi.NewPaymentDetailDV_default
    }else {
      return this.NewCheckPaymentPanelSet_Single.NewPaymentDetailDV_default
    }
  }

  function checkIfRequiredFieldsAreSet() : boolean {
    var newPaymentDetailDV : NewPaymentDetailDV_default
    if (gw.api.financials.FinancialsUtil.isAllowMultiplePayments()) {
      newPaymentDetailDV = this.NewCheckPaymentPanelSet_Multi.NewPaymentDetailDV_default
    } else {
      newPaymentDetailDV = this.NewCheckPaymentPanelSet_Single.NewPaymentDetailDV_default
    }

    return isSet(newPaymentDetailDV.ReserveLineInputSet.ReserveLine) &&
        isSet(newPaymentDetailDV.ReserveLineInputSet.Exposure) &&
        isSet(newPaymentDetailDV.ReserveLineInputSet.CostType) &&
        isSet(newPaymentDetailDV.ReserveLineInputSet.CostCategory) &&
        isSet(newPaymentDetailDV.ReserveLineInputSet.ReservingCurrency) &&
        isSet(newPaymentDetailDV.Payment_PaymentType) &&
        isSet(newPaymentDetailDV.Payment_Eroding) &&
        isSet(newPaymentDetailDV.Payment_Currency)
  }

  function createNewPayment() {
    if (!checkIfRequiredFieldsAreSet()) {
      this.addPayment()
    }
  }

  function addPayment() {
    this.AddPayment.click()
  }

  function createNewLineItem() : EditablePaymentLineItemsLV_default.entry {
    var lastLineItem = this.NewPaymentDetailDV.EditablePaymentLineItemsLV_default._Entries.last()
    if (lastLineItem == null || lastLineItem.Amount.Value == null) {
      this.NewPaymentDetailDV.EditablePaymentLineItemsLV_tb.Add.click()
    }
    return this.NewPaymentDetailDV.EditablePaymentLineItemsLV_default._Entries.last()
  }

  function setRequiredFieldsIfNotPresent() {
    if (gw.api.financials.FinancialsUtil.isAllowMultiplePayments()) {
      this.NewCheckPaymentPanelSet_Multi.setRequiredFieldsIfNotPresent()
    } else {
      this.NewCheckPaymentPanelSet_Single.setRequiredFieldsIfNotPresent()
    }
  }

  private function isSet(valueElement : ValueElement) : boolean {
    return valueElement.Visible && valueElement.Value.HasContent
  }
}

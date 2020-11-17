package gw.enhancement.financials

uses gw.smoketest.platform.web.BooleanValueElement
uses gw.smoketest.platform.web.SelectElement
uses gw.smoketest.platform.web.ValueElement
uses pcftest.NewPaymentDetailDV_default

enhancement NewPaymentDetailDV_defaultTestEnhancement : NewPaymentDetailDV_default {

  function setRequiredFieldsIfNotPresent() {
    setReserveLineIfNotPresent()
    setPaymentFieldsIfNotPresent()
    setLineItemIfNotPresent()
  }

  private function setReserveLineIfNotPresent() {
    selectFirstValidOptionIfVisibleAndNotSet(this.ReserveLineInputSet.ReserveLine)
    selectFirstValidOptionIfVisibleAndNotSet(this.ReserveLineInputSet.Exposure)
    selectFirstValidOptionIfVisibleAndNotSet(this.ReserveLineInputSet.CostType)
    selectFirstValidOptionIfVisibleAndNotSet(this.ReserveLineInputSet.CostCategory)
    selectFirstValidOptionIfVisibleAndNotSet(this.ReserveLineInputSet.ReservingCurrency)
  }

  private function setPaymentFieldsIfNotPresent() {
    selectFirstValidOptionIfVisibleAndNotSet(this.Payment_PaymentType)
    selectBooleanValueOptionIfVisibleAndNotSet(this.Payment_Eroding)
    selectFirstValidOptionIfVisibleAndNotSet(this.Payment_Currency)
  }

  private function setLineItemIfNotPresent() {
    var lineItemEntries = this.EditablePaymentLineItemsLV_default._Entries
    var lastLineItem = lineItemEntries.last()
    if (lastLineItem == null || lastLineItem.LineCategory.Value == null || lastLineItem.Amount.Value == null) {
      this.EditablePaymentLineItemsLV_tb.Add.click()
      lastLineItem = lineItemEntries.last()
    }

    selectFirstValidOptionIfVisibleAndNotSet(lastLineItem.LineCategory)
    setValueIfVisibleAndNotSet(lastLineItem.Amount, "1")
  }

  private function selectFirstValidOptionIfVisibleAndNotSet(selectElement : SelectElement) {
    if (selectElement.Visible && selectElement.Value == null) {
      selectElement.selectFirstValidOption()
    }
  }

  private function selectBooleanValueOptionIfVisibleAndNotSet(booleanValueElement : BooleanValueElement) {
    if (booleanValueElement.Visible && booleanValueElement.Value == null) {
      booleanValueElement.BoolValue = false
    }
  }

  private function setValueIfVisibleAndNotSet(valueElement : ValueElement, value : String) {
    if (valueElement.Visible && valueElement.Value.isEmpty()) {
      valueElement.Value = value
    }
  }

}

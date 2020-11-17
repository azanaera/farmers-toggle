package gw.enhancement.financials


enhancement QuickCreateCheckWizardTestEnhancement : pcftest.QuickCreateCheckWizard {

  function createCheck(payee : String, paymentType : String, eroding : String, currency : String, amount : String) {
    this.QuickCheckBasics.QuickCheckWizard_QuickCheckBasicsScreen.QuickCheckBasicsDV.PayTo.Value = payee
    this.QuickCheckBasics.QuickCheckWizard_QuickCheckBasicsScreen.QuickCheckBasicsDV.Check_MailToContact.Value = payee
    this.QuickCheckBasics.QuickCheckWizard_QuickCheckBasicsScreen.QuickCheckBasicsDV.Payment_PaymentType.getOptionByLabel(paymentType).click()
    this.QuickCheckBasics.QuickCheckWizard_QuickCheckBasicsScreen.QuickCheckBasicsDV.Payment_Eroding.Value = eroding
    if (this.QuickCheckBasics.QuickCheckWizard_QuickCheckBasicsScreen.QuickCheckBasicsDV.Payment_Currency.Enabled) {
      this.QuickCheckBasics.QuickCheckWizard_QuickCheckBasicsScreen.QuickCheckBasicsDV.Payment_Currency.getOptionByLabel(currency).click()
    }
    this.QuickCheckBasics.QuickCheckWizard_QuickCheckBasicsScreen.QuickCheckBasicsDV.EditablePaymentLineItemsLV_default._Entries.first().Amount.Value = amount
    this.Finish.click()
  }

}

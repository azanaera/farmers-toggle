package gw.enhancement.financials

uses gw.financials.CheckRecurrenceType
uses gw.smoketest.platform.web.OptionElement
uses gw.smoketest.platform.web.SelectElement
uses pcftest.CheckRecurrenceDetailInputSet_single
uses pcftest.CheckRecurrenceInputSet
uses pcftest.CheckWizard_CheckInstructionsScreen

enhancement CheckWizard_CheckInstructionsScreenTestEnhancement : CheckWizard_CheckInstructionsScreen {

  property get CheckRecurrenceInputSet() : CheckRecurrenceInputSet {
    return this.NewPaymentInstructionsDV_default.CheckRecurrenceInputSet
  }

  property get CheckRecurrenceDetailInputSet_single() : CheckRecurrenceDetailInputSet_single {
    return CheckRecurrenceInputSet.CheckRecurrenceDetailInputSet_single
  }

  property get RecurrenceType() : SelectElement<OptionElement> {
    return this.NewPaymentInstructionsDV_default.CheckRecurrenceInputSet.RecurrenceType
  }

  function setRequiredFieldsIfNotPresent() {
    if (RecurrenceType.Value == null) {
      RecurrenceType.clickByLabelSubstr(CheckRecurrenceType.SINGLE.DisplayName)
    }

    if (CheckRecurrenceDetailInputSet_single.ScheduledSendDate.Value == null) {
      CheckRecurrenceDetailInputSet_single.ScheduledSendDate.DateValue = Date.Today
    }
  }

}

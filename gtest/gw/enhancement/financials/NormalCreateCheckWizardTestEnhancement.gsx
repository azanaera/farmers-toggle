package gw.enhancement.financials

uses gw.cucumber.util.common.UIHelper
uses gw.enhancement.validationmessagehandler.FinishCancellableValidationMessageHandler
uses gw.smoketest.platform.web.PCFLocation
uses gw.testharness.v3.PLAssertions
uses pcftest.CheckWizard_CheckInstructionsScreen
uses pcftest.CheckWizard_CheckPayeesScreen
uses pcftest.CheckWizard_CheckPaymentsScreen
uses pcftest.ClaimFinancialsChecks
uses pcftest.NormalCreateCheckWizard

enhancement NormalCreateCheckWizardTestEnhancement : pcftest.NormalCreateCheckWizard {

  function createCheck() {
    this.setPayeeInfo()
    this.next()
    this.setPaymentInfo()
    this.next()
    this.finish()
  }

  function setPayeeInfo() {
    var payeeInfo = this.NewCheckPayees.CheckWizard_CheckPayeesScreen.NewCheckPayeeDV
    payeeInfo.PrimaryPayee_Name.selectFirstValidOption()
    payeeInfo.PrimaryPayee_Type.selectFirstValidOption()

  }

  function setPaymentInfo() {
    this.NewCheckPayments.CheckWizard_CheckPaymentsScreen.NewCheckPaymentPanelSet_Single.NewPaymentDetailDV_default.ReserveLineInputSet.ReserveLine.selectFirstValidOption()
    this.NewCheckPayments.CheckWizard_CheckPaymentsScreen.NewCheckPaymentPanelSet_Single.getNewPaymentDetailDV_default().Payment_PaymentType.Value = PaymentType.TC_PARTIAL.getDisplayName()
    this.NewCheckPayments.CheckWizard_CheckPaymentsScreen.NewCheckPaymentPanelSet_Single.getNewPaymentDetailDV_default().EditablePaymentLineItemsLV_default._Entries.first().Amount.Value = "10"
  }

  function next() {
    this.Next.click()
  }

  function prev() {
    this.Prev.click()
  }

  function finish() : PCFLocation {
    gotoInstructions()
    this.NewCheckInstructions.CheckWizard_CheckInstructionsScreen.setRequiredFieldsIfNotPresent()
    if (this.SmokeTest.CurrentWorksheet typeis pcftest.CheckDuplicatesWorksheet) {
      (this.SmokeTest.CurrentWorksheet).NewCheckDuplicatesScreen.CheckDuplicatesWorksheet_CloseButton.click()
    }
    return this.Finish.click()
  }

  function cancelSuccessfully() : pcftest.ClaimFinancialsChecks {
    return FinishCancellableValidationMessageHandler.cancelSuccessfully()
  }

  property get FinishCancellableValidationMessageHandler(): FinishCancellableValidationMessageHandler<NormalCreateCheckWizard,ClaimFinancialsChecks> {
    return new (this, \ -> this.NewCheckInstructions.CheckWizard_CheckInstructionsScreen._msgs.AllMessages)
  }

  function gotoPayees() : CheckWizard_CheckPayeesScreen {
    if (this.NewCheckPayments.Current) {
      this.prev()
    } else if (this.NewCheckInstructions.Current) {
      this.gotoPayments()
      this.gotoPayees()
    }
    return this.NewCheckPayees.click()
  }

  function gotoPayments() : CheckWizard_CheckPaymentsScreen {
    if (this.NewCheckPayees.Current) {
      this.NewCheckPayees.click().setRequiredFieldsIfNotPresent()
      this.next()
    } else if (this.NewCheckInstructions.Current) {
      this.prev()
    }
    return this.NewCheckPayments.click()
  }

  function gotoInstructions() : CheckWizard_CheckInstructionsScreen {
    if (this.NewCheckPayees.Current) {
      this.gotoPayees()
      this.gotoInstructions()
    } else if (this.NewCheckPayments.Current) {
      this.NewCheckInstructions.CheckWizard_CheckInstructionsScreen.setRequiredFieldsIfNotPresent()
      this.next()
    }
    return this.NewCheckInstructions.click()
  }

}

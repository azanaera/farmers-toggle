package gw.enhancement.financials

uses gw.smoketest.platform.web.PCFLocation
uses pcftest.ManualCheckWizard_CheckInstructionsScreen
uses pcftest.ManualCheckWizard_CheckPayeesScreen
uses pcftest.ManualCheckWizard_CheckPaymentsScreen
uses pcftest.ManualCreateCheckWizard

enhancement ManualCreateCheckWizardTestEnhancement : ManualCreateCheckWizard {

  function setPayeeInfo() {
    var payeeInfo = this.NewCheckPayees.ManualCheckWizard_CheckPayeesScreen.NewManualCheckPayeeDV
    payeeInfo.PrimaryPayee_Name.selectFirstValidOption()
    payeeInfo.PrimaryPayee_Type.selectFirstValidOption()
  }

  function goNext() {
    this.Next.click()
  }

  function goPrev() {
    this.Prev.click()
  }

  function finishCreatingTheCheck() : PCFLocation {
    gotoInstructions()
    if (this.SmokeTest.CurrentWorksheet typeis pcftest.CheckDuplicatesWorksheet) {
      (this.SmokeTest.CurrentWorksheet).NewCheckDuplicatesScreen.CheckDuplicatesWorksheet_CloseButton.click()
    }
    return this.Finish.click()
  }

  function gotoPayees() : ManualCheckWizard_CheckPayeesScreen {
    if (this.NewCheckPayments.Current) {
      this.goPrev()
    } else if (this.NewCheckInstructions.Current) {
      this.gotoPayments()
      this.gotoPayees()
    }
    return this.NewCheckPayees.click()
  }

  function gotoPayments() : ManualCheckWizard_CheckPaymentsScreen {
    if (this.NewCheckPayees.Current) {
      this.NewCheckPayees.click()
      this.goNext()
    } else if (this.NewCheckInstructions.Current) {
      this.goPrev()
    }
    return this.NewCheckPayments.click()
  }

  function gotoInstructions() : ManualCheckWizard_CheckInstructionsScreen {
    if (this.NewCheckPayees.Current) {
      this.gotoPayees()
      this.gotoInstructions()
    } else if (this.NewCheckPayments.Current) {
      this.goNext()
    }
    return this.NewCheckInstructions.click()
  }

}

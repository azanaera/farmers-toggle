package gw.enhancement.claim.FNOL

uses gw.smoketest.platform.web.PCFLocation
uses org.junit.Assert
uses pcftest.FNOLWizard

enhancement FNOLWizardBaseEnhancement : FNOLWizard {

  function next() {
    this.Next.click()
  }

  function prev() {
    this.Prev.click()
  }

  function nextIgnoringClaimDuplicates() {
    Assert.assertTrue(!(this.SmokeTest.CurrentWorksheet typeis pcftest.NewClaimDuplicatesWorksheet))
    next()
    ignoreDuplicateClaimsWarningIfPresent()
  }

  function back() : PCFLocation {
    return this.Prev.click()
  }

  function finish() : PCFLocation {
    return this.Finish.click()
  }

  function ignoreDuplicateClaimsWarningIfPresent(): boolean {
    if (this.SmokeTest.CurrentWorksheet typeis pcftest.NewClaimDuplicatesWorksheet) {
      this.SmokeTest.CurrentWorksheet.NewClaimDuplicatesScreen.NewClaimDuplicatesWorksheet_CloseButton.click()
      return true
    }

    return false
  }

  property get InsuredName() : String {
    return this.ClaimInfoBar.InsuredName
  }

  property get SelectPolicy() : pcftest.FNOLWizard_FindPolicyScreen {
    return this.FindPolicy.FNOLWizard_FindPolicyScreen
  }
  property get BasicInfo() : FNOLWizard.FullWizardStepSet.BasicInfo {
    return this.FullWizardStepSet.BasicInfo
  }

  property get BasicInfoAUTO() : pcftest.FNOLWizard_BasicInfoScreen_default {
    return this.BasicInfo.Auto
  }

  property get LossDetails() : FNOLWizard.FullWizardStepSet.LossDetails {
    return this.FullWizardStepSet.LossDetails
  }

  property get LossDetailsAUTO() : pcftest.FNOLWizard_NewLossDetailsScreen_default {
    return LossDetails.Auto
  }

  property get AssignSave() : pcftest.FNOLWizard_AssignSaveScreen {
    return this.FullWizardStepSet.Summary.FNOLWizard_AssignSaveScreen
  }

}

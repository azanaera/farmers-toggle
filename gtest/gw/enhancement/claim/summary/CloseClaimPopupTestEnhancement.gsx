package gw.enhancement.claim.summary

uses gw.smoketest.platform.web.PCFLocation
uses pcftest.CloseClaimPopup

enhancement CloseClaimPopupTestEnhancement : pcftest.CloseClaimPopup {
  
  function close(note : String, outcome : ClaimClosedOutcomeType) {
    var dv = this.CloseClaimScreen.CloseClaimInfoDV
    dv.Note.Value = note
    dv.Outcome.TypeKeyValue = outcome
    this.close()
  }

  function close() : PCFLocation {
    return this.CloseClaimScreen.Update.click()
  }

}

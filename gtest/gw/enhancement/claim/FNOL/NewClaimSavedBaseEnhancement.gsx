package gw.enhancement.claim.FNOL

uses gw.api.database.Query
uses pcftest.ClaimSummary

enhancement NewClaimSavedBaseEnhancement : pcftest.NewClaimSaved {
  
  property get ClaimNumber() : String {
    return this.NewClaimSavedScreen.NewClaimSavedDV.Header.Text.match("^.*(\\d{3}-\\d{2}-\\d{6}).*$").get(0)
  }

  function goToClaim() : ClaimSummary {
    return this.NewClaimSavedScreen.NewClaimSavedDV.GoToClaim.click() as ClaimSummary
  }

  property get ClaimEntity() : Claim {
    return Query.make(Claim).compare("ClaimNumber", Equals, this.ClaimNumber).select().single()
  }

}

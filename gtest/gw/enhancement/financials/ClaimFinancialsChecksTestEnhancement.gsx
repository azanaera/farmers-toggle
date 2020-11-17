package gw.enhancement.financials

uses pcftest.ClaimFinancialsChecks

enhancement ClaimFinancialsChecksTestEnhancement : ClaimFinancialsChecks {

  property get MenuLinks () : pcftest.Claim.MenuLinks {
    return this._parent._parent.MenuLinks
  }

}

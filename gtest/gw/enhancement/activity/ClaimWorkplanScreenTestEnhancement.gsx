package gw.enhancement.activity

uses pcftest.ClaimWorkplan

enhancement ClaimWorkplanScreenTestEnhancement : ClaimWorkplan {

  property get MenuLinks () : pcftest.Claim.MenuLinks {
    return this._parent.MenuLinks
  }

}

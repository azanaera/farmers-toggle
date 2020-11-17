package gw.enhancement.claim.FNOL

enhancement NewClaimSavedTestEnhancement : pcftest.NewClaimSaved {

  property get TabBar() : pcftest.TabBar {
    return this._parent.TabBar
  }

}

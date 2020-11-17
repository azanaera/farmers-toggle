package gw.enhancement.infobar

uses gw.api.locale.DisplayKey

@Export
enhancement ClaimInfoBarBaseEnhancement : pcftest.ClaimInfoBar {
  
  property get InsuredName() : String {
    return this.Insured.Text.replaceFirst("^" + DisplayKey.get("Web.ClaimInfoBar.Insured") + " ", "")
  }

}

package gw.enhancement.tabbar

uses gw.cucumber.util.common.UIHelper
uses gw.smoketest.platform.web.PCFLocation
uses pcftest.Admin
uses pcftest.ClaimSummary
uses pcftest.FNOLWizard

enhancement TabBarTestEnhancement : pcftest.TabBar {
  function goToAdminMenuLinks() : Admin.MenuLinks {
    var tmp = this.AdminTab.AdminTab_Admin.click()
    while (tmp != null && !(tmp typeis Admin)) {
      tmp = tmp.getOrCreateProperty("_parent", pcftest.Admin);
    }
    if (!(tmp typeis Admin)) {
      throw "Couldn't find Admin.MenuLinks"
    }
    return (tmp as Admin).getOrCreateMenuLinksProperty("MenuLinks", "MenuLinks", null, Admin.MenuLinks, null) as Admin.MenuLinks
  }

  function goToNewClaim() : pcftest.FNOLWizard {
    return this.ClaimTab.ClaimTab_FNOLWizard.click()
  }

  /** Go to pre-built claim */
  function goToClaim(claim : Claim) : ClaimSummary {
    return goToClaim(claim.ClaimNumber)
  }

  function goToClaim(claimNumber : String) : ClaimSummary {
    var location = goToClaimByClaimTab(claimNumber)
    if (location typeis ClaimSummary) {
      return location
    } else {
      UIHelper.assertNoMessages(location)
      UIHelper.assertNoMessages(this.SmokeTest.CurrentWorksheet as PCFLocation)
      throw new Exception("Unable to proceed to go to Claim. Currently on ${location.Id}")
    }
  }

  function goToClaimWizard(claimNumber : String) : FNOLWizard {
    var location = goToClaimByClaimTab(claimNumber)
    if (location typeis FNOLWizard) {
      return location
    } else {
      UIHelper.assertNoMessages(location)
      UIHelper.assertNoMessages(this.SmokeTest.CurrentWorksheet as PCFLocation)
      throw new Exception("Unable to proceed to go to Claim. Currently on ${location.Id}")
    }
  }

  function goToClaimByClaimTab(claimNumber : String) : PCFLocation {
    this.ClaimTab.ClaimTab_FindClaim.Value = claimNumber
    return this.ClaimTab.ClaimTab_FindClaim_Button.click()
  }

  function goToAddressSearch() : pcftest.AddressBookSearch {
    return this.AddressBookTab.AddressBook_AddressBookSearch.click()
  }

}

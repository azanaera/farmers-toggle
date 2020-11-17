package gw.smoketest.cc.commons.shared.contact

uses gw.smoketest.platform.web.PCFLocation
uses gw.smoketest.platform.web.SelectElement

enhancement AddressBookSearchTestEnhancement : pcftest.AddressBookSearch {

  property get AddressBookSearchLV() : pcftest.AddressBookSearchLV { return this.AddressBookSearchScreen.AddressBookSearchLV }

  property get ContactSubtype() : SelectElement { return this.AddressBookSearchScreen.AddressBookSearchDV.ContactSubtype }

  property get Search() : pcftest.SearchLinksInputSet.Search {
    return this.AddressBookSearchScreen.AddressBookSearchDV.SearchAndResetInputSet.SearchLinksInputSet.Search
  }

  function search() : PCFLocation { return this.AddressBookSearchScreen.AddressBookSearchDV.SearchAndResetInputSet.SearchLinksInputSet.Search.click() }

}

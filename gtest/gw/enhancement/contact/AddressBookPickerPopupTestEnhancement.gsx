package gw.enhancement.contact

uses gw.smoketest.platform.web.BooleanValueElement
uses gw.smoketest.platform.web.PCFLocation
uses gw.smoketest.platform.web.SelectElement
uses gw.smoketest.platform.web.ValueElement
uses gw.testharness.v3.PLAssertions
uses junit.framework.Assert
uses pcftest.AddressBookPickerPopup
uses entity.Contact

enhancement AddressBookPickerPopupTestEnhancement : AddressBookPickerPopup {

  function pickByKeyword(selectedKeyword : String) : PCFLocation {
    return pickByKeyword(selectedKeyword, true)
  }

  /**
   * There must be at least one Contact matching selectedKeyword. The first Contact will be selected
   *
   * @param expectOnlyOneMatch if true, it will be asserted that there was only one search result
   */
  function pickByKeyword(selectedKeyword : String, expectOnlyOneMatch : boolean) : PCFLocation {
    var dv = this.AddressBookSearchScreen.AddressBookSearchDV
    if (this.Keyword.Visible) {
      this.Keyword.Value = selectedKeyword
    } else if (this.LastName.Visible) {
      this.LastName.Value = selectedKeyword
    }

    dv.SearchAndResetInputSet.SearchLinksInputSet.Search.click()
    var lv = this.AddressBookSearchScreen.AddressBookSearchLV
    var matchCount = lv._Entries.size()
    Assert.assertTrue("Expected at least one contact matching '" + selectedKeyword + "'", matchCount > 0)
    if (expectOnlyOneMatch) {
      Assert.assertEquals("Expected one contact matching '" + selectedKeyword + "' but found " + matchCount, 1, matchCount)
    }
    return lv._Entries[0]._Select.click()
  }

  function searchByCompanyName(companyName : String) {
    this.ContactSubtype.getOptionByLabel("Company").click()
    this.Keyword.Value = companyName
    this.Search.click()
  }

  function searchPersonByLastName(lastName : String) {
    this.ContactSubtype.getOptionByLabel("Person").click()
    this.LastName.Value = lastName
    this.Search.click()
  }

  /**
   * Check that searching by the first name of the passed-in contact only returns that contact
   */
  function searchForPersonByFirstNameAndAssertMatchesSingleResult(person : Person) {
    this.ContactSubtype.getOptionByLabel(typekey.Contact.TC_PERSON.DisplayName).click()
    this.FirstName.Value = person.FirstName
    this.search()
    var searchResult = this.AddressBookSearchLV._Entries.single()
    PLAssertions.assertThat(searchResult.DisplayName.Text).isEqualTo(person.DisplayName)
  }

  function selectContact(contact : Contact) : PCFLocation {
    searchForContact(contact)
    if (hasSearchResults()) {
      return AddressBookSearchLV._Entries.first().select()
    } else {
      return cancelButton.click()
    }
  }

  function searchForContact(contact : Contact) {

    ContactSubtype.getOptionByLabel(contact.Subtype.DisplayName).click()
    if (contact typeis Person) {
      if (contact.FirstName.NotBlank) {
        FirstName.Value = contact.FirstName
      }
      if (contact.LastName.NotBlank) {
        LastName.Value = contact.LastName
      }
      if (contact.TaxID.NotBlank) {
        TaxID.Value = contact.TaxID
      }
    } else if (contact typeis Company) {
      ContactSubtype.getOptionByLabel(contact.Subtype.DisplayName).click()
      if (contact.Name.NotBlank) {
        Keyword.Value = contact.Name
      }
      if (contact.TaxID.NotBlank) {
        TaxID.Value = contact.TaxID
      }
    }
    // PLACE/VENUE CASE NOT CURRENTLY SUPPORTED
    search()
  }

  function hasSearchResults() : Boolean {
    return this.AddressBookSearchLV._Entries.Count > 0
  }


  property get Name() : ValueElement {
    return this.AddressBookSearchScreen.AddressBookSearchDV.NameInputSet_Contact.GlobalContactNameInputSet_default.Name
  }

  property get Search() : pcftest.SearchLinksInputSet.Search {
    return this.AddressBookSearchScreen.AddressBookSearchDV.SearchAndResetInputSet.SearchLinksInputSet.Search
  }

  property get AddressBookSearchLV() : pcftest.AddressBookSearchLV {
    return this.AddressBookSearchScreen.AddressBookSearchLV
  }

  property get AddressBookSearchDV() : pcftest.AddressBookSearchDV {
    return this.AddressBookSearchScreen.AddressBookSearchDV
  }

// buttons

  /**
   * Label: "Unknown"<br>
   */
  property get cancelButton() : pcftest.AddressBookSearchScreen.cancel {
    return this.AddressBookSearchScreen.cancel
  }

// fields

  /**
   * Label: "Search Type"<br>
   * Type: ContactSearchType<br>
   */
  property get SearchType() : pcftest.AddressBookSearchDV.SearchType {
    return this.AddressBookSearchScreen.AddressBookSearchDV.SearchType
  }

  /**
   * Label: "Type"<br>
   * Type: Contact<br>
   */
  property get ContactSubtype() : SelectElement {
    return this.AddressBookSearchScreen.AddressBookSearchDV.ContactSubtype
  }

  /**
   * Label: "First Name"<br>
   * Type: String<br>
   */
  property get FirstName() : ValueElement {
    return this.AddressBookSearchScreen.AddressBookSearchDV.NameInputSet_Person.GlobalPersonNameInputSet_default.FirstName
  }

  /**
   * Label: "Last Name"<br>
   * Type: String<br>
   */
  property get LastName() : ValueElement {
    return this.AddressBookSearchScreen.AddressBookSearchDV.NameInputSet_Person.GlobalPersonNameInputSet_default.LastName
  }

  /**
   * Label: "Unknown"<br>
   * Type: String<br>
   */
  property get Keyword() : ValueElement {
    return this.AddressBookSearchScreen.AddressBookSearchDV.NameInputSet_Contact.GlobalContactNameInputSet_default.Name
  }

  /**
   * Label: "Tax ID"<br>
   * Type: String<br>
   */
  property get TaxID() : ValueElement {
    return this.AddressBookSearchScreen.AddressBookSearchDV.TaxID
  }

  /**
   * Label: "Legal Specialty"<br>
   * Type: LegalSpecialty<br>
   */
  property get AttorneySpecialty() : pcftest.AddressBookSearchDV.AttorneySpecialty {
    return this.AddressBookSearchScreen.AddressBookSearchDV.AttorneySpecialty
  }

  /**
   * Label: "Medical Specialty"<br>
   * Type: SpecialtyType<br>
   */
  property get DoctorSpecialty() : pcftest.AddressBookSearchDV.DoctorSpecialty {
    return this.AddressBookSearchScreen.AddressBookSearchDV.DoctorSpecialty
  }

  /**
   * Label: "Adjudicative Domain"<br>
   * Type: AdjudicativeDomain<br>
   */
  property get AdjudicativeDomain() : pcftest.AddressBookSearchDV.AdjudicativeDomain {
    return this.AddressBookSearchScreen.AddressBookSearchDV.AdjudicativeDomain
  }

  /**
   * Label: "Medical Speciality"<br>
   * Type: SpecialtyType<br>
   */
  property get MedicalSpecialty() : pcftest.AddressBookSearchDV.MedicalSpecialty {
    return this.AddressBookSearchScreen.AddressBookSearchDV.MedicalSpecialty
  }

  /**
   * Label: "Law Firm Sepciality"<br>
   * Type: LegalSpecialty<br>
   */
  property get LawFirmSpecialty() : pcftest.AddressBookSearchDV.LawFirmSpecialty {
    return this.AddressBookSearchScreen.AddressBookSearchDV.LawFirmSpecialty
  }

  /**
   * Label: "Preferred Vendors Only?"<br>
   * Type: Boolean<br>
   */
  property get PreferredVendors() : BooleanValueElement {
    return this.AddressBookSearchScreen.AddressBookSearchDV.PreferredVendors
  }

  /**
   * Label: "Minimum Score"<br>
   * Type: Integer<br>
   */
  property get MinimumScore() : SelectElement {
    return this.AddressBookSearchScreen.AddressBookSearchDV.MinimumScore
  }

  /**
   * Label: "Location"<br>
   * Type: Address<br>
   */
  property get Address_Name_default() : SelectElement {
    return this.AddressBookSearchScreen.AddressBookSearchDV.CCAddressBookSearchProximityAddressInputSet.globalAddressContainer.Address_Name
  }

  /**
   * Label: "Search Radius"<br>
   * Type: ProximitySearchParameters<br>
   */
  property get ProximitySearchType_default() : SelectElement {
    return this.AddressBookSearchScreen.AddressBookSearchDV.CCAddressBookSearchProximityAddressInputSet.globalAddressContainer.ProximitySearchType
  }

  /**
   * Label: "Line 1"<br>
   * Type: String<br>
   */
  property get ProximityAddressLine1_default() : ValueElement {
    return this.AddressBookSearchScreen.AddressBookSearchDV.CCAddressBookSearchProximityAddressInputSet.globalAddressContainer.proximityAddress.GlobalAddressInputSet_default.AddressLine1
  }

  /**
   * Label: "Line 2"<br>
   * Type: String<br>
   */
  property get ProximityAddressLine2_default() : ValueElement {
    return this.AddressBookSearchScreen.AddressBookSearchDV.CCAddressBookSearchProximityAddressInputSet.globalAddressContainer.proximityAddress.GlobalAddressInputSet_default.AddressLine2
  }

  /**
   * AddressBookPickerPopup
   * Label: "City"<br>
   * Type: String<br>
   */
  property get ProximityCity_default() : ValueElement {
    return this.AddressBookSearchScreen.AddressBookSearchDV.CCAddressBookSearchProximityAddressInputSet.globalAddressContainer.proximityAddress.GlobalAddressInputSet_default.City
  }

  /**
   * Label: "Unknown"<br>
   * Type: State<br>
   */
  property get ProximityState_default() : SelectElement {
    return this.AddressBookSearchScreen.AddressBookSearchDV.CCAddressBookSearchProximityAddressInputSet.globalAddressContainer.proximityAddress.GlobalAddressInputSet_default.State
  }

  /**
   * Label: "Unknown"<br>
   * Type: String<br>
   */
  property get ProximityPostalCode_default() : ValueElement {
    return this.AddressBookSearchScreen.AddressBookSearchDV.CCAddressBookSearchProximityAddressInputSet.globalAddressContainer.proximityAddress.GlobalAddressInputSet_default.PostalCode
  }

  /**
   * Label: "Country"<br>
   * Type: Country<br>
   */
  property get ProximityCountry_default() : pcftest.GlobalAddressInputSet_default.Country {
    return this.AddressBookSearchScreen.AddressBookSearchDV.CCAddressBookSearchProximityAddressInputSet.globalAddressContainer.proximityAddress.GlobalAddressInputSet_default.Country
  }

  function search() : pcftest.AddressBookPickerPopup {
    return this.AddressBookSearchScreen.AddressBookSearchDV.SearchAndResetInputSet.SearchLinksInputSet.Search.click() as pcftest.AddressBookPickerPopup
  }
}

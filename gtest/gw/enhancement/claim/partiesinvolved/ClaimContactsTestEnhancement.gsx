package gw.enhancement.claim.partiesinvolved

uses pcftest.ClaimContacts
uses pcftest.NewPartyInvolvedPopup
uses typekey.Contact

enhancement ClaimContactsTestEnhancement : pcftest.ClaimContacts {

  property get TabBar() : pcftest.TabBar {
    return this._parent.TabBar
  }

  property get PeopleInvolvedDetailedLV() : pcftest.PeopleInvolvedDetailedLV { return this.ClaimContactsScreen.PeopleInvolvedDetailedListDetail.PeopleInvolvedDetailedLV }
  property get PeopleInvolvedDetailedLV_tb() : ClaimContacts.ClaimContactsScreen.PeopleInvolvedDetailedListDetail.PeopleInvolvedDetailedLV_tb { return this.ClaimContactsScreen.PeopleInvolvedDetailedListDetail.PeopleInvolvedDetailedLV_tb }

  property get AddExistingButton() : pcftest.ClaimContacts.ClaimContactsScreen.PeopleInvolvedDetailedListDetail.PeopleInvolvedDetailedLV_tb.ClaimContacts_AddExistingButton {
    return this.PeopleInvolvedDetailedLV_tb.ClaimContacts_AddExistingButton
  }

  function goToClaimSummary() : pcftest.ClaimSummary { return this._parent._parent.MenuLinks.Claim_ClaimSummaryGroup.click() as pcftest.ClaimSummary }

  function findEntryByName(name : String) : pcftest.PeopleInvolvedDetailedLV.entry {
    return PeopleInvolvedDetailedLV._Entries.firstWhere(\e -> e.Name.Text == name)
  }

  function createContactOfType(contactType : Contact) : NewPartyInvolvedPopup {
    switch (contactType) {
      case Contact.TC_PERSON:
        return this.ClaimContactsScreen.PeopleInvolvedDetailedListDetail.PeopleInvolvedDetailedLV_tb
            .ClaimContacts_CreateNewContactButton.ClaimContacts_NewPerson.click()
      case Contact.TC_AUTOREPAIRSHOP:
        return this.ClaimContactsScreen.PeopleInvolvedDetailedListDetail.PeopleInvolvedDetailedLV_tb
            .ClaimContacts_CreateNewContactButton.ClaimContacts_NewVendor.ClaimContacts_AutoRepairShop.click()
      case Contact.TC_AUTOTOWINGAGCY:
        return this.ClaimContactsScreen.PeopleInvolvedDetailedListDetail.PeopleInvolvedDetailedLV_tb
            .ClaimContacts_CreateNewContactButton.ClaimContacts_NewVendor.ClaimContacts_AutoTowingAgcy.click()
      case Contact.TC_DOCTOR:
        return this.ClaimContactsScreen.PeopleInvolvedDetailedListDetail.PeopleInvolvedDetailedLV_tb
            .ClaimContacts_CreateNewContactButton.ClaimContacts_NewVendor.ClaimContacts_Doctor.click()
      case Contact.TC_MEDICALCAREORG:
        return this.ClaimContactsScreen.PeopleInvolvedDetailedListDetail.PeopleInvolvedDetailedLV_tb
            .ClaimContacts_CreateNewContactButton.ClaimContacts_NewVendor.ClaimContacts_MedicalCareOrg.click()
      case Contact.TC_COMPANYVENDOR:
        return this.ClaimContactsScreen.PeopleInvolvedDetailedListDetail.PeopleInvolvedDetailedLV_tb
            .ClaimContacts_CreateNewContactButton.ClaimContacts_NewVendor.ClaimContacts_CompanyVendor.click()
      case Contact.TC_COMPANY:
        return this.ClaimContactsScreen.PeopleInvolvedDetailedListDetail.PeopleInvolvedDetailedLV_tb
            .ClaimContacts_CreateNewContactButton.ClaimContacts_Company.click()
      case Contact.TC_ADJUDICATOR:
        return this.ClaimContactsScreen.PeopleInvolvedDetailedListDetail.PeopleInvolvedDetailedLV_tb
            .ClaimContacts_CreateNewContactButton.ClaimContacts_NewLegal.ClaimContacts_Adjudicator.click()
      case Contact.TC_ATTORNEY:
        return this.ClaimContactsScreen.PeopleInvolvedDetailedListDetail.PeopleInvolvedDetailedLV_tb
            .ClaimContacts_CreateNewContactButton.ClaimContacts_NewLegal.ClaimContacts_Attorney.click()
      case Contact.TC_LAWFIRM:
        return this.ClaimContactsScreen.PeopleInvolvedDetailedListDetail.PeopleInvolvedDetailedLV_tb
            .ClaimContacts_CreateNewContactButton.ClaimContacts_NewLegal.ClaimContacts_LawFirm.click()
      case Contact.TC_LEGALVENUE:
        return this.ClaimContactsScreen.PeopleInvolvedDetailedListDetail.PeopleInvolvedDetailedLV_tb
            .ClaimContacts_CreateNewContactButton.ClaimContacts_NewLegal.ClaimContacts_LegalVenue.click()
    }
    throw new UnsupportedOperationException("Unsupported type of Contact requested: ${contactType}")
  }

}

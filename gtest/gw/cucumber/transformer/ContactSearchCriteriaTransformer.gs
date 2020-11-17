package gw.cucumber.transformer

uses cucumber.api.DataTable
uses gw.api.locale.DisplayKey
uses typekey.Contact

class ContactSearchCriteriaTransformer {

  function transform(contactSubTypeName : String, table : DataTable, username : String) : ContactSearchCriteria {
    var contactSubType = new TypelistTransformer<typekey.Contact>().transform(contactSubTypeName)
    return transform(contactSubType, table, username)
  }

  function transform(contactSubType : typekey.Contact, table : DataTable, username : String) : ContactSearchCriteria {
    var searchMap = table.asMap(String, String)
    var searchCriteria : ContactSearchCriteria
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      searchCriteria = new ContactSearchCriteria()
      searchCriteria.ContactSubtype = contactSubType

      switch (contactSubType) {
        case Contact.TC_ADJUDICATOR:
          populateAdjudicator(searchCriteria, searchMap)
          break
        case Contact.TC_ATTORNEY:
          populateAttorney(searchCriteria, searchMap)
          break
        case Contact.TC_AUTOREPAIRSHOP:
          populateAutoRepairShop(searchCriteria, searchMap)
          break
        case Contact.TC_AUTOTOWINGAGCY:
          populateAutoTowingAgcy(searchCriteria, searchMap)
          break
        case Contact.TC_COMPANY:
          populateCompany(searchCriteria, searchMap)
          break
        case Contact.TC_COMPANYVENDOR:
          populateCompanyVendor(searchCriteria, searchMap)
          break
        case Contact.TC_CONTACT:
          populateContact(searchCriteria, searchMap)
          break
        case Contact.TC_DOCTOR:
          populateDoctor(searchCriteria, searchMap)
          break
        case Contact.TC_LAWFIRM:
          populateLawFirm(searchCriteria, searchMap)
            break
        case Contact.TC_LEGALVENUE:
          populateLegalVenue(searchCriteria, searchMap)
          break
        case Contact.TC_MEDICALCAREORG:
          populateMedicalCareOrg(searchCriteria, searchMap)
          break
        case Contact.TC_PERSON:
          populatePerson(searchCriteria, searchMap)
          break
        case Contact.TC_PERSONVENDOR:
          populatePersonVendor(searchCriteria, searchMap)
          break
        case Contact.TC_PLACE:
          populatePlace(searchCriteria, searchMap)
          break
      }
    }, username)
    return searchCriteria
  }

  private function populateContact( searchCriteria : ContactSearchCriteria, searchMap : Map<String, String> ) {
    if ( searchMap.containsKey(DisplayKey.get("Web.ContactDetail.AddressDetail.City"))) {
      searchCriteria.Address.City = searchMap.get(DisplayKey.get("Web.ContactDetail.AddressDetail.City"))
    }
    if ( searchMap.containsKey(DisplayKey.get("Web.ContactDetail.AddressDetail.State"))) {
      searchCriteria.Address.State = new TypelistTransformer<State>().transform(searchMap.get(DisplayKey.get("Web.ContactDetail.AddressDetail.State")), true)
    }
    if ( searchMap.containsKey(DisplayKey.get("Web.ContactDetail.AddressDetail.Postalcode"))) {
      searchCriteria.Address.PostalCode = searchMap.get(DisplayKey.get("Web.ContactDetail.AddressDetail.Postalcode"))
    }
    searchCriteria.PreferredVendors = searchMap.getOrDefault(DisplayKey.get("Web.AddressBook.Search.PreferredVendors"), "false").toBoolean()
  }

  private function populatePerson( searchCriteria : ContactSearchCriteria, searchMap : Map<String, String> ) {
    populateContact(searchCriteria, searchMap)
    searchCriteria.FirstName = searchMap.get(DisplayKey.get("Web.ContactDetail.Name.FirstName"))
    searchCriteria.Keyword = searchMap.get(DisplayKey.get("Web.ContactDetail.Name.LastName"))
  }

  private function populatePersonVendor( searchCriteria : ContactSearchCriteria, searchMap : Map<String, String> ) {
    populatePerson(searchCriteria, searchMap)
    searchCriteria.TaxID = searchMap.get(DisplayKey.get("Web.AddressBook.Search.TaxID"))
  }

  private function populateAttorney( searchCriteria : ContactSearchCriteria, searchMap : Map<String, String> ) {
    populatePersonVendor(searchCriteria, searchMap)
    searchCriteria.AttorneySpecialty = new TypelistTransformer<LegalSpecialty>().transform(searchMap.get(DisplayKey.get("Web.AddressBook.Search.AttorneySpecialty")), true)
  }

  private function populateDoctor( searchCriteria : ContactSearchCriteria, searchMap : Map<String, String> ) {
    populatePersonVendor(searchCriteria, searchMap)
    searchCriteria.DoctorSpecialty = new TypelistTransformer<SpecialtyType>().transform(searchMap.get(DisplayKey.get("Web.AddressBook.Search.DoctorSpecialty")), true)
  }

  private function populateAdjudicator( searchCriteria : ContactSearchCriteria, searchMap : Map<String, String> ) {
    populatePerson(searchCriteria, searchMap)
    searchCriteria.AdjudicativeDomain = new TypelistTransformer<AdjudicativeDomain>().transform(searchMap.get(DisplayKey.get(DisplayKey.get("Web.AddressBook.Search.AdjudicativeDomain"))), true)
  }

  private function populateCompany( searchCriteria : ContactSearchCriteria, searchMap : Map<String, String> ) {
    populateContact(searchCriteria, searchMap)
    searchCriteria.Keyword = searchMap.get(DisplayKey.get("Web.ContactDetail.Name.OrganizationName"))
    searchCriteria.TaxID = searchMap.get(DisplayKey.get("Web.AddressBook.Search.TaxID"))
  }

  private function populateCompanyVendor( searchCriteria : ContactSearchCriteria, searchMap : Map<String, String> ) {
    populateCompany(searchCriteria, searchMap)
  }

  private function populateMedicalCareOrg( searchCriteria : ContactSearchCriteria, searchMap : Map<String, String> ) {
    populateCompanyVendor(searchCriteria, searchMap)
    searchCriteria.MedicalOrgSpecialty = new TypelistTransformer<SpecialtyType>().transform(searchMap.get(DisplayKey.get("Web.AddressBook.Search.DoctorSpecialty")), true)
  }

  private function populateAutoRepairShop( searchCriteria : ContactSearchCriteria, searchMap : Map<String, String> ) {
    populateCompanyVendor(searchCriteria, searchMap)
  }

  private function populateAutoTowingAgcy( searchCriteria : ContactSearchCriteria, searchMap : Map<String, String> ) {
    populateCompanyVendor(searchCriteria, searchMap)
  }

  private function populateLawFirm( searchCriteria : ContactSearchCriteria, searchMap : Map<String, String> ) {
    populateCompanyVendor(searchCriteria, searchMap)
    searchCriteria.LawFirmSpecialty = new TypelistTransformer<LegalSpecialty>().transform(searchMap.get(DisplayKey.get("Web.AddressBook.Search.LawFirmSpecialty")), true)
  }

  private function populatePlace( searchCriteria : ContactSearchCriteria, searchMap : Map<String, String> ) {
    populateContact(searchCriteria, searchMap)
    searchCriteria.Keyword = searchMap.get(DisplayKey.get("Web.ContactDetail.Name.OrganizationName"))
  }

  private function populateLegalVenue( searchCriteria : ContactSearchCriteria, searchMap : Map<String, String> ) {
    populatePlace(searchCriteria, searchMap)
  }
}
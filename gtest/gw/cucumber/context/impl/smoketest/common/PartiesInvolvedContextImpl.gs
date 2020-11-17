package gw.cucumber.context.impl.smoketest.common

uses com.google.inject.Inject
uses cucumber.api.DataTable
uses gw.api.database.Query
uses gw.api.locale.DisplayKey
uses gw.cucumber.context.api.common.PartiesInvolvedContext
uses gw.cucumber.testdata.DataWrapper
uses gw.cucumber.context.impl.smoketest.util.Navigation
uses gw.cucumber.CucumberStepBase
uses gw.cucumber.transformer.TypelistTransformer
uses gw.cucumber.util.common.PCFReflectUtil
uses gw.cucumber.util.common.UIHelper
uses org.fest.assertions.Condition
uses pcftest.AddExistingPartyInvolvedPopup
uses pcftest.ClaimContacts
uses pcftest.ContactBasicsDV_Person
uses pcftest.NewPartyInvolvedPopup

@SuppressWarnings("unused")
class PartiesInvolvedContextImpl extends CucumberStepBase implements PartiesInvolvedContext {

  @Inject
  var _claimWrapper : DataWrapper<Claim>

  @Inject
  var _exposureWrapper : DataWrapper<Exposure>

  @Inject
  var _contactWrapper : DataWrapper<Contact>

  override function addPersonContactWithRoleName(claimContactRoleName : String) {
    var claimContacts = new Navigation<ClaimContacts>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToClaimParties(), CurrentUser)
    var partyInvolvedPopup = claimContacts.ClaimContactsScreen.PeopleInvolvedDetailedListDetail.PeopleInvolvedDetailedLV_tb
        .ClaimContacts_CreateNewContactButton.ClaimContacts_NewPerson.click()
    var contactBasicsDVPerson = partyInvolvedPopup.ContactDetailScreen.ContactBasicsDV_Person

    contactBasicsDVPerson.PersonNameInputSet.GlobalPersonNameInputSet_default.LastName.Value = "Smith"
    contactBasicsDVPerson.ContactBasicsHeaderInputSet.EditableClaimContactRolesLV_tb.Add.click()
    var newEntry = contactBasicsDVPerson.ContactBasicsHeaderInputSet.EditableClaimContactRolesLV._Entries.last()
    newEntry.Role.clickByLabelSubstr(claimContactRoleName)

    var location = partyInvolvedPopup.ContactDetailScreen.update()
    UIHelper.assertNoMessages(location)
  }

  override function addContactWithClaimRole(contactTypeName : String, claimContactRoleName : String, table : DataTable) {
    var claimContactRole = new TypelistTransformer<ContactRole>().transform(claimContactRoleName)

    var claim = _claimWrapper.get()
    var existingClaimContacts = claim.Contacts
    var partyInvolvedPopup = addContact(contactTypeName, table)
    partyInvolvedPopup.addClaimContactRole(claimContactRole, claim)

    var location = partyInvolvedPopup.ContactDetailScreen.update()
    UIHelper.assertNoMessages(location)
    // Querying to refresh the entire claim entity graph
    claim = Query.make(Claim).compare(Claim#ID, Equals, claim.ID).select().single()
    _contactWrapper.set(claim.Contacts.disjunction(existingClaimContacts).single().Contact)
  }

  override function addContactWithExposureRole(contactTypeName : String, claimContactRoleName : String, table : DataTable) {
    var claimContactRole = new TypelistTransformer<ContactRole>().transform(claimContactRoleName)

    var claim = _claimWrapper.get()
    var existingClaimContacts = claim.Contacts
    var partyInvolvedPopup = addContact(contactTypeName, table)
    partyInvolvedPopup.addExposureContactRole(claimContactRole, _exposureWrapper.get())

    var location = partyInvolvedPopup.ContactDetailScreen.update()
    UIHelper.assertNoMessages(location)
    // Querying to refresh the entire claim entity graph
    claim = Query.make(Claim).compare(Claim#ID, Equals, claim.ID).select().single()
    _contactWrapper.set(claim.Contacts.disjunction(existingClaimContacts).single().Contact)
  }

  function addContact(contactTypeName : String, table : DataTable) : NewPartyInvolvedPopup {
    var contactType = new TypelistTransformer<typekey.Contact>().transform(contactTypeName)

    var partiesInvolved = new Navigation<ClaimContacts>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToClaimParties(), CurrentUser)
    var partyInvolvedPopup = partiesInvolved.createContactOfType(contactType)
    var partyInvolvedMap = table.asMap(String, String)
    UIHelper.setFieldValues(partyInvolvedPopup, partyInvolvedMap)
    partyInvolvedPopup.setRequiredFieldsIfNotPresent()
    return partyInvolvedPopup
  }

  override function addContactAsExposurePartyInvolved(claimContactRoleName : String) {
    var claimContactRole = new TypelistTransformer<ContactRole>().transform(claimContactRoleName)
    var contact = _contactWrapper.get()
    var claimContacts = new Navigation<ClaimContacts>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToClaimParties(), CurrentUser)
    var addressBookPickerPopup = claimContacts.AddExistingButton.click()
    var location = addressBookPickerPopup.selectContact(contact)
    if (location typeis AddExistingPartyInvolvedPopup) {
      location.addExposureContactRole(claimContactRole, _exposureWrapper.get())
      location = location.update()
      UIHelper.assertNoMessages(location)
      claimContacts.assertOnPage()
    } else {
      UIHelper.assertNoMessages(location)
    }
  }

  override function deleteContact(contactName : String) {
    var claimContacts = new Navigation<ClaimContacts>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToClaimParties(), CurrentUser)
    var contact = claimContacts.ClaimContactsScreen.PeopleInvolvedDetailedListDetail.PeopleInvolvedDetailedLV._Entries.firstWhere(\contact -> contact.Name.Text.equals(contactName))
    contact._Checkbox.setBoolValue(true)
    claimContacts.ClaimContactsScreen.PeopleInvolvedDetailedListDetail.PeopleInvolvedDetailedLV_tb.ClaimContacts_DeleteButton.click()
    _claimWrapper.set(Query.make(Claim).compare(Claim#ID, Equals, _claimWrapper.get().ID).select().single())
  }

  override function updateEmailAddressForContact(contactName : String, email : String) {
    var claimContacts = new Navigation<ClaimContacts>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToClaimParties(), CurrentUser)
    var personDetails = getPersonDetailsForContactRole(claimContacts, ContactRole.TC_COVEREDPARTY)
    personDetails.PersonContactInfoInputSet.Primary.setValue(email)
    claimContacts.ClaimContactsScreen.PeopleInvolvedDetailedListDetail.ContactBasicsDV_tb.ContactDetailToolbarButtonSet.Update.click()
  }

  override function updateBankInformationForContact(contactName : String, table : DataTable) {
    var claimContacts = new Navigation<ClaimContacts>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToClaimParties(), CurrentUser)
    var personDetails = getPersonDetailsForContactRole(claimContacts, ContactRole.TC_COVEREDPARTY)
    var coveredPartyMap = table.asMaps(String, String)

    for (coveredParty in coveredPartyMap index i) {
      claimContacts = personDetails.ContactEFTLV_tb.Add.click() as ClaimContacts

      var bankData = personDetails.ContactEFTLV._Entries.get(i)
      bankData.AccountName.setValue(coveredParty.get(DisplayKey.get("Web.Contact.EFT.AccountName")))
      bankData.BankName.setValue(coveredParty.get(DisplayKey.get("Web.Contact.EFT.BankName")))
      bankData.BankAccountType.getOptionByLabel(coveredParty.get(DisplayKey.get("Web.Contact.EFT.AccountType"))).click()
      bankData.BankAccountNumber.setValue(coveredParty.get(DisplayKey.get("Web.Contact.EFT.AccountNumber")))
      bankData.BankRoutingNumber.setValue(coveredParty.get(DisplayKey.get("Web.Contact.EFT.RoutingNumber")))
    }

    claimContacts.ClaimContactsScreen.PeopleInvolvedDetailedListDetail.ContactBasicsDV_tb.ContactDetailToolbarButtonSet.Update.click()
    _claimWrapper.set(Query.make(Claim).compare(Claim#ID, Equals, _claimWrapper.get().ID).select().single())
  }

  private function getPersonDetailsForContactRole(claimContacts : ClaimContacts, contactRole : ContactRole) : ContactBasicsDV_Person {
    var entries = claimContacts.ClaimContactsScreen.PeopleInvolvedDetailedListDetail.PeopleInvolvedDetailedLV._Entries
    entries.firstWhere(\contact -> contact.Roles.Text.contains(contactRole.DisplayName)).viewDetail()
    claimContacts = claimContacts.ClaimContactsScreen.PeopleInvolvedDetailedListDetail.ContactBasicsDV_tb.ContactDetailToolbarButtonSet.Edit.click() as ClaimContacts
    return claimContacts.ClaimContactsScreen.PeopleInvolvedDetailedListDetail.ContactBasicsDV_Person
  }

  override function verifyEmailAddressForContact(contactName : String, email : String) {
    var claimContact = getClaimContactByName(contactName)
    assertThat(claimContact.Contact.EmailAddress1).isEqualTo(email)
  }

  override function verifyBankInfoForContact(contactName : String, table : DataTable) {
    var claimContact = getClaimContactByName(contactName)
    for (row in table.asMaps(String, String)) {
      assertThat(claimContact.Contact.EFTRecords.firstWhere(\elt ->
          elt.AccountName == row.get(DisplayKey.get("Web.Contact.EFT.AccountName")) and
          elt.BankName == row.get(DisplayKey.get("Web.Contact.EFT.BankName")) and
          elt.BankAccountType == new TypelistTransformer<BankAccountType>().transform(row.get(DisplayKey.get("Web.Contact.EFT.AccountType"))) and
          elt.BankAccountNumber == row.get(DisplayKey.get("Web.Contact.EFT.AccountNumber")) and
          elt.BankRoutingNumber == row.get(DisplayKey.get("Web.Contact.EFT.RoutingNumber"))
      )).as("Expected to find bank account on claim with values ${row.Values.join(",")}").isNotNull()
    }
  }

  private function getClaimContactByName(contactName : String) : ClaimContact {
    var claim = _claimWrapper.get()
    var firstName = contactName.substring(0, contactName.indexOf(" "))
    var lastName = contactName.substring(contactName.indexOf(" ") + 1, contactName.length)
    return Query.make(ClaimContact)
        .compare(ClaimContact#Claim, Equals, claim)
        .compare(ClaimContact#PersonFirstNameDenorm, Equals, firstName)
        .compare(ClaimContact#PersonLastNameDenorm, Equals, lastName)
        .select().AtMostOneRow
  }

  override function verifyContactWithRoleName(claimContactRoleName : String) {
    var claimContacts = new Navigation<ClaimContacts>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToClaimParties(), CurrentUser)
    var entries = claimContacts.ClaimContactsScreen.PeopleInvolvedDetailedListDetail.PeopleInvolvedDetailedLV._Entries
    assertThat(entries.where(\e -> e.Roles.Text.equalsIgnoreCase(claimContactRoleName))).isNotEmpty()
  }

  override function verifyContactWithContactTypeAndRoleName(contactSubTypeName : String, contactRoleName : String) {
    var claim = _claimWrapper.get()
    var contactSubType = new TypelistTransformer<typekey.Contact>().transform(contactSubTypeName)
    var contactRole = new TypelistTransformer<ContactRole>().transform(contactRoleName)

    var contacts = claim.Contacts.map(\contact -> "${contact.DisplayName} (${contact.Contact.Subtype.DisplayName}) [${contact.Roles*.Role*.DisplayName.join(", ")}]").join(", ")
    var message = "Expected a ${contactSubType.DisplayName} contact with the ${contactRole.DisplayName} role. Acutal Contacts: ${contacts}"
    assertThat(claim.Contacts).as(message).satisfies(new Condition<ClaimContact[]>() {
      override function matches(claimContacts : ClaimContact[]) : boolean {
        return claimContacts.hasMatch(\claimContact ->
            claimContact.Contact.Subtype == contactSubType &&
                claimContact.Roles*.Role.contains(contactRole))
      }
    })
  }

  override function verifyContactWithTwoContactRolesContactRoleName(contactRoleName1 : String, contactRoleName2 : String) {
    var claim = _claimWrapper.get()
    var contactRole1 = new TypelistTransformer<ContactRole>().transform(contactRoleName1)
    var contactRole2 = new TypelistTransformer<ContactRole>().transform(contactRoleName2)

    assertThat(claim.Contacts).satisfies(new Condition<ClaimContact[]>() {
      override function matches(claimContacts : ClaimContact[]) : boolean {
        return claimContacts.hasMatch(\claimContact ->
            claimContact.Roles*.Role.contains(contactRole1) &&
                claimContact.Roles*.Role.contains(contactRole2))
      }
    })
  }

  override function verifyContactPartyInvolved(table : DataTable) {
    var expectedContact = new HashMap<String, String>(table.asMap(String, String))
    var actualContacts = retrieveContacts()

    var expectedFields = expectedContact.keySet().toList()
    transformContacts(expectedFields, actualContacts)

    assertMatch(expectedContact, actualContacts)
  }

  override function verifyContactRemoved(contactName : String) {
    var claimContacts = new Navigation<ClaimContacts>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToClaimParties(), CurrentUser)
    var contact = claimContacts.ClaimContactsScreen.PeopleInvolvedDetailedListDetail.PeopleInvolvedDetailedLV._Entries.firstWhere(\contact -> contact.Name.Text.equals(contactName))
    assertThat(contact).isNull()
  }

  private function retrieveContacts() : List<Map<String, String>> {
    var actualContacts = new ArrayList<Map<String, String>>()
    var claimContacts = new Navigation<ClaimContacts>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToClaimParties(), CurrentUser)
    var entries = claimContacts.ClaimContactsScreen.PeopleInvolvedDetailedListDetail.PeopleInvolvedDetailedLV._Entries
    for(entry in entries) {
      entry.viewDetail()
      var details = claimContacts.ClaimContactsScreen.PeopleInvolvedDetailedListDetail.BasicsCardTab.click() as ClaimContacts
      var fields = PCFReflectUtil.getFieldValues(details.ClaimContactsScreen.PeopleInvolvedDetailedListDetail)
      var entryFields = PCFReflectUtil.getFieldValues(entry)
      fields.putAll(entryFields)
      actualContacts.add(fields)
    }
    return actualContacts
  }

  private function transformContacts(filteredFields : List<String>, contacts : List<Map<String, String>>) {
    for (contact in contacts) {
      contact.retainWhereKeys(\field -> filteredFields.contains(field))
      if (contact.containsKey(DisplayKey.get("Web.Address.Default.Name"))) {
        contact.put(DisplayKey.get("Web.Address.Default.Name"), contact.get(DisplayKey.get("Web.Address.Default.Name")).replace("\n", ", "))
      }
    }
  }

  private function assertMatch(expectedContact : Map<String, String>, actualContacts : List<Map<String, String>>) {
    var bestContactMatch = actualContacts.maxBy(\contact -> contact.entrySet().countWhere(\fields -> expectedContact.get(fields.Key).equalsIgnoreCase(fields.Value)))
    var mismatchExpected = expectedContact.filterByKeys(\field -> !expectedContact.get(field).equalsIgnoreCase(bestContactMatch.get(field)))

    var message = new StringBuilder().append("Mismatch found for the following:")
    mismatchExpected.eachKeyAndValue(\field, value -> message.append("\n - ${field}: Expected: ${value}, Actual: ${bestContactMatch.getOrDefault(field, "Not Found")}"))
    assertThat(mismatchExpected.Keys).overridingErrorMessage(message.toString()).isNullOrEmpty()
  }

}

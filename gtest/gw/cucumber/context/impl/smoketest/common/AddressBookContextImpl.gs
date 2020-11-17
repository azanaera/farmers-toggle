package gw.cucumber.context.impl.smoketest.common

uses com.google.inject.Inject
uses cucumber.api.DataTable
uses gw.api.database.Query
uses gw.api.contact.ContactSystemPluginAdapter
uses gw.api.locale.DisplayKey
uses gw.cucumber.CucumberStepBase
uses gw.cucumber.context.api.common.AddressBookContext
uses gw.cucumber.testdata.DataWrapper
uses gw.cucumber.transformer.ContactSearchCriteriaTransformer
uses gw.cucumber.transformer.TypelistTransformer
uses gw.plugin.contact.search.ContactSearchFilter
uses gw.sampledata.SampleContacts
uses gw.sampledata.SampleDataCache
uses typekey.Contact

@SuppressWarnings("unused")
class AddressBookContextImpl extends CucumberStepBase implements AddressBookContext {

  @Inject
  var _contactWrapper : DataWrapper<entity.Contact>

  override function verifyContactIsInAddressBook(contactSubTypeName : String, table : DataTable) {
    if (sampleContactsNeedsToBeLoaded()) {
      var sampleDataCache = new SampleDataCache()

      gw.transaction.Transaction.runWithNewBundle(\bundle -> {
        new SampleContacts(sampleDataCache).testSampleData(bundle)
      }, User.util.UnrestrictedUser)
    }

    var contactSubType = new TypelistTransformer<typekey.Contact>().transform(contactSubTypeName)
    var _contactSystemPlugin = ContactSystemPluginAdapter.getAdapter()
    var searchCriteria = new ContactSearchCriteriaTransformer().transform(contactSubTypeName, table, CurrentUser)
    var result = _contactSystemPlugin.searchContacts(searchCriteria, new ContactSearchFilter())

    assertThat(result.NumberOfResults).isEqualTo(1)
    _contactWrapper.set(result.Contacts.single())
  }

  override function setAvailableToWork(contactSubTypeName : String, isAvailableToWork : boolean) {
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      var contact = _contactWrapper.get()
      var name = contact.DisplayName.split(' ')

      switch (contactSubTypeName) {
        case DisplayKey.get("entity.AutoTowingAgcy"):
          contact = Query.make(AutoTowingAgcy)
              .compareIgnoreCase(AutoTowingAgcy#Name, Equals, contact.Name)
              .select()
              .FirstResult
          break

        case DisplayKey.get("entity.AutoRepairShop"):
          contact = Query.make(AutoRepairShop)
              .compareIgnoreCase(AutoRepairShop#Name, Equals, contact.Name)
              .select()
              .FirstResult
          break

        case DisplayKey.get("entity.CompanyVendor"):
          contact = Query.make(CompanyVendor)
              .compareIgnoreCase(CompanyVendor#Name, Equals, contact.Name)
              .select()
              .FirstResult
          break

        case DisplayKey.get("entity.PersonVendor"):
          contact = Query.make(PersonVendor)
              .compareIgnoreCase(PersonVendor#FirstName, Equals, name.first())
              .compareIgnoreCase(PersonVendor#LastName, Equals, name.last())
              .select().FirstResult
          break

        case DisplayKey.get("entity.MedicalCareOrg"):
          contact = Query.make(MedicalCareOrg)
              .compareIgnoreCase(MedicalCareOrg#Name, Equals, contact.Name)
              .select()
              .FirstResult
          break

        case DisplayKey.get("entity.Doctor"):
          contact = Query.make(Doctor)
              .compareIgnoreCase(Doctor#FirstName, Equals, name.first())
              .compareIgnoreCase(Doctor#LastName, Equals, name.last())
              .select()
              .FirstResult
          break

        case DisplayKey.get("entity.LawFirm"):
          contact = Query.make(LawFirm)
              .compareIgnoreCase(LawFirm#Name, Equals, contact.Name)
              .select()
              .FirstResult
          break

        case DisplayKey.get("entity.Attorney"):
          contact = Query.make(Attorney)
              .compareIgnoreCase(Attorney#FirstName, Equals, name.first())
              .compareIgnoreCase(Attorney#LastName, Equals, name.last())
              .select().FirstResult
          break

        default:
          break
      }

      contact = bundle.add(contact)
      if (isAvailableToWork) {
        contact.setVendorAvailability_Ext(VendorAvailabilityType_Ext.TC_AVAILABLE)
      } else {
        contact.setVendorAvailability_Ext(VendorAvailabilityType_Ext.TC_UNAVAILABLE)
      }
    }, User.util.UnrestrictedUser)
  }

  override function setBackupWithholding(contactSubTypeName : String, hasBackupWithholding : boolean) {
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      var contact = _contactWrapper.get()
      var name = contact.DisplayName.split(' ')

      switch (contactSubTypeName) {
        case DisplayKey.get("entity.AutoTowingAgcy"):
          contact = Query.make(AutoTowingAgcy)
              .compareIgnoreCase(AutoTowingAgcy#Name, Equals, contact.Name)
              .select()
              .FirstResult
          break

        case DisplayKey.get("entity.AutoRepairShop"):
          contact = Query.make(AutoRepairShop)
              .compareIgnoreCase(AutoRepairShop#Name, Equals, contact.Name)
              .select()
              .FirstResult
          break

        case DisplayKey.get("entity.CompanyVendor"):
          contact = Query.make(CompanyVendor)
              .compareIgnoreCase(CompanyVendor#Name, Equals, contact.Name)
              .select()
              .FirstResult
          break

        case DisplayKey.get("entity.PersonVendor"):
          contact = Query.make(PersonVendor)
              .compareIgnoreCase(PersonVendor#FirstName, Equals, name.first())
              .compareIgnoreCase(PersonVendor#LastName, Equals, name.last())
              .select().FirstResult
          break

        case DisplayKey.get("entity.MedicalCareOrg"):
          contact = Query.make(MedicalCareOrg)
              .compareIgnoreCase(MedicalCareOrg#Name, Equals, contact.Name)
              .select()
              .FirstResult
          break

        case DisplayKey.get("entity.Doctor"):
          contact = Query.make(Doctor)
              .compareIgnoreCase(Doctor#FirstName, Equals, name.first())
              .compareIgnoreCase(Doctor#LastName, Equals, name.last())
              .select()
              .FirstResult
          break

        case DisplayKey.get("entity.LawFirm"):
          contact = Query.make(LawFirm)
              .compareIgnoreCase(LawFirm#Name, Equals, contact.Name)
              .select()
              .FirstResult
          break

        case DisplayKey.get("entity.Attorney"):
          contact = Query.make(Attorney)
              .compareIgnoreCase(Attorney#FirstName, Equals, name.first())
              .compareIgnoreCase(Attorney#LastName, Equals, name.last())
              .select()
              .FirstResult
          break

        default:
          break
      }

      contact = bundle.add(contact)
      if (hasBackupWithholding) {
        contact.setBackupwithholding_Ext(true)
      } else {
        contact.setBackupwithholding_Ext(false)
      }
    }, User.util.UnrestrictedUser)
  }

  private function sampleContactsNeedsToBeLoaded() : boolean {
    var numberOfMedCareOrg = Query.make(MedicalCareOrg).select().Count
    return numberOfMedCareOrg < 1
  }

}

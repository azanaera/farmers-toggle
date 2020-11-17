package gw.enhancement.contact

uses gw.api.util.Math
uses gw.smoketest.platform.web.PCFLocation
uses gw.smoketest.platform.web.ValueElement
uses gw.testharness.v3.PLAssertions
uses pcftest.PersonNameInputSet

enhancement NewContactPopupTestEnhancement : pcftest.NewContactPopup {

  property get Person() : pcftest.ContactBasicsDV_Person {
    return this.ContactDetailScreen.ContactBasicsDV_Person
  }

  property get Company() : pcftest.ContactBasicsDV_Company {
    return this.ContactDetailScreen.ContactBasicsDV_Company
  }

  property get PersonName() : PersonNameInputSet {
    return this.Person.PersonNameInputSet
  }

  property get PersonTaxID() : ValueElement {
    return this.Person.AdditionalInfoInputSet_Person.TaxID
  }

  property get PersonFirstName() : ValueElement {
    return this.PersonName.GlobalPersonNameInputSet_default.FirstName
  }

  property get PersonLastName() : ValueElement {
    return this.PersonName.GlobalPersonNameInputSet_default.LastName
  }

  function customUpdate() : PCFLocation {
    return this.ContactDetailScreen.ContactBasicsDV_tb.ContactDetailToolbarButtonSet.CustomUpdateButton.click()
  }

  public function createNewPersonFromContactPopup() {
    this.PersonLastName.setValue(generateLastName())
    this.update()
    PLAssertions.assertThat(this.ContactDetailScreen._msgs.AllMessages).isEmpty()
  }

  public function createNewDoctorFromContactPopup() {
    createNewPersonFromContactPopup()
  }

  public function createNewVendorFromContactPopup(orgName : String) {
    this.OrganizationName.Value = orgName
    if (this.Company.VendorW9InfoInputSet.TaxStatus.Visible) {
      this.Company.VendorW9InfoInputSet.TaxStatus.TypeKeyValue = TaxStatus.TC_CONFIRMED
    }
    this.update()
    PLAssertions.assertThat(this.ContactDetailScreen._msgs.AllMessages).isEmpty()
  }

  public function createNewVendorFromContactPopup() {
    createNewVendorFromContactPopup( generateCompanyName() )
  }

  function update() : PCFLocation {
    return this.ContactDetailScreen.update()
  }

  public static function generateLastName() : String {
    return "guy" + Math.random(9999)
  }

  public static function generateCompanyName() : String {
    return "co" + Math.random(9999)
  }

  property get OrganizationName() : ValueElement {
    return this.Company.OrganizationName.GlobalContactNameInputSet_default.Name
  }

}

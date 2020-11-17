package gw.enhancement.claim.partiesinvolved

uses gw.smoketest.platform.web.ValueElement

enhancement AddExistingPartyInvolvedPopupTestEnhancement : pcftest.AddExistingPartyInvolvedPopup {

  property get LastName() : ValueElement { return this.LastName }

  property get OrganizationName() : pcftest.ContactBasicsDV_Company.OrganizationName { return this.OrganizationName}

  property get TaxID_Person() : ValueElement { return this.ContactDetailScreen.TaxID_Person }

  property get TaxID_PersonVendor() : ValueElement { return this.ContactDetailScreen.TaxID_PersonVendor }

  property get TaxID_Adjudicator() : ValueElement { return this.ContactDetailScreen.TaxID_Adjudicator}

  property get TaxID_Company() : ValueElement { return this.ContactDetailScreen.TaxID_Company }

  function setRequiredFieldsIfNotPresent() {
    this.ContactDetailScreen.setRequiredFieldsIfNotPresent()
  }

  function addClaimContactRole(claimContactRole : ContactRole, claim : Claim = null) {
    this.ContactDetailScreen.addClaimContactRole(claimContactRole, claim)
  }

  function addExposureContactRole(claimContactRole : ContactRole, exposure : Exposure) {
    this.ContactDetailScreen.addExposureContactRole(claimContactRole, exposure)
  }

  function update() : gw.smoketest.platform.web.PCFLocation {
    return this.ContactDetailScreen.update()
  }

}

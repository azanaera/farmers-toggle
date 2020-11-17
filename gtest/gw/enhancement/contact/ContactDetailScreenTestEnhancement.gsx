package gw.enhancement.contact

uses gw.api.locale.DisplayKey
uses gw.smoketest.platform.web.ValueElement
uses pcftest.ContactBasicsHeaderInputSet
uses org.junit.Assert

enhancement ContactDetailScreenTestEnhancement : pcftest.ContactDetailScreen {

  function setRequiredFieldsIfNotPresent() {
    setValueIfVisibleAndEmpty(this.LastName, "Newton")
    setValueIfVisibleAndEmpty(this.OrganizationName.getGlobalContactNameInputSet_default().Name, "Express Auto")
    setValueIfVisibleAndEmpty(this.TaxID_Person, "818-446-1206")
    setValueIfVisibleAndEmpty(this.TaxID_PersonVendor, "818-446-1206")
    setValueIfVisibleAndEmpty(this.TaxID_Adjudicator, "818-446-1206")
    setValueIfVisibleAndEmpty(this.TaxID_Company, "77-7752421")
  }

  private function setValueIfVisibleAndEmpty(valueElement : ValueElement, value : String) {
    if (valueElement.Visible && valueElement.Value.isEmpty()) {
      valueElement.Value = value
    }
  }

  function addClaimContactRole(claimContactRole : ContactRole, claim : Claim = null) {
    addNewContactRole(claimContactRole.DisplayName, claim.State == TC_DRAFT ?
        DisplayKey.get("LV.Claim.EditableClaimContactRoles.DraftClaim") : claim.DisplayName)
  }

  function addExposureContactRole(claimContactRole : ContactRole, exposure : Exposure) {
    addNewContactRole(claimContactRole.DisplayName, exposure.DisplayName)
  }

  private function addNewContactRole(role : String, relatedTo : String) {
    var contactBasicsHeaderInputSet : ContactBasicsHeaderInputSet
    if (this.ContactBasicsDV_Person.ContactBasicsHeaderInputSet.EditableClaimContactRolesLV_tb.Add.Visible) {
      contactBasicsHeaderInputSet = this.ContactBasicsDV_Person.ContactBasicsHeaderInputSet
    } else if (this.ContactBasicsDV_Place.ContactBasicsHeaderInputSet.EditableClaimContactRolesLV_tb.Add.Visible) {
      contactBasicsHeaderInputSet = this.ContactBasicsDV_Place.ContactBasicsHeaderInputSet
    } else if (this.ContactBasicsDV_Company.ContactBasicsHeaderInputSet.EditableClaimContactRolesLV_tb.Add.Visible) {
      contactBasicsHeaderInputSet = this.ContactBasicsDV_Company.ContactBasicsHeaderInputSet
    }

    contactBasicsHeaderInputSet.EditableClaimContactRolesLV_tb.Add.click()
    var newEntry = contactBasicsHeaderInputSet.EditableClaimContactRolesLV._Entries.last()
    newEntry.Role.clickByLabelSubstr(role)
    newEntry.Owner.clickByLabelSubstr(relatedTo)
  }

  property get LastName() : ValueElement { return this.ContactBasicsDV_Person.PersonNameInputSet.GlobalPersonNameInputSet_default.LastName }

  property get OrganizationName() : pcftest.ContactBasicsDV_Company.OrganizationName { return this.ContactBasicsDV_Company.OrganizationName }

  property get TaxID_Person() : ValueElement { return this.ContactBasicsDV_Person.AdditionalInfoInputSet_Person.TaxID }

  property get TaxID_PersonVendor() : ValueElement { return this.ContactBasicsDV_Person.AdditionalInfoInputSet_PersonVendor.SSN }

  property get TaxID_Adjudicator() : ValueElement { return this.ContactBasicsDV_Person.AdditionalInfoInputSet_Adjudicator.TaxID }

  property get TaxID_Company() : ValueElement { return this.ContactBasicsDV_Company.V_EIN }

  function update() : gw.smoketest.platform.web.PCFLocation {
    var page : gw.smoketest.platform.web.PCFLocation

    if (this.ContactBasicsDV_tb.ContactDetailToolbarButtonSet.Update.Visible) {
      page = this.ContactBasicsDV_tb.ContactDetailToolbarButtonSet.Update.click()
    } else if (this.ContactRelatedContactsDV_tb.ContactDetailToolbarButtonSet.Update.Visible) {
      page = this.ContactRelatedContactsDV_tb.ContactDetailToolbarButtonSet.Update.click()
    } else if (this.ContactBasicsDV_tb.ContactDetailToolbarButtonSet.CustomUpdateButton.Visible) {
      page = this.ContactBasicsDV_tb.ContactDetailToolbarButtonSet.CustomUpdateButton.click()
    } else if (this.ContactRelatedContactsDV_tb.ContactDetailToolbarButtonSet.CustomUpdateButton.Visible) {
      page = this.ContactRelatedContactsDV_tb.ContactDetailToolbarButtonSet.CustomUpdateButton.click()
    } else {
      Assert.fail("None of the expected update buttons are visible")
    }

    if (page typeis pcftest.DuplicateContactPopup) {
      page.DuplicateContact_CancelButton.click()
      return this.update()
    } else {
      return page
    }
  }
}

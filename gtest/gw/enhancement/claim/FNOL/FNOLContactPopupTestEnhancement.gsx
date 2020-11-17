package gw.enhancement.claim.FNOL

enhancement FNOLContactPopupTestEnhancement : pcftest.FNOLContactPopup {

  function setContactFromPolicy() {
    this.FNOLContactScreen.ContactDV.ClaimContactPerson.getOption(1).click()
  }

  function setContact(contactLabel : String) {
    this.FNOLContactScreen.ContactDV.ClaimContactPerson.getOptionByLabel(contactLabel).click()
  }

  function fillInjured() {
    this.Injured = true
    this.FNOLContactScreen.ContactDV.InjuryIncidentInputSet.LossParty.TypeKeyValue = TC_INSURED
    //Disabled as part of Toggle R1
    //this.FNOLContactScreen.ContactDV.InjuryIncidentInputSet.Severity.TypeKeyValue = TC_MINOR;
  }

  function cancel() {
    this.FNOLContactScreen.Cancel.click()
  }

  function update() {
    this.FNOLContactScreen.Update.click()
  }

  function isContactDropDownContainingContactByLabel(label : String) : boolean {
    return this.FNOLContactScreen.ContactDV.ClaimContactPerson.OptionLabels.contains(label)
  }

  function isContactSelected(label : String) : boolean {
    var personOption = this.FNOLContactScreen.ContactDV.ClaimContactPerson.getOptionByLabel(label)
    return this.FNOLContactScreen.ContactDV.ClaimContactPerson.Value == personOption.Value
  }

  property get Injured() : boolean {
    return this.FNOLContactScreen.ContactDV.InjuredBoolean.BoolValue
  }

  property set Injured(isInjured : boolean) {
    this.FNOLContactScreen.ContactDV.InjuredBoolean.BoolValue = isInjured
  }

  property get FirstName() : String {
    return this.FNOLContactScreen.ContactDV.FNOLContactInputSet.GlobalPersonNameInputSet_default.FirstName.Value
  }

  property set FirstName(firstNameSet : String) {
    this.FNOLContactScreen.ContactDV.FNOLContactInputSet.GlobalPersonNameInputSet_default.FirstName.Value = firstNameSet
  }

  property get LastName() : String {
    return this.FNOLContactScreen.ContactDV.FNOLContactInputSet.GlobalPersonNameInputSet_default.LastName.Value
  }

  property set LastName(lastNameSet : String) {
    this.FNOLContactScreen.ContactDV.FNOLContactInputSet.GlobalPersonNameInputSet_default.LastName.Value = lastNameSet
  }

  property get Address() : pcftest.CCAddressInputSet {
    return this.FNOLContactScreen.ContactDV.FNOLContactInputSet.CCAddressInputSet
  }

  property get OtherServicesPopup() : pcftest.OtherServiceRequestPopup {
    return this.FNOLContactScreen.ContactDV.InjuryIncidentInputSet.OtherServicesLVInputSet.OtherServicesLV_tb.AddServiceRequest.click()
  }

  property get OtherServices() : pcftest.OtherServicesLV.entry[] {
    return this.FNOLContactScreen.ContactDV.InjuryIncidentInputSet.OtherServicesLVInputSet.OtherServicesLV._Entries?.toTypedArray()
  }

  function addInjuredContact(lossPartyType : LossPartyType, severityType : SeverityType, contactLastName : String) {
    this.FNOLContactScreen.ContactDV.InjuredBoolean.BoolValue = true
    this.FNOLContactScreen.ContactDV.ClaimContactPerson.clickByLabelSubstr("New")
    this.FNOLContactScreen.ContactDV.FNOLContactInputSet.GlobalPersonNameInputSet_default.LastName.Value = contactLastName

    this.FNOLContactScreen.ContactDV.InjuryIncidentInputSet.LossParty.TypeKeyValue = lossPartyType
    this.FNOLContactScreen.ContactDV.InjuryIncidentInputSet.PrimaryInjuryType.selectFirstValidOption()
    //Disabled as part of Toggle R1
    //this.FNOLContactScreen.ContactDV.InjuryIncidentInputSet.Severity.TypeKeyValue = severityType
    this.FNOLContactScreen.Update.click()
  }
}

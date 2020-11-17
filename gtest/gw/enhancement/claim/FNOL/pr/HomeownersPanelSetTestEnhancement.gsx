package gw.enhancement.claim.FNOL.pr

uses pcftest.HomeownersEmergencyDebrisRemovalDV.EMSDebrisRemovalInputGroup
uses pcftest.HomeownersEmergencyMakeSafeDV

enhancement HomeownersPanelSetTestEnhancement : pcftest.HomeownersPanelSet {

  // Debris Removal
  function enableDebrisRemovalAndFillRequiredFields(companyName : String = null) {
    DebrisRemovalCheckboxValue = true
    if (companyName != null) {
      findDebrisRemovalVendorByName(companyName)
    } else {
      var contactPopup = EMSDebrisRemovalInputGroup.DebrisRemovalPicker.ClaimNewVendorOnlyPickerMenuItemSet.NewContactPickerMenuItemSet_CompanyVendor.click()
      contactPopup.ContactDetailScreen.ContactBasicsDV_Company.OrganizationName.GlobalContactNameInputSet_default.Name.Value = "Created by enhancement"
      contactPopup.customUpdate()
    }
    DebrisRemovalInstructionInputSet.RequestedQuoteCompletionDate.DateValue = Date.Tomorrow
    setDebrisRemovalNewAddress()
  }

  property get DebrisRemovalCheckboxValue() : boolean {
    return EMSDebrisRemovalInputGroup._checkbox.BoolValue
  }

  property set DebrisRemovalCheckboxValue(checkboxVal : boolean) {
    EMSDebrisRemovalInputGroup._checkbox.BoolValue = checkboxVal
  }

  private function findDebrisRemovalVendorByName(name : String) {
    EMSDebrisRemovalInputGroup.DebrisRemovalPicker.MenuItem_Search.click().pickByKeyword(name)
  }

  private function setDebrisRemovalNewAddress() {
    DebrisRemovalInstructionInputSet.ServiceAddressPicker.clickByLabelSubstr("New")
    DebrisRemovalInstructionInputSet.ServiceAddressFields.CCAddressInputSet.setAddress("", "San Mateo", State.TC_CA, "")
  }

  private property get DebrisRemovalInstructionInputSet() : pcftest.NewServiceRequestInstructionInputSet_default {
    return EMSDebrisRemovalInputGroup.OtherServiceRequestInfo.NewServiceRequestInstructionInputSet_default
  }

  property get EMSDebrisRemovalInputGroup() : EMSDebrisRemovalInputGroup {
    return this.HomeownersEmergencyDebrisRemovalDV.EMSDebrisRemovalInputGroup
  }

  // Make Safe
  function enableMakeSafeAndFillRequiredFields(companyName : String) {
    MakeSafeCheckboxValue = true
    findMakeSafeVendorByName(companyName)
    MakeSafeInstructionInputSet.RequestedQuoteCompletionDate.DateValue = Date.Tomorrow
    setMakeSafeNewAddress()
  }

  property get MakeSafeCheckboxValue() : boolean {
    return EMSMakeSafeInputGroup._checkbox.BoolValue
  }

  property set MakeSafeCheckboxValue(checkboxVal: boolean) {
    EMSMakeSafeInputGroup._checkbox.BoolValue = checkboxVal
  }

  private function findMakeSafeVendorByName(name : String) {
    EMSMakeSafeInputGroup.EMSPicker.MenuItem_Search.click().pickByKeyword(name)
  }

  private function setMakeSafeNewAddress() {
    MakeSafeInstructionInputSet.ServiceAddressPicker.clickByLabelSubstr("New")
    MakeSafeInstructionInputSet.ServiceAddressFields.CCAddressInputSet.setAddress("", "San Mateo", State.TC_CA, "")
  }

  private property get MakeSafeInstructionInputSet() : pcftest.NewServiceRequestInstructionInputSet_default {
    return EMSMakeSafeInputGroup.OtherServiceRequestInfo.NewServiceRequestInstructionInputSet_default
  }

  property get EMSMakeSafeInputGroup(): HomeownersEmergencyMakeSafeDV.EMSMakeSafeInputGroup {
    return this.HomeownersEmergencyMakeSafeDV.EMSMakeSafeInputGroup
  }

  //other services
  property get OtherServicesCheckboxValue() : boolean {
    return this.OtherServicesLVInputGroupInputSet.OtherServicesInputGroup._checkbox.BoolValue
  }

  property set OtherServicesCheckboxValue(checkboxValue: boolean) {
    this.OtherServicesLVInputGroupInputSet.OtherServicesInputGroup._checkbox.BoolValue = checkboxValue
  }

  function clickAddOtherServices() : pcftest.OtherServiceRequestPopup {
    this.OtherServicesCheckboxValue = true
    return this.OtherServicesLVInputGroupInputSet.OtherServicesInputGroup.OtherServicesLVInputSet.OtherServicesLV_tb.AddServiceRequest.click()
  }

  property get OtherServices(): pcftest.OtherServicesLV.entry[] {
    return  this.OtherServicesLVInputGroupInputSet.OtherServicesInputGroup.OtherServicesLVInputSet.OtherServicesLV._Entries?.toTypedArray()
  }
}

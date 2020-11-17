package gw.enhancement.lossdetails

uses gw.testharness.v3.PLAssertions
uses pcftest.AppraisalServiceInputSet.AppraisalServiceInputGroup

enhancement AppraisalServiceInputGroupTestEnhancement : AppraisalServiceInputGroup {

  function enableAndFillRequiredFields(assessorName : String = null, quoteDateText : String = null) : String {
    AppraisalCheckboxValue = true
    if(assessorName == null){
      var contactPopup = this.Assessor_Picker.ClaimNewVendorOnlyPickerMenuItemSet.NewContactPickerMenuItemSet_CompanyVendor.click()
      contactPopup.ContactDetailScreen.ContactBasicsDV_Company.OrganizationName.GlobalContactNameInputSet_default.Name.Value = "Created by enhancement"
      contactPopup.customUpdate()
    }else{
      findAssessorByName(assessorName)
    }


    if (quoteDateText == null) {
      AppraisalInstructionInputSet.RequestedQuoteCompletionDate.DateValue = Date.Tomorrow
    } else {
      AppraisalInstructionInputSet.RequestedQuoteCompletionDate.Value = quoteDateText
    }
    return setAppraisalNewAddress()
  }

  property get AppraisalCheckboxValue() : boolean {
    return this._checkbox.BoolValue
  }

  property set AppraisalCheckboxValue(checkboxVal : boolean) {
    this._checkbox.BoolValue = checkboxVal
  }

  private function findAssessorByName(name : String) {
    this.Assessor_Picker.MenuItem_Search.click().pickByKeyword(name)
  }

  function setAppraisalNewAddress() : String {
    AppraisalInstructionInputSet.ServiceAddressPicker.clickByLabelSubstr("New")
    AppraisalInstructionInputSet.ServiceAddressFields.CCAddressInputSet.setAddress("", "San Mateo", State.TC_CA, "")
    return AppraisalInstructionInputSet.ServiceAddressFields.CCAddressInputSet.Address_AddressLine1.Value
  }

  property get AppraisalInstructionInputSet() : pcftest.NewServiceRequestInstructionInputSet_default {
    return this.OtherServiceRequestInfo.NewServiceRequestInstructionInputSet_default
  }
}

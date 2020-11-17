package gw.enhancement.incident

uses gw.util.RandUtil
uses pcftest.AppraisalServiceInputSet.AppraisalServiceInputGroup
uses pcftest.OtherServicesLVInputGroupInputSet.OtherServicesInputGroup

enhancement NewVehicleIncidentPopupTestEnhancement : pcftest.NewVehicleIncidentPopup {

  property get VehicleIncidentDV() : pcftest.VehicleIncidentDV {
    return this.NewVehicleIncidentScreen.VehIncidentDetailDV.VehicleIncidentDV
  }

  function setRequiredFields() {
    var dv = this.VehicleIncidentDV
    dv.Vehicle_Picker.getOptionByLabel("New...").click()
    dv.Vehicle_Make.Value = "Toyota"
    dv.Vehicle_Model.Value = "Corolla"
    dv.Vehicle_Year.Value = "2001"
    dv.Driver_Picker.getOption(1).click()
    dv.Vehicle_VIN.Value = RandUtil.randLettersUpper(17)
    dv.Description.Value = "test vehicle incident"
  }

  function update() {
    this.NewVehicleIncidentScreen.Update.click()
  }

  function cancel() {
    this.NewVehicleIncidentScreen.Cancel.click()
  }

  //other services

  function clickAddOtherServices() : pcftest.OtherServiceRequestPopup {
    OtherServicesCheckboxValue = true
    return OtherServicesInputGroup.OtherServicesLVInputSet.OtherServicesLV_tb.AddServiceRequest.click()
  }

  property get OtherServicesCheckboxValue() : boolean {
    return OtherServicesInputGroup._checkbox.BoolValue
  }

  property set OtherServicesCheckboxValue(checkboxValue : boolean) {
    OtherServicesInputGroup._checkbox.BoolValue = checkboxValue
  }

  property get OtherServices() : pcftest.OtherServicesLV.entry[] {
    return OtherServicesInputGroup.OtherServicesLVInputSet.OtherServicesLV._Entries?.toTypedArray()
  }

  property get OtherServicesInputGroup() : OtherServicesInputGroup {
    return this.NewVehicleIncidentScreen.VehIncidentDetailDV.VehicleIncidentDV.OtherServicesLVInputGroupInputSet.OtherServicesInputGroup;
  }

  // appraisal

  function enableAppraisalServiceAndFillRequiredFields(companyName : String) {
    AppraisalServiceCheckboxValue = true
    findAssessorByName(companyName)
    NewServiceRequestInstructionInputSet.RequestedQuoteCompletionDate.DateValue = Date.Tomorrow
    setAppraisalServiceNewAddress()
  }

  property get AppraisalServiceCheckboxValue() : boolean {
    return AppraisalServiceInputGroup._checkbox.BoolValue
  }

  property set AppraisalServiceCheckboxValue(checkboxVal : boolean) {
    AppraisalServiceInputGroup._checkbox.BoolValue = checkboxVal
  }

  function findAssessorByName(name : String) {
    AppraisalServiceInputGroup.Assessor_Picker.MenuItem_Search.click().pickByKeyword(name)
  }

  private function setAppraisalServiceNewAddress() {
    NewServiceRequestInstructionInputSet.ServiceAddressPicker.clickByLabelSubstr("New")
    NewServiceRequestInstructionInputSet.ServiceAddressFields.CCAddressInputSet.setAddress("", "San Mateo", State.TC_CA, "")
  }

  property get NewServiceRequestInstructionInputSet() : pcftest.NewServiceRequestInstructionInputSet_default {
    return AppraisalServiceInputGroup.OtherServiceRequestInfo.NewServiceRequestInstructionInputSet_default
  }

  property get AppraisalServiceInputGroup() : AppraisalServiceInputGroup {
    return this.NewVehicleIncidentScreen.VehIncidentDetailDV.VehicleIncidentDV.AppraisalServiceInputSet.AppraisalServiceInputSet.AppraisalServiceInputGroup
  }
}

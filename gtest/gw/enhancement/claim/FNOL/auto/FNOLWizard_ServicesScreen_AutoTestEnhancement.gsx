package gw.enhancement.claim.FNOL.auto

uses pcftest.FNOLWizard_ServicesScreen_Auto

enhancement FNOLWizard_ServicesScreen_AutoTestEnhancement : FNOLWizard_ServicesScreen_Auto {

  property get FirstIncidentRentalInputGroup() : pcftest.RentalServiceInputSet.RentalInputGroup {
    return FirstIncidentPanelSet.RentalServiceDV.RentalServiceInputSet.RentalServiceInputSet.RentalInputGroup
  }

  property get FirstIncidentAutobodyInputGroup() : pcftest.VehicleIncidentAutoBodyDV.AutobodyInputGroup {
    return FirstIncidentPanelSet.VehicleIncidentAutoBodyDV.AutobodyInputGroup
  }

  property get FirstIncidentTowingInputGroup() : pcftest.VehicleIncidentTowingDV.TowingInputGroup {
    return FirstIncidentPanelSet.VehicleIncidentTowingDV.TowingInputGroup
  }

  property get FirstIncidenOtherServicesInputGroup() : pcftest.OtherServicesLVInputGroupInputSet.OtherServicesInputGroup {
    return FirstIncidentPanelSet.OtherServicesLVInputGroupInputSet.OtherServicesInputGroup
  }

  property get FirstIncidentOtherServices() : pcftest.OtherServicesLV.entry[] {
    return FirstIncidenOtherServicesInputGroup.OtherServicesLVInputSet.OtherServicesLV._Entries?.toTypedArray()
  }

  property get FirstIncidentOtherServicesCheckboxValue() : boolean {
    return this.FirstIncidenOtherServicesInputGroup._checkbox.BoolValue
  }

  property set FirstIncidentOtherServicesCheckboxValue(checkboxValue : boolean) {
    this.FirstIncidenOtherServicesInputGroup._checkbox.setBoolValue(checkboxValue)
  }

  function clickFirstIncidentAddOtherServices() : pcftest.OtherServiceRequestPopup {
    this.FirstIncidentOtherServicesCheckboxValue = true
    return FirstIncidenOtherServicesInputGroup.OtherServicesLVInputSet.OtherServicesLV_tb.AddServiceRequest.click()
  }

  property get FirstIncidentAppraisalInputGroup() : pcftest.AppraisalServiceInputSet.AppraisalServiceInputGroup {
    return FirstIncidentPanelSet.AppraisalServiceDV.AppraisalServiceInputSet.AppraisalServiceInputSet.AppraisalServiceInputGroup
  }

  function enableFirstIncidentAppraisalAndFillRequiredFields(assessorName : String = null, quoteDateText : String = null) {
    FirstIncidentAppraisalInputGroup.enableAndFillRequiredFields(assessorName, quoteDateText)
  }

  private property get FirstIncidentPanelSet() : pcftest.VehicleIncidentPanelSet {
    return this._Entries.first().VehicleIncidentPanelSet
  }

  property get FirstIncidentAddOtherServicesAvailable() : boolean{
    return this.FirstIncidenOtherServicesInputGroup._checkbox.Visible
  }
}

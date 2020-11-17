package gw.enhancement.claim.servicerequests
uses java.util.Date
uses gw.smoketest.platform.web.SelectElement
uses gw.smoketest.platform.web.DateElement

enhancement OtherServiceRequestPopupEnhancement : pcftest.OtherServiceRequestPopup {

  
  /**
   * Create a new "other service request"
   */
  function addOtherServiceRequest(serviceToPerform: SpecialistService, newKind : ServiceRequestKind, relatedTo: String){
    this.setService(serviceToPerform)
    if (relatedTo != null) {
      this.RelatedTo.clickByLabelSubstr(relatedTo)
    }
    if (newKind != null) {
      this.Kind.Value = newKind.Code
    }
    this.Specialist.ClaimNewServiceRequestSpecialistPickerMenuItemSet.NewVendor.NewAutoTowingAgency.click().createNewVendorFromContactPopup("new vendor")
    if (this.Kind.Value == ServiceRequestKind.TC_SERVICEONLY.Code) {
      this.RequestedServiceCompletionDate.DateValue = Date.Tomorrow  
    } else {
      this.RequestedQuoteCompletionDate.DateValue = Date.Tomorrow
    }
    
    this.ServiceAddressPicker.clickByLabelSubstr("New")
    this.AddressInputSet_US.setAddress("123 St", "San Mateo", State.TC_CA, "94440")
    this.Update.click()
  }

  function setService(service : SpecialistService) {
    var servicesPopup = this.NewServiceRequestDV.InstructionServicesLV_tb.AddMultipleServices.click() as pcftest.SelectServicesPopup
    servicesPopup.setService(service)
  }

  function setServiceByName(serviceName : String) {
    var servicesPopup = this.NewServiceRequestDV.InstructionServicesLV_tb.AddMultipleServices.click() as pcftest.SelectServicesPopup
    servicesPopup.setServiceByName(serviceName)
  }

  property get InstructionServicesLV() : pcftest.InstructionServicesLV_default { return this.NewServiceRequestDV.InstructionServicesLV_default }

  property get RelatedTo() : SelectElement { return this.NewServiceRequestDV.RelatedTo }

  property get Kind() : SelectElement { return this.NewServiceRequestDV.Kind }

  property get Specialist() : pcftest.NewServiceRequestDV.Specialist { return this.NewServiceRequestDV.Specialist }

  property get RequestedQuoteCompletionDate() : DateElement { return this.NewServiceRequestDV.NewServiceRequestInstructionInputSet_default.RequestedQuoteCompletionDate }

  property get RequestedServiceCompletionDate() : DateElement { return this.NewServiceRequestDV.NewServiceRequestInstructionInputSet_default.RequestedServiceCompletionDate }

  property get ServiceAddressPicker() : SelectElement { return this.NewServiceRequestDV.NewServiceRequestInstructionInputSet_default.ServiceAddressPicker }

  property get AddressInputSet_US() : pcftest.CCAddressInputSet {
    return this.NewServiceRequestDV.NewServiceRequestInstructionInputSet_default.ServiceAddressFields.CCAddressInputSet
  }

}

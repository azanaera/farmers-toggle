package gw.enhancement.claim.servicerequests

uses gw.api.databuilder.AddressBuilder
uses gw.cucumber.util.common.UIHelper
uses gw.enhancement.validationmessagehandler.SubmittableValidationMessageHandler
uses gw.pl.logging.LoggerCategory
uses gw.smoketest.platform.web.DateElement
uses gw.smoketest.platform.web.PCFLocation
uses gw.smoketest.platform.web.SelectElement
uses gw.smoketest.platform.web.ValueElement
uses pcftest.NewServiceRequest
uses typekey.Contact

uses java.lang.reflect.Modifier

enhancement NewServiceRequestTestEnhancement : NewServiceRequest {

  property get DV() : pcftest.NewServiceRequestDV {
    return this.NewServiceRequestScreen.NewServiceRequestDV
  }

  property get RelatedTo() : SelectElement {
    return this.DV.RelatedTo
  }

  property get AdditionalInstructions() : ValueElement {
    return this.DV.NewServiceRequestInstructionInputSet_default.InstructionText
  }

  property get RequestedServiceCompletionDate() : DateElement {
    return this.DV.NewServiceRequestInstructionInputSet_default.RequestedServiceCompletionDate
  }

  property get RequestedQuoteCompletionDate() : DateElement {
    return this.DV.NewServiceRequestInstructionInputSet_default.RequestedQuoteCompletionDate
  }

  property get CustomerContact() : pcftest.NewServiceRequestInstructionInputSet_default.CustomerContact {
    return this.DV.NewServiceRequestInstructionInputSet_default.CustomerContact
  }

  property get ServiceAddressUS() : pcftest.CCAddressInputSet {
    return this.DV.NewServiceRequestInstructionInputSet_default.ServiceAddressFields.CCAddressInputSet
  }

  property get ServiceAddressPicker() : SelectElement {
    return this.DV.NewServiceRequestInstructionInputSet_default.ServiceAddressPicker
  }

  property get Specialist() : pcftest.NewServiceRequestDV.Specialist {
    return this.DV.Specialist
  }

  /**
   * This property is getting the first row ServiceType0 for the InstructionServicesIterator for testing purposes
   */
  property get InstructionServiceType0() : ValueElement {
    return this.DV.InstructionServicesLV_default._Entries.first().InstructionServiceType0
  }

  /**
   * This property is getting the first row ServiceType1 for the InstructionServicesIterator for testing purposes
   */
  property get InstructionServiceType1(): ValueElement {
    return this.DV.InstructionServicesLV_default._Entries.first().InstructionServiceType1
  }

  /**
   * This property is getting the first row ServiceType2 for the InstructionServicesIterator for testing purposes
   */
  property get InstructionServiceType2(): ValueElement {
    return this.DV.InstructionServicesLV_default._Entries.first().InstructionServiceType2
  }

  function setService(service : SpecialistService) {
    var servicesPopup = this.DV.InstructionServicesLV_tb.AddMultipleServices.click() as pcftest.SelectServicesPopup
    servicesPopup.setService(service)
  }

  function setServiceByName(serviceName : String) {
    var servicesPopup = this.DV.InstructionServicesLV_tb.AddMultipleServices.click() as pcftest.SelectServicesPopup
    servicesPopup.setServiceByName(serviceName)
  }

  function setNewAddress() {
    var serviceAddress = AddressBuilder.uiReadyUSA().create()
    this.ServiceAddressPicker.setValue("__new")
    this.ServiceAddressUS.setAddress(serviceAddress.AddressLine1, serviceAddress.City, serviceAddress.State, serviceAddress.PostalCode)
  }

  function update() : pcftest.ClaimServiceRequests {
    return this.Update.click() as pcftest.ClaimServiceRequests
  }

  function updateUnsuccessfully() : NewServiceRequest {
    return this.Update.click() as NewServiceRequest
  }

  function cancel() : PCFLocation {
    return this.Cancel.click()
  }

  function submitUnsuccessfully() : NewServiceRequest {
    return this.SubmitButton.click() as NewServiceRequest
  }

  function submit() : pcftest.ClaimServiceRequests {
    var location = this.SubmitButton.click()
    UIHelper.assertNoMessages(location)
    return location as pcftest.ClaimServiceRequests
  }

  property get ValidationMessageHandler(): SubmittableValidationMessageHandler<NewServiceRequest,NewServiceRequest> {
    return new (this)
  }

  function setSpecialistToNewVendor() {
    this.Specialist.ClaimNewServiceRequestSpecialistPickerMenuItemSet.NewVendor.NewCompanyVendor.click().createNewVendorFromContactPopup()
  }

  function setSpecialistToNewVendorOfType(contactSubType : Contact) {
    switch (contactSubType) {
      case Contact.TC_ADJUDICATOR:
        this.Specialist.ClaimNewServiceRequestSpecialistPickerMenuItemSet.NewLegal.NewAdjudicator.click()
            .createNewVendorFromContactPopup()
        break
      case Contact.TC_ATTORNEY:
        this.Specialist.ClaimNewServiceRequestSpecialistPickerMenuItemSet.NewLegal.NewAttorney.click()
            .createNewVendorFromContactPopup()
        break
      case Contact.TC_LAWFIRM:
        this.Specialist.ClaimNewServiceRequestSpecialistPickerMenuItemSet.NewLegal.NewLawFirm.click()
            .createNewVendorFromContactPopup()
        break
      case Contact.TC_AUTOREPAIRSHOP:
        this.Specialist.ClaimNewServiceRequestSpecialistPickerMenuItemSet.NewVendor.NewAutoRepairShop.click()
            .createNewVendorFromContactPopup()
        break
      case Contact.TC_AUTOTOWINGAGCY:
        this.Specialist.ClaimNewServiceRequestSpecialistPickerMenuItemSet.NewVendor.NewAutoTowingAgency.click()
            .createNewVendorFromContactPopup()
        break
      case Contact.TC_COMPANYVENDOR:
        this.Specialist.ClaimNewServiceRequestSpecialistPickerMenuItemSet.NewVendor.NewCompanyVendor.click()
            .createNewVendorFromContactPopup()
        break
      case Contact.TC_DOCTOR:
        this.Specialist.ClaimNewServiceRequestSpecialistPickerMenuItemSet.NewVendor.NewDoctor.click()
            .createNewDoctorFromContactPopup()
        break
      case Contact.TC_MEDICALCAREORG:
        this.Specialist.ClaimNewServiceRequestSpecialistPickerMenuItemSet.NewVendor.NewMedicalCareOrg.click()
            .createNewVendorFromContactPopup()
        break
      case Contact.TC_PERSONVENDOR:
        this.Specialist.ClaimNewServiceRequestSpecialistPickerMenuItemSet.NewVendor.NewPersonVendor.click()
            .createNewVendorFromContactPopup()
        break
      default:
        throw new IllegalArgumentException("No valid option available for " + contactSubType)
    }
  }

}

package gw.cucumber.context.impl.smoketest.common

uses com.google.inject.Inject
uses cucumber.api.DataTable
uses gw.api.databuilder.ServiceRequestBuilder
uses gw.api.database.Query
uses gw.api.databuilder.ServiceRequestBuilder
uses gw.api.databuilder.ServiceRequestInstructionBuilder
uses gw.api.locale.DisplayKey
uses gw.cucumber.CucumberStepBase
uses gw.cucumber.context.api.common.ServiceRequestContext
uses gw.cucumber.context.impl.smoketest.util.Navigation
uses gw.cucumber.testdata.DataWrapper
uses gw.cucumber.transformer.SpecialistServiceTransformer
uses gw.cucumber.transformer.TypelistTransformer
uses gw.cucumber.util.common.UIHelper
uses gw.vendormanagement.servicerequeststate.ServiceRequestOperationDefinition
uses pcftest.AddReviseQuotePopup
uses pcftest.AssignServiceRequestPopup
uses pcftest.ClaimServiceRequests
uses pcftest.EditReferenceNumberPopup
uses pcftest.NewServiceRequest
uses pcftest.OperationReasonPromptPopup
uses pcftest.RequestRequotePopup
uses typekey.Contact

@SuppressWarnings("unused")
class ServiceRequestContextImpl extends CucumberStepBase implements ServiceRequestContext {

  @Inject
  var _claimWrapper : DataWrapper<Claim>

  @Inject
  var _serviceRequestWrapper : DataWrapper<ServiceRequest>

  @Inject
  var _exposureWrapper : DataWrapper<Exposure>

  @Inject
  protected var _userWrapper : DataWrapper<User>

  override function completeAllServiceRequests() {
    var claim = _claimWrapper.get() as Claim
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      claim = bundle.add(claim)
      claim.ServiceRequests.each(\serviceRequest -> {
        if (!serviceRequest.IsDone) {
          var context = new ServiceRequestOperationDefinition.OperationContext() {:Reason = "testing purpose"}
          serviceRequest.performOperation(ServiceRequestOperation.TC_CANCELSERVICEREQUEST, context, false)
        }
      })
    }, CurrentUser)
    _claimWrapper.set(claim)
  }

  override function requestServiceAndKind(serviceRequestKindText : String, serviceName : String) {
    var serviceRequestKind = new TypelistTransformer<ServiceRequestKind>().transform(serviceRequestKindText)
    var service = new SpecialistServiceTransformer().transform(serviceName)
    var claimServiceRequests = new Navigation<ClaimServiceRequests>(_proxy)
        .ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get())
            .goToServiceRequests(), CurrentUser)
    var newServiceRequest = claimServiceRequests.NewServiceRequest.click()
    newServiceRequest.setService(service)
    newServiceRequest.DV.Kind.clickByLabelSubstr(serviceRequestKind.Label)
    newServiceRequest.setSpecialistToNewVendor()
    if (newServiceRequest.RequestedServiceCompletionDate.Visible) {
      newServiceRequest.RequestedServiceCompletionDate.DateValue = Date.Tomorrow
    }
    if (newServiceRequest.RequestedQuoteCompletionDate.Visible) {
      newServiceRequest.RequestedQuoteCompletionDate.DateValue = Date.Tomorrow
    }
    newServiceRequest.setNewAddress()
    newServiceRequest.submit()
  }

  override function requestNewVendorServiceAndKind(vendorTypeName : String, serviceRequestKindText : String, serviceName : String) {
    var serviceRequestKind = new TypelistTransformer<ServiceRequestKind>().transform(serviceRequestKindText)
    var service = new SpecialistServiceTransformer().transform(serviceName)
    var claimServiceRequests = new Navigation<ClaimServiceRequests>(_proxy)
        .ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get())
            .goToServiceRequests(), CurrentUser)
    var newServiceRequest = claimServiceRequests.NewServiceRequest.click()
    newServiceRequest.setService(service)
    newServiceRequest.DV.Kind.clickByLabelSubstr(serviceRequestKind.Label)
    var vendorType = typekey.Contact.AllTypeKeys.singleWhere(\type -> type.Code.equalsIgnoreCase(vendorTypeName) ||
        type.DisplayName.equalsIgnoreCase(vendorTypeName))
    newServiceRequest.setSpecialistToNewVendorOfType(vendorType)
    if (newServiceRequest.RequestedServiceCompletionDate.Visible) {
      newServiceRequest.RequestedServiceCompletionDate.DateValue = Date.Tomorrow
    }
    if (newServiceRequest.RequestedQuoteCompletionDate.Visible) {
      newServiceRequest.RequestedQuoteCompletionDate.DateValue = Date.Tomorrow
    }
    newServiceRequest.setNewAddress()
    newServiceRequest.submit()
  }

  override function startNewServiceRequestForAnExposure(exposureTypeText : String) {
    var exposureType = new TypelistTransformer<ExposureType>().transform(exposureTypeText)
    var claimServiceRequests = new Navigation<ClaimServiceRequests>(_proxy)
        .ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get())
            .goToServiceRequests(), CurrentUser)
    var newServiceRequest = claimServiceRequests.NewServiceRequest.click()
  }

  override function createNewVendorOfTypeOnServiceRequest(contactTypeName : String) {
    var contactType = new TypelistTransformer<Contact>().transform(contactTypeName)
    var newServiceRequest = _proxy.CurrentPage as NewServiceRequest
    newServiceRequest.setSpecialistToNewVendorOfType(contactType)
  }

  override function specifyServiceRequestAndServiceOnServiceRequest(serviceRequestKindText : String, serviceName : String) {
    var serviceRequestKind = new TypelistTransformer<ServiceRequestKind>().transform(serviceRequestKindText)
    var service = new SpecialistServiceTransformer().transform(serviceName)
    var newServiceRequest = _proxy.CurrentPage as NewServiceRequest
    newServiceRequest.setService(service)
    newServiceRequest.DV.Kind.clickByLabelSubstr(serviceRequestKind.Label)
    if (newServiceRequest.RequestedServiceCompletionDate.Visible) {
      newServiceRequest.RequestedServiceCompletionDate.DateValue = Date.Tomorrow
    }
    if (newServiceRequest.RequestedQuoteCompletionDate.Visible) {
      newServiceRequest.RequestedQuoteCompletionDate.DateValue = Date.Tomorrow
    }
    newServiceRequest.setNewAddress()
    newServiceRequest.submit()
  }

  override function verifyService(serviceName : String) {
    var service = new SpecialistServiceTransformer().transform(serviceName)
    var claimServiceRequests = new Navigation<ClaimServiceRequests>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToServiceRequests(), CurrentUser)
    var serviceRequestList = claimServiceRequests.ServiceRequestList
    var entries = serviceRequestList.ServiceRequestLV._Entries
        .where(\entry -> entry.Services.Text.equalsIgnoreCase(service.DisplayName))
    assertThat(entries.Count).isEqualTo(1)
    _serviceRequestWrapper.set(_claimWrapper.get().ServiceRequests
        .singleWhere(\sr -> sr.ServiceRequestNumber.toString().equalsIgnoreCase(entries.single().ServiceRequestNumber.Text)))
  }

  override function verifyServiceRequestKind(serviceRequestKindText : String) {
    var serviceRequestKind = new TypelistTransformer<ServiceRequestKind>().transform(serviceRequestKindText)
    var claimServiceRequests = new Navigation<ClaimServiceRequests>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToServiceRequests(), CurrentUser)
    var serviceRequestLV = claimServiceRequests.ServiceRequestList.ServiceRequestLV
    serviceRequestLV._Entries.firstWhere(\e -> e.ServiceRequestNumber.Text == _serviceRequestWrapper.get().ServiceRequestNumber).viewDetail()
    assertThat(claimServiceRequests.ServiceRequestDV.Kind.TypeKeyValue).isEqualTo(serviceRequestKind)
  }

  override function verifyServiceAndServiceRequestKind(table : DataTable) {
    var expectedServiceEntries = table.asMaps(String, String)

    for (entry in expectedServiceEntries) {
      var serviceRequestKind = entry.get(DisplayKey.get("Web.ServiceRequest.Kind"))
      var serviceName = entry.get(DisplayKey.get("Web.ServiceRequest.ServiceToPerform"))

      var claimServiceRequests = new Navigation<ClaimServiceRequests>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToServiceRequests(), CurrentUser)
      var serviceRequestLV = claimServiceRequests.ServiceRequestList.ServiceRequestLV
      serviceRequestLV._Entries.firstWhere(\e -> e.Services.Text.contains(serviceName)).viewDetail()
      assertThat(claimServiceRequests.ServiceRequestDV.Kind.Text).isEqualTo(serviceRequestKind)
    }
  }

  override function createNewServiceRequest() {
    var claim = _claimWrapper.get()
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      _claimWrapper.set(ServiceRequestBuilder
          .uiReadyServiceOnly()
          .onClaim(claim)
          .create(bundle).getClaim())
    }, CurrentUser)
  }
  override function createServiceRequest(serviceName : String, serviceRequestKindText : String, progressText : String) {
    var service = new SpecialistServiceTransformer().transform(serviceName)
    var serviceRequestKind = new TypelistTransformer<ServiceRequestKind>().transform(serviceRequestKindText)
    var progress = new TypelistTransformer<ServiceRequestProgress>().transform(progressText)

    var claim = _claimWrapper.get()
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      bundle.add(claim)
      var sr = ServiceRequestBuilder.uiReadyServiceOnly()
          .onClaim(claim)
          .withKind(serviceRequestKind)
          .withInstruction(new ServiceRequestInstructionBuilder().withSpecialistService(service))
          .onIncident(_exposureWrapper.get().Incident)
          .withProgress(progress)
          .withSpecialistCommMethod(SpecialistCommMethod.TC_GWPORTAL)
          //sets the service request number as allowing the built in code to set ends on throwing an exception when run multiple times
          .withServiceRequestNumber(UUID.randomUUID().toString())
          .create(bundle)
      _serviceRequestWrapper.set(sr)
      claim.addToServiceRequests(sr)
    }, CurrentUser)
    _claimWrapper.set(claim)
  }

  override function cancelServiceRequest() {
    var claimServiceRequests = goToServiceRequestScreen()

    var cancelScreen = claimServiceRequests.StateToolbar.Cancel.click() as OperationReasonPromptPopup
    cancelScreen.Update.click()
    _claimWrapper.set(Query.make(Claim).compare(Claim#ClaimNumber, Equals, _claimWrapper.get().ClaimNumber).select().AtMostOneRow)
  }

  override function verifyServiceRequestProgressIs(progressText : String) {
    var progress = new TypelistTransformer<ServiceRequestProgress>().transform(progressText)
    var claimServiceRequests = goToServiceRequestScreen()

    assertThat(claimServiceRequests.Progress).isEqualTo(progress)
  }

  override function reassignServiceRequest() {
    var claimServiceRequests = goToServiceRequestScreen()

    var assignServiceRequestPopup = claimServiceRequests.StateToolbar.AssignService.click() as AssignServiceRequestPopup
    claimServiceRequests = assignServiceRequestPopup.AssignmentPopupScreen.AssignmentPopupDV.AssignmentPopupScreen_ButtonButton.click() as ClaimServiceRequests
    _serviceRequestWrapper.set(Query.make(ServiceRequest).compare(ServiceRequest#ID, Equals, _serviceRequestWrapper.get().ID).select().AtMostOneRow)
  }

  override function verifyServiceRequestIsReassigned() {
    var serviceRequest = _serviceRequestWrapper.get()
    var originalUser = _userWrapper.get()
    assertThat(serviceRequest.AssignedUser).isNotEqualTo(originalUser)
  }

  override function updateReferenceNumber() {
    var claimServiceRequests = goToServiceRequestScreen()

    var editReferenceNumberPopup = claimServiceRequests.StateToolbar.UpdateStateButton.UpdateReferenceNumber.click() as EditReferenceNumberPopup
    var referenceNumber = System.currentTimeMillis() as String
    editReferenceNumberPopup.ServiceRequestReferenceNumber.Value = referenceNumber
    editReferenceNumberPopup.Update.click()
    _serviceRequestWrapper.set(Query.make(ServiceRequest).compare(ServiceRequest#ID, Equals, _serviceRequestWrapper.get().ID).select().AtMostOneRow)
    assertThat(_serviceRequestWrapper.get().ServiceRequestReferenceNumber).isEqualTo(referenceNumber)
  }

  override function verifyServiceRequestReferenceNumber() {
    var claimServiceRequests = goToServiceRequestScreen()

    var actualReferenceNumber = claimServiceRequests.ServiceRequestPanelRow.ServiceRequestDV.ServiceRequestReferenceNumber.Value
    assertThat(actualReferenceNumber).isEqualTo(_serviceRequestWrapper.get().ServiceRequestReferenceNumber)
  }

  override function createQuote() {
    var claimServiceRequestsScreen = goToServiceRequestScreen()

    var quotePopup = claimServiceRequestsScreen.ServiceRequestPanelRow.QuotePanelSet.AddQuote.click() as AddReviseQuotePopup
    quotePopup.StatementDV_quote.DaysToPerformService.Value = "1"
    quotePopup.StatementDV_quote.Description.Value = "Created by ServiceRequestContextImpl.addQuote"
    quotePopup.StatementDV_quote.StatementLineItemLV._Entries.first().lineItemAmount.Value = "100"
    quotePopup.Update.click()

    _serviceRequestWrapper.set(Query.make(ServiceRequest).compare(ServiceRequest#ID, Equals, _serviceRequestWrapper.get().ID).select().AtMostOneRow)
  }

  override function requestRequote() {
    var claimServiceRequests = goToServiceRequestScreen()

    var requestRequotePopup = claimServiceRequests.ServiceRequestPanelRow.QuotePanelSet.RequestRequote.click() as RequestRequotePopup
    requestRequotePopup.ReasonForRequestingRequote.Value = "Requote requested by ServiceRequestContextImpl.requestRequote"
    requestRequotePopup.Update.click()
    UIHelper.assertNoMessages(requestRequotePopup)
    _serviceRequestWrapper.set(Query.make(ServiceRequest).compare(ServiceRequest#ID, Equals, _serviceRequestWrapper.get().ID).select().AtMostOneRow)
  }

  override function verifyRequoteSentAndHistoryUpdated() {
    var claimServiceRequests = goToServiceRequestScreen()

    verifyQuoteStatusAndProgressAfterRequoting()

    claimServiceRequests = claimServiceRequests.HistoryTab.click() as ClaimServiceRequests
    var isRequoteEventPresent = claimServiceRequests.ServiceRequestHistoryLV._Entries.hasMatch(\event -> event.Description.Value.contains("Requote requested by ServiceRequestContextImpl.requestRequote"))
    assertThat(isRequoteEventPresent).isTrue()
  }

  public function verifyQuoteStatusAndProgressAfterRequoting() {
    var serviceRequest = _serviceRequestWrapper.get()
    assertThat(serviceRequest.Progress).isEqualTo(ServiceRequestProgress.TC_INPROGRESS)
    assertThat(serviceRequest.QuoteStatus).isEqualTo(ServiceRequestQuoteStatus.TC_WAITINGFORQUOTE)
  }

  override function approveQuote() {
    var claimServiceRequests = goToServiceRequestScreen()

    var approveQuotePopup = claimServiceRequests.ServiceRequestPanelRow.QuotePanelSet.ApproveQuote.click()
    claimServiceRequests = approveQuotePopup.Update.click() as ClaimServiceRequests
    _serviceRequestWrapper.set(Query.make(ServiceRequest).compare(ServiceRequest#ID, Equals, _serviceRequestWrapper.get().ID).select().AtMostOneRow)
  }

  override function verifyTheQuoteStatus(quoteStatusText : String) {
    var quoteStatus = new TypelistTransformer<ServiceRequestQuoteStatus>().transform(quoteStatusText)

    var sr = _serviceRequestWrapper.get()
    assertThat(_serviceRequestWrapper.get().QuoteStatus).isEqualTo(quoteStatus)
  }

  override function updateQuote(numberOfDays : String, table : DataTable) {
    var claimServiceRequests = goToServiceRequestScreen()
    var lineItems = table.asMaps(String, String)

    var reviseQuotePopup = claimServiceRequests.ServiceRequestPanelRow.QuotePanelSet.ReviseQuote.click()
    reviseQuotePopup.StatementDV_quoterevision.DaysToPerformService.Value = numberOfDays

    var pageLineItems = reviseQuotePopup.StatementDV_quoterevision.StatementLineItemLV._Entries
    var addButton = reviseQuotePopup.StatementDV_quoterevision.StatementLineItemLV_tb.Add

    for (lineItem in lineItems index i) {
      var pageLineItem = pageLineItems.get(i)
      if (pageLineItem == null or not pageLineItem.lineItemCategory.Visible) {
        addButton.click()
        pageLineItem = pageLineItems.get(i)
      }

      pageLineItem.lineItemCategory.getOptionByLabel(lineItem.get(DisplayKey.get("Web.ServiceRequest.LineItem.Category"))).click()
      pageLineItem.lineItemDescription.Value = lineItem.get(DisplayKey.get("Web.ServiceRequest.LineItem.Description"))
      pageLineItem.lineItemAmount.Value = lineItem.get(DisplayKey.get("Web.ServiceRequest.Quote.Amount"))
    }
    reviseQuotePopup.Update.click()
    _serviceRequestWrapper.set(Query.make(ServiceRequest).compare(ServiceRequest#ID, Equals, _serviceRequestWrapper.get().ID).select().AtMostOneRow)
  }

  override function verifyQuoteAmount(quoteAmountText : String) {
    var claimServiceRequests = goToServiceRequestScreen()

    var totalAmount = claimServiceRequests.ServiceRequestPanelRow.QuotePanelSet.StatementDV_quote.quoteTotal
    var expectedAmount = _currencyAmountTransformer.transform(quoteAmountText)

    assertThat(totalAmount).hasCurrencyAmount(expectedAmount)
  }

  override function verifyCompletionDate(numberOfDaysText : String) {
    var claimServiceRequests = goToServiceRequestScreen()

    var days = claimServiceRequests.ServiceRequestPanelRow.QuotePanelSet.StatementDV_quote.DaysToPerformService

    assertThat(days).hasText(numberOfDaysText)
  }

  override function addInvoice(description : String, table : DataTable) {
    var claimServiceRequests = goToServiceRequestScreen()
    var newInvoice = claimServiceRequests.ServiceRequestPanelRow.AddInvoice.click()
    var lineItems = table.asMaps(String, String)

    newInvoice.StatementDV_invoice.Description.Value = description

    var pageLineItems = newInvoice.StatementDV_invoice.StatementLineItemLV._Entries
    var addButton = newInvoice.StatementDV_invoice.StatementLineItemLV_tb.Add

    for (lineItem in lineItems index i) {
      var pageLineItem = pageLineItems.get(i)
      if (pageLineItem == null or not pageLineItem.lineItemCategory.Visible) {
        addButton.click()
        pageLineItem = pageLineItems.get(i)
      }

      pageLineItem.lineItemCategory.getOptionByLabel(lineItem.get(DisplayKey.get("Web.ServiceRequest.LineItem.Category"))).click()
      pageLineItem.lineItemDescription.Value = lineItem.get(DisplayKey.get("Web.ServiceRequest.LineItem.Description"))
      pageLineItem.lineItemAmount.Value = lineItem.get(DisplayKey.get("Web.ServiceRequest.Quote.Amount"))
    }
    newInvoice.Update.click()
    _serviceRequestWrapper.set(Query.make(ServiceRequest).compare(ServiceRequest#ID, Equals, _serviceRequestWrapper.get().ID).select().AtMostOneRow)
  }

  override function verifyInvoiceIsAdded(amountText : String) {
    var claimServiceRequests = goToServiceRequestScreen()
    var expectedAmount = _currencyAmountTransformer.transform(amountText)

    claimServiceRequests = claimServiceRequests.DetailsTab.click() as ClaimServiceRequests
    assertThat(claimServiceRequests.ServiceRequestPanelRow.TotalInvoiced).hasCurrencyAmount(expectedAmount)

    claimServiceRequests = claimServiceRequests.InvoicesTab.click() as ClaimServiceRequests
    assertThat(claimServiceRequests.InvoicePanelSet.StatementLineItemLV.lineItemAmountFooter).hasCurrencyAmount(expectedAmount)
  }

  override function sendQuestionToVendor() {
    var claimServiceRequests = goToServiceRequestScreen()

    claimServiceRequests = claimServiceRequests.MessagesTab.click() as ClaimServiceRequests
    var sendMessagePopup = claimServiceRequests.clickSendMessageButton()

    sendMessagePopup.NewMessageDV.MessageType.getOptionByLabel(ServiceRequestMessageType.TC_QUESTION.DisplayName).click()
    sendMessagePopup.NewMessageDV.MessageTitle.Value = "Message created by ServiceRequestContextImpl.sendQuestionVendor"
    sendMessagePopup.NewMessageDV.MessageContent.Value = "Message"

    sendMessagePopup.Update.click()
  }

  override function verifyMessageIsCreated() {
    var claimServiceRequests = goToServiceRequestScreen()
    claimServiceRequests = claimServiceRequests.MessagesTab.click() as ClaimServiceRequests

    var question = claimServiceRequests.ServiceRequestMessagePanelSet._Entries
        .firstWhere(\elt -> elt.ServiceRequestMessageDV.MessageType.Text == ServiceRequestMessageType.TC_QUESTION.DisplayName)
    assertThat(question.ServiceRequestMessageDV.MessageBody.Text).isEqualTo("Message")
  }

  private function goToServiceRequestScreen() : ClaimServiceRequests {
    var claimServiceRequests = new Navigation<ClaimServiceRequests>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToServiceRequests(), CurrentUser)
    var serviceRequestLV = claimServiceRequests.ServiceRequestList.ServiceRequestLV
    serviceRequestLV._Entries.firstWhere(\elt -> elt.ServiceRequestNumber.Value == _serviceRequestWrapper.get().ServiceRequestNumber).viewDetail()
    return claimServiceRequests;
  }
}

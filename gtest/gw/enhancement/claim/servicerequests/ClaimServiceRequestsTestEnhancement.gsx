package gw.enhancement.claim.servicerequests

uses gw.api.locale.DisplayKey
uses gw.smoketest.platform.web.IteratorEntries
uses gw.smoketest.platform.web.IteratorEntriesWithPaging
uses pcftest.AssignServiceRequestPopup
uses typekey.Currency

enhancement ClaimServiceRequestsTestEnhancement : pcftest.ClaimServiceRequests {

  property get ServiceRequests() : pcftest.ServiceRequestLV.entry[] {
    return this.ServiceRequestList.ServiceRequestLV._Entries?.toTypedArray()
  }

  property get SelectedServiceRequest() : pcftest.ServiceRequestLV.entry {
    return ServiceRequests.singleWhere(\ w -> w._Current)
  }

  property get SelectedInvoice() : pcftest.ClaimServiceRequests.ServiceRequestInvoicesLV.entry {
    return Invoices.singleWhere(\ c -> c._Current)
  }

  property get ServiceRequestNumber() : long {
    // The ServiceRequest.ServiceRequestNumber property itself is a string, but OOTB we expect it to always be numeric
    return Long.valueOf(this.ServiceRequestPanelRow.ServiceRequestDV.ServiceRequestNumber.Text)
  }

  property get Services() : List<pcftest.InstructionServicesLV_default.entry> {
    return this.ServiceRequestPanelRow.ServiceRequestDV.ServiceToPerform.InstructionServicesLV_default._Entries
  }

  property get Progress() : ServiceRequestProgress {
    return this.ServiceRequestPanelRow.ServiceRequestDV.Progress.TypeKeyValue
  }

  property get QuoteStatus() : ServiceRequestQuoteStatus {
    return this.ServiceRequestPanelRow.ServiceRequestDV.QuoteStatus.TypeKeyValue
  }
  
  property get Kind() : ServiceRequestKind {
    return ServiceRequestKind.get(this.ServiceRequestPanelRow.ServiceRequestDV.Kind.Value)
  }
  
  property get NextAction() : String {
    return this.ServiceRequestPanelRow.ServiceRequestDV.NextAction.Text
  }
  
  property get ActionOwner() : String {
    return this.ServiceRequestPanelRow.ServiceRequestDV.ActionOwner.Text
  }
 
  property get InstructionText() : String {
    return this.ServiceRequestPanelRow.ServiceRequestDV.InstructionText.Text
  }

  property get RelatedTo() : String {
    return this.ServiceRequestPanelRow.ServiceRequestDV.RelatedTo.Text
  }

  property get RequestedServiceCompletionDate() : Date {
    return this.ServiceRequestPanelRow.ServiceRequestDV.RequestedServiceCompletionDate.DateValue
  }
  
  property get RequestedQuoteCompletionDate() : Date {
    return this.ServiceRequestPanelRow.ServiceRequestDV.RequestedQuoteCompletionDate.DateValue
  }

  property get ExpectedServiceCompletionDate() : Date {
    return this.ServiceRequestPanelRow.ServiceRequestDV.ExpectedServiceCompletionDate.DateValue
  }

  property get ExpectedQuoteCompletionDate() : Date {
    return this.ServiceRequestPanelRow.ServiceRequestDV.ExpectedQuoteCompletionDate.DateValue
  }
  
  property get Currency() : Currency {
    return this.ServiceRequestPanelRow.ServiceRequestDV.Currency.TypeKeyValue
  }
  
  property get CustomerContactName() : String {
    return this.ServiceRequestPanelRow.ServiceRequestDV.CustomerContact.Text
  }

  property get SpecialistName() : String {
    return this.ServiceRequestPanelRow.ServiceRequestDV.Specialist.Text
  }

  property get SpecialistCommMethod() : SpecialistCommMethod {
    return this.ServiceRequestPanelRow.ServiceRequestDV.SpecialistCommMethod.TypeKeyValue
  }

  property get SpecialistPhone() : String {
    return this.ServiceRequestPanelRow.ServiceRequestDV.SpecialistPhone.Text
  }

  property get QuoteAmount() : String {
    return this.QuotePanelSet.StatementDV_quote.StatementLineItemLV.lineItemAmountFooter.Value
  }
 
  property get DaysToPerformService() : String {
    return this.QuotePanelSet.StatementDV_quote.DaysToPerformService.Value
  }

  property get QuoteDescription() : String {
    return this.QuotePanelSet.StatementDV_quote.Description.Value
  }

  property get QuoteReferenceNumber() : String {
    return this.QuotePanelSet.StatementDV_quote.ReferenceNumber.Value
  }

  property get QuoteCreationDate() : Date {
    return this.QuotePanelSet.StatementDV_quote.CreationDate.DateValue
  }
  
  property get Notes() : IteratorEntriesWithPaging<pcftest.WideNotesLV.entry> {
    return this.WideNotesLV._Entries
  }
  
  property get Documents() : IteratorEntriesWithPaging<pcftest.ServiceRequestDocumentsLV.entry> {
    return this.ServiceRequestDocumentsLV._Entries
  }
  
  property get Invoices() : IteratorEntriesWithPaging<pcftest.ClaimServiceRequests.ServiceRequestInvoicesLV.entry>{
    return this.ServiceRequestInvoicesLV._Entries
  }
  
  property get QuoteDocuments() : IteratorEntriesWithPaging<pcftest.StatementDocumentsLV.entry> {
    return this.QuotePanelSet.StatementDocumentsLV._Entries
  }
  
  property get QuotePanelSet() : pcftest.ClaimServiceRequests.ServiceRequestPanelRow.QuotePanelSet {
    return this.ServiceRequestPanelRow.QuotePanelSet
  }
  
  property get ServiceRequestDV() : pcftest.ServiceRequestDV {
    return this.ServiceRequestPanelRow.ServiceRequestDV
  }

  property get SpecialistResponseTimeMetric() : pcftest.ClaimServiceRequests.ServiceRequestPanelRow.MetricsDV.MetricsLV.entry {
    return VisibleMetrics.firstWhere(\ m -> m.MetricName.TypeKeyValue == typekey.ServiceRequestMetric.TC_SPECIALISTINITIALRESPONSETIMESERVICEREQUESTMETRIC)
  }

  property get CycleTimeMetric() : pcftest.ClaimServiceRequests.ServiceRequestPanelRow.MetricsDV.MetricsLV.entry {
    return VisibleMetrics.firstWhere(\ m -> m.MetricName.TypeKeyValue == typekey.ServiceRequestMetric.TC_SERVICECYCLETIMESERVICEREQUESTMETRIC)
  }

  property get QuoteExpectedCompletionTimeMetric() : pcftest.ClaimServiceRequests.ServiceRequestPanelRow.MetricsDV.MetricsLV.entry {
    return VisibleMetrics.firstWhere(\ m -> m.MetricName.TypeKeyValue == typekey.ServiceRequestMetric.TC_QUOTETIMELINESSSERVICEREQUESTMETRIC)
  }  
  
  property get ServiceExpectedCompletionTimeMetric() : pcftest.ClaimServiceRequests.ServiceRequestPanelRow.MetricsDV.MetricsLV.entry {
    return VisibleMetrics.firstWhere(\ m -> m.MetricName.TypeKeyValue == typekey.ServiceRequestMetric.TC_SERVICETIMELINESSSERVICEREQUESTMETRIC)
  }
  
  property get InvoiceVsFirstEstimateMetric() : pcftest.ClaimServiceRequests.ServiceRequestPanelRow.MetricsDV.MetricsLV.entry {
    return VisibleMetrics.firstWhere(\ m -> m.MetricName.TypeKeyValue == typekey.ServiceRequestMetric.TC_INVOICEVARIANCEVSQUOTESERVICEREQUESTMETRIC)
  }
  
  property get NumberOfDelaysMetric() : pcftest.ClaimServiceRequests.ServiceRequestPanelRow.MetricsDV.MetricsLV.entry {
    return VisibleMetrics.firstWhere(\ m -> m.MetricName.TypeKeyValue == typekey.ServiceRequestMetric.TC_NUMBEROFDELAYSSERVICEREQUESTMETRIC)
  }
  
  property get Metrics() : IteratorEntries<pcftest.ClaimServiceRequests.ServiceRequestPanelRow.MetricsDV.MetricsLV.entry> {
    return this.ServiceRequestPanelRow.MetricsDV.MetricsLV._Entries
  }
  
  private property get VisibleMetrics() : List<pcftest.ClaimServiceRequests.ServiceRequestPanelRow.MetricsDV.MetricsLV.entry> {
    return this.Metrics.where(\ c -> c.MetricName.Visible)
  }

  function updateReferenceNumber() : pcftest.EditReferenceNumberPopup {
    return this.StateToolbar.UpdateStateButton.UpdateReferenceNumber.click()
  }

  function showHistory () : pcftest.ClaimServiceRequests {
    if (this.HistoryTab.Visible and this.HistoryTab.Enabled) { 
      this.HistoryTab.click() 
    }
    return this
  }
  
  function showActivities() : pcftest.ClaimServiceRequests {
    if(this.ActivitiesTab.Visible and this.DocumentsTab.Enabled) {
      this.ActivitiesTab.click()
    }
    return this
  }
  
  function showInvoices() : pcftest.ClaimServiceRequests {
    if(this.InvoicesTab.Visible and this.InvoicesTab.Enabled) {
      this.InvoicesTab.click()
    }
    return this
  }

  function showMessages() : pcftest.ClaimServiceRequests {
   if(this.MessagesTab.Visible and this.MessagesTab.Enabled) {
     this.MessagesTab.click()
   }
   return this
  }
  
  function getInvoicePanelSet(invoiceRefNumber: String) : pcftest.InvoicePanelSet {
    this.Invoices.singleWhere(\ i -> i.ReferenceNumber.Text == invoiceRefNumber).viewDetail()
    return this.InvoicePanelSet
  }
  
  property get SelectedInvoiceAmount() : String {
    return this.SelectedInvoice.Amount.Value
  }
  
  property get SelectedInvoiceReferenceNumber() : String {
    return this.SelectedInvoice.ReferenceNumber.Text
  }

  property get SelectedInvoiceStatus() : ServiceRequestInvoiceStatus {
    return this.SelectedInvoice.Status.TypeKeyValue
  } 

  property get SelectedInvoiceDescription() : String {
    return this.SelectedInvoice.Description.Text
  }  
  
  function selectServiceRequestByNumber(serviceReqNum : String) : pcftest.ClaimServiceRequests {
    this.ServiceRequests.singleWhere(\ sr -> sr.ServiceRequestNumber.Text == serviceReqNum).viewDetail()
    return this
  }
  
  function selectInvoiceByReferenceNumber(invoiceRefNumber : String) : pcftest.ClaimServiceRequests {
    this.showInvoices()
    this.Invoices.singleWhere(\ i -> i.ReferenceNumber.Text == invoiceRefNumber).viewDetail()
    return this
  }

  function showDetails () : pcftest.ClaimServiceRequests {
    if (this.DetailsTab.Visible and this.DetailsTab.Enabled) { 
      this.DetailsTab.click() 
    }
    return this
  }
  
  function showDocuments () : pcftest.ClaimServiceRequests {
    if (this.DocumentsTab.Visible and this.DocumentsTab.Enabled) { 
      this.DocumentsTab.click() 
    }
    return this
  }  
  
  function showNotes () : pcftest.ClaimServiceRequests {
    if (this.NotesTab.Visible and this.NotesTab.Enabled) {
      this.NotesTab.click()
    }
    return this
  }

  function assignSelectedServiceRequest() : AssignServiceRequestPopup {
    return this.StateToolbar.AssignService.click()
  }

  function clickOnActivityBySubject(subject : String) : pcftest.ActivityDetailViaClaimWorksheet {
    var activity = this.ServiceRequestActivityLV._Entries.firstWhere(\ a -> a.Subject.Value == subject)
    if(activity == null) throw new IllegalArgumentException("An activity with this subject does not exist on this service request")
    activity.Subject.click()
    return this.SmokeTest.CurrentWorksheet as pcftest.ActivityDetailViaClaimWorksheet
  }
  
  function clickAddDocumentButton() : pcftest.PickExistingDocumentPopup {
    return this.ServiceRequestDocumentsLV_tb.AssociateOnlyButton.Link.click()
  }

  function clickAddQuoteButton() : pcftest.AddReviseQuotePopup {
    return this.ServiceRequestPanelRow.QuotePanelSet.AddQuote.click()
  }

  function clickAddInvoiceButton() : pcftest.NewInvoice {
    this.showInvoices()
    return this.InvoiceTabToolbar.AddInvoice.click()
  }
  
  function clickSendMessageButton() : pcftest.ServiceRequestMessagePopup {
    this.showMessages()
    return this.MessageTabToolbar.SendMessage.click()
  }

  function clickReviseQuoteButton() : pcftest.AddReviseQuotePopup {
    return this.ServiceRequestPanelRow.QuotePanelSet.ReviseQuote.click()
  }

  function clickApproveQuoteButton() : pcftest.ApproveQuotePopup {
    return this.ServiceRequestPanelRow.QuotePanelSet.ApproveQuote.click()
  }

  function clickPromoteQuoteButton() : pcftest.PromoteQuoteOnly {
    return this.StateToolbar.CreateNewService.click() as pcftest.PromoteQuoteOnly
  }

  function clickRequestRequoteButton() : pcftest.RequestRequotePopup {
    return this.ServiceRequestPanelRow.QuotePanelSet.RequestRequote.click()
  }

  function setAllActivitiesFilter() : pcftest.ClaimServiceRequests {
    return setFilter(DisplayKey.get("Java.Workplan.AllActivities"))
  }

  function setFilter(label : String) : pcftest.ClaimServiceRequests {
    this.ServiceRequestActivityLV.ServiceRequestFilter.getOptionByLabel(label).click()
    return this
  }

  function goToWorkplan() : pcftest.ClaimWorkplan {
    return this._parent.MenuLinks.Claim_ClaimWorkplan.click()
  }
  
  function goToDesktopClaims() : pcftest.DesktopClaims {
    this._parent.TabBar.DesktopTab.openMenu()
    return this._parent.TabBar.DesktopTab.Desktop_DesktopClaims.click()
  }

  function goToClaimSummary() : pcftest.ClaimSummary {
    this._parent.TabBar.DesktopTab.openMenu()
    return this._parent.MenuLinks.Claim_ClaimSummaryGroup.click() as pcftest.ClaimSummary
  }
  
  function goToClaimNotes() : pcftest.ClaimNotes {
    return this._parent.MenuLinks.Claim_ClaimNotes.click()
  }

  function goToClaimLossDetails() : pcftest.ClaimLossDetails {
    return this._parent.MenuLinks.Claim_ClaimLossDetailsGroup.click() as pcftest.ClaimLossDetails
  }

  function goToClaimHistory() : pcftest.ClaimHistory {
    return this._parent.MenuLinks.Claim_ClaimHistory.click()
  }
  
  function goToClaimDocuments() : pcftest.ClaimDocuments {
    return this._parent.MenuLinks.Claim_ClaimDocuments.click()
  }

  function submitInstruction() {
    this.StateToolbar.SubmitInstruction.click()
  }
}

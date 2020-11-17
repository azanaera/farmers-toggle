package gw.cucumber.context.api.common

uses cucumber.api.DataTable

/**
 * Methods related to Service Request
 */
interface ServiceRequestContext {

  /**
   * Complete all Service Requests on claim
   */
  function completeAllServiceRequests()

  /**
   * Request a claim level service of given specialist service and Service Request kind
   *
   * @param serviceRequestKindName - The kind of service being requested
   * @param serviceName -  The specialist service being requested
   */
  function requestServiceAndKind(serviceRequestKindName : String, serviceName : String)

  /**
   * Request a claim level service from a new vendor of given specialist service and Service Request kind
   *
   * @param vendorTypeName - The type of the new vendor
   * @param serviceRequestKindName - The kind of service being requested
   * @param serviceName -  The specialist service being requested
   */
  function requestNewVendorServiceAndKind(vendorTypeName : String, serviceRequestKindName : String, serviceName : String)

  /**
   * Start requesting a service for a specific exposure type
   *
   * @param exposureTypeName - The type of exposure related to the service
   */
  function startNewServiceRequestForAnExposure(exposureTypeName : String)

  /**
   * Add a new vendor for a service
   *
   * @param vendorType - The type of the new vendor
   * @param serviceRequestKindName - The kind of service being requested
   * @param serviceName -  The specialist service being requested
   */
  function createNewVendorOfTypeOnServiceRequest(vendorTypeName : String)

  /**
   * Specifiy a given specialist service and Service Request kind for a service
   *
   * @param serviceRequestKindName - The kind of service being requested
   * @param serviceName -  The specialist service being requested
   */
  function specifyServiceRequestAndServiceOnServiceRequest(serviceRequestKindText : String, serviceName : String)

  /**
   * Verify the given specialist service is requested on claim
   *
   * @param serviceName -  The specialist service being requested
   */
  function verifyService(serviceName : String)

  /**
   * Verify the Service Request kind is set to the given value
   *
   * @param serviceRequestKindName - The kind of service being requested
   */
  function verifyServiceRequestKind(serviceRequestKindText : String)

  /**
   * Verify a service of following specialist service and Service Request kind is requested on the claim
   *
   * @param table Service Request's kind and specialist service
   *  | Vendor                      | Request Type      | Services to Perform |
   *  | Advanced Auto Repair Center | Unmanaged Service | Auto body           |
   */
  function verifyServiceAndServiceRequestKind(table : DataTable)

  /**
   * Creates a generic Service Request
   */
  function createNewServiceRequest()
  /**
   * Creates a Service Request in the claim
   * @param serviceName, specialist service of the Service Request
   * @param serviceRequestKindText, kind of service of the Service Request
   * @param progress, progress of the Service Request
   */
  function createServiceRequest(serviceName : String, serviceRequestKindText : String, progress : String)

  /**
   * Cancels the Service Request
   */
  function cancelServiceRequest()

  /**
   * Verifies the status of the Service Request is correct
   * @param progress, expected progress of the Service Request
   */
  function verifyServiceRequestProgressIs(progress : String)

  /**
   * Reassigns the Service Request throught the screen
   */
  function reassignServiceRequest()

  /**
   * Verifies the Service Request has been reassinged
   */
  function verifyServiceRequestIsReassigned()

  /**
   * Updates the reference number in the Service Request
   */
  function updateReferenceNumber()

  /**
   * Verifies the Service Request reference number is correct
   */
  function verifyServiceRequestReferenceNumber()

  /**
   * Creates a quote on the Service Request
   */
  function createQuote()

  /**
   * Requests a requote on the Service Request throught the UI
   */
  function requestRequote()

  /**
   * Verifies the requote request is sent, the Service Request is in the right status and a history event was added
   */
  function verifyRequoteSentAndHistoryUpdated()

  /**
   * Verifies the quote status and the status of the Service Request after a requote request.
   */
  function verifyQuoteStatusAndProgressAfterRequoting()

  /**
   * Approves the given quote throught the UI
   */
  function approveQuote()

  /**
   * Verifies the quote status is the given parameter
   * @param quoteStatusText, the expected status of the quote
   */
  function verifyTheQuoteStatus(quoteStatusText : String)

  /**
   * Updates the quote of the Service Request with a new date and different line items
   * @param numberOfDays, number of days to perform the service
   * @param table, a table containing line items of the invoice
   *  | Category     | Description              | Amount |
   *  | Chiropractor | Chiropractor description | 100    |
   */
  function updateQuote(numberOfDays : String, table : DataTable)

  /**
   * Verifies the total amount of the quote matches a given value
   * @param quoteAmountText, the expected amount on the invoice
   */
  function verifyQuoteAmount(quoteAmountText : String)

  /**
   * Verifies the completion date of the given quote
   * @param numberOfDaysText, expected number of days to perform the service
   */
  function verifyCompletionDate(numberOfDaysText : String)

  /**
   * Adds an invoice with a description and different line items
   * @param description, the description of the invoice
   * @param table, a table containing line items of the invoice
   *  | Category     | Description              | Amount |
   *  | Chiropractor | Chiropractor description | 100    |
   */
  function addInvoice(description : String, table : DataTable)

  /**
   * Verifies an Invoice is added with a total amount
   * @param amountText, the expected amount on the invoice
   */
  function verifyInvoiceIsAdded(amountText : String)

  /**
   * Sends a question to the vendor
   */
  function sendQuestionToVendor()

  /**
   * Verifies a message gets created in the Service Request
   */
  function verifyMessageIsCreated()

}
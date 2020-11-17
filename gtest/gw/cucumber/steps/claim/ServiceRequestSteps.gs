package gw.cucumber.steps.claim

uses com.google.inject.Inject
uses cucumber.api.DataTable
uses cucumber.api.java.en.Given
uses cucumber.api.java.en.Then
uses cucumber.api.java.en.When
uses gw.cucumber.context.api.ContextFactory

@SuppressWarnings("unused")
@Export
class ServiceRequestSteps {

  @Inject
  var _contextFactory : ContextFactory

  @Given("^an \"([^\"]*)\" service request of Type \"([^\"]*)\" is \"([^\"]*)\"$")
  public function createServiceRequestInStatus(serviceName : String, serviceRequestKindText : String, progress : String) {
    _contextFactory.getServiceRequestContext().createServiceRequest(serviceName, serviceRequestKindText, progress)
  }

  @When("^the service request has been quoted$")
  public function createQuote() {
    _contextFactory.getServiceRequestContext().createQuote()
  }

  @When("^I request a \"([^\"]*)\" for \"([^\"]*)\"$")
  public function iRequestAFor(serviceRequestKindText : String, serviceName : String) {
    _contextFactory.getClaimContext().addClaimLevelServices(serviceName, serviceRequestKindText)
  }

  @When("^I request a \"([^\"]*)\" for \"([^\"]*)\" on the existing claim$")
  public function iRequestAForOnTheExistingClaim(serviceRequestKindText : String, serviceName : String) {
    _contextFactory.getServiceRequestContext().requestServiceAndKind(serviceRequestKindText, serviceName)
  }

  @When("^I request a new \"([^\"]*)\" to \"([^\"]*)\" for \"([^\"]*)\" on the existing claim$")
  public function iRequestANewToForOnTheExistingClaim(vendorTypeName : String, serviceRequestKindText : String, serviceName : String) {
    _contextFactory.getServiceRequestContext().requestNewVendorServiceAndKind(vendorTypeName, serviceRequestKindText, serviceName)
  }

  @When("^I start a request for a new service related to the \"([^\"]*)\" exposure$")
  public function startNewServiceRequestForAnExposure(exposureTypeText : String) {
    _contextFactory.getServiceRequestContext().startNewServiceRequestForAnExposure(exposureTypeText)
  }

  @When("^add a new vendor to the service for \"([^\"]*)\"$")
  public function createNewVendorOfTypeOnServiceRequest(contactTypeName : String) {
    _contextFactory.getServiceRequestContext().createNewVendorOfTypeOnServiceRequest(contactTypeName)
  }

  @When("^I request to \"([^\"]*)\" for \"([^\"]*)\" on the existing claim$")
  public function specifyServiceRequestAndServiceOnServiceRequest(serviceRequestKindText : String, serviceName : String) {
    _contextFactory.getServiceRequestContext().specifyServiceRequestAndServiceOnServiceRequest(serviceRequestKindText, serviceName)
  }

  @When("^I cancel the service request$")
  public function iCancelTheServiceRequest() {
    _contextFactory.getServiceRequestContext().cancelServiceRequest()
  }

  @When("^I Re-assign the service request$")
  public function iReassignTheServiceRequest() {
    _contextFactory.getServiceRequestContext().reassignServiceRequest()
  }

  @When("^I update Vendor Reference Number$")
  public function iUpdateTheReferenceNumber() {
    _contextFactory.getServiceRequestContext().updateReferenceNumber()
  }

  @When("^I request for requote$")
  public function iRequestRequote() {
    _contextFactory.getServiceRequestContext().requestRequote()
  }

  @When("^I revise the quote to update the number of days to perform the service to \"([^\"]*)\" with line items as:$")
  public function iReviseQuote(numberOfDays : String, table : DataTable) {
    _contextFactory.getServiceRequestContext().updateQuote(numberOfDays, table)
  }

  @When("^I add an invoice described with \"([^\"]*)\" with line items as:$")
  public function iAddAnInvoice(description : String, table : DataTable) {
    _contextFactory.getServiceRequestContext().addInvoice(description, table)
  }

  @When("^I approve the quote and the requested service completion date$")
  public function iApproveTheQuote() {
    _contextFactory.getServiceRequestContext().approveQuote()
  }

  @When("^I send a question to the vendor$")
  public function iSendAQuestionToTheVendor() {
    _contextFactory.getServiceRequestContext().sendQuestionToVendor()
  }

  @Then("^a \"([^\"]*)\" service should be requested on the claim$")
  public function aServiceShouldBeRequestedOnTheClaim(serviceName : String) {
    _contextFactory.getServiceRequestContext().verifyService(serviceName)
  }

  @Then("^the request type should be \"([^\"]*)\"$")
  public function theServiceTypeShouldBe(serviceRequestKindText : String) {
    _contextFactory.getServiceRequestContext().verifyServiceRequestKind(serviceRequestKindText)
  }

  @Then("^the following services should be requested on the claim:$")
  function theFollowingServicesShouleBeRequestedOnTheClaim(table : DataTable) {
    _contextFactory.getServiceRequestContext().verifyServiceAndServiceRequestKind(table)
  }

  @Then("^the service request is \"([^\"]*)\"$")
  public function verifyServiceRequestProgressIs(progress : String) {
    _contextFactory.getServiceRequestContext().verifyServiceRequestProgressIs(progress)
  }

  @Then("^assignment has changed for service request$")
  public function verifyServiceRequestIsReassigned() {
    _contextFactory.getServiceRequestContext().verifyServiceRequestIsReassigned()
  }

  @Then("^service request should reflect updated Reference Number$")
  public function verifyServiceRequestReferenceNumber() {
    _contextFactory.getServiceRequestContext().verifyServiceRequestReferenceNumber()
  }

  @Then("^Requote request is sent and history table is updated$")
  public function verifyRequoteSentAndHistoryUpdated() {
    _contextFactory.getServiceRequestContext().verifyRequoteSentAndHistoryUpdated()
  }

  @Then("^Quote Status is \"([^\"]*)\"$")
  public function verifyQuoteStatus(quoteStatus : String) {
    _contextFactory.getServiceRequestContext().verifyTheQuoteStatus(quoteStatus)
  }

  @Then("^the quote amount is \"([^\"]*)\"$")
  public function verifyQuoteAmount(quoteAmount : String) {
    _contextFactory.getServiceRequestContext().verifyQuoteAmount(quoteAmount)
  }

  @Then("^the number Of Days To Perform Service is \"([^\"]*)\" days$")
  public function verifyCompletionDate(numberOfDays : String) {
    _contextFactory.getServiceRequestContext().verifyCompletionDate(numberOfDays)
  }

  @Then("^a new invoice is added for a total of \"([^\"]*)\"$")
  public function verifyInvoiceIsAdded(amountText : String) {
    _contextFactory.getServiceRequestContext().verifyInvoiceIsAdded(amountText)
  }

  @Then("^a message is created$")
  public function verifyMessageIsCreated() {
    _contextFactory.getServiceRequestContext().verifyMessageIsCreated()
  }

}
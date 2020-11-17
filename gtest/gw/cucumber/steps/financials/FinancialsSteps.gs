package gw.cucumber.steps.financials

uses com.google.inject.Inject
uses cucumber.api.DataTable
uses cucumber.api.java.en.Given
uses cucumber.api.java.en.Then
uses cucumber.api.java.en.When
uses gw.cucumber.context.api.ContextFactory

@SuppressWarnings("unused")
@Export
class FinancialsSteps {
  @Inject
  var _contextFactory : ContextFactory

  @Given("^the claim has a bodily injury exposure$")
  public function existingExposure() {
    _contextFactory.getExposureContext().createBodilyInjuryExposure()
  }

  @Given("^the exposure has \"([^\"]*)\" available reserves for \"([^\"]*)\" and \"([^\"]*)\"$")
  public function existingReserves(amountString : String, costTypeString : String, costCategoryString : String) {
    _contextFactory.getFinancialsContext().createExistingReserves(amountString, costTypeString, costCategoryString)
  }

  @Given("^the exposure has available reserves for$")
  public function existingReserves(table : DataTable) {
    _contextFactory.getFinancialsContext().createExistingReserves(table)
  }

  @Given("^the exposure has a check with a \"([^\"]*)\" \"([^\"]*)\" payment on the reserve line$")
  public function theExposureHasACheckWithAPaymentOnTheReserveLine(amountString : String, paymentTypeString : String) {
    _contextFactory.getFinancialsContext().createExistingPayment(amountString, paymentTypeString)
  }

  @Given("^the claim has no prior payments or checks$")
  public function noClaimPaymentsOrChecks() {
    _contextFactory.getFinancialsContext().verifyClaimHasNoPaymentsOrChecks()
  }

  @Given("^a check payment exists against the reserve line$")
  public function checkPaymentOnTheReserveLine(table : DataTable) {
    _contextFactory.getFinancialsContext().createCheckPaymentOnTheReserveLine(table)
  }

  @Given("^a check exists against the reserve line within a check group$")
  public function checkPaymentOnTheReserveLineWithingACheckGroup(table : DataTable) {
    _contextFactory.getFinancialsContext().createCheckPaymentOnTheReserveLineWithinACheckGroup(table)
  }

  @Given("^a recovery reserve line on the claim$")
  public function givenRecoveryReserves(table : DataTable) {
    _contextFactory.getFinancialsContext().createRecoveryReserves(table)
  }

  @Given("^there is no open recoveries for the following recovery reserve lines$")
  public function verifyThereIsNoOpenRecoveriesforReserveLines(table : DataTable) {
    _contextFactory.getFinancialsContext().verifyThereIsNoOpenRecoveriesforReserveLines(table)
  }

  @Given("^there is no open recovery reserves for the following recovery reserve lines$")
  public function verifyThereIsNoOpenRecoveryReservesforReserveLines(table : DataTable) {
    _contextFactory.getFinancialsContext().verifyThereIsNoOpenRecoveryReservesforReserveLines(table)
  }

  @Given("^a reserve for \"([^\"]*)\" on the exposure requires approval$")
  public function reserveOnExposureRequiresApproval(amount : String) {
    _contextFactory.getFinancialsContext().createReserveOnExposureThatRequiresApproval(amount)
  }

  @Given("^a check for \"([^\"]*)\" on the exposure requires approval$")
  public function createCheckThatRequiresApproval(amount : String) {
    _contextFactory.getFinancialsContext().createCheckThatRequiresApproval(amount)
  }

  @When("^I create a check for \"([^\"]*)\" on the exposure$")
  public function createCheckOnExposure(amount : String, table : DataTable) {
    _contextFactory.getFinancialsContext().createCheckOnExposure(amount, table)
  }

  @When("^I \"([^\"]*)\" the reserve transaction$")
  public function actionReserveTransaction(action : String) {
    _contextFactory.getFinancialsContext().actionReserveTransaction(action)
  }

  @When("^I \"([^\"]*)\" the payment$")
  public function actionPayment(action : String) {
    _contextFactory.getFinancialsContext().actionPayment(action)
  }

  @When("^I create a new recovery$")
  public function createRecovery(table : DataTable) {
    _contextFactory.getFinancialsContext().createRecovery(table)
  }

  @Given("^the claim has a payment$")
  public function theClaimHasAPayment(table : DataTable) {
    _contextFactory.getFinancialsContext().theClaimHasAPayment(table)
  }

  @When("^I create a new recovery reserve$")
  public function createRecoveryReserve(table : DataTable) {
    _contextFactory.getFinancialsContext().createRecoveryReserve(table)
  }

  @When("^I create a comprehensive exposure on the claim$")
  public function createComprehensiveExposure() {
    _contextFactory.getExposureContext().createComprehensiveExposure()
  }

  @When("^I create a check with a \"([^\"]*)\" \"([^\"]*)\" payment on the reserve line$")
  public function createPaymentOnTheReserveLine(amountString : String, paymentTypeString : String) {
    _contextFactory.getFinancialsContext().createPayment(amountString, paymentTypeString)
  }

  @When("^I create a manual check with a \"([^\"]*)\" \"([^\"]*)\" payment on the reserve line$")
  public function createManualCheckOnTheReserveLine(amountString : String, paymentTypeString : String) {
    _contextFactory.getFinancialsContext().createManualCheck(amountString, paymentTypeString)
  }

  @When("^I create a quick check with the following details:$")
  public function createQuickCheckOnTheReserveLine(table : DataTable) {
    _contextFactory.getFinancialsContext().createQuickCheck(table)
  }

  @When("^I create a check with a \"([^\"]*)\" \"([^\"]*)\" payment on the \"([^\"]*)\" and \"([^\"]*)\" reserve line$")
  public function iCreateACheckWithAPaymentOnTheAndReserveLine(amountString : String, paymentTypeString : String, costTypeString : String, costCategoryString : String) {
    _contextFactory.getFinancialsContext().createPaymentOnAReserveLine(amountString, paymentTypeString, costTypeString, costCategoryString)
  }

  @When("^I change the payment amount to \"([^\"]*)\"$")
  public function editPayment(amountString : String) {
    _contextFactory.getFinancialsContext().editPayment(amountString)
  }

  @When("^I void the check$")
  public function iVoidTheCheck() {
    _contextFactory.getFinancialsContext().voidTheCheck()
  }

  @When("^I stop the check$")
  public function iStopTheCheck() {
    _contextFactory.getFinancialsContext().stopTheCheck()
  }

  @When("^I clone the check$")
  public function cloneCheck() {
    _contextFactory.getFinancialsContext().cloneCheck()
  }

  @When("^I delete the check$")
  public function deleteTheCheck() {
    _contextFactory.getFinancialsContext().deleteTheCheck()
  }

  @When("^I transfer the check to the first claim$")
  public function transferTheCheck() {
    _contextFactory.getFinancialsContext().transferTheCheckToFirstClaim()
  }

  @When("^I reissue the check updating the amount$")
  public function reissueTheCheck() {
    _contextFactory.getFinancialsContext().reissueTheCheck()
  }

  @When("^I create \"([^\"]*)\" available reserves for \"([^\"]*)\" and \"([^\"]*)\"$")
  public function createReserveOnTheExposure(amountString : String, costTypeString : String, costCategoryString : String) {
    _contextFactory.getFinancialsContext().setAvailableReserves(amountString, costTypeString, costCategoryString)
  }

  @When("^I set \"([^\"]*)\" available reserves for \"([^\"]*)\" and \"([^\"]*)\"$")
  public function setReserveOnTheExposure(amountString : String, costTypeString : String, costCategoryString : String) {
    _contextFactory.getFinancialsContext().setAvailableReserves(amountString, costTypeString, costCategoryString)
  }

  @When("^I set the available reserves for \"([^\"]*)\"\\/\"([^\"]*)\" to \"([^\"]*)\"$")
  public function setNewReserveOnTheExposure(costTypeString : String, costCategoryString : String, amountString : String) {
    _contextFactory.getFinancialsContext().setAvailableReserves(amountString, costTypeString, costCategoryString)
  }

  @When("^I start creating a check$")
  public function startCheckWizard() {
    _contextFactory.getFinancialsContext().startCheckWizard()
  }

  @When("^I start creating a check for \"([^\"]*)\" with contact name \"([^\"]*)\"$")
  public function startCheckWizardForOrganizationVendor(contactSubTypeName : String, contactName : String) {
    _contextFactory.getFinancialsContext().startCheckWizardForSpecificVendor(contactSubTypeName, contactName)
  }

  @When("^I start creating a check for \"([^\"]*)\" with contact name \"([^\"]*)\" \"([^\"]*)\"$")
  public function startCheckWizardForContactVendor(contactSubTypeName : String, fname : String, lname : String) {
    _contextFactory.getFinancialsContext().startCheckWizardForSpecificVendor(contactSubTypeName, null, fname, lname)
  }

  @When("^I create a payment on the claim$")
  public function createClaimPayment(table : DataTable) {
    _contextFactory.getFinancialsContext().createClaimPayment(table)
  }

  @When("^I create a payment on the exposure$")
  public function createExposurePayment(table : DataTable) {
    _contextFactory.getFinancialsContext().createExposurePayment(table)
  }

  @When("^I create payment on the reserve line as follows:$")
  public function createPaymentOnReserveline(table : DataTable) {
    _contextFactory.getFinancialsContext().createPaymentOnReserveline(table.asMap(String, String))
  }

  @When("^I select the deductions link from the Instructions wizard$")
  public function navigateToCheckDeductions() {
    _contextFactory.getFinancialsContext().navigateToCheckDeductions()
  }

  @When("^I create these line items$")
  public function createLineItems(table : DataTable) {
    _contextFactory.getFinancialsContext().createLineItems(table)
  }

  @When("^I finish creating a check$")
  public function finishCheckWizard() {
    _contextFactory.getFinancialsContext().finishCheckWizard()
  }

  @When("^I recode the payment to update the reserve for \"([^\"]*)\" and \"([^\"]*)\"$")
  public function recodePayment(costTypeString : String, costCategoryString : String) {
    _contextFactory.getFinancialsContext().recodePayment(costTypeString, costCategoryString)
  }

  @When("^I create a recovery reserve on the claim$")
  public function createRecoveryReserves(table : DataTable) {
    _contextFactory.getFinancialsContext().createRecoveryReserves(table)
  }

  @When("^I change the recovery reserve amount$")
  public function changeRecoveryReserveAmount(table : DataTable) {
    _contextFactory.getFinancialsContext().changeRecoveryReserveAmount(table)
  }

  @Then("^State withholding with amount of \"([^\"]*)\" should be deducted$")
  public function verifyStateWithholdingAmountIsDeducted(amount : String) {
    _contextFactory.getFinancialsContext().verifyStateWithholdingAmountIsDeducted(amount)
  }

  @Then("^the approval status of the reserve transaction is \"([^\"]*)\"$")
  public function verifyReserveTransactionApprovalStatus(status : String) {
    _contextFactory.getFinancialsContext().verifyReserveTransactionApprovalStatus(status)
  }

  @Then("^the check's approval status should be \"([^\"]*)\"$")
  public function verifyCheckApprovalStatus(status : String) {
    _contextFactory.getFinancialsContext().verifyCheckApprovalStatus(status)
  }

  @Then("^the payment's approval status should be \"([^\"]*)\"$")
  public function verifyPaymentApprovalStatus(status : String) {
    _contextFactory.getFinancialsContext().verifyPaymentApprovalStatus(status)
  }

  @Then("^the recovery reserve should exist on the claim$")
  public function verifyRecoveryReserves(table : DataTable) {
    _contextFactory.getFinancialsContext().verifyRecoveryReserves(table)
  }

  @Then("^the recovery reserve should exist on the claim with a transaction showing the changed amount$")
  public function verifyRecoveryReserveChange(table : DataTable) {
    _contextFactory.getFinancialsContext().verifyRecoveryReserveChange(table)
  }

  @Then("^a financial transaction should be created$")
  public function verifyFinancialTransactionExists(table : DataTable) {
    _contextFactory.getFinancialsContext().verifyFinancialTransactionExists(table)
  }

  @Then("^a recovery reserve should be created$")
  public function verifyRecoveryReserveExists(table : DataTable) {
    _contextFactory.getFinancialsContext().verifyRecoveryReserveExists(table)
  }

  @Then("a transaction should be visible on the \"([^\"]*)\" Financials Summary screen")
  public function verifyTransactionExistsOnFinancialsExposureScreen(view : String, table : DataTable) {
    _contextFactory.getFinancialsContext().verifyTransactionExistsOnFinancialsExposureScreen(view, table)
  }

  @Then("multi-currency transactions should be listed on the claim")
  public function verifyMultiCurrencyTransactions(table : DataTable) {
    _contextFactory.getFinancialsContext().verifyMultiCurrencyTransactions(table)
  }

  @When("^I subrogate individual exposures$")
  public function referSubrogationToExposureLevel() {
    _contextFactory.getFinancialsContext().referSubrogationToExposureLevel()
  }

  @Then("^the exposure should have the following remaining reserves:$")
  public function checkReservesTransactions(table : DataTable) {
    _contextFactory.getFinancialsContext().verifyReserves(table)
  }

  @Then("a \"([^\"]*)\" \"([^\"]*)\" payment should exist on the reserve line")
  public function correctPayment(amountString : String, paymentTypeString : String) {
    _contextFactory.getFinancialsContext().verifyPayment(amountString, paymentTypeString)
  }

  @Then("^a \"([^\"]*)\" check to \"([^\"]*)\" should exist on the claim$")
  public function aCheckToShouldExistOnTheClaim(checkAmount : String, payeeName : String) {
    _contextFactory.getFinancialsContext().verifyCheck(checkAmount, payeeName)
  }

  @Then("^I cannot finish because \"([^\"]*)\"$")
  public function cannotFinishCheckWizard(message : String) {
    _contextFactory.getFinancialsContext().verifyCannotFinishCheckWizard(message)
  }

  @Then("^payment options are not available on the closed claim$")
  public function paymentOptionsUnavailable() {
    _contextFactory.getFinancialsContext().verifyPaymentOptionsUnavailable()
  }

  @Then("^a reserve should be created on the claim$")
  function verifyClaimHasReserve(table : DataTable) {
    _contextFactory.getFinancialsContext().verifyClaimHasReserve(table)
  }

  @Then("^a reserve should not be created on the claim$")
  function verifyClaimDoesNotHaveReserve(table : DataTable) {
    _contextFactory.getFinancialsContext().verifyClaimDoesNotHaveReserve(table)
  }

  @Then("^the check is \"([^\"]*)\"$")
  public function checkStatusIs(status : String) {
    _contextFactory.getFinancialsContext().verifyCheckStatus(status)
  }

  @Then("^the check is deleted$")
  public function verifyCheckIsDeleted() {
    _contextFactory.getFinancialsContext().verifyCheckIsDeleted()
  }

  @Then("^a subrogation opportunity exists$")
  public function aSubrogationOportunityExists() {
    _contextFactory.getFinancialsContext().verifySubrogationExists()
  }

  @Then("^recoveries exist with the following details$")
  public function recoveriesExistsWithDetails(table : DataTable) {
    _contextFactory.getFinancialsContext().verifyRecoveriesInSubrogation(table)
  }

  @Then("^the exposure has a subrogation owner$")
  public function theExposureHasSubrogationOwner() {
    _contextFactory.getFinancialsContext().verifyExposureHasSubrogationOwner()
  }

}
package gw.cucumber.steps.claim

uses com.google.inject.Inject
uses cucumber.api.java.en.Given
uses cucumber.api.java.en.Then
uses cucumber.api.java.en.When
uses gw.cucumber.context.api.ContextFactory

@SuppressWarnings("unused")
@Export
class CloseClaimSteps {

  @Inject
  var _contextFactory : ContextFactory

  @Given("^all activities are completed$")
  public function allActivitiesAreCompleted() {
    _contextFactory.getActivityContext().completeAllOpenActivities()
  }

  @Given("^all exposures are closed$")
  public function allExposuresAreClosed() {
    _contextFactory.getExposureContext().closeAllOpenExposures()
  }

  @Given("^all matters are closed$")
  public function allMattersAreClosed() {
    _contextFactory.getClaimContext().closeAllMatters()
  }

  @Given("^all service requests are completed$")
  public function allServiceRequestsAreCompleted() {
    _contextFactory.getServiceRequestContext().completeAllServiceRequests()
  }

  @Given("^subrogation is closed$")
  public function subrogationIsClosed() {
    _contextFactory.getClaimContext().closeSubrogation()
  }

  @Given("^fault rating is determined$")
  public function faultRatingIsDetermined() {
    _contextFactory.getClaimContext().determineFaultRating()
  }

  @Given("^the claim is closed$")
  public function theClaimIsClosed() {
    _contextFactory.getClaimContext().setClaimStatusToClosed()
  }

  @Given("^the claim has open activities$")
  public function theClaimHasOpenActivities() {
    _contextFactory.getActivityContext().createOpenActivity()
  }

  @Given("^the claim has open exposures$")
  public function theClaimHasOpenExposures() {
    _contextFactory.getExposureContext().createBodilyInjuryExposure()
  }

  @Given("^the claim has open matters$")
  public function theClaimHasOpenMatters() {
    _contextFactory.getClaimContext().createOpenMatter()
  }

  @Given("^the claim has open service requests$")
  public function theClaimHasOpenServiceRequest() {
    _contextFactory.getServiceRequestContext().createNewServiceRequest()
  }

  @When("^I close the claim$")
  public function iCloseTheClaim() {
    _contextFactory.getClaimContext().closeClaim()
  }

  @When("^I try to close the claim$")
  public function iTryToCloseTheClaim() {
    _contextFactory.getClaimContext().tryToCloseTheClaim()
  }

  @When("^I re-open the claim$")
  public function iReOpenTheClaim() {
    _contextFactory.getClaimContext().reopenClaim()
  }

  @Then("^I could not close the claim$")
  public function iCouldNotCloseClaim() {
    _contextFactory.getClaimContext().iCouldNotCloseClaim()
  }

  @Then("^the claim status should be \"([^\"]*)\"$")
  public function theClaimStatusShouldBe(claimStateText : String) {
    _contextFactory.getClaimContext().verifyClaimStatus(claimStateText)
  }
}
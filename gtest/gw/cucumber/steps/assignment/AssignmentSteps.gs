package gw.cucumber.steps.assignment

uses com.google.inject.Inject
uses cucumber.api.java.en.Given
uses cucumber.api.java.en.Then
uses cucumber.api.java.en.When
uses gw.cucumber.context.api.ContextFactory

@SuppressWarnings("unused")
@Export
class AssignmentSteps {

  @Inject
  var _contextFactory : ContextFactory

  @Given("^the claim segment is \"([^\"]*)\"$")
  public function theClaimSegmentationIs(claimSegmentText : String) {
    _contextFactory.getClaimContext().setClaimSegment(claimSegmentText)
  }

  @Given("^the claim loss location is in state \"([^\"]*)\"$")
  public function theClaimLossLocationIsInState(stateText : String) {
    _contextFactory.getClaimContext().setClaimLossLocationState(stateText)
  }

  @Given("^the claim has an activity$")
  public function theClaimHasAnActivity() {
    _contextFactory.getActivityContext().createOpenActivity()
  }

  @Given("^the claim is assigned to group \"([^\"]*)\" and user \"([^\"]*)\"$")
  public function theClaimIsAssignedToGroupAndUser(groupName : String, userDisplayName : String) {
    _contextFactory.getAssignmentContext().setClaimAssignedGroupAndUser(groupName, userDisplayName)
  }

  @Given("^the exposure is assigned to group \"([^\"]*)\" and user \"([^\"]*)\"$")
  public function theExposureIsAssignedToGroupAndUser(groupName : String, userDisplayName : String) {
    _contextFactory.getAssignmentContext().setExposureAssignedGroupAndUser(groupName, userDisplayName)
  }

  @Given("^the activity is assigned to group \"([^\"]*)\" and user \"([^\"]*)\"$")
  public function theActivityIsAssignedToGroupAndUser(groupName : String, userDisplayName : String) {
    _contextFactory.getAssignmentContext().setActivityAssignedGroupAndUser(groupName, userDisplayName)
  }

  @Given("^I am the claim owner$")
  public function assignClaimToCurrentUser() {
    _contextFactory.getAssignmentContext().assignClaimToCurrentUser()
  }

  @Given("^the service request is assigned$")
  public function assignServiceRequest() {
    _contextFactory.getAssignmentContext().assignServiceRequest()
  }

  @When("^I set loss location to an address in state \"([^\"]*)\"$")
  public function iSetLossLocationToAnAddressInState(stateText : String) {
    _contextFactory.getClaimContext().setLossLocationInState(stateText)
  }

  @When("^I assign the claim through automated assignment$")
  public function iAssignTheClaimThroughAutomatedAssignment() {
    _contextFactory.getClaimContext().autoAssignClaimAndExposures()
  }

  @When("^I assign the claim individually through automated assignment$")
  public function iAssignTheClaimIndividuallyThroughAutomatedAssignment() {
    _contextFactory.getClaimContext().autoAssignClaimIndividually()
  }

  @When("^I assign the \"([^\"]*)\" exposure through automated assignment$")
  public function iAssignTheExposureThroughAutomatedAssignment(coverageTypeText : String) {
    _contextFactory.getClaimContext().autoAssignExposureIndividually(coverageTypeText)
  }

  @When("^I manually assign the claim to group \"([^\"]*)\" and user \"([^\"]*)\"$")
  public function iManuallyAssignTheClaimToGroupAndUser(groupName : String, userDisplayName : String) {
    _contextFactory.getClaimContext().assignClaimAndExposuresToGroupAndUser(groupName, userDisplayName)
  }

  @When("^I manually assign the claim individually to group \"([^\"]*)\" and user \"([^\"]*)\"$")
  public function iManuallyAssignTheClaimindividuallyToGroupAndUser(groupName : String, userDisplayName : String) {
    _contextFactory.getClaimContext().assignClaimIndividuallyToGroupAndUser(groupName, userDisplayName)
  }

  @When("^I manually assign the \"([^\"]*)\" exposure to group \"([^\"]*)\" and user \"([^\"]*)\"$")
  public function iManuallyAssignTheExposureToGroupAndUser(coverageTypeText : String, groupName : String, userDisplayName : String) {
    _contextFactory.getClaimContext().assignExposureIndividuallyToGroupAndUser(coverageTypeText, groupName, userDisplayName)
  }

  @When("^I reassign the claim through automated assignment$")
  public function iReAssignTheClaimThroughAutomatedAssignment() {
    _contextFactory.getAssignmentContext().reassignClaimThroughAutomatedAssignment()
  }

  @When("^I reassign the exposure through automated assignment$")
  public function iReAssignTheExposureThroughAutomatedAssignment() {
    _contextFactory.getAssignmentContext().reassignExposureThroughAutomatedAssignment()
  }

  @When("^I manually reassign the claim to group \"([^\"]*)\" and user \"([^\"]*)\"$")
  public function iManuallyReAssignTheClaimToGroupAndUser(groupName : String, userDisplayName : String) {
    _contextFactory.getAssignmentContext().reassignClaimToGroupAndUser(groupName, userDisplayName)
  }

  @When("^I manually reassign the exposure to group \"([^\"]*)\" and user \"([^\"]*)\"$")
  public function iManuallyReAssignTheExposureToGroupAndUser(groupName : String, userDisplayName : String) {
    _contextFactory.getAssignmentContext().reassignExposureToGroupAndUser(groupName, userDisplayName)
  }

  @When("^I manually reassign the activity to group \"([^\"]*)\" and user \"([^\"]*)\"$")
  public function iManuallyReAssignTheActivityToGroupAndUser(groupName : String, userDisplayName : String) {
    _contextFactory.getAssignmentContext().reassignActivityToGroupAndUser(groupName, userDisplayName)
  }

  @Then("^the claim should be assigned to a user in \"([^\"]*)\" group$")
  public function theClaimShouldBeAssignedToAUserInGroup(groupName : String) {
    _contextFactory.getAssignmentContext().verifyClaimAssignedToUserInGroup(groupName)
  }

  @Then("^the claim should be assigned to group \"([^\"]*)\"$")
  public function theClaimShouldBeAssignedToGroup(groupName : String) {
    _contextFactory.getAssignmentContext().verifyClaimAssignedGroup(groupName)
  }

  @Then("^the claim should be assigned to user \"([^\"]*)\"$")
  public function theClaimShouldBeAssignedToUser(userDisplayName : String) {
    _contextFactory.getAssignmentContext().verifyClaimAssignedUser(userDisplayName)
  }

  @Then("^the exposure should be assigned to group \"([^\"]*)\"$")
  public function theExposureShouldBeAssignedToGroup(groupName : String) {
    _contextFactory.getAssignmentContext().verifyExposureAssignedGroup(groupName)
  }

  @Then("^the \"([^\"]*)\" exposure should be assigned to group \"([^\"]*)\"$")
  public function theCoverageTypeExposureShouldBeAssignedToGroup(coverageTypeText : String, groupName : String) {
    _contextFactory.getAssignmentContext().verifyExposureAssignedGroup(groupName, coverageTypeText)
  }

  @Then("^the exposure should be assigned to user \"([^\"]*)\"$")
  public function theExposureShouldBeAssignedToUser(userDisplayName : String) {
    _contextFactory.getAssignmentContext().verifyExposureAssignedUser(userDisplayName)
  }

  @Then("^the \"([^\"]*)\" exposure should be assigned to user \"([^\"]*)\"$")
  public function theCoverageTypeExposureShouldBeAssignedToUser(coverageTypeText : String, userDisplayName : String) {
    _contextFactory.getAssignmentContext().verifyExposureAssignedUser(userDisplayName, coverageTypeText)
  }

  @Then("^the exposure should be assigned to the claim owner$")
  public function theExposureShouldBeAssignedToTheClaimOwner() {
    _contextFactory.getAssignmentContext().verifyExposureAssignedToClaimOwner()
  }

  @Then("^the \"([^\"]*)\" exposure should be assigned to the claim owner$")
  public function theCoverageTypeExposureShouldBeAssignedToTheClaimOwner(coverageTypeText : String) {
    _contextFactory.getAssignmentContext().verifyExposureAssignedToClaimOwner(coverageTypeText)
  }

  @Then("^the activity should be assigned to group \"([^\"]*)\"$")
  public function theActivityShouldBeAssignedToGroup(groupName : String) {
    _contextFactory.getAssignmentContext().verifyActivityAssignedGroup(groupName)
  }

  @Then("^the activity should be assigned to user \"([^\"]*)\"$")
  public function theActivityShouldBeAssignedToUser(userDisplayName : String) {
    _contextFactory.getAssignmentContext().verifyActivityAssignedUser(userDisplayName)
  }
}
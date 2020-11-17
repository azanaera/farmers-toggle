package gw.cucumber.steps.activity

uses com.google.inject.Inject
uses cucumber.api.DataTable
uses cucumber.api.java.en.Given
uses cucumber.api.java.en.When
uses cucumber.api.java.en.Then
uses gw.cucumber.context.api.ContextFactory

@SuppressWarnings("unused")
@Export
class ActivitySteps {

  @Inject
  var _contextFactory : ContextFactory

  @When("^an open activity on the claim$")
  public function anActivityOnTheClaim() {
    _contextFactory.getActivityContext().createOpenActivity()
  }

  @When("^I add activities with following categories and subjects:$")
  public function iAddActivitiesWithFollowingSubjects(table : DataTable) {
    _contextFactory.getActivityContext().addActivitiesWithSubjects(table)
  }

  @When("^I create the following \"([^\"]*)\" Activity:$")
  public function createActivityFromTable(activityPatternSubject : String, table : DataTable) {
    _contextFactory.getActivityContext().createActivity(activityPatternSubject, table)
  }

  @When("^I complete the activity$")
  public function iCompleteTheActivity() {
    _contextFactory.getActivityContext().completeActivity()
  }

  @When("^I complete the \"([^\"]*)\" activity$")
  public function iCompleteTheActivity(subject : String) {
    _contextFactory.getActivityContext().completeActivity(subject)
  }

  @When("^I complete all activities$")
  public function iCompleteAllActivities() {
    _contextFactory.getActivityContext().completeAllOpenActivities()
  }

  @Then("^activities with following subjects should be on the claim:$")
  public function activitiesWithFollowingSubjectsShouldBeOnTheClaim(table : DataTable) {
    _contextFactory.getActivityContext().verifyActivitiesSubjects(table)
  }

  @Then("^the activity status should be \"([^\"]*)\"$")
  public function theActivityStatusShouldBe(activityStatusText : String) {
    _contextFactory.getActivityContext().verifyActivityStatus(activityStatusText)
  }

  @Then("^all activities should be completed$")
  public function allActivitiesShouldBeCompleted() {
    _contextFactory.getActivityContext().verifyAllActivitiesCompleted()
  }

  @Then("^the following activities should be on the claim:$")
  public function activityOnTheClaimFromTable(table : DataTable) {
    _contextFactory.getActivityContext().verifyActivity(table)
  }
}
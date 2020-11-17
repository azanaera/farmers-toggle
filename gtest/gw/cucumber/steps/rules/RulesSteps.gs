package gw.cucumber.steps.rules

uses com.google.inject.Inject
uses cucumber.api.DataTable
uses cucumber.api.java.en.Given
uses cucumber.api.java.en.When
uses cucumber.api.java.en.Then

@SuppressWarnings("unused")
@Export
class RulesSteps {

  @Inject
  var _contextFactory : gw.cucumber.context.api.ContextFactory

  @Given("^a reserve rule named \"([^\"]*)\" is \"([^\"]*)\"$")
  function setupReserveRule(name : String, status : String, table : DataTable) {
    _contextFactory.getRulesContext().createReserveRule(name, status, table)
  }

  @Given("^an exposure rule named \"([^\"]*)\" is \"([^\"]*)\"$")
  function setupExposureRule(name : String, status : String, table : DataTable) {
    _contextFactory.getRulesContext().createExposureRule(name, status, table)
  }

  @When("^I create a new reserve rule named \"([^\"]*)\"$")
  function createNewReserveRule(name : String, data : DataTable) {
    _contextFactory.getRulesContext().createReserveRule(name, null, data)
  }

  @When("^I create a new exposure rule named \"([^\"]*)\"$")
  function createNewExposureRule(name : String, data : DataTable) {
    _contextFactory.getRulesContext().createExposureRule(name, null, data)
  }

  @When("^I promote the reserve rule \"([^\"]*)\" to staged$")
  function stageReserveRuleWithName(name : String) {
    _contextFactory.getRulesContext().stageReserveRuleWithName(name)
  }

  @When("^I promote the exposure rule \"([^\"]*)\" to staged$")
  function stageExposureRuleWithName(name : String) {
    _contextFactory.getRulesContext().stageExposureRuleWithName(name)
  }

  @Then("^the reserve rule \"([^\"]*)\" should be \"([^\"]*)\"$")
  function verifyReserveRuleWithNameHasStatus(name : String, status : String) {
    _contextFactory.getRulesContext().verifyReserveRuleWithNameHasStatus(name, status)
  }

  @Then("^the exposure rule \"([^\"]*)\" should be \"([^\"]*)\"$")
  function verifyExposureRuleWithNameHasStatus(name : String, status : String) {
    _contextFactory.getRulesContext().verifyExposureRuleWithNameHasStatus(name, status)
  }

}
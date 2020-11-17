package gw.cucumber.steps.exposure

uses com.google.inject.Inject
uses cucumber.api.DataTable
uses cucumber.api.java.en.Given
uses cucumber.api.java.en.Then
uses cucumber.api.java.en.When
uses gw.cucumber.context.api.ContextFactory
uses gw.cucumber.context.api.common.ExposureContext

@SuppressWarnings("unused")
@Export
class ExposureSteps {

  @Inject
  var _contextFactory : ContextFactory

  @Given("^the exposure reaches the ability to pay$")
  public function theExposureHasAbilityToPay() {
    _contextFactory.getExposureContext().setValidationLevel(ValidationLevel.TC_PAYMENT)
  }

  @Given("^the exposure is closed$")
  public function theExposureIsClosed() {
    _contextFactory.getExposureContext().closeExposure()
  }

  @Given("^the claim has a \"([^\"]*)\" exposure$")
  public function theClaimHasAExposureForCoverageType(coverageTypeText : String) {
    _contextFactory.getExposureContext().createExposureForCoverageType(coverageTypeText)
  }

  @When("^I add a bodily injury exposure$")
  public function iAddABodilyInjuryExposure() {
    _contextFactory.getClaimContext().addInjuryExposure()
  }

  @When("^I add a collision exposure$")
  public function iAddACollisionExposure() {
    _contextFactory.getClaimContext().addCollisionExposure()
  }

  @Then("^(?:a|an) \"([^\"]*)\" exposure should be created on the claim$")
  public function aExposureShouldBeCreatedOnTheClaim(coverageOrExposureTypeText : String) {
    _contextFactory.getExposureContext().verifyExposure(coverageOrExposureTypeText)
  }

  @Then("^an exposure should be created on the claim$")
  public function anExposureShouldExistOnTheClaim(table : DataTable) {
    _contextFactory.getExposureContext().anExposureShouldExistOnTheClaim(table)
  }

  @Then("^an exposure should not be created on the claim$")
  public function anExposureShouldNotExistOnTheClaim(table : DataTable) {
    _contextFactory.getExposureContext().anExposureShouldNotExistOnTheClaim(table)
  }

}
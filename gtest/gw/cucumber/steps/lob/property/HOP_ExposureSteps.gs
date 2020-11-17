package gw.cucumber.steps.lob.property

uses com.google.inject.Inject
uses cucumber.api.java.en.Then
uses cucumber.api.java.en.When
uses gw.cucumber.context.api.ContextFactory
uses gw.cucumber.context.api.hop.HOPExposureContext

@SuppressWarnings("unused")
@Export
class HOP_ExposureSteps {

  @Inject
  private var _contextFactory : ContextFactory

  @When("^I add a dwelling exposure referencing the incident$")
  public function iAddADwellingExposureReferencingTheIncident() {
    _contextFactory.getExposureContext<HOPExposureContext>().addDwellingExposureReferencingIncident()
  }

  @Then("^the exposure should reference the dwelling incident$")
  public function theExposureShouldReferenceTheDwellingIncident() {
    _contextFactory.getExposureContext<HOPExposureContext>().verifyExposureReferencingDwellingIncident()
  }
}
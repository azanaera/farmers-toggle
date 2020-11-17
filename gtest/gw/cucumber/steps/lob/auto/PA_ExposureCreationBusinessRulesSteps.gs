package gw.cucumber.steps.lob.auto

uses com.google.inject.Inject
uses cucumber.api.java.en.When
uses gw.cucumber.context.api.ContextFactory
uses gw.cucumber.context.api.pa.PAExposureContext

@SuppressWarnings("unused")
@Export
class PA_ExposureCreationBusinessRulesSteps {

  @Inject
  private var _contextFactory : ContextFactory

  @When("^I select an involved vehicle from covered vehicles$")
  public function iSelectAnInvolvedVehicleFromCoveredVehicles() {
    _contextFactory.getExposureContext<PAExposureContext>().selectFirstInvolvedVehicle()
  }
}
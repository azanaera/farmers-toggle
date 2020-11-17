package gw.cucumber.steps.lob.wc

uses com.google.inject.Inject
uses cucumber.api.java.en.Given
uses gw.cucumber.context.api.ContextFactory
uses gw.cucumber.context.api.wc.WCExposureContext

@SuppressWarnings("unused")
@Export
class WC_ExposureSteps {

  @Inject
  private var _contextFactory : ContextFactory

  @Given("^the claim has a Medical Details exposure$")
  public function theClaimHasAMedicalDetailsExposure() {
    _contextFactory.getExposureContext<WCExposureContext>().createMedicalDetailsExposure()
  }

  @Given("^the only exposure on claim is for Medical Details$")
  public function theOnlyExposureOnClaimIsForMedicalDetails() {
    _contextFactory.getExposureContext<WCExposureContext>().createOnlyMedicalDetailsExposure()
  }

}
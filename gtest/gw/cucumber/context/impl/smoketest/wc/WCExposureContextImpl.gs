package gw.cucumber.context.impl.smoketest.wc

uses com.google.inject.Inject
uses gw.api.databuilder.ExposureBuilder
uses gw.cucumber.context.api.wc.WCExposureContext
uses gw.cucumber.context.impl.smoketest.common.ExposureContextImpl
uses gw.cucumber.testdata.DataWrapper
uses org.fest.assertions.Condition

@SuppressWarnings("unused")
class WCExposureContextImpl extends ExposureContextImpl implements WCExposureContext {

  @Inject
  var _claimWrapper : DataWrapper<Claim>

  @Inject
  var _exposureWrapper : DataWrapper<Exposure>

  override function createMedicalDetailsExposure() {
    var claim = _claimWrapper.get()
    if (!claim.Exposures.hasMatch(\exposure -> exposure.ExposureType == ExposureType.TC_WCINJURYDAMAGE)) {
      gw.transaction.Transaction.runWithNewBundle(\bundle -> {
        new ExposureBuilder()
            .uiReadyMedicalDetails()
            .onClaim(_claimWrapper.get())
            .create(bundle)
      }, CurrentUser)
    }
    _exposureWrapper.set(claim.Exposures.singleWhere(\exposure -> exposure.ExposureType == ExposureType.TC_WCINJURYDAMAGE))
  }

  override function createOnlyMedicalDetailsExposure() {
    var claim = _claimWrapper.get()
    assertThat(claim.Exposures).as("Expected no non-medical details exposures").doesNotSatisfy(new Condition<Exposure[]>() {
      override function matches(exposures : Exposure[]) : boolean {
        return exposures.hasMatch(\exposure -> exposure.ExposureType  != ExposureType.TC_WCINJURYDAMAGE)
      }
    })

    createMedicalDetailsExposure()
  }

}

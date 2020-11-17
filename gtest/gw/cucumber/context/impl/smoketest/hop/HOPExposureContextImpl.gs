package gw.cucumber.context.impl.smoketest.hop

uses com.google.inject.Inject
uses gw.cucumber.context.api.hop.HOPExposureContext
uses gw.cucumber.context.impl.smoketest.common.ExposureContextImpl
uses gw.cucumber.testdata.DataWrapper
uses gw.cucumber.context.impl.smoketest.util.Navigation
uses gw.cucumber.util.common.UIHelper
uses pcftest.ClaimExposures
uses pcftest.ClaimSummary

@SuppressWarnings("unused")
class HOPExposureContextImpl extends ExposureContextImpl implements HOPExposureContext {

  @Inject
  var _claimWrapper : DataWrapper<Claim>

  @Inject
  var _incidentWrapper : DataWrapper<Incident>

  @Inject
  var _exposureWrapper : DataWrapper<Exposure>

  override function addDwellingExposureReferencingIncident() {
    var claimSummary = new Navigation<ClaimSummary>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()), CurrentUser)
    var newExposure = claimSummary.goToNewExposureByCoverageSubtype(CoverageSubtype.TC_HOPCOVA)
    newExposure.NewExposureScreen.NewExposureDV_Dwelling.NewClaimPropertyDamageDV.Claimant_Picker.selectFirstValidOption()
    newExposure.NewExposureScreen.NewExposureDV_Dwelling.NewClaimPropertyDamageDV.Claimant_Type.selectFirstValidOption()
    newExposure.NewExposureScreen.NewExposureDV_Dwelling.NewClaimPropertyDamageDV.NewClaimIncidentInputSet_Dwelling
        .Dwelling_Incident.getOptionByLabel(_incidentWrapper.get().DisplayName).click()
    var claimExposures = newExposure.update()
    UIHelper.assertNoMessages(claimExposures)
  }

  override function verifyExposureReferencingDwellingIncident() {
    var claim = _claimWrapper.get()
    var exposure = _exposureWrapper.get() ?: claim.Exposures.single()
    var claimExposures = new Navigation<ClaimExposures>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(claim).goToExposures(), CurrentUser)
    var exposureDetail = claimExposures.ClaimExposuresScreen.ExposuresLV._Entries.singleWhere(\e -> e.Order.Text == exposure.ClaimOrder.toString()).Order.click()
    assertThat(exposureDetail.ExposureDetailScreen.ExposureDetailDV_Dwelling.PropertyDamageDV.PropertyIncidentInputSet_Dwelling.Dwelling_Incident.Text)
        .isEqualTo(_incidentWrapper.get().DisplayName)
  }
}
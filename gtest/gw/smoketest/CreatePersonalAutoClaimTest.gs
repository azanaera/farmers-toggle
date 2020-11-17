package gw.smoketest

uses gw.api.test.CCSmokeTestClassBase
uses gw.api.util.DateUtil
uses gw.pl.logging.LoggerCategory
uses gw.plugin.policy.impl.PolicySearchPluginDemoImpl
uses gw.plugin.policy.search.IPolicySearchAdapter
uses gw.sampledata.SampleDataGroup
uses gw.suites.CCExampleSmokeSuite
uses gw.testharness.v3.Suites
uses pcftest.NewClaimSaved

@Export
@Suites(CCExampleSmokeSuite.NAME)
class CreatePersonalAutoClaimTest extends CCSmokeTestClassBase {

  override function beforeClass() {
    try {
      gw.transaction.Transaction.runWithNewBundle(\ bundle -> {
        SampleDataGroup.Test.load()
      }, "su")
    } catch (e) {
      // Ignoring sample data import exceptions
    }
  }

  function testCreatePersonalAutoClaim() {
    registerPlugin(IPolicySearchAdapter, new PolicySearchPluginDemoImpl())
    loginDefaultUser()
    var wizard = TabBar.goToNewClaim()
    wizard.SelectPolicy.findPolicy("54-123456", DateUtil.currentDate())
    wizard.next()

    wizard.BasicInfoAUTO.setReportedByToInsured()

    wizard.BasicInfoAUTO.RightColumnAUTO.toggleVehicleCheckboxByIndex(0)
    wizard.nextIgnoringClaimDuplicates()

    wizard.LossDetailsAUTO.setRequiredFields()

    var claimSaved = (wizard.finish() as NewClaimSaved)
    LoggerCategory.TEST.info("Created Personal Auto Claim: ${claimSaved.ClaimNumber}")

    var claim = claimSaved.ClaimEntity
    assertThat(claim.getContactByRole(ContactRole.TC_REPORTER))
        .as("The reporter should be the insured.")
        .isEqualTo(claim.Insured)
    assertThat(claim.VehicleIncidentsOnly).hasSize(1)
    var vehicle = claim.VehicleIncidentsOnly.single().Vehicle
    var involvedVehicle = claim.Vehicles.sort(\ v, v2 -> v.DisplayName < v2.DisplayName).first()
    assertThat(involvedVehicle).isEqualTo(vehicle)
  }

}

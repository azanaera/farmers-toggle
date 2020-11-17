package gw.cucumber.steps.lob.auto

uses com.google.inject.Inject
uses cucumber.api.DataTable
uses cucumber.api.java.en.Given
uses cucumber.api.java.en.When
uses cucumber.api.java.en.Then
uses gw.cucumber.context.api.ContextFactory
uses gw.cucumber.context.api.pa.PAExposureContext

@SuppressWarnings("unused")
@Export
class PA_ExposureSteps {

  @Inject
  private var _contextFactory : ContextFactory

  @Given("^an \"([^\"]*)\" collision exposure$")
  public function anExposureOnTheClaim(exposureStateText : String) {
    _contextFactory.getExposureContext<PAExposureContext>().createCollisionExposureWithState(exposureStateText)
  }

  @Given("the policy on the claim has the following covered vehicles")
  public function thePolicyOnClaimHasTheFollowingCoveredVehicles(table : DataTable) {
    _contextFactory.getExposureContext<PAExposureContext>().createCoveredVehicles(table)
  }

  @Given("the policy on the claim has a covered vehicle")
  public function thePolicyHasACoveredVehicles() {
    _contextFactory.getExposureContext<PAExposureContext>().createCoveredVehicle()
  }

  @Given("the policy on the claim has the following covered parties")
  public function thePolicyOnClaimHasTheFollowingCoveredParties(table : DataTable) {
    _contextFactory.getExposureContext<PAExposureContext>().createCoveredParties(table)
  }

  @Given("a collision exposure for vehicle \"([^\"]*)\"")
  public function aVehicleExposureWithVehicle(vehicleText : String) {
    _contextFactory.getExposureContext<PAExposureContext>().createCollisionExposureWithVehicle(vehicleText)
  }

  @Given("^a third party is the claimant for that exposure$")
  public function exposureHasThirdPartyClaimant() {
    _contextFactory.getExposureContext<PAExposureContext>().chooseThirdPartyClaimantForExposure()
  }

  @Given("^the claim has a first party vehicle exposure$")
  public function theClaimHasAFirstPartyVehicleExposure() {
    _contextFactory.getExposureContext<PAExposureContext>().addFirstPartyComprehensiveExposure()
  }

  @Given("^a property is listed on the claim$")
  public function createPropertyOnClaim(table : DataTable) {
    _contextFactory.getExposureContext<PAExposureContext>().createPropertyOnClaim(table)
  }

  @When("^the vehicle incident is indicated as a total loss$")
  public function theVehicleIncidentIsIndicatedAsTotalLoss() {
    _contextFactory.getExposureContext<PAExposureContext>().theVehicleIncidentIsIndicatedAsTotalLoss()
  }

  @When("^I add a collision exposure by coverage$")
  public function iAddAVehicleExposureByCoverage() {
    _contextFactory.getExposureContext<PAExposureContext>().addCollisionExposureByCoverage()
  }

  @When("^I choose the insured to be the claimant for the vehicle exposure$")
  public function iChooseInsuredClaimant() {
    _contextFactory.getExposureContext<PAExposureContext>().chooseInsuredClaimantForExposure()
  }

  @When("^I choose a third party to be the claimant for the vehicle exposure$")
  public function iChooseAThirdPartyClaimant() {
    _contextFactory.getExposureContext<PAExposureContext>().chooseThirdPartyClaimantForExposure()
  }

  @When("^I change involved vehicle for the incident to \"([^\"]*)\"$")
  public function iChangeInvolvedVehicle(vehicleName : String) {
    _contextFactory.getExposureContext<PAExposureContext>().changeInvolvedVehicleTo(vehicleName)
  }

  @When("^I change driver of the involved vehicle to \"([^\"]*)\"$")
  public function iChangeDriver(driverName : String) {
    _contextFactory.getExposureContext<PAExposureContext>().changeDriverForInvolvedVehicleTo(driverName)
  }

  @When("^I add a driver to the covered vehicle$")
  public function iAddADriverToTheInvolvedVehicle() {
    _contextFactory.getExposureContext<PAExposureContext>().addDriverToInvolvedVehicle()
  }

  @When("^I add a passenger to the covered vehicle$")
  public function iAddAPassengerToTheInvolvedVehicle() {
    _contextFactory.getExposureContext<PAExposureContext>().addPassengerToInvolvedVehicle()
  }

  @When("^I add a damage description to the covered vehicle$")
  public function iAddADamageDescriptionToTheInvolvedVehicle() {
    _contextFactory.getExposureContext<PAExposureContext>().addDamageDescriptionToInvolvedVehicle()
  }

  @When("^I record property damage information$")
  public function iRecordPropertyDamage() {
    _contextFactory.getExposureContext<PAExposureContext>().addPropertyDamage()
  }

  @When("^I add a vehicle incident$")
  public function iAddAVehicleIncident(table : DataTable) {
    _contextFactory.getExposureContext<PAExposureContext>().createVehicleIncident(table)
  }

  @When("^I add a new property to the claim$")
  public function iAddAPropertyIncident(table : DataTable) {
    _contextFactory.getExposureContext<PAExposureContext>().createPropertyOnClaim(table)
  }

  @Then("^the claim should have \"([^\"]*)\" vehicle incident(?:s|)$")
  public function aVehicleIncidentShouldBeCreatedOnTheClaim(number : String) {
    _contextFactory.getExposureContext<PAExposureContext>().verifyClaimHasVehicleIncidentAmount(number)
  }

  @When("^I update the loss details on the claim$")
  public function updateLossDetails(table : DataTable) {
    _contextFactory.getExposureContext<PAExposureContext>().updateLossDetails(table)
  }

  @When("^I update the notification details on the claim$")
  public function updateNotificationDetails(table : DataTable) {
    _contextFactory.getExposureContext<PAExposureContext>().updateNotificationDetails(table)
  }

  @When("^I add a new witness to the claim$")
  public function addWitnessToClaim(table : DataTable) {
    _contextFactory.getExposureContext<PAExposureContext>().addWitnessToClaim(table)
  }

  @When("^I add contributing factors to the claim$")
  public function addContributingFactors(table : DataTable) {
    _contextFactory.getExposureContext<PAExposureContext>().addContributingFactors(table)
  }

  @When("^I add a new vehicle to the claim$")
  public function addNewVehicleToClaim(table : DataTable) {
    _contextFactory.getExposureContext<PAExposureContext>().addNewVehicleToClaim(table)
  }

  @When("^I add a new injury incident$")
  public function addNewInjuryIncident(table : DataTable) {
    _contextFactory.getExposureContext<PAExposureContext>().addNewInjuryIncident(table)
  }

  @When("^I add a new bodily injury exposure$")
  public function addNewBodilyInjuryExposure(table : DataTable) {
    _contextFactory.getExposureContext<PAExposureContext>().addNewBodilyInjuryExposure(table)
  }

  @When("^I add a medical payments exposure$")
  public function addNewMedPayExposure(table : DataTable) {
    _contextFactory.getExposureContext<PAExposureContext>().addNewMedPayExposure(table)
  }

  @When("^I add a PIP exposure$")
  public function addPipExposure(table : DataTable) {
    _contextFactory.getExposureContext<PAExposureContext>().addPipExposure(table)
  }

  @When("^I add a property damage exposure$")
  public function addPropertyDamageExposure(table : DataTable) {
    _contextFactory.getExposureContext<PAExposureContext>().addPropertyDamageExposure(table)
  }

  @When("^I add a towing and labor exposure$")
  public function addTowingAndLaborExposure(table : DataTable) {
    _contextFactory.getExposureContext<PAExposureContext>().addTowingAndLaborExposure(table)
  }

  @When("^I indicate that a vehicle is a total loss$")
  public function iSetVehicleIncidentAsTotalLoss() {
    _contextFactory.getExposureContext<PAExposureContext>().iSetVehicleIncidentAsTotalLoss()
  }

  @Then("^a towing and labor exposure should be created on the claim$")
  public function verifyTowingAndLaborExposure(table : DataTable) {
    _contextFactory.getExposureContext<PAExposureContext>().verifyTowingAndLaborExposure(table)
  }

  @Then("^a property damage exposure should be created on the claim$")
  public function verifyPropertyDamageExposureOnClaim(table : DataTable) {
    _contextFactory.getExposureContext<PAExposureContext>().verifyPropertyDamageExposureOnClaim(table)
  }

  @Then("a bodily injury exposure should be created on the claim")
  public function verifyBodilyInjuryExposureOnClaim(table : DataTable) {
    _contextFactory.getExposureContext<PAExposureContext>().verifyBodilyInjuryExposureOnClaim(table)
  }

  @Then("^a medical payments exposure should be created on the claim$")
  public function verifyMedPayExposureOnClaim(table : DataTable) {
    _contextFactory.getExposureContext<PAExposureContext>().verifyMedPayExposureOnClaim(table)
  }

  @Then("^a PIP exposure should be created on the claim$")
  public function verifyPipExposure(table : DataTable) {
    _contextFactory.getExposureContext<PAExposureContext>().verifyPipExposure(table)
  }

  @Then("^the property should be listed on the claim$")
  public function verifyPropertyExistsOnClaim(table : DataTable) {
    _contextFactory.getExposureContext<PAExposureContext>().verifyPropertyExistsOnClaim(table)
  }

  @Then("^the injury incident should be listed on the claim$")
  public function verifyInjuryIncidentOnClaim(table : DataTable) {
    _contextFactory.getExposureContext<PAExposureContext>().verifyInjuryIncidentOnClaim(table)
  }

  @Then("^the vehicle should be listed on the claim$")
  public function verifyVehicleExistsOnClaim(table : DataTable) {
    _contextFactory.getExposureContext<PAExposureContext>().verifyVehicleExistsOnClaim(table)
  }

  @Then("^the metropolitan report should be listed on the claim$")
  public function verifyMetropolitanReport(table : DataTable) {
    _contextFactory.getExposureContext<PAExposureContext>().verifyMetropolitanReport(table)
  }

  @Then("^the contributing factors should be listed on the claim$")
  public function verifyContributingFactors(table : DataTable) {
    _contextFactory.getExposureContext<PAExposureContext>().verifyContributingFactors(table)
  }

  @Then("^the witness should be listed on the claim$")
  public function verifyWitnessOnClaim(table : DataTable) {
    _contextFactory.getExposureContext<PAExposureContext>().verifyWitnessOnClaim(table)
  }

  @Then("^the loss details should be listed on the claim$")
  public function verifyLossDetailsMatch(table : DataTable) {
    _contextFactory.getExposureContext<PAExposureContext>().verifyLossDetailsMatch(table)
  }

  @Then("^the notification details should be listed on the claim$")
  public function verifyNotificationDetails(table : DataTable) {
    _contextFactory.getExposureContext<PAExposureContext>().verifyNotificationDetails(table)
  }

  @Then("^a vehicle incident should be created on the claim$")
  public function verifyVehicleIncident(table : DataTable) {
    _contextFactory.getExposureContext<PAExposureContext>().verifyVehicleIncident(table)
  }

  @Then("^additional Salvage information can be captured for a total loss$")
  public function aVehicleSalvageShouldBecomeAvailableForEditing() {
    _contextFactory.getExposureContext<PAExposureContext>().aVehicleSalvageShouldBecomeAvailableForEditing()
  }

  @Then("^the property incident should be listed on the claim$")
  public function aPropertyIncidentShouldBeCreatedOnTheClaim(table : DataTable) {
    _contextFactory.getExposureContext<PAExposureContext>().verifyPropertyExistsOnClaim(table)
  }

  @Then("^the exposure should reference the vehicle incident$")
  public function theExposureShouldReferenceTheVehicleIncident() {
    _contextFactory.getExposureContext<PAExposureContext>().verifyExposureReferenceVehicleIncident()
  }

  @Then("^the vehicle exposure's claimant should be the insured$")
  public function theExposureShouldReferenceTheClaimant() {
    _contextFactory.getExposureContext<PAExposureContext>().verifyExposureClaimantIsInsured()
  }

  @Then("^the involved vehicle on the incident should be \"([^\"]*)\"$")
  public function involvedVehicleShouldBe(vehicleName : String) {
    _contextFactory.getExposureContext<PAExposureContext>().verifyInvolvedVehicleIs(vehicleName)
  }

  @Then("^the driver of the involved vehicle should be \"([^\"]*)\"$")
  public function driverShouldBe(driverName : String) {
    _contextFactory.getExposureContext<PAExposureContext>().verifyInvolvedVehicleDriverIs(driverName)
  }

  @Then("^a driver should be listed on the covered vehicle$")
  public function aDriverShouldBeListedOnInvolvedVehicle() {
    _contextFactory.getExposureContext<PAExposureContext>().verifyVehicleHasDriver()
  }

  @Then("^a passenger should be listed on the covered vehicle$")
  public function aPassengerShouldBeListedOnInvolvedVehicle() {
    _contextFactory.getExposureContext<PAExposureContext>().verifyVehicleHasPassenger()
  }

  @Then("^a damage description should be listed on the covered vehicle$")
  public function aDamageDescriptionShouldBeListedOnInvolvedVehicle() {
    _contextFactory.getExposureContext<PAExposureContext>().verifyVehicleHasDamageDescription()
  }

  @Then("^property damage should be listed on the claim$")
  public function aPropertyDamageDescriptionShouldBeListedInTheClaim() {
    _contextFactory.getExposureContext<PAExposureContext>().verifyClaimHasFixedPropertyDamage()
  }

  @When("^the vehicle recovery date should be today$")
  public function theVehicleRecoveryDateShouldBeUpdated() {
    _contextFactory.getExposureContext<PAExposureContext>().theVehicleRecoveryDateShouldBeUpdated()
  }
}
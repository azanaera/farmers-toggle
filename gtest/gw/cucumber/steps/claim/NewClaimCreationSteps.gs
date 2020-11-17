package gw.cucumber.steps.claim

uses com.google.inject.Inject
uses cucumber.api.DataTable
uses cucumber.api.java.en.Given
uses cucumber.api.java.en.When
uses cucumber.api.java.en.Then
uses gw.cucumber.context.api.ContextFactory
uses gw.cucumber.setup.PolicyDataSet
uses gw.cucumber.testdata.DataWrapper

@SuppressWarnings("unused")
@Export
class NewClaimCreationSteps {

  @Inject
  private var _contextFactory : ContextFactory

  @Inject
  private var _policyDataSetWrapper : DataWrapper<PolicyDataSet>

  @Given("^the claim loss cause is \"([^\"]*)\"$")
  public function setClaimLossCause(lossCause : String) {
    _contextFactory.getClaimContext().setClaimLossCause(lossCause)
  }

  @Given("^the policy on the claim has the following scheduled items$")
  public function setScheduledItems(table : DataTable) {
    _contextFactory.getClaimContext().setScheduledItems(table)
  }

  @Given("^I have the following search data:$")
  public function setSearchData(table : DataTable) {
    _contextFactory.getClaimContext().setSearchCriteria(table)
  }

  @When("^I start filing a claim$")
  public function iStartFilingAClaim() {
    _contextFactory.getClaimContext().startFilingClaim()
  }

  @When("^I set claim loss cause to \"([^\"]*)\"$")
  public function iSetClaimLossCauseTo(lossCauseText : String) {
    _contextFactory.getClaimContext().setLossCause(lossCauseText)
  }

  @When("^I add (?:an|a) \"([^\"]*)\" injury incident$")
  public function iAddAnInjuryIncident(lossPartyTypeText : String) {
    _contextFactory.getClaimContext().createInjuryIncident(lossPartyTypeText)
  }

  @When("^I set the Loss Date to \"([^\"]*)\"$")
  public function iSetTheLossDate(lossDateText : String) {
    _contextFactory.getClaimContext().setLossDate(lossDateText)
  }

  @When("^I set the fault rating to \"([^\"]*)\"$")
  public function iSetAFaultRating(faultRating : String) {
    _contextFactory.getClaimContext().setFaultRating(faultRating)
  }

  @When("^I add a property damage liability$")
  public function iAddAPropertyDamageLiability(table : DataTable) {
    _contextFactory.getClaimContext().addAPropertyDamageLiability(table)
  }

  @When("^the claim was reported by the Insured$")
  public function claimReportedByInsured() {
    _contextFactory.getClaimContext().reportedByInsured()
  }

  @When("^the claim was reported by a Third Party$")
  public function claimReportedByThirdParty() {
    _contextFactory.getClaimContext().reportedByThirdParty()
  }

  @When("^I add a note$")
  public function iAddANote() {
    _contextFactory.getClaimContext().addNote()
  }

  @When("^I finish filing the claim$")
  public function iFinishFilingTheClaim() {
    _contextFactory.getClaimContext().finishFilingClaim()
  }

  @When("^I file a new claim with no exposure$")
  public function iCreateAClaimWithNoExposure() {
    _contextFactory.getClaimContext().createClaimWithNoExposure()
  }

  @When("^I file a new claim with the following exposure:$")
  public function iCreateAClaimWithAnExposure(table : DataTable) {
    _contextFactory.getClaimContext().iCreateAClaimWithAnExposure(table)
  }

  @When("^I add a witness report$")
  public function iAddAWitnessReport(table : DataTable) {
    _contextFactory.getClaimContext().addAWitness(table)
  }

// This functionality has been disabled as part of Toggle R1
//  @When("^I add a report from (?:a|an) \"([^\"]*)\" official$")
//  public function iAddAnOfficialReport(officialType : String, table : DataTable) {
//    _contextFactory.getClaimContext().addAnOfficial(officialType, table)
//  }

  @Given("^the claim has an injury incident$")
  public function claimHasInjuryIncident(table : DataTable) {
    _contextFactory.getClaimContext().claimHasInjuryIncident(table)
  }

// This functionality has been disabled as part of Toggle R1
//  @When("^I add a police report$")
//  public function iAddAPoliceReport(table : DataTable) {
//    _contextFactory.getClaimContext().addAPoliceReport(table)
//  }

  @When("^I file a new claim with a mid complexity exposure$")
  public function iCreateAClaimWithMidComplexityExposure() {
    _contextFactory.getClaimContext().createAClaimWithMidComplexityExposure()
  }

  @Then("^the Loss Date should be \"([^\"]*)\"$")
  public function verifyLossDate(val : String) {
    _contextFactory.getClaimContext().verifyLossDate(val)
  }

  @When("^I search for a known policy by policy number$")
  public function iSearchForAPolicyByPolicyNumber() {
    _contextFactory.getClaimContext().searchForAPolicyByPolicyNumber()
  }

  @When("^I search for a policy$")
  public function iSearchForPoliciesByCriteria() {
    _contextFactory.getClaimContext().searchForPoliciesByCriteria()
  }

  @Then("^a \"([^\"]*)\" claim should be created$")
  public function aNewClaimShouldBeCreated(policyTypeText : String) {
    _contextFactory.getClaimContext().verifyClaimIsCreated(policyTypeText)
  }

  @Then("claims should be assigned to users within the \"([^\"]*)\" group via round-robin$")
  public function assignClaimToUsersViaRoundRobin(groupName : String) {
    _contextFactory.getClaimContext().verifyClaimsIsAssignedToUsersViaRoundRobin(groupName)
  }

  @Then("^the claim loss cause should be \"([^\"]*)\"$")
  public function theClaimLossCauseShouldBe(lossCauseText : String) {
    _contextFactory.getClaimContext().verifyClaimLossCause(lossCauseText)
  }

  @Then("^the claim should have a loss location in the state of \"([^\"]*)\"$")
  public function theClaimLossLocationStateShouldBe(lossState : String) {
    _contextFactory.getClaimContext().verifyClaimLossLocationInState(lossState)
  }

  @Then("^the policy on the claim should be unverified$")
  public function thePolicyOnTheClaimShouldBeUnverified() {
    _contextFactory.getClaimContext().verifyPolicyIsUnverified()
  }

  @Then("^an injury incident should be created on the claim$")
  public function anInjuryIncidentShouldBeCreatedOnTheClaim() {
    _contextFactory.getClaimContext().verifyInjuryIncidentExists()
  }

  @Then("^the injury incident should be created on the claim$")
  public function verifyInjuryIncidentOnClaimMatchesTable(table : DataTable) {
    _contextFactory.getClaimContext().verifyInjuryIncidentMatchesTable(table)
  }

  @Then("^the injury loss party type should be \"([^\"]*)\"$")
  public function theInjuryLossPartyTypeShouldBe(lossPartyTypeText : String) {
    _contextFactory.getClaimContext().verifyInjuryIncidentLossPartyType(lossPartyTypeText)
  }

  @Then("^the claim segment should be \"([^\"]*)\"$")
  public function verifyClaimSegment(claimSegmentText : String) {
    _contextFactory.getClaimContext().verifyClaimSegment(claimSegmentText)
  }

  @Then("^the exposure segment should be \"([^\"]*)\"$")
  public function verifyExposureSegment(exposureSegmentText : String) {
    _contextFactory.getExposureContext().verifyExposureSegment(exposureSegmentText)
  }

  @Then("^the claim should have a witness report$")
  public function theClaimShouldHaveAWitnessReport(table : DataTable) {
    _contextFactory.getClaimContext().verifyClaimHasAWitnessReport(table)
  }

  @Then("^the claim should have a police report$")
  public function theClaimShouldHaveAPoliceReport(table : DataTable) {
    _contextFactory.getClaimContext().verifyClaimHasAPoliceReport(table)
  }

  @Then("^the claim should have a report from a \"([^\"]*)\" official$")
  public function theClaimShouldHaveAPoliceReport(officialType : String, table : DataTable) {
    _contextFactory.getClaimContext().verifyClaimHasAOfficialReportWithType(officialType, table)
  }

  @Then("^the fault rating should be \"([^\"]*)\"$")
  public function theClaimShouldHaveAFaultRating(reportType : String) {
    _contextFactory.getClaimContext().verifyClaimHasFaultRating(reportType)
  }

  @Then("^a bodily injury incident should be created on the claim$")
  public function aBodilyInjuryIncidentShouldBeCreatedOnTheClaim() {
    _contextFactory.getClaimContext().verifyInjuryIncidentCreated()
  }

  @Then("^I can lodge a claim against that policy$")
  public function policiesAreFoundWithPolicyNumber() {
    _contextFactory.getClaimContext().verifyPoliciesMatchAGivenPolicyNumber()
  }

  @Then("^I have a list of policies matching the search criteria$")
  public function policiesFoundMatchTheCriteria() {
    _contextFactory.getClaimContext().policiesFoundMatchTheCriteria()
  }

  @Then("^the claim loss location should be in state \"([^\"]*)\"$")
  public function verifyLossLocationInState(state : String) {
    _contextFactory.getClaimContext().verifyLossLocationInState(state)
  }
}
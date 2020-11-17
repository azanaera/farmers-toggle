package gw.cucumber.steps.lob.property

uses com.google.inject.Inject
uses cucumber.api.DataTable
uses cucumber.api.java.en.Given
uses cucumber.api.java.en.Then
uses cucumber.api.java.en.When
uses gw.cucumber.context.api.ContextFactory
uses gw.cucumber.context.api.hop.HOPClaimContext
uses gw.cucumber.setup.ClaimMode
uses gw.cucumber.setup.PolicyDataSet
uses gw.cucumber.testdata.DataWrapper

@SuppressWarnings("unused")
@Export
class HOP_NewClaimCreationSteps {
  @Inject
  private var _contextFactory : ContextFactory

  @Inject
  private var _policyDataSetWrapper : DataWrapper<PolicyDataSet>

  @Given("^a Homeowners policy$")
  public function aHOPPolicy() {
    if (_policyDataSetWrapper.get() == null) {
      _policyDataSetWrapper.set(new PolicyDataSet(PolicyType.TC_HOPHOMEOWNERS, ClaimMode.HOPHomeowners))
    } else {
      _policyDataSetWrapper.get().ClaimMode = ClaimMode.HOPHomeowners
    }
    _contextFactory.getClaimContext().createPolicyDataSet()
  }

  @Given("^a Homeowners claim$")
  public function aHOPClaim() {
    if (_policyDataSetWrapper.get() == null) {
      _policyDataSetWrapper.set(new PolicyDataSet(PolicyType.TC_HOPHOMEOWNERS, ClaimMode.HOPHomeowners))
    } else {
      _policyDataSetWrapper.get().ClaimMode = ClaimMode.HOPHomeowners
    }
    _contextFactory.getClaimContext().createClaim()
  }

  @Given("^the claim has a dwelling incident$")
  public function theClaimHasADwellingIncident() {
    _contextFactory.getClaimContext<HOPClaimContext>().createDwellingIncident()
  }

  @Given("^the claim has a dwelling incident for a fire in living room after a candle fell$")
  public function theClaimHasADwellingIncidentForLivingRoomFire() {
    _contextFactory.getClaimContext<HOPClaimContext>().createDwellingIncidentForLivingRoomFireAfterACandleFell()
  }

  @When("^I create an unverified Homeowners policy$")
  public function iCreateAnUnverifiedPolicy() {
    if (_policyDataSetWrapper.get() == null) {
      _policyDataSetWrapper.set(new PolicyDataSet(PolicyType.TC_HOPHOMEOWNERS, ClaimMode.HOPHomeowners))
    } else {
      _policyDataSetWrapper.get().ClaimMode = ClaimMode.HOPHomeowners
    }
    _contextFactory.getClaimContext().createUnverifiedPolicy()
  }

  @When("^I add a dwelling incident$")
  public function iAddADwellingIncident(table : DataTable) {
    _contextFactory.getClaimContext<HOPClaimContext>().addDwellingIncident(table)
  }

  @When("^I add a personal property incident$")
  public function iAddPersonalPropertyIncident(table : DataTable) {
    _contextFactory.getClaimContext<HOPClaimContext>().addPersonalPropertyIncident(table)
  }

  @When("^I add a living expenses incident$")
  public function iAddLivingExpensesIncident(table : DataTable) {
    _contextFactory.getClaimContext<HOPClaimContext>().addLivingExpensesIncident(table)
  }

  @When("^I set the damage type to \"([^\"]*)\"$")
  public function setDamageTypeTo(type : String) {
    _contextFactory.getClaimContext<HOPClaimContext>().setDamageTypeTo(type)
  }

  @When("^I answer the fire questions$")
  public function answerFireQuestions(table : DataTable) {
    _contextFactory.getClaimContext<HOPClaimContext>().answerFireQuestions(table)
  }

  @When("^I answer the water questions$")
  public function answerWaterQuestions(table : DataTable) {
    _contextFactory.getClaimContext<HOPClaimContext>().answerWaterQuestions(table)
  }

  @Then("^the water questions should be answered on the claim$")
  public function verifyWaterQuestionsOnClaim(table : DataTable) {
    _contextFactory.getClaimContext<HOPClaimContext>().verifyWaterQuestionsOnClaim(table)
  }

  @Then("^the fire questions should be answered on the claim$")
  public function verifyFireQuestionsOnClaim(table : DataTable) {
    _contextFactory.getClaimContext<HOPClaimContext>().verifyFireQuestionsOnClaim(table)
  }

  @Then("^a property damage liability should be created on the claim$")
  public function verifyPropertyDamageLiability(table : DataTable) {
    _contextFactory.getClaimContext<HOPClaimContext>().verifyPropertyDamageLiability(table)
  }

  @Then("^the following personal property incident should be created on the claim$")
  public function verifyPersonalPropertyIncidentOnClaim(table : DataTable) {
    _contextFactory.getClaimContext<HOPClaimContext>().verifyASpecificPersonalPropertyIncidentOnClaim(table)
  }

  @Then("the following living expenses incident should be created on the claim$")
  public function verifyLivingExpensesOnClaim(table : DataTable) {
    _contextFactory.getClaimContext<HOPClaimContext>().verifyLivingExpensesOnClaim(table)
  }

  @Then("^a Living Expenses incident should be created on the claim$")
  public function aLivingExpensesIncidentShouldBeCreatedOnTheClaim() {
    _contextFactory.getClaimContext<HOPClaimContext>().verifyLivingExpensesIncidentExists()
  }

  @Then("^a personal property incident should be created on the claim$")
  public function verifyPersonalPropertyIncidentShouldBeCreatedOnTheClaim() {
    _contextFactory.getClaimContext<HOPClaimContext>().verifyAPersonalPropertyIncidentExists()
  }

  @When("^I add new dwelling incident to the claim$")
  public function iAddADwellingIncident() {
    _contextFactory.getClaimContext<HOPClaimContext>().addDwellingIncident()
  }

  @When("^I add new bodily injury to the claim with the injured person details and injury details$")
  public function iAddABodilyInjuryIncidentWithPersonAndInjuryDetails() {
    _contextFactory.getClaimContext<HOPClaimContext>().addABodilyInjuryIncidentWithPersonAndInjuryDetails()
  }

  @When("^I add \"meal and lodging\" Living Expense Incident to the claim$")
  public function iAddALivingExpensesIncidentForMealAndLodging() {
    _contextFactory.getClaimContext<HOPClaimContext>().addALivingExpensesIncidentForMealAndLodging()
  }

  @Given("^the claim has a bodily injury incident$")
  public function theClaimHasABodilyInjuryIncident() {
    _contextFactory.getClaimContext<HOPClaimContext>().createBodilyInjuryIncident()
  }

  @Given("^the claim has a bodily injury incident for a skin burn$")
  public function theClaimHasABodilyInjuryIncidentForSkineBurns() {
    _contextFactory.getClaimContext<HOPClaimContext>().createBodilyInjuryIncidentForSkinBurns()
  }

  @When("^I update the dwelling incident$")
  public function iUpdateTheDwellingIncident(table : DataTable) {
    _contextFactory.getClaimContext<HOPClaimContext>().updateDwellingIncident(table)
  }

  @When("^I add the other structures incident to include the outside Shed and fence damage$")
  public function iAddOtherStructuresIncident() {
    _contextFactory.getClaimContext<HOPClaimContext>().addOtherStructuresIncident()
  }

  @When("^I add a personal property incident with line items$")
  public function iAddPersonalPropertyIncident() {
    _contextFactory.getClaimContext<HOPClaimContext>().addPersonalPropertyIncident()
  }

  @When("^I update the bodily injury incident$")
  public function iUpdateTheBodilyInjuryIncident(table : DataTable) {
    _contextFactory.getClaimContext<HOPClaimContext>().updateBodilyInjuryIncident(table)
  }

  @Then("^the following dwelling incident should exist on the claim$")
  public function aDwellingIncidentShouldBeCreatedOnTheClaim(table : DataTable) {
    _contextFactory.getClaimContext<HOPClaimContext>().verifyASpecificDwellingIncidentExists(table)
  }

  @Then("^a dwelling incident should be created on the claim$")
  public function aDwellingIncidentShouldBeCreatedOnTheClaim() {
    _contextFactory.getClaimContext<HOPClaimContext>().verifyADwellingIncidentExists()
  }

  @Then("^an Other Structures incident should be created on the claim$")
  public function verifyOtherStructuresIncidentShouldBeCreatedOnTheClaim() {
    _contextFactory.getClaimContext<HOPClaimContext>().verifyOtherStructuresIncidentExists()
  }

  @Then("^the bodily injury incident should be as follows$")
  public function verifyBodilyInjuryIncidentShouldBeCreatedOnTheClaim(table : DataTable) {
    _contextFactory.getClaimContext<HOPClaimContext>().verifyASpecificBodilyInjuryIncidentExist(table)
  }
}
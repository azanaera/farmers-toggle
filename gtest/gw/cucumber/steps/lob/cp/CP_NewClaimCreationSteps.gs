package gw.cucumber.steps.lob.cp

uses com.google.inject.Inject
uses cucumber.api.DataTable
uses cucumber.api.java.en.Given
uses cucumber.api.java.en.Then
uses cucumber.api.java.en.When
uses gw.cucumber.context.api.ContextFactory
uses gw.cucumber.context.api.cp.CPClaimContext
uses gw.cucumber.context.api.cp.CPQuickClaimContext
uses gw.cucumber.setup.ClaimMode
uses gw.cucumber.setup.PolicyDataSet
uses gw.cucumber.testdata.DataWrapper

@SuppressWarnings("unused")
@Export
class CP_NewClaimCreationSteps {
  @Inject
  private var _contextFactory : ContextFactory

  @Inject
  private var _policyDataSetWrapper : DataWrapper<PolicyDataSet>

  @Given("^a Commercial Property policy$")
  public function aCPPolicy() {
    if (_policyDataSetWrapper.get() == null) {
      _policyDataSetWrapper.set(new PolicyDataSet(PolicyType.TC_COMMERCIALPROPERTY, ClaimMode.CommercialProperty))
    } else {
      _policyDataSetWrapper.get().ClaimMode = ClaimMode.CommercialProperty
    }
    _contextFactory.getClaimContext().createPolicyDataSet()
  }

  @Given("^a Commercial Property claim$")
  public function aCPClaim() {
    if (_policyDataSetWrapper.get() == null) {
      _policyDataSetWrapper.set(new PolicyDataSet(PolicyType.TC_COMMERCIALPROPERTY, ClaimMode.CommercialProperty))
    } else {
      _policyDataSetWrapper.get().ClaimMode = ClaimMode.CommercialProperty
    }
    _contextFactory.getClaimContext().createClaim()
  }

  @Given("^the claim has a property incident$")
  public function claimHasPropertyIncident() {
    _contextFactory.getClaimContext<CPClaimContext>().claimHasPropertyIncident()
  }

  @When("^I set the claimant to \"([^\"]*)\"$")
  public function setClaimantTo(val : String) {
    _contextFactory.getClaimContext<CPQuickClaimContext>().setClaimantTo(val)
  }

  @When("^I add a property incident to the claim$")
  public function addPropertyIncident(table : DataTable) {
    _contextFactory.getClaimContext<CPClaimContext>().addPropertyIncident(table)
  }

  @When("^I set the claim reporter to \"([^\"]*)\"$")
  public function setReportedByContactTo(val : String) {
    _contextFactory.getClaimContext<CPQuickClaimContext>().setReportedByContactTo(val)
  }

  @When("^I add a property damage incident$")
  public function createPropertyDamageIncident(table : DataTable) {
    _contextFactory.getClaimContext<CPClaimContext>().createPropertyDamageIncident(table)
  }

  @When("^I set the date of notice to \"([^\"]*)\"$")
  public function setDateOfNotice(val : String) {
    _contextFactory.getClaimContext<CPClaimContext>().setDateOfNotice(val)
  }

  @When("^I add an injury incident$")
  public function addInjuryIncident(table : DataTable) {
    _contextFactory.getClaimContext<CPClaimContext>().addInjuryIncident(table)
  }

  @When("^I select the \"([^\"]*)\" covered property$")
  public function selectCoveredProperty(val : String) {
    _contextFactory.getClaimContext<CPClaimContext>().selectCoveredProperty(val)
  }

  @When("^I add an injury incident to the claim$")
  public function addInjuryIncidentToClaim(table : DataTable) {
    _contextFactory.getClaimContext<CPClaimContext>().addInjuryIncidentToClaim(table)
  }

  @When("^I update the property incident$")
  public function updatePropertyIncident(table : DataTable) {
    _contextFactory.getClaimContext<CPClaimContext>().updatePropertyIncident(table)
  }
  @When("^I start filing a claim using Quick Claim Property$")
  public function fileQuickClaimProperty() {
    _policyDataSetWrapper.get().ClaimMode = ClaimMode.QuickClaimPr
    _contextFactory.getClaimContext<CPQuickClaimContext>().fileQuickClaimProperty()
  }

  @When("^I set the exposure property address to an address in state \"([^\"]*)\"$")
  public function setExposurePropertyAddressState(val : String) {
    _contextFactory.getClaimContext<CPQuickClaimContext>().setExposurePropertyAddressState(val)
  }

  @When("^I update the injury incident$")
  public function updateInjuryIncident(table : DataTable) {
    _contextFactory.getClaimContext<CPClaimContext>().updateInjuryIncident(table)
  }

  @Then("^a property damage incident should be created on the claim$")
  public function verifyPropertyDamageIncident(table : DataTable) {
    _contextFactory.getClaimContext<CPClaimContext>().verifyPropertyDamageIncidentExists(table)
  }

  @Then("^the claim date of notice should be \"([^\"]*)\"$")
  public function verifyClaimDateOfNotice(val : String) {
    _contextFactory.getClaimContext<CPClaimContext>().verifyClaimDateOfNotice(val)
  }

  @Then("^the claim should be reported by the \"([^\"]*)\"$")
  public function verifyClaimReportedBy(val : String) {
    _contextFactory.getClaimContext<CPClaimContext>().verifyClaimReportedBy(val)
  }

  @Then("^the claimant should be \"([^\"]*)\"$")
  public function verifyClaimantTypeIs(val : String) {
    _contextFactory.getClaimContext<CPClaimContext>().verifyClaimantTypeIs(val)
  }

  @Then("^a property incident should be created on the claim$")
  public function verifyPropertyIncidentOnClaim(table : DataTable) {
    _contextFactory.getClaimContext<CPClaimContext>().verifyPropertyIncidentOnClaim(table)
  }

  @Then("^an injury incident matching the table should be created on the claim$")
  public function verifyInjuryIncidentOnClaim(table : DataTable) {
    _contextFactory.getClaimContext<CPClaimContext>().verifyInjuryIncidentOnClaim(table)
  }

  @Then("^the property incident is updated correctly$")
  public function verifyPropertyIncidentUpdated(table : DataTable) {
    _contextFactory.getClaimContext<CPClaimContext>().verifyPropertyIncidentOnClaim(table)
  }

  @Then("^the injury incident is updated correctly$")
  public function verifyInjuryIncidentUpdated(table : DataTable) {
    _contextFactory.getClaimContext<CPClaimContext>().verifyInjuryIncidentUpdated(table)
  }

  @Then("^the claim exposure property address is in state \"([^\"]*)\"$")
  public function verifyClaimExposurePropertyAddressInState(val : String) {
    _contextFactory.getClaimContext<CPClaimContext>().verifyClaimExposurePropertyAddressInState(val)
  }

}
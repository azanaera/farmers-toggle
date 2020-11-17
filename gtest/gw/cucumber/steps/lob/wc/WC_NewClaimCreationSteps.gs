package gw.cucumber.steps.lob.wc

uses com.google.inject.Inject
uses cucumber.api.java.en.Given
uses cucumber.api.java.en.Then
uses cucumber.api.java.en.When
uses gw.cucumber.context.api.ContextFactory
uses gw.cucumber.context.api.wc.WCClaimContext
uses gw.cucumber.setup.ClaimMode
uses gw.cucumber.setup.PolicyDataSet
uses gw.cucumber.testdata.DataWrapper

@SuppressWarnings("unused")
@Export
class WC_NewClaimCreationSteps {
  @Inject
  private var _contextFactory : ContextFactory

  @Inject
  private var _policyDataSetWrapper : DataWrapper<PolicyDataSet>

  @Given("^a Workers' Compensation policy$")
  public function aHOPPolicy() {
    if (_policyDataSetWrapper.get() == null) {
      _policyDataSetWrapper.set(new PolicyDataSet(PolicyType.TC_WORKERSCOMP, ClaimMode.WorkersComp))
    } else {
      _policyDataSetWrapper.get().ClaimMode = ClaimMode.WorkersComp
    }
    _contextFactory.getClaimContext().createPolicyDataSet()
  }

  @Given("^a Workers' Compensation claim$")
  public function aHOPClaim() {
    if (_policyDataSetWrapper.get() == null) {
      _policyDataSetWrapper.set(new PolicyDataSet(PolicyType.TC_WORKERSCOMP, ClaimMode.WorkersComp))
    } else {
      _policyDataSetWrapper.get().ClaimMode = ClaimMode.WorkersComp
    }
    _contextFactory.getClaimContext().createClaim()
  }

  @When("^I add the Injured Worker$")
  public function iAddATheInjuredWorker() {
    _contextFactory.getClaimContext<WCClaimContext>().addInjuredWorker()
  }


  @When("^I set the Date Employer Notified to \"([^\"]*)\"$")
  public function iSetDateEmployerNotified(employerNotifiedDateText : String) {
    _contextFactory.getClaimContext<WCClaimContext>().setDateEmployerNotified(employerNotifiedDateText)
  }

  @When("^I set the Incident Location$")
  public function iAddtheIncidentLocation() {
    _contextFactory.getClaimContext<WCClaimContext>().setIncidentLocation()
  }

  @When("^I set incident location to an address in state \"([^\"]*)\"$")
  public function iSetLossLocationInState(stateText : String) {
    _contextFactory.getClaimContext<WCClaimContext>().setLossLocationInState(stateText)
  }

  @When("^I set Cause of Injury to \"([^\"]*)\"$")
  public function iSetCauseofInjury(lossCauseText : String) {
    _contextFactory.getClaimContext<WCClaimContext>().setLossCause(lossCauseText)
  }

  @When("^I set Primary Injury Type to \"([^\"]*)\"$")
  public function iSetPrimaryInjuryType(injuryTypeText : String) {
    _contextFactory.getClaimContext<WCClaimContext>().setPrimaryInjuryType(injuryTypeText)
  }

  @When("^I set Detailed Injury Type to \"([^\"]*)\"$")
  public function iSetDetailedInjuryType(detailedInjuryTypeText : String) {
    _contextFactory.getClaimContext<WCClaimContext>().setDetailedInjuryType(detailedInjuryTypeText)
  }

  @When("^the Injured Worker will have lost time from work$")
  public function setLostTimeFromWork() {
    _contextFactory.getClaimContext<WCClaimContext>().setLostTimeFromWork()
  }

  @When("^the Injured Worker will lose time from work$")
  public function setLoseTimeFromWork() {
    _contextFactory.getClaimContext<WCClaimContext>().setLoseTimeFromWork()
  }

  @Then("^the Injured Worker should be person contact with \"([^\"]*)\" role on the claim$")
  public function verifyInjuredWorkerRole(contactRoleName : String) {
    _contextFactory.getPartiesInvolvedContext().verifyContactWithTwoContactRolesContactRoleName(ContactRole.TC_CLAIMANT.DisplayName, contactRoleName)
  }

  @Then("^the claim will have (?:a|an) \"([^\"]*)\" exposure$")
  public function verifyClaimExposure(exposureTypeText : String) {
    _contextFactory.getClaimContext<WCClaimContext>().verifyClaimHasExposureOfType(exposureTypeText)
  }

}
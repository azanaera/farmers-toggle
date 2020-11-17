package gw.cucumber.steps.lob.auto

uses com.google.inject.Inject
uses cucumber.api.DataTable
uses cucumber.api.java.en.Given
uses cucumber.api.java.en.Then
uses cucumber.api.java.en.When
uses gw.cucumber.context.api.ContextFactory
uses gw.cucumber.context.api.pa.PAClaimContext
uses gw.cucumber.context.api.pa.PAQuickClaimContext
uses gw.cucumber.setup.ClaimMode
uses gw.cucumber.setup.PolicyDataSet
uses gw.cucumber.testdata.DataWrapper

@SuppressWarnings("unused")
@Export
class PA_NewClaimCreationSteps {
  @Inject
  private var _contextFactory : ContextFactory

  @Inject
  var _policyDataSetWrapper : DataWrapper<PolicyDataSet>

  @Given("^a Personal Auto policy$")
  public function aPAPolicy() {
    if (_policyDataSetWrapper.get() == null) {
      _policyDataSetWrapper.set(new PolicyDataSet(PolicyType.TC_PERSONALAUTO, ClaimMode.PersonalAuto))
    } else {
      _policyDataSetWrapper.get().ClaimMode = ClaimMode.PersonalAuto
    }
    _contextFactory.getClaimContext().createPolicyDataSet()
  }

  @Given("^a Personal Auto claim$")
  public function aPAClaim() {
    if (_policyDataSetWrapper.get() == null) {
      _policyDataSetWrapper.set(new PolicyDataSet(PolicyType.TC_PERSONALAUTO, ClaimMode.PersonalAuto))
    } else {
      _policyDataSetWrapper.get().ClaimMode = ClaimMode.PersonalAuto
    }
    _contextFactory.getClaimContext().createClaim()
  }

  @Given("^another Personal Auto claim$")
  public function anotherPAClaim() {
    if (_policyDataSetWrapper.get() == null) {
      _policyDataSetWrapper.set(new PolicyDataSet(PolicyType.TC_PERSONALAUTO, ClaimMode.PersonalAuto))
    } else {
      _policyDataSetWrapper.get().ClaimMode = ClaimMode.PersonalAuto
    }
    _contextFactory.getClaimContext().createClaim()
  }
  @Given("^(?:another party is|other parties are) at fault$")
  public function otherPartiesAreAtFault() {
    _contextFactory.getClaimContext<PAClaimContext>().otherPartiesAreAtFault()
  }

  @Given("^the claim is referred for subrogation$")
  public function claimIsReferredForSubrogation() {
    _contextFactory.getClaimContext<PAClaimContext>().claimReferredForSubrogation()
  }

  @When("^I specify another party is at fault$")
  public function iSetAnotherPartyIsAtFault() {
    _contextFactory.getClaimContext<PAClaimContext>().iSetAnotherPartyIsAtFault()
  }

  @When("^I add the responsible parties and their liabilities$")
  public function addResponsiblePartiesLiability(table : DataTable) {
    _contextFactory.getClaimContext<PAClaimContext>().addResponsiblePartiesLiability(table)
  }

  @When("^I select the \"(1st|2nd|3rd)\" covered vehicle$")
  public function iSelectTheInvolvedVehicle(indexString : String) {
    _contextFactory.getClaimContext<PAClaimContext>().selectInvolvedVehicle(indexString)
  }

  @When("^I add a third party vehicle$")
  public function addThirdPartyVehicle(table : DataTable) {
    _contextFactory.getClaimContext<PAClaimContext>().addThirdPartyVehicle(table)
  }

  @When("^I start filing a claim in Auto First and Final Wizard$")
  public function iStartFilingAClaimInAutoFirstAndFinalWizard() {
    if (_policyDataSetWrapper.get() == null) {
      _policyDataSetWrapper.set(new PolicyDataSet(PolicyType.TC_PERSONALAUTO, ClaimMode.QuickClaimAutoFirstAndFinal))
    } else {
      _policyDataSetWrapper.get().ClaimMode = ClaimMode.QuickClaimAutoFirstAndFinal
    }
    _contextFactory.getClaimContext<PAClaimContext>().startFilingAutoFirstAndFinal()
  }

  @When("^I submit \"([^\"]*)\" claims for adjudication$")
  public function iSubmitClaimsForAdjudication(noOfClaims : String) {
    _contextFactory.getClaimContext<PAClaimContext>().submitClaimsForAdjudication(noOfClaims)
  }

  @When("^the insured is the claimant$")
  public function insuredIsClaimant() {
    _contextFactory.getClaimContext<PAClaimContext>().setInsuredAsClaimant()
  }

  @When("^I start filing a claim in Quick Claim Auto Wizard$")
  public function iStartFilingAClaimInAutoQuickClaimAutoWizard() {
    if (_policyDataSetWrapper.get() == null) {
      _policyDataSetWrapper.set(new PolicyDataSet(PolicyType.TC_PERSONALAUTO, ClaimMode.QuickClaimAuto))
    } else {
      _policyDataSetWrapper.get().ClaimMode = ClaimMode.QuickClaimAuto
    }
    _contextFactory.getClaimContext<PAQuickClaimContext>().startFilingQuickClaimAuto()
  }

  @When("^I add an autobody repair shop \"([^\"]*)\"$")
  public function iAddAnAutobodyRepairShop(autobodyRepairShopName : String) {
    _contextFactory.getClaimContext<PAClaimContext>().addRepairShop(autobodyRepairShopName)
  }

  @When("^I create a \"([^\"]*)\" check to \"([^\"]*)\"$")
  public function iCreateACheckTo(checkAmount : String, payeeName : String) {
    _contextFactory.getClaimContext<PAClaimContext>().createCheckDuringAutoFirstAndFinal(checkAmount, payeeName)
  }

  @When("^I select Ready To Pay option \"([^\"]*)\"$")
  public function selectReadyToPay(readyToPayText : String) {
    _contextFactory.getClaimContext<PAClaimContext>().selectReadyToPay(readyToPayText)
  }


  @Then("^a damaged vehicle should exist on the claim$")
  public function verifyDamagedVehicleOnClaim(table : DataTable) {
    _contextFactory.getClaimContext<PAClaimContext>().verifyDamagedVehicleOnClaim(table)
  }

  @Then("^a property damage liability should exist on the claim$")
  public function verifyPropertyDamageLiability(table : DataTable) {
    _contextFactory.getClaimContext<PAClaimContext>().verifyPropertyDamageLiability(table)
  }

  @Then("^(?:a vehicle|an) incident for the selected vehicle should be created on the claim$")
  public function anIncidentForVehicleShouldBeCreatedOnTheClaim() {
    _contextFactory.getClaimContext<PAClaimContext>().verifyVehicleIncidentCreated()
  }
}
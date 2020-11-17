package gw.cucumber.steps.claim

uses com.google.inject.Inject
uses cucumber.api.DataTable
uses cucumber.api.java.en.Given
uses cucumber.api.java.en.Then
uses cucumber.api.java.en.When
uses gw.cucumber.context.api.ContextFactory

@SuppressWarnings("unused")
@Export
class PartiesInvolvedSteps {

  @Inject
  var _contextFactory : ContextFactory

  @Given("^a \"([^\"]*)\" contact exists in the address book$")
  public function aContactExistsInAddressBook(contactSubTypeName : String, table : DataTable) {
    _contextFactory.getAddressBookContext().verifyContactIsInAddressBook(contactSubTypeName, table)
  }

  @Given("^\"([^\"]*)\" contact is available for work$")
  function contactIsAvailableToWork(contactSubTypeName : String) {
    _contextFactory.getAddressBookContext().setAvailableToWork(contactSubTypeName, true)
  }

  @Given("^\"([^\"]*)\" contact has backup withholding$")
  function contactHasBackupWithholding(contactSubTypeName : String) {
    _contextFactory.getAddressBookContext().setBackupWithholding(contactSubTypeName, true)
  }

  @When("^I add a person contact with \"([^\"]*)\" role$")
  public function iAddAContactWithRole(contactRoleName : String) {
    _contextFactory.getClaimContext().addPersonContactWithRole(contactRoleName)
  }

  @When("^I add a person contact with \"([^\"]*)\" role to the existing claim$")
  public function iAddAPersonContactWithRoleToTheExistingClaim(claimContactRoleName : String) {
    _contextFactory.getPartiesInvolvedContext().addPersonContactWithRoleName(claimContactRoleName)
  }

  @When("^I add an \"([^\"]*)\" contact with \"([^\"]*)\" role to the existing claim$")
  public function iAddAContactWithRoleToTheExistingClaim(contactTypeName : String, claimContactRoleName : String, table : DataTable) {
    _contextFactory.getPartiesInvolvedContext().addContactWithClaimRole(contactTypeName, claimContactRoleName, table)
  }

  @When("^I add an \"([^\"]*)\" contact with \"([^\"]*)\" role to the existing exposure$")
  public function iAddAContactWithRoleToTheExistingExposure(contactTypeName : String, claimContactRoleName : String, table : DataTable) {
    _contextFactory.getPartiesInvolvedContext().addContactWithExposureRole(contactTypeName, claimContactRoleName, table)
  }

  @When("^I add that contact as a party on the claim with \"([^\"]*)\" role to the existing exposure$")
  public function addContactAsExposurePartyInvolved(claimContactRoleName : String) {
    _contextFactory.getPartiesInvolvedContext().addContactAsExposurePartyInvolved(claimContactRoleName)
  }

  @When("^I update the email address for \"([^\"]*)\" to \"([^\"]*)\"$")
  public function updateEmailAddressForContact(contactName : String, email : String) {
    _contextFactory.getPartiesInvolvedContext().updateEmailAddressForContact(contactName, email)
  }

  @When("^I add bank account information for \"([^\"]*)\"$")
  public function updateBankInformationForContact(contactName : String, table : DataTable) {
    _contextFactory.getPartiesInvolvedContext().updateBankInformationForContact(contactName, table)
  }

  @When("^I remove the contact \"([^\"]*)\" from the claim$")
  public function deleteContact(contactName : String) {
    _contextFactory.getPartiesInvolvedContext().deleteContact(contactName)
  }

  @Then("^a person contact with \"([^\"]*)\" role should be on the claim$")
  public function aContactWithRoleShouldBeOnTheClaim(claimContactRoleName : String) {
    _contextFactory.getPartiesInvolvedContext().verifyContactWithRoleName(claimContactRoleName)
  }

  @Then("^the \"([^\"]*)\" should be listed as \"([^\"]*)\"$")
  public function aContactSubtypeWithRoleShouldBeListed(contactSubTypeName : String, contactRoleName : String) {
    _contextFactory.getPartiesInvolvedContext().verifyContactWithContactTypeAndRoleName(contactSubTypeName, contactRoleName)
  }

  @Then("^the \"([^\"]*)\" should be person contact with \"([^\"]*)\" role on the claim$")
  public function aContactWithTwoRolesShouldBeOnTheClaim(contactRoleName1 : String, contactRoleName2 : String) {
    _contextFactory.getPartiesInvolvedContext().verifyContactWithTwoContactRolesContactRoleName(contactRoleName1, contactRoleName2)
  }

  @Then("^the contact is a Parties Involved contact$")
  public function aContacctIsAnInvolvedPartyContact(table : DataTable) {
    _contextFactory.getPartiesInvolvedContext().verifyContactPartyInvolved(table)
  }

  @Then("^the email address for \"([^\"]*)\" should be \"([^\"]*)\"$")
  public function verifyEmailAddressForContact(contactName : String, email : String) {
    _contextFactory.getPartiesInvolvedContext().verifyEmailAddressForContact(contactName, email)
  }

  @Then("^the bank account information for \"([^\"]*)\" should be updated$")
  public function verifyBankInfoForContact(contactName : String, table : DataTable) {
    _contextFactory.getPartiesInvolvedContext().verifyBankInfoForContact(contactName, table)
  }

  @Then("^the contact \"([^\"]*)\" should not be listed on the claim$")
  public function verifyContactRemoved(contactName : String) {
    _contextFactory.getPartiesInvolvedContext().verifyContactRemoved(contactName)
  }
}
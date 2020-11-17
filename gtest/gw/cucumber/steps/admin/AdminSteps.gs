package gw.cucumber.steps.admin

uses com.google.inject.Inject
uses cucumber.api.DataTable
uses cucumber.api.java.en.Given
uses cucumber.api.java.en.When
uses gw.cucumber.context.api.ContextFactory

@SuppressWarnings("unused")
@Export
class AdminSteps {
  @Inject
  var _contextFactory : ContextFactory

  @Given("^I am a user with the \"([^\"]*)\" role$")
  function createUserWithRoleAndSetAsCurrentUser(roleString : String) {
    _contextFactory.getAdminContext().createAndSetUserWithRole(roleString)
  }

  @Given("^I have the \"([^\"]*)\" role$")
  function ensureUserHasRole(roleString : String) {
    _contextFactory.getAdminContext().ensureUserHasRole(roleString)
  }

  @Given("^I have the \"([^\"]*)\" authority limit profile$")
  public function createAuthorityLimitProfile(profileString : String) {
    _contextFactory.getAdminContext().grantAuthorityProfileToCurrentUser(profileString)
  }

  @Given("^I am in the \"([^\"]*)\" security zone$")
  public function addToGroupWithSecurityZone(securityZone : String) {
    _contextFactory.getAdminContext().addToGroupWithSecurityZone(securityZone)
  }

  @Given("^I have the following authority limits$")
  public function setAuthorityLimits(table : DataTable) {
    _contextFactory.getAdminContext().setAuthorityLimits(table)
  }

  @Given("^I have the \"([^\"]*)\" permission$")
  public function setPermission(perm : String) {
    _contextFactory.getAdminContext().setPermission(perm)
  }

  @Given("^no load factor is set for all users within the \"([^\"]*)\" group$")
  public function noLoadFactorOnGroupUsers(groupName : String) {
    _contextFactory.getAdminContext().noLoadfactorOnGroupUsers(groupName)
  }

  @When("^today's date is \"([^\"]+)\"$")
  function setCurrentTime(date : String) {
    _contextFactory.getAdminContext().setCurrentTime(date)
  }

}
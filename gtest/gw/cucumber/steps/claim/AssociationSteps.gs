package gw.cucumber.steps.claim

uses com.google.inject.Inject
uses cucumber.api.java.en.Given
uses cucumber.api.java.en.Then
uses cucumber.api.java.en.When
uses gw.cucumber.context.api.ContextFactory

@SuppressWarnings("unused")
@Export
class AssociationSteps {

  @Inject
  private var _contextFactory : ContextFactory

  @Given("^these claims are associated with the title \"([^\"]*)\"$")
  public function associatedClaims(associationTitle : String) {
    _contextFactory.getClaimContext().associatedClaims(associationTitle)
  }

  @When("^I associate these claims with the title \"([^\"]*)\"$")
  public function associateClaims(associationTitle : String) {
    _contextFactory.getClaimContext().associateClaims(associationTitle)
  }

  @When("^I change the \"([^\"]*)\" association type to \"([^\"]*)\"$")
  public function updateAssociationType(name : String, type : String) {
    _contextFactory.getClaimContext().updateAssociationType(name, type)
  }

  @When("^I delete the \"([^\"]*)\" association$")
  public function deleteAssociationOnClaim(name : String) {
    _contextFactory.getClaimContext().deleteAssociationOnClaim(name)
  }

  @Then("^an association with the title \"([^\"]*)\" and type \"([^\"]*)\" should exist between both claims$")
  public function verifyAssociationExist(associationTitle : String, type : String) {
    _contextFactory.getClaimContext().verifyAssociationWithNameAndTypeExists(associationTitle, type)
  }

  @Then("^an association with the title \"([^\"]*)\" should exist between both claims$")
  public function verifyAssociationExist(associationTitle : String) {
    _contextFactory.getClaimContext().verifyAssociationWithNameExists(associationTitle)
  }

  @Then("^an association with the title \"([^\"]*)\" should not exist between both claims$")
  public function verifyAssociationDoesNotExist(associationTitle : String) {
    _contextFactory.getClaimContext().verifyAssociationDoesNotExist(associationTitle)
  }

}
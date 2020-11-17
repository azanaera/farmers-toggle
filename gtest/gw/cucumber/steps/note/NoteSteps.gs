package gw.cucumber.steps.note

uses com.google.inject.Inject
uses cucumber.api.DataTable
uses cucumber.api.java.en.Given
uses cucumber.api.java.en.When
uses cucumber.api.java.en.Then

uses gw.cucumber.context.api.ContextFactory

@SuppressWarnings("unused")
@Export
class NoteSteps {

  @Inject
  var _contextFactory : ContextFactory

  @Given("^(?:a note exist|multiple notes exists) on the claim$")
  public function addNotesOnTheExistClaim(table : DataTable) {
    _contextFactory.getNoteContext().addNotes(table)
  }

  @When("^I add a note to the existing claim$")
  public function iAddANote() {
    _contextFactory.getNoteContext().addNote()
  }

  @When("^I start creating a new note for \"([^\"]*)\"$")
  public function iAddANoteForTopic(topic : String) {
    _contextFactory.getNoteContext().startNoteOfTopic(topic)
  }

  @When("^Security Type is \"([^\"]*)\"$")
  public function noteSecurityType(securityTypeName : String) {
    _contextFactory.getNoteContext().setSecurityType(securityTypeName)
  }

  @When("^I update the topic \"([^\"]*)\" in the note with text \"([^\"]*)\"$")
  public function updateTopic(topicName : String, bodyText : String) {
    _contextFactory.getNoteContext().setTopic(bodyText, topicName)
  }

  @When("^the note is related to the exposure$")
  public function relateNoteToExposure() {
    _contextFactory.getNoteContext().relateNoteToExposure()
  }

  @When("^the note is confidential$")
  public function confidentialNote() {
    _contextFactory.getNoteContext().confidentialNote()
  }

  @When("^I finish creating the note$")
  public function finishNote() {
    _contextFactory.getNoteContext().finishNote()
  }

//  disabled as part of TOGDEL-45
  @When("^I delete the note with text \"([^\"]*)\"$")
  public function deleteNote(bodyText : String) {
    new AssertionError("deleteNote() functionality has been disabled per Toggle")
  }

  @Then("^a note should be on the claim$")
  public function aNoteShouldBeOnTheClaim() {
    _contextFactory.getNoteContext().verifyNote()
  }

  @Then("^a note has following details:$")
  public function verifyNoteDetails(table : DataTable) {
    _contextFactory.getNoteContext().verifyNoteDetails(table)
  }

  @Then("^the topic \"([^\"]*)\" is updated in the note with text \"([^\"]*)\"$")
  public function verifyTopic(topicName : String, bodyText : String) {
    _contextFactory.getNoteContext().verifyTopic(bodyText, topicName)
  }

  @Then("^only the following notes exist on the claim$")
  public function verifyDeletedNote(table : DataTable) {
    _contextFactory.getNoteContext().verifyNoteDetails(table)
  }

}
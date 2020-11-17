package gw.cucumber.context.impl.smoketest.common

uses com.google.inject.Inject
uses cucumber.api.DataTable
uses gw.api.database.Query
uses gw.api.databuilder.NoteBuilder
uses gw.cucumber.CucumberStepBase
uses gw.cucumber.context.api.common.NoteContext
uses gw.cucumber.context.impl.smoketest.util.Navigation
uses gw.cucumber.testdata.DataWrapper
uses gw.cucumber.transformer.TypelistTransformer
uses gw.cucumber.util.common.UIHelper
uses pcftest.ClaimNotes
uses pcftest.ClaimSummary
uses pcftest.NewNoteWorksheet

uses java.text.SimpleDateFormat

@SuppressWarnings("unused")
class NoteContextImpl extends CucumberStepBase implements NoteContext {

  @Inject
  var _claimWrapper : DataWrapper<Claim>

  @Inject
  var _exposureWrapper : DataWrapper<Exposure>

  override function addNote() {
    var claimSummary = new Navigation<ClaimSummary>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()), CurrentUser)
    var noteWorksheet = claimSummary.ClaimMenuActions.goToNewNote()
    noteWorksheet.NewNoteScreen.NoteDetailDV.Body.Value = "note body text"
    claimSummary = noteWorksheet.NewNoteScreen.Update.click() as pcftest.ClaimSummary
    UIHelper.assertNoMessages(claimSummary)
  }

  override function addNotes(table : DataTable) {
    var dataTable = table.asMaps(String, String)
    var claim = _claimWrapper.get()
    var exposure = _exposureWrapper.get()
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      for (row in dataTable) {
        var noteBuilder = new NoteBuilder().onClaim(claim)
            .withTopic(new TypelistTransformer<NoteTopicType>().transform(row.get(TOPIC_KEY)))
            .withBody(row.get(BODY_KEY))
            .withAuthor(getUserByUsername(row.get(AUTHOR_KEY)) ?: getUserByUsername(CurrentUser))

        if (row.get(CONFIDENTIAL_KEY).equalsIgnoreCase(YES_KEY)) {
          noteBuilder.asConfidential()
        } else {
          noteBuilder.asNonConfidential()
        }

        var note = noteBuilder.create(bundle)
        var relatedTo = row.get(RELATED_TO_KEY)
        if (relatedTo.equalsIgnoreCase(CLAIM_KEY)) {
          note.RelatedTo = claim
        } else if (relatedTo.equalsIgnoreCase(EXPOSURE_KEY)) {
          note.RelatedTo = exposure
        }
      }
    }, CurrentUser)
    _claimWrapper.set(claim)
  }

  override function startNoteOfTopic(topic : String) {
    var noteTopic = new TypelistTransformer<NoteTopicType>().transform(topic)
    var claimSummary = new Navigation<ClaimSummary>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()), CurrentUser)
    var noteWorksheet = claimSummary.ClaimMenuActions.goToNewNote()
    noteWorksheet.NewNoteScreen.NoteDetailDV.Body.Value = "note body text"
    noteWorksheet.NewNoteScreen.NoteDetailDV.Topic.TypeKeyValue = noteTopic
  }

  override function setSecurityType(securityTypeName : String) {
    var securityType = new TypelistTransformer<NoteSecurityType>().transform(securityTypeName)
    var noteWorksheet = _proxy.CurrentWorksheet as NewNoteWorksheet
    noteWorksheet.NewNoteScreen.NoteDetailDV.SecurityType.TypeKeyValue = securityType
  }

  override function setTopic(bodyText : String, topicName : String) {
    var topic = new TypelistTransformer<NoteTopicType>().transform(topicName)
    var notes = new Navigation<ClaimNotes>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToNotes(), CurrentUser)
    var editNoteScreen = notes.NotesSearchScreen.ClaimNotesLV._Entries.singleWhere(\note -> note.Body.Value == bodyText).EditLink.click().EditNoteScreen
    editNoteScreen.NoteDetailDV.Topic.TypeKeyValue = topic
    editNoteScreen.Update.click()
  }

  override function relateNoteToExposure() {
    var exposure = _exposureWrapper.get()
    var noteWorksheet = _proxy.CurrentWorksheet as NewNoteWorksheet
    noteWorksheet.NewNoteScreen.NoteDetailDV.RelatedTo.clickByLabelSubstr(exposure.DisplayName)
  }

  override function confidentialNote() {
    var noteWorksheet = _proxy.CurrentWorksheet as NewNoteWorksheet
    noteWorksheet.NewNoteScreen.NoteDetailDV.Confidential.BoolValue = true
  }

  override function finishNote() {
    var noteWorksheet = _proxy.CurrentWorksheet as NewNoteWorksheet
    var claimSummary = noteWorksheet.NewNoteScreen.Update.click() as pcftest.ClaimSummary
    UIHelper.assertNoMessages(claimSummary)
  }
//disabled as part of TOGDEL-45
//  override function deleteNote(bodyText : String) {
//    var claimNote = new Navigation<ClaimNotes>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToNotes(), CurrentUser)
//    var entries = claimNote.NotesSearchScreen.ClaimNotesLV._Entries
//    entries.singleWhere(\note -> note.Body.Value == bodyText).DeleteLink.click()
//    UIHelper.assertNoMessages(claimNote)
//  }

  override function verifyNote() {
    var claimSummary = new Navigation<ClaimSummary>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()), CurrentUser)
    var notes = claimSummary.MenuLinks.Claim_ClaimNotes.click()
    assertThat(notes.NotesSearchScreen.ClaimNotesLV._Entries.single().Body.Text).isEqualTo("note body text")
  }

  override function verifyNoteDetails(table : DataTable) {
    var expectedFields = table.topCells()

    var expectedNotes = table.asMaps(String, String).map(\map -> new HashMap<String, String>(map))
    transformExpectedNote(expectedNotes)
    var actualNotes = retrieveNotes()
    transformActualNote(expectedFields, actualNotes)

    assertMatch(expectedNotes, actualNotes)
  }

  override function verifyTopic(bodyText : String, topicName : String) {
    var notes = new Navigation<ClaimNotes>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToNotes(), CurrentUser)
    var currentTopicName = notes.NotesSearchScreen.ClaimNotesLV._Entries.singleWhere(\note -> note.Body.Value == bodyText).Topic.getValue()
    assertThat(new TypelistTransformer<NoteTopicType>().transform(currentTopicName)).isEqualTo(new TypelistTransformer<NoteTopicType>().transform(topicName))
  }

  private function transformExpectedNote(notes : List<Map<String, String>>) {
    var claim = _claimWrapper.get().DisplayName
    var exposure = _exposureWrapper.get().DisplayName
    var currentUser = getUserByUsername(CurrentUser).DisplayName
    var today = getDateString(Date.Today)
    var yesterday = getDateString(Date.Yesterday)

    for (note in notes) {
      if (note.containsKey(RELATED_TO_KEY)) {
        var relatedToValue = note.get(RELATED_TO_KEY)
        if (relatedToValue.equalsIgnoreCase(CLAIM_KEY)) {
          note.put(RELATED_TO_KEY, claim)
        } else if (relatedToValue.equalsIgnoreCase(EXPOSURE_KEY)) {
          note.put(RELATED_TO_KEY, exposure)
        }
      }
      if (note.containsKey(AUTHOR_KEY)) {
        if (note.get(AUTHOR_KEY).equalsIgnoreCase("me")) {
          note.put(AUTHOR_KEY, currentUser)
        }
      }
      if (note.containsKey(CREATE_DATE_KEY)) {
        var createDateValue = note.get(CREATE_DATE_KEY)
        if (createDateValue.equalsIgnoreCase("today")) {
          note.put(CREATE_DATE_KEY, today)
        } else if (createDateValue.equalsIgnoreCase("yesterday")) {
          note.put(CREATE_DATE_KEY, yesterday)
        }
      }
    }
  }

  private function retrieveNotes() : List<Map<String, String>> {
    var entries = Query.make(Claim).compare(Claim#ID, Equals, _claimWrapper.get().ID).select().single().Notes

    var notes = new ArrayList<Map<String, String>>()
    for (entry in entries) {
      notes.add({
          AUTHOR_KEY -> entry.Author.DisplayName,
          CREATE_DATE_KEY -> getDateString(entry.AuthoringDate),
          BODY_KEY -> entry.Body,
          CONFIDENTIAL_KEY -> entry.Confidential ? YES_KEY : NO_KEY,
          RELATED_TO_KEY -> entry.RelatedTo.DisplayName,
          SUBJECT_KEY -> entry.Subject,
          TOPIC_KEY -> entry.Topic.DisplayName
      })
    }
    return notes
  }

  function transformActualNote(filteredFields : List<String>, notes : List<Map<String, String>>) {
    for (note in notes) {
      note.retainWhereKeys(\key -> filteredFields.contains(key))
    }
  }

  private function assertMatch(expectedNotes : List<Map<String, String>>, actualNotes : List<Map<String, String>>) {
    var noteMessages = new ArrayList<String>()
    for (expectedNote in expectedNotes) {
      var bestContactMatch = actualNotes.maxBy(\contact -> contact.entrySet().countWhere(\fields -> expectedNote.get(fields.Key).equalsIgnoreCase(fields.Value)))
      var mismatchExpected = expectedNote.filterByKeys(\field -> !expectedNote.get(field).equalsIgnoreCase(bestContactMatch.get(field)))

      var message = new StringBuilder().append("${expectedNote.entrySet().join(", ")}:") //.append("Mismatch found for the following:")
      mismatchExpected.eachKeyAndValue(\field, value -> message.append("   - ${field}: Expected: ${value}, Actual: ${bestContactMatch.getOrDefault(field, "Not Found")}"))
      if (!mismatchExpected.isEmpty()) {
        noteMessages.add(message.toString())
      }
    }

    assertThat(noteMessages).overridingErrorMessage("Mismatch found for the following: ${noteMessages.join(";")}").isEmpty()
  }

  private function getDateString(date : Date) : String {
    return SimpleDateFormat.DateInstance.format(date.trimToMidnight())
  }

}

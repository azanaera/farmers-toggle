package gw.cucumber.context.api.common

uses cucumber.api.DataTable
uses gw.api.locale.DisplayKey

/**
 * Methods related to note
 */
interface NoteContext {

  public static final var CREATE_DATE_KEY : String = DisplayKey.get("Web.Claim.ClaimStatus.CreateDate")

  public static final var AUTHOR_KEY : String = DisplayKey.get("NVV.Claim.NoteDetail.Note.Author")

  public static final var RELATED_TO_KEY : String = DisplayKey.get("NVV.Claim.NoteDetail.Note.RelatedTo")

  public static final var CLAIM_KEY : String = DisplayKey.get("entity.Claim")

  public static final var EXPOSURE_KEY : String = DisplayKey.get("entity.Exposure")

  public static final var TOPIC_KEY : String = DisplayKey.get("NVV.Claim.NoteDetail.Note.Topic")

  public static final var BODY_KEY : String = DisplayKey.get("NVV.Claim.NoteDetail.Note.Body")

  public static final var CONFIDENTIAL_KEY : String = DisplayKey.get("NVV.Claim.NoteDetail.Note.Confidential")

  public static final var SUBJECT_KEY : String = DisplayKey.get("NVV.Claim.NoteDetail.Note.Subject")

  public static final var YES_KEY : String = DisplayKey.get("Web.ClaimSnapshotNotesScreen.Confidential_2")

  public static final var NO_KEY : String = DisplayKey.get("Web.ClaimSnapshotNotesScreen.Confidential")

  /**
   * Add a note to claim
   */
  function addNote()

  /**
   * Add notes to the claim
   * @param table
   *    - Author          - String                   - The author of the note
   *    - Topic           - String (NoteTopicType)   - The note topic
   *    - Related To      - String                   - What is the note related to? (Claim/Exposure/Contact)
   *    - Confidential    - String (YesNo)           - Is the note confidential?
   *    - Text            - String                   - The body of the note
   * | Author | Topic   | Related To | Confidential | Text       |
   * | Me     | General | Exposure   | Yes          | First note |
   */
  function addNotes(table : DataTable)

  /**
   * Add a note to a claim for a specific topic
   * @param topic
   */
  function startNoteOfTopic(topic : String)

  /**
   * Set the security type of a note
   * @param securityType - Type of the note for access-restriction purposes
   */
  function setSecurityType(securityTypeName : String)

  /**
   * Set the topic of a note
   * @param bodyText - Note identifier to be updated
   * @param topicName - Topic value to be updated
   */
  function setTopic(bodyText : String, topicName : String)

  /**
   * Relate a note to the current exposure
   */
  function relateNoteToExposure()

  /**
   * Indicate a note is confidential
   */
  function confidentialNote()

  /**
   * Finish creating a note
   */
  function finishNote()

  //disabled as part of TOGDEL-45
//  /**
//   * Delete a note
//   * @param bodyText - Note identifier to be deleted
//   */
//  function deleteNote(bodyText : String)

  /**
   * Verify a note exist on claim
   */
  function verifyNote()

  /**
   * Verify a note exists with matching details
   * @param table
   *    - Create Date     - String                   - The date the note should have been created (Today or dd/mm/yyyy)
   *    - Author          - String                   - The author of the note
   *    - Topic           - String (NoteTopicType)   - The note topic
   *    - Related To      - String                   - What is the note related to? (Claim/Exposure/Contact)
   *    - Confidential    - String (YesNo)           - Is the note confidential?
   * e.g
   * | Create Date | Author | Topic          | Related To | Confidential |
   * | Today       | Me     | Medical Issues | Exposure   | Yes          |
   */
  function verifyNoteDetails(table : DataTable)

  /**
   * Verify topic on the note is set to the given value
   * @param bodyText - Note identifier updated
   * @param topicName - Topic value updated
   */
  function verifyTopic(bodyText : String, topicName : String)
}
package gw.cucumber.context.api.common

uses cucumber.api.DataTable

/**
 * Methods related to creating and completing activities
 */
interface ActivityContext {

  /**
   * Create an open activity and assign it to the current user
   */
  function createOpenActivity()

  /**
   * Complete all open activities
   */
  function completeAllOpenActivities()

  /**
   * Add activities from data table
   *
   * @param table
   *    - Category   - String (ActivityCategory)   - The activity category
   *    - Subject    - String                      - The activity subject
   * e.g
   * | Reminder | 30 day diary |
   */
  function addActivitiesWithSubjects(table : DataTable)

  /**
   * Add activities from data table
   *
   * @param activityPatternSubject
   * @param table
   *    - Field name    - String    - The field to be set
   *    - Value         - String    - The value the field will be set to
   * e.g
   * | Related To | Claim                |
   * | Assign To  | Claim/Exposure Owner |
   */
  function createActivity(activityPatternSubject : String, table : DataTable)

  /**
   * Complete the activity in _activityWrapper
   */
  function completeActivity()

  /**
   * Complete the activity with the subject
   * @param subject A brief title for the activity
   */
  function completeActivity(subject : String)

  /**
   * Verify activities with the following subjects from data table exist
   *
   * @param table
   *    - Subject   - String   - The subject of the activity that should exist
   * e.g
   * | 30 day diary |
   */
  function verifyActivitiesSubjects(table : DataTable)

  /**
   * Verify activities with the following subjects from data table exist
   *
   * @param table
   *    - Subject       - String    - The subject of the activity
   *    - Related To    - String    - What should the activity related to? (Claim/Contact/Exposure)
   *    - Status        - String    - What should the status of the activity be?
   *    - Assigned To   - String    - Who should the activity be assigned to?
   * e.g
   * | Subject           | Related To | Status | Assigned To |
   * | Get police report | Claim      | open   | Claim Owner |
   */
  function verifyActivity(table : DataTable)

  /**
   * Verify the activity in _activityWrapper has the given status
   *
   * @param activityStatusText
   */
  function verifyActivityStatus(activityStatusText : String)

  /**
   * Verify all activities on the claim are completed
   */
  function verifyAllActivitiesCompleted()
}
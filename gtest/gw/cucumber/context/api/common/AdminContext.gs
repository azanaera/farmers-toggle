package gw.cucumber.context.api.common

uses cucumber.api.DataTable
uses gw.api.locale.DisplayKey

/**
 * Methods related to users, permissions and roles
 */
@SuppressWarnings("Method2Property")
interface AdminContext {

  final static var DK_LIMIT_AMOUNT  : String = DisplayKey.get("LV.Admin.EditableAuthorityLimits.LimitAmount")
  final static var DK_LIMIT_TYPE    : String = DisplayKey.get("LV.Admin.EditableAuthorityLimits.LimitType")

  /**
   * Create a user with the given role if the user does not exist
   *
   * @param roleString
   */
  function createAndSetUserWithRole(roleString : String)

  /**
   * Grant the give authority profile to {@gw.cucumber.steps.CucumberStepBase#CurrentUser}
   *
   * @param profileString
   */
  function grantAuthorityProfileToCurrentUser(profileString : String)

  /**
   * Set the authority limits of the current user
   * @param table
   *    - Limit Type   - String (AuthorityLimitType)   - The type of authority limit
   *    - Amount       - Number                            - The set limit (in default currency)
   * e.g
   * | Limit Type          | Amount |
   * | Reserve change size | 1200   |
   */
  function setAuthorityLimits(table : DataTable)

  /**
   * Adds a group with the specified security zone to the current user
   * @param securityZone - The desired security zone
   */
  function addToGroupWithSecurityZone(securityZone : String)

  /**
   * Grant a permission to the current user
   * @param perm
   */
  function setPermission(perm : String)

  /**
   * Ensures the current user has the specified role
   * @param roleString
   */
  function ensureUserHasRole(roleString : String)

  /**
   * Set the current system clock to the given date
   * @param date the given date for setting the clock
   */
  function setCurrentTime(date : String)

  /**
   * Set the load factor for all users in the Group
   * @param groupName
   */
  function noLoadfactorOnGroupUsers(groupName : String)
}
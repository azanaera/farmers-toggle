package gw.cucumber.context.api.common

uses cucumber.api.DataTable

/**
 * Methods related to parties involved
 */
interface PartiesInvolvedContext {

  /**
   * Add a person contact with the given role to claim
   *
   * @param claimContactRoleName - The name of the ClaimContactRole
   */
  function addPersonContactWithRoleName(claimContactRoleName : String)

  /**
   * Add a person contact with the given role to claim
   *
   * @param contactType - The type of contact to be created
   * @param claimContactRoleName - The name of the ClaimContactRole
   */
  function addContactWithClaimRole(contactTypeName : String, claimContactRoleName : String, table : DataTable)

  /**
   * Add a person contact with the given role to exposure
   *
   * @param contactType - The type of contact to be created
   * @param claimContactRoleName - The name of the ClaimContactRole
   */
  function addContactWithExposureRole(contactTypeName : String, claimContactRoleName : String, table : DataTable)

  /**
   * Add an existing contact as a party involved with the given role to exposure
   * @param claimContactRoleName
   */
  function addContactAsExposurePartyInvolved(claimContactRoleName : String)

  /**
   * Updates the email address of a named contact on the current claim
   * @param contactName
   * @param email
   */
  function updateEmailAddressForContact(contactName : String, email : String)

  /**
   * Updates the bank information of a named contact on the current claim
   * @param contactName
   * @param table
   *    - Account Name      - String                     - The name of the bank account
   *    - Bank Name         - String                     - The name of the bank
   *    - Account Type      - String (BankAccountType)   - The type of account
   *    - Account Number    - Number                     - The bank account number
   *    - Routing Number    - Number                     - The bank routing number
   * e.g
   * | Account Name       | Bank Name      | Account Type | Account Number | Routing Number |
   * | My savings account | Bank of Uganda | Checking     | 12345          | 67890          |
   */
  function updateBankInformationForContact(contactName : String, table : DataTable)

  /**
   * Verifies the email of a named contact
   * @param contactName
   * @param email
   */
  function verifyEmailAddressForContact(contactName : String, email : String)

  /**
   * Verifies the bank information for a named contact
   * @param contactName
   * @param table
   *    - Account Name      - String                     - The name of the bank account
   *    - Bank Name         - String                     - The name of the bank
   *    - Account Type      - String (BankAccountType)   - The type of account
   *    - Account Number    - Number                     - The bank account number
   *    - Routing Number    - Number                     - The bank routing number
   * e.g
   * | Account Name       | Bank Name      | Account Type | Account Number | Routing Number |
   * | My savings account | Bank of Uganda | Checking     | 12345          | 67890          |
   */
  function verifyBankInfoForContact(contactName : String, table : DataTable)

  /**
   * Verify a person contact with the given role exist on claim
   *
   * @param claimContactRoleName - The name of the ClaimContactRole
   */
  function verifyContactWithRoleName(claimContactRoleName : String)

  /**
   * Verify a contact of the specified subtype with the given role exist on claim
   *
   * @param contactSubTypeName - The subtype of the contact
   * @param contactRoleName - The name of the ContactRole
   */
  function verifyContactWithContactTypeAndRoleName(contactSubTypeName : String, contactRoleName : String)

  /**
   * Verify a contact with the given roles exist on claim
   *
   * @param contactRoleName1 - The name of the ContactRole
   * @param contactRoleName2 - The name of the ContactRole
   */
  function verifyContactWithTwoContactRolesContactRoleName(contactRoleName1 : String, contactRoleName2 : String)

  /**
   * Verify a contact is a party involved on claim
   * @param table
   *    - Field     - String      - The name of the field
   *    - Value     - String      - The value the field should be set to
   * e.g
   * | Name    | Health South    |
   * | Address | 9032 Market Str |
   * | City    | San Francisco   |
   */
  function verifyContactPartyInvolved(table : DataTable)

  /**
   * Removes the contact from the claim
   * @param contactName
   */
  function deleteContact(contactName : String)

  /**
   * Verifies the contact has been removed
   * @param contactName
   */
  function verifyContactRemoved(contactName : String)
}
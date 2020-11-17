package gw.cucumber.context.api.common

uses cucumber.api.DataTable

/**
 * Methods related to the global address book
 */
@SuppressWarnings("Method2Property")
interface AddressBookContext {

  /**
   * Verify a specified contact exists in the global address book
   *
   * @param contactSubTypeName The subtype of the Contact
   * @param table              - Field     - String      - The address field
   *                           - Value     - String      - The value of the field
   *                           e.g
   *                           | Name | Health South  |
   *                           | City | San Francisco |
   */
  function verifyContactIsInAddressBook(contactSubTypeName : String, table : DataTable)

  /**
   * set the contacts availability to work
   *
   * @param contactSubTypeName
   * @param isAvailableToWork
   */
  function setAvailableToWork(contactSubTypeName : String, isAvailableToWork : boolean)

  /**
   * set the contacts bakcup withholding
   *
   * @param contactSubTypeName
   * @param hasBackupWithholding
   */
  function setBackupWithholding(contactSubTypeName : String, hasBackupWithholding : boolean)
}
@common @CC-COM-SysFuncContacts-ClaimMaintenance @suite
Feature: Contacts - Claim Maintenance (CC-COM-SysFuncContacts-ClaimMaintenance)

  As an adjuster,
  I want to be able to create, update, and delete claim contacts
  So that we ensure contact data integrity

  Background:
    Given I am a user with the "Adjuster" role

  @23150.2-GW
  Scenario: 1. Edit contact on an existing claim
    Given a Personal Auto claim
    And the policy on the claim has the following covered parties:
      | First  | Last |
      | Brooke | Wynn |
    When I update the email address for "Brooke Wynn" to "bwynn@guidewire.com"
    And I add bank account information for "Brooke Wynn"
      | Account Name       | Bank Name      | Account Type | Account Number | Routing Number |
      | My savings account | Bank of Uganda | Checking     | 12345          | 67890          |
    Then the email address for "Brooke Wynn" should be "bwynn@guidewire.com"
    And the bank account information for "Brooke Wynn" should be updated
      | Account Name       | Bank Name      | Account Type | Account Number | Routing Number |
      | My savings account | Bank of Uganda | Checking     | 12345          | 67890          |

  @23150.2-GW
  Scenario: 2. Delete a contact on an existing claim
    Given a Personal Auto claim
    And the policy on the claim has the following covered parties:
      | First  | Last |
      | Brooke | Wynn |
    When I remove the contact "Brooke Wynn" from the claim
    Then the contact "Brooke Wynn" should not be listed on the claim

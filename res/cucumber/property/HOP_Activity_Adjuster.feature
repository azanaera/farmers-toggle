@homeowners
Feature: Activity

  As an adjuster,
  I want to add new activities to existing claims and also perform actions on open activities.

  Background:
    Given I am a user with the "Adjuster" role

  Scenario: Creating activities on an existing Homeowners claim
    Given a Homeowners claim
    When I add activities with following categories and subjects:
      | Reminder | 30 day diary    |
      | Reminder | Verify coverage |
      | Request  | Legal review    |
    Then activities with following subjects should be on the claim:
      | 30 day diary    |
      | Verify coverage |
      | Legal review    |

  Scenario: Closing an open activity
    Given a Homeowners claim
    And an open activity on the claim
    When I complete the activity
    Then the activity status should be "Complete"
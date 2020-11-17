@personal_auto @Common-SC-11-CloseClaim @suite
Feature: Close Claim - Adjuster (PA_CloseClaim_Adjuster)

  As an adjuster, I want to close and re-open claims.

  Background:
    Given I am a user with the "Adjuster" role

  @23240-GW
  Scenario: 1. Closing a Personal Auto claim
    Given a Personal Auto claim
    And all activities are completed
    And all exposures are closed
    And all matters are closed
    And all service requests are completed
    And subrogation is closed
    And fault rating is determined
    When I close the claim
    Then the claim status should be "Closed"

  @23240-GW
  Scenario: 2. Re-opening a Personal Auto claim
    Given a Personal Auto claim
    And the claim is closed
    When I re-open the claim
    Then the claim status should be "Open"

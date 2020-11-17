@common @CC-COM-CloseClaim-CloseClaim @suite
Feature: Close Claim (CC-COM-CloseClaim-CloseClaim)

  As an adjuster, I want to close and re-open claims.

  Background:
    Given I am a user with the "Adjuster" role

  @23240-GW
  Scenario: 1. Close a claim - Negative Test due to activities
    Given a Personal Auto claim
    And the claim has open activities
    When I try to close the claim
    Then I could not close the claim

  @23240-GW
  Scenario: 2. Close a claim - Negative Test due to exposures
    Given a Personal Auto claim
    And the claim has a "collision" exposure
    When I try to close the claim
    Then I could not close the claim

  @23240-GW
  Scenario: 3. Close a claim - Negative Test due to matters
    Given a Personal Auto claim
    And the claim has open matters
    When I try to close the claim
    Then I could not close the claim

  @23240-GW
  Scenario: 4. Close a claim - Negative Test due to service requests
    Given a Personal Auto claim
    And the claim has open service requests
    When I try to close the claim
    Then I could not close the claim

@common @CC-COM-CaptureResponses-ClaimMaintenance @suite
Feature: Claim Associations (CC-COM-CaptureResponses-ClaimMaintenance)

  As an Adjuster,
  I want to associate claims
  So that I can ensure data on the claim represents the loss

  Background:
    Given I am a user with the "Adjuster" role

  @23130-GW
  Scenario: 1. Create a new association between 2 claims
    Given a Personal Auto claim
    And another Personal Auto claim
    When I associate these claims with the title "Prior claim on the vehicle"
    Then an association with the title "Prior claim on the vehicle" should exist between both claims

  @23130-GW
  Scenario: 2. Find an association between 2 claims
    Given a Personal Auto claim
    And another Personal Auto claim
    And these claims are associated with the title "Prior claim on the vehicle"
    Then an association with the title "Prior claim on the vehicle" should exist between both claims

  @23130-GW
  Scenario: 3. Update an association between 2 claims
    Given a Personal Auto claim
    And another Personal Auto claim
    When I associate these claims with the title "Prior claim on the vehicle"
    And I change the "Prior claim on the vehicle" association type to "Companion Claim"
    Then an association with the title "Prior claim on the vehicle" and type "Companion Claim" should exist between both claims

  @23130-GW
  Scenario: 4. Delete an association between 2 claims
    Given a Personal Auto claim
    And another Personal Auto claim
    When I associate these claims with the title "Prior claim on the vehicle"
    And I delete the "Prior claim on the vehicle" association
    Then an association with the title "Prior claim on the vehicle" should not exist between both claims

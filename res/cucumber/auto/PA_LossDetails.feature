@personal_auto @PA_LossDetails @suite
Feature: Claim Associations - Adjuster (PA_LossDetails)

  As an Adjuster,
  I want to be able to indicate relationships or associations betweeen a claim and other claims or events
  So that I can track our current understanding of the loss.

  Background:
    Given I am a user with the "Adjuster" role

  Scenario: 1. CRUD operation – New Association
    Given a Personal Auto claim
    And another Personal Auto claim
    When I associate these claims with the title "Prior claim on the vehicle"
    Then an association with the title "Prior claim on the vehicle" should exist between both claims

  Scenario: 2. CRUD operation – Find Association
    Given a Personal Auto claim
    And another Personal Auto claim
    And these claims are associated with the title "Prior claim on the vehicle"
    Then an association with the title "Prior claim on the vehicle" should exist between both claims

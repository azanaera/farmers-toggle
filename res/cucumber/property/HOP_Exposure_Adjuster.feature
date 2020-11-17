@homeowners
Feature: Exposure

  As an adjuster,
  I want to create exposures while filing a new claim and on existing claims.

  Background:
    Given I am a user with the "Adjuster" role

  Scenario: Creating a dwelling exposure on an existing Homeowners claim
    Given a Homeowners claim
    And the claim has a dwelling incident
    When I add a dwelling exposure referencing the incident
    Then a "Coverage A - Dwelling" exposure should be created on the claim
    And the exposure should reference the dwelling incident
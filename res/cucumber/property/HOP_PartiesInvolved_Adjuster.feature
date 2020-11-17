@homeowners
Feature: Parties Involved

  As an adjuster,
  I want to add contacts for existing claims.

  Background:
    Given I am a user with the "Adjuster" role

  Scenario: Adding a contact to an existing Homeowners claim
    Given a Homeowners claim
    When I add a person contact with "Other" role to the existing claim
    Then a person contact with "Other" role should be on the claim
@homeowners
Feature: Parties Involved

  As a customer service representative,
  I want to add contacts for new claims.

  Background:
    Given I am a user with the "Customer Service Associate" role

  Scenario: Adding a contact to a new Homeowners claim
    Given a Homeowners policy
    When I start filing a claim
    And I add a person contact with "Other" role
    And I finish filing the claim
    Then a "Homeowners" claim should be created
    And a person contact with "Other" role should be on the claim
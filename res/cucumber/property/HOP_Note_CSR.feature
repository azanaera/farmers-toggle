@homeowners
Feature: Note

  As a customer service representative,
  I want to add new notes while filing claims.

  Background:
    Given I am a user with the "Customer Service Associate" role

  Scenario: Adding a note to a new Homeowners claim
    Given a Homeowners policy
    When I start filing a claim
    And I add a note
    And I finish filing the claim
    Then a "Homeowners" claim should be created
    And a note should be on the claim
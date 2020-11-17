@commercial_property
Feature: New Claim Creation

  As an adjuster,
  I want to file claims against unverified policies
  So that claims can be recorded and processed

  Background:
    Given I am a user with the "Adjuster" role

  Scenario: Create a new Commercial Property claim for an Insured injured due to hail
    Given a Commercial Property policy
    When I start filing a claim
    And I set claim loss cause to "Hail"
    And I add a "Insured's loss" injury incident
    And I finish filing the claim
    Then a "Commercial Property" claim should be created
    And the claim loss cause should be "Hail"
    And an injury incident should be created on the claim

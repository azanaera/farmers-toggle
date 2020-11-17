@homeowners
Feature: New Claim Creation

  As an adjuster,
  I want to file claims against unverified policies.

  Background:
    Given I am a user with the "Adjuster" role

  Scenario: Filing a new Homeowners claim with a hail loss cause against an unverified policy
    # Given no existing "Homeowner" policy
    When I start filing a claim
    And I create an unverified Homeowners policy
    And I set claim loss cause to "Hail"
    And I finish filing the claim
    Then a "Homeowners" claim should be created
    And the claim loss cause should be "Hail"
    And the policy on the claim should be unverified

  Scenario: Filing a new Homeowners claim with a fire loss cause and an injury incident against an unverified policy
    # Given no existing "Homeowners" policy
    When I start filing a claim
    And I create an unverified Homeowners policy
    And I set claim loss cause to "Fire"
    And I add a "Insured's loss" injury incident
    And I finish filing the claim
    Then a "Homeowners" claim should be created
    And the claim loss cause should be "Fire"
    And an injury incident should be created on the claim
    And the injury loss party type should be "Insured's loss"
    And the policy on the claim should be unverified
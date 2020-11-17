@personal_auto @PA_NewClaimCreation_CSR @suite
Feature: New Claim Creation CSR (PA_NewClaimCreation_CSR)

  As a customer service representative,
  I want to file claims against verified policies, and issue checks while filing claims through Auto First and Final Wizard.

  Background:
    Given I am a user with the "Customer Service Associate" role
    And I have the "Toggle Auto APD Specialist Level 1" authority limit profile

  Scenario Outline: 1. Filing a new Personal Auto claim with a loss cause
    Given a Personal Auto policy
    When I start filing a claim
    And I set claim loss cause to "<Loss Cause>"
    And I finish filing the claim
    Then a "Personal Auto" claim should be created
    And the claim loss cause should be "<Loss Cause>"

    Examples:
      | Loss Cause                   |
      | Animal                       |
      | Collision while turning left |
      | Glass breakage               |

  Scenario: 2. Filing a new Personal Auto claim for collision with motor vehicle to an insured's vehicle
    Given a Personal Auto policy
    When I start filing a claim
    And I select the "1st" covered vehicle
    And I set claim loss cause to "Collision with motor vehicle"
    And I finish filing the claim
    Then a "Personal Auto" claim should be created
    And an incident for the selected vehicle should be created on the claim
    And a "Collision" exposure should be created on the claim

  # TODO ignoring S3: First and Final is broken
  @ignore
  Scenario: 3. Filing a new Personal Auto claim through Auto First and Final Wizard
    Given a Personal Auto policy
    When I start filing a claim in Auto First and Final Wizard
    And I add an autobody repair shop "Advanced Auto Repair Center"
    And I create a "500 USD" check to "Advanced Auto Repair Center"
    And I finish filing the claim
    Then a "Personal Auto" claim should be created
    And a "500 USD" check to "Advanced Auto Repair Center" should exist on the claim

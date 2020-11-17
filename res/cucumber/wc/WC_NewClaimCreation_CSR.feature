@workers_comp
Feature: New Claim Creation

  As a customer service representative,
  I want to file claims against verified policies through the New Claim Wizard.

  Background:
    Given I am a user with the "Customer Service Associate" role
    And I am in the "Workers Comp" security zone

  Scenario: Filing a new Workers Compensation claim for an Injured Worker
    Given a Workers' Compensation policy
    When I start filing a claim
    And I set the Loss Date to "today"
    And I set the Date Employer Notified to "today"
    And I add the Injured Worker
    And I set the Incident Location
    And I set Cause of Injury to "Fall, Slip, or Trip Injury"
    And I set Primary Injury Type to "Specific Injury"
    And I set Detailed Injury Type to "Fracture"
    And the Injured Worker will have lost time from work
    And I finish filing the claim
    Then a "Workers' Compensation" claim should be created
    And the Injured Worker should be person contact with "Claimant" role on the claim
    And the claim will have a "Medical Details" exposure
    And the claim will have a "Indemnity" exposure

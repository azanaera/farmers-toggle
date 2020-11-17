@workers_comp
Feature: Assignment

  As a customer service representative,
  I want to create and assign claims manually and automated using assignment rules.

  Background:
    Given I am a user with the "Customer Service Associate" role
    And I am in the "Workers Comp" security zone

  Scenario: Assigning a new Workers' Compensation claim with no Indemnity through automated assignment
    Given a Workers' Compensation policy
    # And gosu rules to automatically assign the claim: GCAP00010 - If the claim loss type is workers' compensation, this rule uses the loss type and claim segment to get the top two matching group type choices for assigning this claim.
    When I start filing a claim
    And I add the Injured Worker
    And I set the Loss Date to "today"
    And I set the Date Employer Notified to "today"
    And I set incident location to an address in state "California"
    And I set Cause of Injury to "Fall, Slip, or Trip Injury"
    And I set Primary Injury Type to "Specific Injury"
    And I set Detailed Injury Type to "Fracture"
    And I assign the claim through automated assignment
    And I finish filing the claim
    Then a "Workers' Compensation" claim should be created
    And the claim should be assigned to a user in "Comp - TeamB" group
    And the claim segment should be "Workers' Comp - indemnity"

  Scenario: Assigning a new Workers' Compensation claim with Indemnity through automated assignment
    Given a Workers' Compensation policy
    # And gosu rules to automatically assign the claim: GCAP00010 - If the claim loss type is workers' compensation, this rule uses the loss type and claim segment to get the top two matching group type choices for assigning this claim.
    When I start filing a claim
    And I add the Injured Worker
    And I set the Loss Date to "today"
    And I set the Date Employer Notified to "today"
    And I set incident location to an address in state "California"
    And I set Cause of Injury to "Fall, Slip, or Trip Injury"
    And I set Primary Injury Type to "Specific Injury"
    And I set Detailed Injury Type to "Fracture"
    And the Injured Worker will have lost time from work
    And I assign the claim through automated assignment
    And I finish filing the claim
    Then a "Workers' Compensation" claim should be created
    And the claim should be assigned to a user in "Comp - TeamB" group
    And the claim segment should be "Workers' Comp - indemnity"

  Scenario: Manually assigning a new Workers' Compensation claim
    Given a Workers' Compensation policy
    When I start filing a claim
    And I manually assign the claim to group "Comp - TeamB" and user "Candice Payne"
    And I finish filing the claim
    Then a "Workers' Compensation" claim should be created
    And the claim should be assigned to group "Comp - TeamB"
    And the claim should be assigned to user "Candice Payne"
    And the claim segment should be "Workers' Comp - indemnity"

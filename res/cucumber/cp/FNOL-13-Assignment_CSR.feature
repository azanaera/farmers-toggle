@commercial_property @FNOL-13-Assignment
Feature: Assignment

  As a customer service representative,
  I want to create and assign claims manually and automated using assignment rules
  So that workload can be divided and issues can be escalated

  Background:
    Given I am a user with the "Customer Service Associate" role

  @23860-2-GW
  Scenario: Assigning a claim through automated assignment during FNOL
    Given a Commercial Property policy
    # And gosu rules to automatically assign the claim: GCAP00010 - If the claim loss type is property, this rule uses the loss type and claim segment to get the top two matching group type choices for assigning this claim.
    When I start filing a claim
    And I set loss location to an address in state "California"
    And I add a "Third-party liability" injury incident
    And I assign the claim through automated assignment
    And I finish filing the claim
    Then a "Commercial Property" claim should be created
    And the claim should be assigned to a user in "Property - TeamB" group

  @23860-2-GW
  Scenario: Manually assigning a claim during FNOL
    Given a Commercial Property policy
    When I start filing a claim
    And I manually assign the claim to group "Property - TeamA" and user "Harry Atley"
    And I finish filing the claim
    Then a "Commercial Property" claim should be created
    And the claim should be assigned to group "Property - TeamA"
    And the claim should be assigned to user "Harry Atley"

  @23860-2-GW
  Scenario: Assigning a claim manually and an exposure through automated assignment on a claim during FNOL
    Given a Commercial Property policy
    When I start filing a claim
    And I set loss location to an address in state "California"
    And I add a property damage incident
      | Property Description | Damage Description  | Loss Estimate | Address 1     | City          | State      |
      | 2 bed apartment      | Flooding in kitchen | 500 USD       | 1 Main Street | San Francisco | California |
    And I manually assign the claim individually to group "Property - TeamA" and user "Harry Atley"
    And I assign the "Building Coverage" exposure through automated assignment
    And I finish filing the claim
    Then a "Commercial Property" claim should be created
    And the claim should be assigned to group "Property - TeamA"
    And the claim should be assigned to user "Harry Atley"
    And the exposure should be assigned to the claim owner

  @23860-2-GW
  Scenario: Assigning a claim through automated assignment and manually assigning an exposure on a claim during FNOL
    Given a Commercial Property policy
    When I start filing a claim
    And I set loss location to an address in state "California"
    And I add a property damage incident
      | Property Description | Damage Description  | Loss Estimate | Address 1     | City          | State      |
      | 2 bed apartment      | Flooding in kitchen | 500 USD       | 1 Main Street | San Francisco | California |
    And I assign the claim individually through automated assignment
    And I manually assign the "Building Coverage" exposure to group "Property - TeamA" and user "Harry Atley"
    And I finish filing the claim
    Then a "Commercial Property" claim should be created
    And the claim should be assigned to a user in "Property - TeamB" group
    And the exposure should be assigned to group "Property - TeamA"
    And the exposure should be assigned to user "Harry Atley"
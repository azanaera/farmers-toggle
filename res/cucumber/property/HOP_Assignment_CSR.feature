@homeowners
Feature: Assignment

  As a customer service representative,
  I want to create and assign claims manually and automated using assignment rules.

  Background:
    Given I am a user with the "Customer Service Associate" role

  Scenario: Assigning a new Homeowners claim through automated assignment
    Given a Homeowners policy
    # And gosu rules to automatically assign the claim: GCAP00010 - If the claim loss type is property, this rule uses the loss type and claim segment to get the top two matching group type choices for assigning this claim.
    When I start filing a claim
    And I set loss location to an address in state "California"
    And I add a "Third-party liability" injury incident
    And I add a bodily injury exposure
    And I assign the claim through automated assignment
    And I finish filing the claim
    Then a "Homeowners" claim should be created
    And the claim should be assigned to a user in "Property - TeamB" group

  Scenario: Manually assigning a new Homeowners claim
    Given a Homeowners policy
    When I start filing a claim
    And I manually assign the claim to group "Property - TeamA" and user "Harry Atley"
    And I finish filing the claim
    Then a "Homeowners" claim should be created
    And the claim should be assigned to group "Property - TeamA"
    And the claim should be assigned to user "Harry Atley"

  @23860-GW-I
  Scenario: Assigning a claim manually and an exposure through automated assignment on new Homeowners claim
    Given a Homeowners policy
    When I start filing a claim
    And I set loss location to an address in state "California"
    And I add a "Third-party liability" injury incident
    And I add a bodily injury exposure
    And I manually assign the claim individually to group "Property - TeamA" and user "Harry Atley"
    And I assign the "Coverage E - Personal Liability" exposure through automated assignment
    And I finish filing the claim
    Then a "Homeowners" claim should be created
    And the claim should be assigned to group "Property - TeamA"
    And the claim should be assigned to user "Harry Atley"
    And the exposure should be assigned to the claim owner

  @23860-GW-I
  Scenario: Assigning a claim through automated assignment and manually assigning an exposure on new Homeowners claim
    Given a Homeowners policy
    When I start filing a claim
    And I set loss location to an address in state "California"
    And I add a "Third-party liability" injury incident
    And I add a bodily injury exposure
    And I assign the claim individually through automated assignment
    And I manually assign the "Coverage E - Personal Liability" exposure to group "Property - TeamA" and user "Harry Atley"
    And I finish filing the claim
    Then a "Homeowners" claim should be created
    And the claim should be assigned to a user in "Property - TeamB" group
    And the exposure should be assigned to group "Property - TeamA"
    And the exposure should be assigned to user "Harry Atley"
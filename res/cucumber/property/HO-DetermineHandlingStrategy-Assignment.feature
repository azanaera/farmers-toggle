@homeowners @HO-DetermineHandlingStrategy-Assignment
Feature: Assignment

  As an adjuster,
  I want to reassign claims manually and automated using assignment rules.

  Background:
    Given I am a user with the "Adjuster" role

  @23860-GW
  Scenario: Reassign an existing Homeowners claim through automated assignment
    Given a Homeowners claim
    And the claim segment is "Property - mid complexity"
    And the claim loss location is in state "California"
    # And gosu rules to automatically assign the claim: GCAP00010 - If the claim loss type is property, this rule uses the loss type and claim segment to get the top two matching group type choices for assigning this claim.
    When I reassign the claim through automated assignment
    Then the claim should be assigned to a user in "Property - TeamB" group

  @23860-GW
  Scenario: Manually reassigning an existing Homeowners claim
    Given a Homeowners claim
    When I manually reassign the claim to group "Property - TeamA" and user "Harry Atley"
    Then the claim should be assigned to group "Property - TeamA"
    And the claim should be assigned to user "Harry Atley"

  @23860-GW
  Scenario: Manually reassigning an exposure on a Homeowners claim
    Given a Homeowners claim
    And the claim has a "Coverage A - Dwelling" exposure
    And the exposure is assigned to group "Cleveland Property Adjusters" and user "Richard Myette"
    When I manually reassign the exposure to group "Property - TeamA" and user "Harry Atley"
    Then the exposure should be assigned to group "Property - TeamA"
    And the exposure should be assigned to user "Harry Atley"

  @23860-GW
  Scenario: Manually reassigning an activity on a Homeowners claim
    Given a Homeowners claim
    And the claim has an activity
    And the activity is assigned to group "Cleveland Property Adjusters" and user "Richard Myette"
    When I manually reassign the activity to group "Property - TeamB" and user "Spencer Dunn"
    Then the activity should be assigned to group "Property - TeamB"
    And the activity should be assigned to user "Spencer Dunn"
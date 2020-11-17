@commercial_property @FNOL-13-Assignment
Feature: FNOL-13-Assignment

  As an adjuster,
  I want to re-assign claims manually and automatically using assignment rules
  So that workload can be divided and issues can be escalated

  Background:
    Given I am a user with the "Adjuster" role

  @23860-2-GW
  Scenario: Re-assign an existing claim through automated assignment
    Given a Commercial Property claim
    And the claim segment is "Property - mid complexity"
    And the claim loss location is in state "California"
    # And gosu rules to automatically assign the claim: GCAP00010 - If the claim loss type is property, this rule uses the loss type and claim segment to get the top two matching group type choices for assigning this claim.
    When I reassign the claim through automated assignment
    Then the claim should be assigned to a user in "Property - TeamB" group

  @23860-2-GW
  Scenario: Manually re-assigning an existing claim
    Given a Commercial Property claim
    When I manually reassign the claim to group "Property - TeamA" and user "Harry Atley"
    Then the claim should be assigned to group "Property - TeamA"
    And the claim should be assigned to user "Harry Atley"

  @23860-2-GW
  Scenario: Manually re-assigning an exposure on a claim
    Given a Commercial Property claim
    And the claim has a "Building Coverage" exposure
    And the exposure is assigned to group "Cleveland Property Adjusters" and user "Richard Myette"
    When I manually reassign the exposure to group "Property - TeamA" and user "Harry Atley"
    Then the exposure should be assigned to group "Property - TeamA"
    And the exposure should be assigned to user "Harry Atley"

  @23860-2-GW
  Scenario: Manually re-assigning an activity on a claim
    Given a Commercial Property claim
    And the claim has an activity
    And the activity is assigned to group "Cleveland Property Adjusters" and user "Richard Myette"
    When I manually reassign the activity to group "Property - TeamB" and user "Spencer Dunn"
    Then the activity should be assigned to group "Property - TeamB"
    And the activity should be assigned to user "Spencer Dunn"
@personal_auto @PA_Activity_Adjuster @suite
Feature: Activity - Adjuster (PA_Activity_Adjuster)

  As an adjuster,
  I want to add new activities to existing claims and also perform actions on open activities.

  Background:
    Given I am a user with the "Adjuster" role

  Scenario: 1. A New Activity is created on an existing claim
    Given a Personal Auto claim
    And the claim has a "collision" exposure
    When I create the following "Get police report" Activity:
      | Related To | Claim                |
      | Assign To  | Claim/Exposure Owner |
    Then the following activities should be on the claim:
      | Subject              | Related To | Status | Assigned To |
      | Get police report    | Claim      | open   | Claim Owner |
      | New Claim Assignment | Claim      | open   | Claim Owner |
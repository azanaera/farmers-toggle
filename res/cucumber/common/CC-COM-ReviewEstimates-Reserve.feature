@common @CC-COM-ReviewEstimates-Reserve @suite
Feature: Process reserves (CC-COM-ReviewEstimates-Reserve)

  As an adjuster,
  I want to be able to manage reserves
  So that we can estimate and track our future liabilities

  Background:
    Given I am a user with the "Adjuster" role
    And I have the following authority limits
      | Limit Type              | Amount |
      | Claim total reserves    | 5000   |
      | Reserve change size     | 5000   |
    And I have the "Approve any approval activity" permission

  #TODO ignoring: Passes locally, but on TC: Bundle invariants violated. Orphaned policy.  Each unretired Policy must be one-to-one with a Claim.
  @23300-GW @ignore
  Scenario Outline: 1. Process reserves for a Personal Auto claim
    Given a Personal Auto claim
    And the claim has a bodily injury exposure
    And a reserve for "<Amount>" on the exposure requires approval
    When I "<Action>" the reserve transaction
    Then the approval status of the reserve transaction is "<Approval Status>"

  Examples:
    | Amount | Action  | Approval Status  |
    | 1000   | Approve | Submitting       |
    | 1000   | Reject  | Rejected         |
    | 10000  | Approve | Pending Approval |

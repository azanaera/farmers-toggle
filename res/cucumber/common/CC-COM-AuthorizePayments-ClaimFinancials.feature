@common @CC-COM-AuthorizePayments-ClaimFinancials @suite
Feature: Transaction approvals (CC-COM-AuthorizePayments-ClaimFinancials)


  As an adjuster,
  I want to be able to create and edit reserves and checks,
  So that claim financials can be recorded and maintained.

  Background:
    Given I am a user with the "Adjuster" role
    And I have the following authority limits
      | Limit Type                | Amount |
      | Exposure payments to date | 5000   |
    And I have the "Approve any approval activity" permission

  # TODO CC-COM-AuthorizePayments-ClaimFinancials has inconsistent results: sometimes pass, other times fail.
  # TODO ignoring SO1: Reserve line seems to be there - but not really
  @ignore @23290.7-GW
  Scenario Outline: 1. Creating a check requires appropriate authority
    Given a Personal Auto claim
    And the claim has a bodily injury exposure
    And the exposure has available reserves for
      | Cost Type  | Cost Category | Amount |
      | Claim Cost | Bodily Injury | 11000  |
    When I create a check for "<Amount>" on the exposure
      | Payment Type | Eroding? |
      | Partial      | Yes      |
    Then the check's approval status should be "<Check Approval Status>"
    And the payment's approval status should be "<Payment Approval Status>"

    Examples:
      | Amount | Check Approval Status | Payment Approval Status |
      | 1000   | Awaiting submission   | Awaiting submission     |
      | 10000  | Pending approval      | Pending approval        |

  @ignore @23290.7-GW
  Scenario Outline: 2. Actioning a check
    Given a Personal Auto claim
    And the claim has a bodily injury exposure
    And the exposure has available reserves for
      | Cost Type  | Cost Category   | Amount |
      | Claim Cost | Material Damage | 11000  |
    And a check for "<Amount>" on the exposure requires approval
    When I "<Action>" the payment
    Then the check's approval status should be "<Check Approval Status>"
    And the payment's approval status should be "<Payment Approval Status>"

    Examples:
      | Amount | Action  | Check Approval Status | Payment Approval Status |
      | 1000   | Approve | Awaiting submission   | Awaiting submission     |
      | 1000   | Reject  | Rejected              | Rejected                |

  # TODO ignoring CC-COM-AuthorizePayments-ClaimFinancials.S3: ISBTF failing; yields a UI rendering error:
  #      Invoking withClaim and withExposure together when the exposure is on a different claim is not supported
  @ignore @23290.7-GW
  Scenario: 3. Actioning a check - Pending Approval
    Given a Personal Auto claim
    And the claim has a bodily injury exposure
    And the exposure has available reserves for
      | Cost Type  | Cost Category   | Amount |
      | Claim Cost | Material Damage | 11000  |
    And a check for "1000" on the exposure requires approval
    When I "Approve" the payment
    Then the check's approval status should be "Pending approval"
    And the payment's approval status should be "Pending approval"

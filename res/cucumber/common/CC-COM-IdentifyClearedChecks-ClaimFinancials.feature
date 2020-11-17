@common @CC-COM-IdentifyClearedChecks-ClaimFinancials @suite
Feature: Claim Financials (CC-COM-IdentifyClearedChecks-ClaimFinancials)

  As an adjuster,
  I want to be able to process payments in ClaimCenter which have already been created.
  I want to be able to process payments:
  - Process Checks (modify, delete,  void, stop)
  - Process Payments (modify)
  So that I can verify the check/payment life cycle progression

  Background:
    Given I am a user with the "Adjuster" role
    And I have the "Toggle Auto APD Specialist Level 1" authority limit profile

  @23290.4-GW
  Scenario Outline: 1. Void a Check
    Given a Personal Auto claim
    And the claim has a "Collision" exposure
    And I set "3000 USD" available reserves for "Claim Cost" and "Material Damage"
    And a check payment exists against the reserve line
      | Cost Type   | Cost Category   | Amount   | Reserving Currency   | Payment Type   | Eroding   | Check Status   | Payment Status   |
      | <Cost Type> | <Cost Category> | <Amount> | <Reserving Currency> | <Payment Type> | <Eroding> | <Check Status> | <Payment Status> |
    When I void the check
    Then the check is "<Result Check Status>"
    Examples:
      | Cost Type  | Cost Category   | Amount  | Reserving Currency | Payment Type | Eroding | Check Status        | Payment Status | Result Check Status |
      | Claim Cost | Material Damage | 100 USD | USD                | Partial      | Yes     | Awaiting submission | Submitted      | Awaiting submission |
      | Claim Cost | Material Damage | 200 USD | USD                | Partial      | Yes     | Issued              | Submitted      | Pending void        |
#      | Claim Cost | Material Damage | 300 USD | USD                | Partial      | Yes     | Notifying           | Submitted      | Pending void        |
#      | Claim Cost | Material Damage | 400 USD | USD                | Partial      | Yes     | Requested           | Submitted      | Pending void        |
#      | Claim Cost | Material Damage | 500 USD | USD                | Partial      | Yes     | Requesting          | Submitted      | Pending void        |

  @23290.4-GW
  Scenario Outline: 2. Stop a Check
    Given a Personal Auto claim
    And the claim has a "Collision" exposure
    And I set "3000 USD" available reserves for "Claim Cost" and "Material Damage"
    And a check payment exists against the reserve line
      | Cost Type   | Cost Category   | Amount   | Reserving Currency   | Payment Type   | Eroding   | Check Status   | Payment Status   |
      | <Cost Type> | <Cost Category> | <Amount> | <Reserving Currency> | <Payment Type> | <Eroding> | <Check Status> | <Payment Status> |
    When I stop the check
    Then the check is "<Result Check Status>"
    Examples:
      | Cost Type  | Cost Category   | Amount  | Reserving Currency | Payment Type | Eroding | Check Status        | Payment Status | Result Check Status |
      | Claim Cost | Material Damage | 100 USD | USD                | Partial      | Yes     | Awaiting submission | Submitted      | Awaiting submission |
      | Claim Cost | Material Damage | 200 USD | USD                | Partial      | Yes     | Issued              | Submitted      | Pending stop        |
#      | Claim Cost | Material Damage | 300 USD | USD                | Partial      | Yes     | Notifying           | Submitted      | Pending stop        |
#      | Claim Cost | Material Damage | 400 USD | USD                | Partial      | Yes     | Requested           | Submitted      | Pending stop        |
#      | Claim Cost | Material Damage | 500 USD | USD                | Partial      | Yes     | Requesting          | Submitted      | Pending stop        |

  @23290.4-GW
  Scenario Outline: 3. Delete a Check
    Given a Personal Auto claim
    And the claim has a "Collision" exposure
    And I set "3000 USD" available reserves for "Claim Cost" and "Material Damage"
    And a check payment exists against the reserve line
      | Cost Type   | Cost Category   | Amount   | Reserving Currency   | Payment Type   | Eroding   | Check Status   | Payment Status   |
      | <Cost Type> | <Cost Category> | <Amount> | <Reserving Currency> | <Payment Type> | <Eroding> | <Check Status> | <Payment Status> |
    When I delete the check
    Then the check is deleted
    Examples:
      | Cost Type  | Cost Category   | Amount  | Reserving Currency | Payment Type | Eroding | Check Status        | Payment Status |
      | Claim Cost | Material Damage | 100 USD | USD                | Partial      | Yes     | Draft               | Submitted      |
      | Claim Cost | Material Damage | 200 USD | USD                | Partial      | Yes     | Pending approval    | Submitted      |
      | Claim Cost | Material Damage | 300 USD | USD                | Partial      | Yes     | Awaiting submission | Submitted      |
      | Claim Cost | Material Damage | 400 USD | USD                | Partial      | Yes     | Rejected            | Submitted      |
      | Claim Cost | Material Damage | 500 USD | USD                | Partial      | Yes     | Denied              | Submitted      |

  @23290.5-GW
  Scenario Outline: 4. Transfer a Check
    Given a Personal Auto claim
    And the claim has a "Collision" exposure
    And I set "3000 USD" available reserves for "Claim Cost" and "Material Damage"
    And another Personal Auto claim
    And the claim has a "Collision" exposure
    And I set "4000 USD" available reserves for "Claim Cost" and "Material Damage"
    And a check payment exists against the reserve line
      | Cost Type   | Cost Category   | Amount   | Reserving Currency   | Payment Type   | Eroding   | Check Status   | Payment Status   |
      | <Cost Type> | <Cost Category> | <Amount> | <Reserving Currency> | <Payment Type> | <Eroding> | <Check Status> | <Payment Status> |
    When I transfer the check to the first claim
    Then the check is "<Result Check Status>"
    Examples:
      | Cost Type  | Cost Category   | Amount  | Reserving Currency | Payment Type | Eroding | Check Status        | Payment Status | Result Check Status |
      | Claim Cost | Material Damage | 100 USD | USD                | Partial      | Yes     | Cleared             | Submitted      | Pending transfer    |
      | Claim Cost | Material Damage | 200 USD | USD                | Partial      | Yes     | Issued              | Submitted      | Pending transfer    |
#      | Claim Cost | Material Damage | 300 USD | USD                | Partial      | Yes     | Notifying           | Submitted      | Pending transfer    |
#      | Claim Cost | Material Damage | 400 USD | USD                | Partial      | Yes     | Requested           | Submitted      | Pending transfer    |
#      | Claim Cost | Material Damage | 500 USD | USD                | Partial      | Yes     | Requesting          | Submitted      | Pending transfer    |
      | Claim Cost | Material Damage | 600 USD | USD                | Partial      | Yes     | Awaiting submission | Submitted      | Awaiting submission |

  @23290.5-GW
  Scenario Outline: 5. Re-Issue Check
    Given a Personal Auto claim
    And the claim has a "Collision" exposure
    And I set "3000 USD" available reserves for "Claim Cost" and "Material Damage"
    And a check exists against the reserve line within a check group
      | Cost Type   | Cost Category   | Amount   | Reserving Currency   | Payment Type   | Eroding   | Check Status   | Payment Status   |
      | <Cost Type> | <Cost Category> | <Amount> | <Reserving Currency> | <Payment Type> | <Eroding> | <Check Status> | <Payment Status> |
    When I reissue the check updating the amount
    Then the check is "<Result Check Status>"
    Examples:
      | Cost Type  | Cost Category   | Amount  | Reserving Currency | Payment Type | Eroding | Check Status | Payment Status | Result Check Status |
      | Claim Cost | Material Damage | 100 USD | USD                | Partial      | Yes     | Issued       | Submitted      | Pending void        |
#      | Claim Cost | Material Damage | 200 USD | USD                | Partial      | Yes     | Notifying    | Submitted      | Pending void        |
#      | Claim Cost | Material Damage | 300 USD | USD                | Partial      | Yes     | Requested    | Submitted      | Pending void        |
#      | Claim Cost | Material Damage | 400 USD | USD                | Partial      | Yes     | Requesting   | Submitted      | Pending void        |
      | Claim Cost | Material Damage | 500 USD | USD                | Partial      | Yes     | Cleared      | Submitted      | Cleared             |

  @23290.5-GW
  Scenario: 6. Clone a Check
    Given a Personal Auto claim
    And the claim has a "Collision" exposure
    And the exposure has "1000 USD" available reserves for "Claim Cost" and "Material Damage"
    And a check payment exists against the reserve line
      | Cost Type  | Cost Category   | Amount  | Reserving Currency | Payment Type | Eroding | Check Status        | Payment Status |
      | Claim Cost | Material Damage | 300 USD | USD                | Partial      | Yes     | Awaiting submission | Submitted      |
    When I clone the check
    And I change the payment amount to "400 USD"
    Then a "400 USD" "Partial" payment should exist on the reserve line
    And the exposure should have the following remaining reserves:
      | Cost Type  | Cost Category   | Amount  |
      | Claim Cost | Material Damage | 300 USD |

  @23290.5-GW
  Scenario: 7. Recoding a check
    Given a Personal Auto claim
    And the claim has a "Collision" exposure
    And the exposure has available reserves for
      | Cost Type  | Cost Category   | Amount   |
      | Claim Cost | Material Damage | 2500 USD |
      | Expense    | Material Damage | 500 USD  |
    And a check exists against the reserve line within a check group
      | Cost Type  | Cost Category   | Amount  | Reserving Currency | Payment Type | Eroding | Check Status | Payment Status |
      | Claim Cost | Material Damage | 300 USD | USD                | Partial      | Yes     | Issued       | Submitted      |
    When I recode the payment to update the reserve for "Expense" and "Material Damage"
    Then the check is "Issued"

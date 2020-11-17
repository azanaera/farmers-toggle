@personal_auto @PA_Financials_Adjuster @suite
Feature: Create reserves and checks - Adjuster (PA_Financials_Adjuster)

  As an adjuster,
  I want to be able to create and edit reserves and checks.

  Background:
    Given I am a user with the "Adjuster" role
    And I have the "Toggle Auto APD Specialist Level 1" authority limit profile

  # TODO ignoring SO2 - SO5: ISBTF can't find the Exposure in the Reserve drop-down, but I CAN find it on the UI
  @ignore
  Scenario Outline: 2. Manually creating a reserve on an existing Personal Auto claim
    Given a Personal Auto claim
    And the claim has a bodily injury exposure
    When I create "<Reserve Amount>" available reserves for "<Cost Type>" and "<Cost Category>"
    Then the exposure should have the following remaining reserves:
      | Cost Type   | Cost Category   | Amount           |
      | <Cost Type> | <Cost Category> | <Reserve Amount> |

    Examples:
      | Cost Type  | Cost Category | Reserve Amount |
      | Claim Cost | Bodily Injury | 500 USD        |
      | Expense    | Bodily Injury | 300 USD        |

  @ignore
  Scenario Outline: 3. Changing a reserve on an existing claim
    Given a Personal Auto claim
    And the claim has a bodily injury exposure
    And the exposure has "<Reserve Amount>" available reserves for "<Cost Type>" and "<Cost Category>"
    When I set "<New Reserve Amount>" available reserves for "<Cost Type>" and "<Cost Category>"
    Then the exposure should have the following remaining reserves:
      | Cost Type   | Cost Category   | Amount               |
      | <Cost Type> | <Cost Category> | <New Reserve Amount> |

    Examples:
      | Cost Type  | Cost Category | Reserve Amount | New Reserve Amount |
      | Claim Cost | Bodily Injury | 500 USD        | 600 USD            |
      | Expense    | Bodily Injury | 300 USD        | 200 USD            |

  @ignore
  Scenario Outline: 4. Creating a payment when there are enough available reserves
    Given a Personal Auto claim
    And the claim has a bodily injury exposure
    And the exposure has "<Reserve Amount>" available reserves for "<Cost Type>" and "<Cost Category>"
    When I create a check with a "<Payment Amount>" "<Payment Type>" payment on the reserve line
    Then a "<Payment Amount>" "<Payment Type>" payment should exist on the reserve line
    Then the exposure should have the following remaining reserves:
      | Cost Type   | Cost Category   | Amount                     |
      | <Cost Type> | <Cost Category> | <Remaining Reserve Amount> |

    Examples:
      | Cost Type  | Cost Category | Reserve Amount | Payment Amount | Remaining Reserve Amount | Payment Type |
      | Claim Cost | Bodily Injury | 500 USD        | 100 USD        | 400 USD                  | Partial      |
      | Expense    | Bodily Injury | 300 USD        | 50 USD         | 0 USD                    | Final        |

  @ignore
  Scenario Outline: 5. Editing a payment
    Given a Personal Auto claim
    And the claim has a bodily injury exposure
    And the exposure has "<Reserve Amount>" available reserves for "<Cost Type>" and "<Cost Category>"
    When I create a check with a "<Payment Amount>" "<Payment Type>" payment on the reserve line
    And I change the payment amount to "<New Payment Amount>"
    Then a "<New Payment Amount>" "<Payment Type>" payment should exist on the reserve line
    Then the exposure should have the following remaining reserves:
      | Cost Type   | Cost Category   | Amount                     |
      | <Cost Type> | <Cost Category> | <Remaining Reserve Amount> |

    Examples:
      | Cost Type  | Cost Category | Reserve Amount | Payment Amount | New Payment Amount | Remaining Reserve Amount | Payment Type |
      | Claim Cost | Bodily Injury | 500 USD        | 100 USD        | 200 USD            | 300 USD                  | Partial      |
      | Expense    | Bodily Injury | 300 USD        | 200 USD        | 50 USD             | 0 USD                    | Final        |

  Scenario: 6. Creating a supplemental payment
    Given a Personal Auto claim
    And the claim has a "collision" exposure
    And the exposure has "500 USD" available reserves for "Claim Cost" and "Material Damage"
    And the exposure has a check with a "500 USD" "Partial" payment on the reserve line
    And the exposure is closed
    And the claim is closed
    When I create a check with a "800 USD" "Supplement" payment on the reserve line
    Then a "800 USD" "Supplement" payment should exist on the reserve line

  Scenario: 7. Creating a payment for an amount more than the available reserve
    Given a Personal Auto claim
    And the claim has a "collision" exposure
    And I choose the insured to be the claimant for the vehicle exposure
    And the exposure has "400 USD" available reserves for "Claim Cost" and "Material Damage"
    When I start creating a check
    And I create a payment on the exposure
      | Cost Type  | Cost Category   | Reserving Currency | Payment Type | Eroding |
      | Claim Cost | Material Damage | USD                | Final        | Yes     |
    And I create these line items
      | Category              | Amount |
      | Mileage reimbursement | 300    |
      | Other                 | 200    |
    And I finish creating a check

    Given a Personal Auto claim
    And the claim has a "collision" exposure
    And I choose the insured to be the claimant for the vehicle exposure
    And the exposure has "400 USD" available reserves for "Claim Cost" and "Material Damage"
    When I start creating a check
    # Default to Insured if not set
    # And the "Insured" is the primary payee
    # I am paying via check / EFT
    And I create a payment on the exposure
      | Cost Type  | Cost Category   | Reserving Currency | Payment Type | Eroding |
      | Claim Cost | Material Damage | USD                | Partial      | Yes     |
    And I create these line items
      | Category              | Amount |
      | Mileage reimbursement | 300    |
    Then I cannot finish because "This payment cannot be added because the sum of its line items' amounts exceeds the available reserves for its ReserveLine."

  # This scenario depends on AllowNoPriorPaymentSupplement being false
  Scenario: 8. Payments on closed claims
    Given a Personal Auto claim
    And the claim has a "collision" exposure
    And I choose the insured to be the claimant for the vehicle exposure
    And all exposures are closed
    And the claim is closed
    And the claim has no prior payments or checks
    Then payment options are not available on the closed claim

  Scenario: 9. Supplemental payment on closed claims
    Given a Personal Auto claim
    And the claim has a "collision" exposure
    And I choose the insured to be the claimant for the vehicle exposure
    And the exposure has "500 USD" available reserves for "Claim Cost" and "Material Damage"
    And the exposure has a check with a "500 USD" "Partial" payment on the reserve line
    And all exposures are closed
    And the claim is closed
    Then payment options are not available on the closed claim

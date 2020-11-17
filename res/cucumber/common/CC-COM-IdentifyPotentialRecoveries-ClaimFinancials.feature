@common @CC-COM-IdentifyPotentialRecoveries-ClaimFinancials @suite
Feature: Create reserves and checks (CC-COM-IdentifyPotentialRecoveries-ClaimFinancials)

  As an adjuster,
  I want to be able to create and maintain recovery reserves
  So that expected payments can be viewed and monitored.

  Background:
    Given I am a user with the "Adjuster" role
    And I have the "Toggle Auto APD Specialist Level 1" authority limit profile

  @23320-GW
  Scenario Outline: 1. Create a reserve line on a Personal Auto claim which causes a recovery reserve to be created
    Given a Personal Auto claim
    And the claim has a "collision" exposure
    When I create a recovery reserve on the claim
      | Level   | Cost Type   | Cost Category   | Recovery Category   | Amount   |
      | <Level> | <Cost Type> | <Cost Category> | <Recovery Category> | <Amount> |
    Then the recovery reserve should exist on the claim
      | Level   | Cost Type   | Cost Category   | Recovery Category   | Amount   |
      | <Level> | <Cost Type> | <Cost Category> | <Recovery Category> | <Amount> |

    Examples:
      | Level    | Cost Type | Cost Category       | Recovery Category             | Amount |
      | Claim    | Expense   | Claim Level Expense | Unspecified Recovery Category | 200    |
      | Exposure | Expense   | Material Damage     | Deductible                    | 400    |

  @23320-GW
  Scenario Outline: 2. Modify a reserve line on a Personal Auto claim which causes the recovery reserve amount to be updated
    Given a Personal Auto claim
    And the claim has a "collision" exposure
    And a recovery reserve line on the claim
      | Level   | Cost Type   | Cost Category   | Recovery Category   | Amount   |
      | <Level> | <Cost Type> | <Cost Category> | <Recovery Category> | <Amount> |
    When I change the recovery reserve amount
      | Level   | Cost Type   | Cost Category   | Recovery Category   | Amount   | New Amount   |
      | <Level> | <Cost Type> | <Cost Category> | <Recovery Category> | <Amount> | <New Amount> |
    Then the recovery reserve should exist on the claim with a transaction showing the changed amount
      | Level   | Cost Type   | Cost Category   | Recovery Category   | Amount   | New Amount   |
      | <Level> | <Cost Type> | <Cost Category> | <Recovery Category> | <Amount> | <New Amount> |

    Examples:
      | Level    | Cost Type | Cost Category       | Recovery Category             | Amount | New Amount |
      | Claim    | Expense   | Claim Level Expense | Unspecified Recovery Category | 400    | 1200       |
      | Exposure | Expense   | Material Damage     | Credit to expense             | 500    | 300        |
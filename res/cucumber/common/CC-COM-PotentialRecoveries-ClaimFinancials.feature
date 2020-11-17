@common @CC-COM-PotentialRecoveries-ClaimFinancials @suite
Feature: Process Recoveries (CC-COM-PotentialRecoveries-ClaimFinancials)

  As an adjuster,
  I want to be able to process recoveries so that the system financials will correctly reflect that funds that should be
  applied as a credit toward a given claim have been received.

  Background:
    Given I am a user with the "Adjuster" role

  @23310-GW
  Scenario Outline: 1. As an Adjuster I want to create a recovery
    Given a Personal Auto claim
    And there is no open recoveries for the following recovery reserve lines
      | Level   | Cost Type   | Cost Category   | Recovery Category   |
      | <Level> | <Cost Type> | <Cost Category> | <Recovery Category> |
    When I create a new recovery
      | Reserve Line   | Level   | Cost Type   | Cost Category   | Recovery Category   | Line Item Category   | Amount   |
      | <Reserve Line> | <Level> | <Cost Type> | <Cost Category> | <Recovery Category> | <Line Item Category> | <Amount> |
    Then a financial transaction should be created
      | Reserve Line   | Level   | Cost Type   | Cost Category   | Recovery Category   | Line Item Category   | Amount   |
      | <Reserve Line> | <Level> | <Cost Type> | <Cost Category> | <Recovery Category> | <Line Item Category> | <Amount> |

    Examples:
      | Reserve Line | Level | Cost Type | Cost Category       | Recovery Category             | Line Item Category     | Amount  |
      | New          | Claim | Expense   | Claim Level Expense | Unspecified Recovery Category | Coverage Investigation | 800 USD |

  @23310-GW
  Scenario Outline: 2.As an Adjuster I want to create a recovery reserve
    Given a Personal Auto claim
    And there is no open recovery reserves for the following recovery reserve lines
      | Level   | Cost Type   | Cost Category   | Recovery Category   |
      | <Level> | <Cost Type> | <Cost Category> | <Recovery Category> |
    When I create a new recovery reserve
      | Level   | Cost Type   | Cost Category   | Recovery Category   | New Open Recovery Reserves |
      | <Level> | <Cost Type> | <Cost Category> | <Recovery Category> | <Amount>                   |
    Then a recovery reserve should be created
      | Level   | Cost Type   | Cost Category   | Recovery Category   | New Open Recovery Reserves |
      | <Level> | <Cost Type> | <Cost Category> | <Recovery Category> | <Amount>                   |

    Examples:
      | Level | Cost Type | Cost Category       | Recovery Category             | Amount  |
      | Claim | Expense   | Claim Level Expense | Unspecified Recovery Category | 800 USD |
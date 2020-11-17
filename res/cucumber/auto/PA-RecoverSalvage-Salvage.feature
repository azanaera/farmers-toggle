@personal_auto @PA-RecoverSalvage-Salvage @suite
Feature: Salvage - Adjuster (PA-RecoverSalvage-Salvage)

  As an adjuster,
  I want to manage the salvage of a vehicle on a claim
  So that I can verify corresponding financial transactions have been created

  Background:
    Given I am a user with the "Adjuster" role

  @23530-GW
  Scenario Outline: 1. As an Adjuster I want to create a salvage recovery
    Given a Personal Auto claim
    When I create a new recovery
      | Level   | Cost Type   | Cost Category   | Recovery Category   | Line Item Category   | Amount   |
      | <Level> | <Cost Type> | <Cost Category> | <Recovery Category> | <Line Item Category> | <Amount> |
    Then a financial transaction should be created
      | Level   | Cost Type   | Cost Category   | Recovery Category   | Line Item Category   | Amount   |
      | <Level> | <Cost Type> | <Cost Category> | <Recovery Category> | <Line Item Category> | <Amount> |

    Examples:
      | Level | Cost Type | Cost Category       | Recovery Category | Line Item Category | Amount |
      | Claim | Expense   | Claim Level Expense | Deductible        | Claim Exp Legal    | 100    |
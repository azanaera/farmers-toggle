@common @CC-COM-SysFuncClaims-ClaimFinancials @suite
Feature: Define financial summary presentation (C-COM-SysFuncClaims-ClaimFinancials)

  As an adjuster,
  I want to be able to view summary financials for my claim file
  So that I can verify the expenses on a claim

  Background:
    Given I am a user with the "Adjuster" role
    And I have the "Toggle Auto APD Specialist Level 1" authority limit profile

  @23330-GW
  Scenario Outline: 1. Financial Summary Screens
    Given a Personal Auto claim
    And the claim has a "<Exposure>" exposure
    And the exposure has "<Reserve Amount>" available reserves for "<Cost Type>" and "<Cost Category>"
    And the exposure has a check with a "<Check Amount>" "<Payment Type>" payment on the reserve line
    Then a transaction should be visible on the "<View>" Financials Summary screen
      | Exposure   | Reserve Amount   | Cost Type   | Cost Category   | Check Amount   | Payment Type   |
      | <Exposure> | <Reserve Amount> | <Cost Type> | <Cost Category> | <Check Amount> | <Payment Type> |

    Examples:
      | View            | Exposure         | Reserve Amount | Cost Type  | Cost Category   | Check Amount | Payment Type |
      | Exposure        | Collision        | 1000           | Claim Cost | Material Damage | 500          | Partial      |
      | Coverage        | Collision        | 900            | Claim Cost | Material Damage | 700          | Final        |
      | Exposure only   | Collision        | 850            | Expense    | Material Damage | 300          | Partial      |

@workers_comp
Feature: Financials

  As an adjuster,
  I want to be able to manually create reserves and checks for existing claims.

  Background:
    Given I am a user with the "Adjuster" role
    And I have the "Toggle Auto APD Specialist Level 1" authority limit profile
    And I am in the "Workers Comp" security zone

  Scenario Outline: Creating a payment when there are enough available reserves
    Given a Workers' Compensation claim
    And the claim has a Medical Details exposure
    When I create "<Reserve Amount>" available reserves for "<Cost Type>" and "<Cost Category>"
    And I create a check with a "<Payment Amount>" "<Payment Type>" payment on the reserve line
    Then a "<Payment Amount>" "<Payment Type>" payment should exist on the reserve line
    And the exposure should have the following remaining reserves:
      | Cost Type   | Cost Category   | Amount                     |
      | <Cost Type> | <Cost Category> | <Remaining Reserve Amount> |

    Examples:
      | Cost Type     | Cost Category             | Reserve Amount | Payment Amount | Remaining Reserve Amount | Payment Type |
      | Claim Cost    | Medical                   | 500 USD        | 100 USD        | 400 USD                  | Partial      |
      | Expense - A&O | Unspecified Cost Category | 300 USD        | 50 USD         | 0 USD                    | Final        |

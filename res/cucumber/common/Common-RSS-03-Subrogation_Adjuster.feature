@common @Common-RSS-03-Subrogation @suite
Feature: Manage subrogation opportunities (Common-RSS-03-Subrogation)

  As an adjuster,
  I want to be able to view, create and edit the subrogation opportunities,
  So that I can manage the opportunity to recover money from responsible parties.

  Background:
    Given I am a user with the "Adjuster" role
    And I have the "Toggle Auto APD Specialist Level 1" authority limit profile

  @23540-GW
  Scenario: 1. If another party is at fault I want to identify a subrogation is possible
    Given a Personal Auto claim
    When I specify another party is at fault
    Then a subrogation opportunity exists

  # TODO ignoring S2: Toggle Doesn't Allow Claim-Level transactions see TXV23000 in TransactionSetValidationRules.grs
  @23540-GW @ignore
  Scenario: 2. Splitting Subrogation Liability Between Responsible Parties
    Given a Personal Auto claim
    And other parties are at fault
    And the claim has a payment
      | Cost Type | Cost Category       | Amount  | Payment Type | Eroding? |
      | Expense   | Claim Level Expense | 100 USD | Final        | Yes      |
    When I add the responsible parties and their liabilities
      | Responsible Party | Liability % |
      | Responsible 1     | 60          |
      | Responsible 2     | 40          |
    Then a subrogation opportunity exists
    And recoveries exist with the following details
      | Responsible Party | Liability % | Expected Recovery |
      | Responsible 1     | 60          | 60 USD            |
      | Responsible 2     | 40          | 40 USD            |

  @23540-GW
  Scenario: 3. When referring for individual subrogation, each exposure has an owner
    Given a Personal Auto claim
    And another party is at fault
    And the claim has a "collision" exposure
    And the claim is referred for subrogation
    When I subrogate individual exposures
    Then the exposure has a subrogation owner

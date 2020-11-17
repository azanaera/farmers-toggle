@homeowners @HO-Adjudicate-ClaimMaintenance
Feature: Claim Maintenance

  As an adjuster,
  I want to create and update incidents on existing claims,
  So that I can track the loss events that occurred on the claim.

  Background:
    Given I am a user with the "Adjuster" role

  @23790.1-GW
  Scenario: Add a Dwelling Incident to the Homeowners Claim
    Given a Homeowners claim
    And the claim loss cause is "Fire"
    When I add new dwelling incident to the claim
    Then a dwelling incident should be created on the claim

  @23790.1-GW
  Scenario Outline: Update a Dwelling Incident for the Homeowners Claim
    Given a Homeowners claim
    And the claim loss cause is "Fire"
    And the claim has a dwelling incident for a fire in living room after a candle fell
    When I update the dwelling incident
      | Damage Description  | <Damage Description> |
      | Materials Damaged   | <Materials Damaged>  |
      | Estimate Received?  | <Estimate Received?> |
      | Already Repaired?   | <Already Repaired?>  |
    Then the following dwelling incident should exist on the claim
      | Damage Description  | <Damage Description> |
      | Materials Damaged   | <Materials Damaged>  |
      | Estimate Received?  | <Estimate Received?> |
      | Already Repaired?   | <Already Repaired?>  |
    Examples:
      | Damage Description                                   | Materials Damaged                | Estimate Received? | Already Repaired? |
      | Electrical fault that caused fire in the living room | Phone charger, Carpet and Floors | Yes                | No                |

  @23790.2-GW
  Scenario: Add a Bodily Injury Incident to a Homeowners Claim
    Given a Homeowners claim
    And the claim loss cause is "Fire"
    When I add new bodily injury to the claim with the injured person details and injury details
    Then an injury incident should be created on the claim

  @23790.2-GW
  Scenario Outline: Update a Bodily Injury Incident for a Homeowners Claim
    Given a Homeowners claim
    And the claim loss cause is "Fire"
    And the claim has a bodily injury incident for a skin burn
    When I update the bodily injury incident
      | Describe Injuries    | <Describe Injuries>   |
      | Loss Party           | <Loss Party>          |
      | Severity             | <Severity>            |
      | General Injury Type  | <General Injury Type> |
    Then the bodily injury incident should be as follows
      | Describe Injuries    | <Describe Injuries>   |
      | Loss Party           | <Loss Party>          |
      | Severity             | <Severity>            |
      | General Injury Type  | <General Injury Type> |
    Examples:
      | Describe Injuries                                                                                                  | Loss Party     | Severity | General Injury Type |
      | After medical evaluation it was determined that I have 3rd degree burns on my hand from trying to put out the fire | Insured's loss | Moderate | Multiple injuries   |

  @23790.3-GW
  Scenario: Add a Living Expenses Incident to the Homeowners Claim
    Given a Homeowners claim
    And the claim loss cause is "Water Damage"
    When I add "meal and lodging" Living Expense Incident to the claim
    Then a Living Expenses incident should be created on the claim

  @23790.4-GW
  Scenario: Add an Other Structure Incident to the Homeowners Claim
    Given a Homeowners claim
    And the claim loss cause is "Wind"
    When I add the other structures incident to include the outside Shed and fence damage
    Then an Other Structures incident should be created on the claim

  @23790.5-GW
  Scenario: Add a Personal Property Incident to a Homeowners Claim
    Given a Homeowners claim
    And the policy on the claim has the following scheduled items
      | Grandfather clock |
    And the claim loss cause is "Burglary"
    When I add a personal property incident with line items
    Then a personal property incident should be created on the claim


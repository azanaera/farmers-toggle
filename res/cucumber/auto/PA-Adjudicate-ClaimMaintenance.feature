@personal_auto @PA-Adjudicate-ClaimMaintenance @suite
Feature: Exposure - Adjuster (PA-Adjudicate-ClaimMaintenance)

  As an adjuster,
  I want to create and update incidents on existing claims. So that I can track the losses that have occurred in this claim.

  Background:
    Given I am a user with the "Adjuster" role

  @23460.1-GW
  Scenario: 1. Creating a vehicle incident on a claim
    Given a Personal Auto claim
    And the policy on the claim has the following covered parties:
      | First  | Last    |
      | Brooke | Wynn    |
    And the policy on the claim has the following covered vehicles:
      | Year | Make   | Model   |
      | 2001 | Acura  | RSX     |
    When I add a vehicle incident
      | Vehicle        | License Plate | Driver Name | Loss Occurred? | Damage Description              |
      | 2001 Acura RSX | 64RJK12       | Brooke Wynn | At premises    | Side panel scratched and dented |
    Then a vehicle incident should be created on the claim
      | Vehicle        | License Plate | Driver Name | Loss Occurred? | Damage Description              |
      | 2001 Acura RSX | 64RJK12       | Brooke Wynn | At premises    | Side panel scratched and dented |

  @23460.1-GW
  Scenario: 2. Editing involved vehicle and driver for a vehicle incident
    Given a Personal Auto claim
    And the policy on the claim has the following covered vehicles
      | Year | Make   | Model   |
      | 2001 | Acura  | RSX     |
      | 1997 | Toyota | Corolla |
    And the policy on the claim has the following covered parties
      | First  | Last    |
      | Brooke | Wynn    |
      | Bo     | Simpson |
    And a collision exposure for vehicle "2001 Acura RSX"
    When I change involved vehicle for the incident to "1997 Toyota Corolla"
    And I change driver of the involved vehicle to "Bo Simpson"
    Then the involved vehicle on the incident should be "1997 Toyota Corolla"
    And the driver of the involved vehicle should be "Bo Simpson"

  @23460.2-GW
  Scenario: 3. Creating property incident on a claim
    Given a Personal Auto claim
    When I add a new property to the claim
      | Property Description | Damage Description  | Loss Estimate | Address 1     | City          | State      |
      | 2 bed apartment      | Flooding to bedroom | 800           | 1 Main Street | San Francisco | California |
    Then the property incident should be listed on the claim
      | Property Description | Damage Description  | Loss Estimate | Address 1     | City          | State      |
      | 2 bed apartment      | Flooding to bedroom | 800           | 1 Main Street | San Francisco | California |

  @23460.3-GW
  Scenario: 4. Creating injury incident on a claim
    Given a Personal Auto claim
    And the policy on the claim has the following covered parties:
      | First  | Last    |
      | Brooke | Wynn    |
    When I add a new injury incident
      | Injured Person | Loss Party     | General Injury Type | Detailed Injury Type |
      | Brooke Wynn    | Insured's loss | Loss of Limb        | Concussion           |
    Then the injury incident should be listed on the claim
      | Injured Person | Loss Party     | General Injury Type | Detailed Injury Type |
      | Brooke Wynn    | Insured's loss | Loss of Limb        | Concussion           |

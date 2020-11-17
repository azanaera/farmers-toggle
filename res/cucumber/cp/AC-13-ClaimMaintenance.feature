@commercial_property @AC-13-ClaimMaintenance
Feature: Claim Maintenance - Incidents on existing claims

  As an adjuster,
  I want to create and update incidents on existing claims,
  So that I can track the losses that have occurred in this claim.

  Background:
    Given I am a user with the "Adjuster" role

  @23820-2-GW
  Scenario: Add a property incident
    Given a Commercial Property claim
    And the claim loss cause is "Fire"
    When I add a property incident to the claim
      | Property Description | Damage Description | Loss Estimate | Address 1      | City          | State      |
      | Beautiful office     | Big fire           | 420000 USD    | 25 Main Street | San Francisco | California |
    Then a property incident should be created on the claim
      | Property Description | Damage Description | Loss Estimate | Address 1      | City          | State      |
      | Beautiful office     | Big fire           | 420000 USD    | 25 Main Street | San Francisco | California |

  Scenario: Add an injury incident
    Given a Commercial Property claim
    And the claim loss cause is "Fire"
    When I add an injury incident to the claim
      | Injured Person First Name | Injured Person Last Name | Loss Party     | General Injury Type | Detailed Injury Type |
      | Brooke                    | Wynn                     | Insured's loss | Loss of Limb        | Puncture             |
    Then an injury incident matching the table should be created on the claim
      | Injured Person First Name | Injured Person Last Name | Loss Party     | General Injury Type | Detailed Injury Type |
      | Brooke                    | Wynn                     | Insured's loss | Loss of Limb        | Puncture             |

  @23790.1-2-GW
  Scenario: Update a property incident
    Given a Commercial Property claim
    And the claim loss cause is "Fire"
    And the claim has a property incident
    When I update the property incident
      | Property Description | Damage Description     | Loss Estimate | Address 1      | City     | State      |
      | Disgusting office    | Burnt stuff everywhere | 5007 USD      | 12 Fire Lane   | San Jose | California |
    Then the property incident is updated correctly
      | Property Description | Damage Description     | Loss Estimate | Address 1      | City     | State      |
      | Disgusting office    | Burnt stuff everywhere | 5007 USD      | 12 Fire Lane   | San Jose | California |

  Scenario: Update an injury incident
    Given a Commercial Property claim
    And the claim loss cause is "Fire"
    And the claim has an injury incident
      | Loss Party     | General Injury Type | Detailed Injury Type |
      | Insured's loss | Loss of Limb        | Crushing             |
    When I update the injury incident
      | Loss Party     | General Injury Type | Detailed Injury Type |
      | Insured's loss | Loss of Limb        | Puncture             |
    Then the injury incident is updated correctly
      | Loss Party     | General Injury Type | Detailed Injury Type |
      | Insured's loss | Loss of Limb        | Puncture             |
@personal_auto @PA-CaptureResponses-ClaimMaintenance @suite
Feature: Claim Maintenance - CSR (PA-CaptureResponses-ClaimMaintenance)

  As a customer service representative,
  I want to be able update the details on the loss
  So that the data on the claim represents our current understanding of the loss.

  Background:
    Given I am a user with the "Adjuster" role

  @23460-GW
  Scenario: 01. Update loss details on a claim
    Given a Personal Auto claim
    When I update the loss details on the claim
      | Weather | Fault Rating         |
      | Rain    | Other party at fault |
    Then the loss details should be listed on the claim
      | Weather | Fault Rating         |
      | Rain    | Other party at fault |

  @23460-GW
  Scenario: 02. Add a witness on the claim
    Given a Personal Auto claim
    When I add a new witness to the claim
      | Statement Obtained | Where was the witness? | Perspective               |
      | Yes                | Inside vehicle         | Sitting in passenger seat |
    Then the witness should be listed on the claim
      | Statement Obtained | Where was the witness? | Perspective               |
      | Yes                | Inside vehicle         | Sitting in passenger seat |

  @23460-GW
  Scenario: 03. Update notification and contact details
    Given a Personal Auto claim
    And the policy on the claim has the following covered parties
      | First  | Last    |
      | Brooke | Wynn    |
      | Bo     | Simpson |
    When I update the notification details on the claim
      | First Notice Suit | How Reported | Reported By | Reporter Relationship to Insured | Main Contact | Contact Relationship to Insured |
      | Yes               | Phone        | Brooke Wynn | Friend                           | Bo Simpson   | Self/Insured                    |
    Then the notification details should be listed on the claim
      | First Notice Suit | How Reported | Reported By | Reporter Relationship to Insured | Main Contact | Contact Relationship to Insured |
      | Yes               | Phone        | Brooke Wynn | Friend                           | Bo Simpson   | Self/Insured                    |

  @23460-GW
  Scenario: 04. Add contributing factors to the claim
    Given a Personal Auto claim
    When I add contributing factors to the claim
      | Category                 | Sub Category   | Value         |
      | Driver factors           | MPH over limit | 61 or greater |
      | Environmental conditions | Visibility     | Fog           |
    Then the contributing factors should be listed on the claim
      | Category                 | Sub Category   | Value         |
      | Driver factors           | MPH over limit | 61 or greater |
      | Environmental conditions | Visibility     | Fog           |

  @23460-GW
  Scenario: 05. Add vehicles to the claim
    Given a Personal Auto claim
    And the policy on the claim has the following covered parties
      | First  | Last    |
      | Brooke | Wynn    |
    When I add a new vehicle to the claim
      | Year | Make | Model   | Driver      | Loss Occurred? |
      | 2010 | Ford | Mustang | Brooke Wynn | At premises    |
    Then the vehicle should be listed on the claim
      | Year | Make | Model   | Driver      | Loss Occurred? |
      | 2010 | Ford | Mustang | Brooke Wynn | At premises    |

  @23460-GW
  Scenario: 06. Add injuries to the claim
    Given a Personal Auto claim
    And the policy on the claim has the following covered parties
      | First  | Last    |
      | Brooke | Wynn    |
    When I add a new injury incident
      | Injured Person | Loss Party     | General Injury Type | Detailed Injury Type |
      | Brooke Wynn    | Insured's loss | Loss of Limb        | Concussion           |
    Then the injury incident should be listed on the claim
      | Injured Person | Loss Party     | General Injury Type | Detailed Injury Type |
      | Brooke Wynn    | Insured's loss | Loss of Limb        | Concussion           |

  @23460-GW
  Scenario: 07. Add properties to the claim
    Given a Personal Auto claim
    When I add a new property to the claim
      | Property Description | Damage Description  | Loss Estimate | Address 1     | City          | State      |
      | 2 bed apartment      | Flooding in kitchen | 800           | 1 Main Street | San Francisco | California |
    Then the property should be listed on the claim
      | Property Description | Damage Description  | Loss Estimate | Address 1     | City          | State      |
      | 2 bed apartment      | Flooding in kitchen | 800           | 1 Main Street | San Francisco | California |

  @23480-GW
  Scenario: 08. Add a bodily injury exposure
    Given a Personal Auto claim
    And the policy on the claim has the following covered parties
      | First  | Last    |
      | Brooke | Wynn    |
    And the policy on the claim has the following covered vehicles
      | Year | Make   | Model   |
      | 2001 | Acura  | RSX     |
    And the claim has an injury incident
      | Injured Person | Loss Party     | General Injury Type | Detailed Injury Type |
      | Brooke Wynn    | Insured's loss | Loss of Limb        | Concussion           |
    When I add a new bodily injury exposure
      | Coverage       | Claimant    | Claimant Type |
      | 2001 Acura RSX | Brooke Wynn | Insured       |
    Then a bodily injury exposure should be created on the claim
      | Coverage       | Claimant    | Claimant Type |
      | 2001 Acura RSX | Brooke Wynn | Insured       |

  @23480-GW
  Scenario: 09. Add a medical payments exposure
    Given a Personal Auto claim
    And the policy on the claim has the following covered parties
      | First  | Last    |
      | Brooke | Wynn    |
    And the policy on the claim has the following covered vehicles
      | Year | Make   | Model |
      | 2001 | Acura  | RSX   |
    And the claim has an injury incident
      | Injured Person | Loss Party     | General Injury Type | Detailed Injury Type |
      | Brooke Wynn    | Insured's loss | Loss of Limb        | Concussion           |
    When I add a medical payments exposure
      | Coverage       | Claimant    | Claimant Type |
      | 2001 Acura RSX | Brooke Wynn | Insured       |
    Then a medical payments exposure should be created on the claim
      | Coverage       | Claimant    | Claimant Type |
      | 2001 Acura RSX | Brooke Wynn | Insured       |

  @23490-GW
  Scenario: 10. Add a PIP exposure
    Given a Personal Auto claim
    And the policy on the claim has the following covered parties
      | First  | Last    |
      | Brooke | Wynn    |
    And the claim has an injury incident
      | Injured Person | Loss Party     | General Injury Type | Detailed Injury Type |
      | Brooke Wynn    | Insured's loss | Loss of Limb        | Concussion           |
    When I add a PIP exposure
      | Title Coverage | Claimant    | Claimant Type |
      | None           | Brooke Wynn | Insured       |
    Then a PIP exposure should be created on the claim
      | Title Coverage | Claimant    | Claimant Type |
      | None           | Brooke Wynn | Insured       |

  # PA-CaptureResponses-ClaimMaintenance - Need BA Help to determine proper behavior
  @23500-GW
  Scenario: 11. Add a property damage exposure
    Given a Personal Auto claim
    And the policy on the claim has the following covered parties
      | First  | Last    |
      | Brooke | Wynn    |
    And the policy on the claim has the following covered vehicles
      | Year | Make   | Model |
      | 2001 | Acura  | RSX   |
    And a property is listed on the claim
      | Property Description | Damage Description  | Loss Estimate | Address 1     | City          | State      |
      | 2 bed apartment      | Flooding in kitchen | 800           | 1 Main Street | San Francisco | California |
    When I add a property damage exposure
      | Coverage       | Claimant    | Claimant Type | Property Name                    |
      | 2001 Acura RSX | Brooke Wynn | Insured       | 1 Main Street, San Francisco, CA |
    Then a property damage exposure should be created on the claim
      | Coverage       | Claimant    | Claimant Type | Property Name                    |
      | 2001 Acura RSX | Brooke Wynn | Insured       | 1 Main Street, San Francisco, CA |

  @23510-GW
  Scenario: 12. Add a towing and labor exposure
    Given a Personal Auto claim
    And the policy on the claim has the following covered parties
      | First  | Last    |
      | Brooke | Wynn    |
    And the policy on the claim has the following covered vehicles
      | Year | Make   | Model |
      | 2001 | Acura  | RSX   |
    When I add a towing and labor exposure
      | Coverage       | Claimant    | Claimant Type |
      | 2001 Acura RSX | Brooke Wynn | Insured       |
    Then a towing and labor exposure should be created on the claim
      | Coverage       | Claimant    | Claimant Type |
      | 2001 Acura RSX | Brooke Wynn | Insured       |

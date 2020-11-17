@homeowners @HO-CaptureIncidentAndLossDetails-FNOL
Feature: Define financial summary presentation

  As an adjuster,
  I want to be able to view financial records associated with a claim
  So that expenses and costs can be tracked and maintained

  Background:
    Given I am a user with the "Adjuster" role
    And I have the "Toggle Auto APD Specialist Level 1" authority limit profile

  @23390.8-GW-6 @23730-GW
  Scenario: Capture basic information during FNOL for a Homeowners policy
    Given a Homeowners policy
    When I start filing a claim
    And I set the Loss Date to "Today"
    And the claim was reported by the Insured
    And I set claim loss cause to "Hurricane"
    And I finish filing the claim
    Then the claim loss cause should be "Hurricane"

  @23410.3-GW
  Scenario Outline: Capture property damage information during FNOL for a Homeowners policy
    Given a Homeowners policy
    When I start filing a claim
    And I set claim loss cause to "Hurricane"
    And I add a dwelling incident
      | Damage Description  | <Dwelling Damage Description>          |
      | Materials Damaged   | <Materials Damaged>                    |
      | Estimate Received?  | <Estimate Received?>                   |
      | Already Repaired?   | <Already Repaired?>                    |
    And I add a personal property incident
      | Damage Description  | <Personal property Damage Description> |
    And I add a living expenses incident
      | Description         | <Living Expenses Damage Description>   |
    And I finish filing the claim
    Then the claim loss cause should be "Hurricane"
    And the following dwelling incident should exist on the claim
      | Damage Description  | <Dwelling Damage Description>          |
      | Materials Damaged   | <Materials Damaged>                    |
      | Estimate Received?  | <Estimate Received?>                   |
      | Already Repaired?   | <Already Repaired?>                    |
    And the following personal property incident should be created on the claim
      | Damage Description  | <Personal property Damage Description> |
    And the following living expenses incident should be created on the claim
      | Description         | <Living Expenses Damage Description>   |
    Examples:
      | Dwelling Damage Description                          | Materials Damaged | Estimate Received? | Already Repaired? | Personal property Damage Description  | Living Expenses Damage Description  |
      | Electrical fault that caused fire in the living room | Carpet and floors | Yes                | No                | Example Description Personal property | Example Description Living Expenses |

  @23410.3-GW
  Scenario: Capture property damage information during FNOL for a Homeowners policy
    Given a Homeowners policy
    When I start filing a claim
    And I set claim loss cause to "Fire"
    And I add a property damage liability
      | Property Description | Damage Description | Loss Estimate | Address 1     | City          | State      |
      | Prop description     | Damage description | 500           | 1 Main Street | San Francisco | California |
    And I finish filing the claim
    Then a property damage liability should be created on the claim
      | Property Description | Damage Description | Loss Estimate | Address 1     | City          | State      |
      | Prop description     | Damage description | 500           | 1 Main Street | San Francisco | California |

  @23740.1-GW
  Scenario: Capture Bodily Injury Information
    Given a Homeowners policy
    When I start filing a claim
    And I set claim loss cause to "Fire"
    And I add an "Insured's loss" injury incident
    And I finish filing the claim
    Then an injury incident should be created on the claim

  @23740-GW
  Scenario: Filing a new Homeowners claim with a fire loss cause
    Given a Homeowners policy
    When I start filing a claim
    And I set claim loss cause to "Fire"
    And I set the damage type to "Fire"
    And I answer the fire questions
      | Arson Involved? | Source Of The Fire   | How Was The Fire Discovered? | Fire Department Responded? | Is Anyone Injured? | Smoke Damage Only? | Is The Home Habitable? | Is The Home Secure? |
      | Yes             | Gasoline soaked rags | I saw it on fire             | Yes                        | No                 | No                 | No                     | No                  |
    And I finish filing the claim
    Then the fire questions should be answered on the claim
      | Arson Involved? | Source Of The Fire   | How Was The Fire Discovered? | Fire Department Responded? | Is Anyone Injured? | Smoke Damage Only? | Is The Home Habitable? | Is The Home Secure? |
      | Yes             | Gasoline soaked rags | I saw it on fire             | Yes                        | No                 | No                 | No                     | No                  |

  @23740-GW
  Scenario: Filing a new Homeowners claim with a Water loss cause
    Given a Homeowners policy
    When I start filing a claim
    And I set claim loss cause to "Water damage"
    And I set the damage type to "Water"
    And I answer the water questions
      | Source Of The Water | Is The Roof Damage Covered? |
      | Roof                | Yes                         |
    And I finish filing the claim
    Then the water questions should be answered on the claim
      | Source Of The Water | Is The Roof Damage Covered? |
      | Roof                | Yes                         |

  @23740-GW
  Scenario Outline: End to End FNOL Scenario to capture all steps of FNOL wizard and create a HO claim for verified policy
    Given a Homeowners policy
    When I start filing a claim
    And I set the Loss Date to "Today"
    And the claim was reported by the Insured
    And I add a person contact with "Other" role
    And I add a note
    And I set claim loss cause to "Fire"
    And I set the damage type to "Fire"
    And I answer the fire questions
      | Arson Involved? | Source Of The Fire   | How Was The Fire Discovered? | Fire Department Responded? | Is Anyone Injured? | Smoke Damage Only? | Is The Home Habitable? | Is The Home Secure? |
      | Yes             | Gasoline soaked rags | I saw it on fire             | Yes                        | No                 | No                 | No                     | No                  |
    And I add a dwelling incident
      | Damage Description  | <Damage Description> |
      | Materials Damaged   | <Materials Damaged>  |
      | Estimate Received?  | <Estimate Received?> |
      | Already Repaired?   | <Already Repaired?>  |
    And I add a property damage liability
      | Property Description | Damage Description | Loss Estimate | Address 1     | City          | State      |
      | Prop description     | Damage description | 500           | 1 Main Street | San Francisco | California |
    And I add a "Insured's loss" injury incident
    And I add a bodily injury exposure
    And I finish filing the claim
    Then the claim loss cause should be "Fire"
    And the fire questions should be answered on the claim
      | Arson Involved? | Source Of The Fire   | How Was The Fire Discovered? | Fire Department Responded? | Is Anyone Injured? | Smoke Damage Only? | Is The Home Habitable? | Is The Home Secure? |
      | Yes             | Gasoline soaked rags | I saw it on fire             | Yes                        | No                 | No                 | No                     | No                  |
    And the following dwelling incident should exist on the claim
      | Damage Description  | <Damage Description> |
      | Materials Damaged   | <Materials Damaged>  |
      | Estimate Received?  | <Estimate Received?> |
      | Already Repaired?   | <Already Repaired?>  |
    And a property damage liability should be created on the claim
      | Property Description | Damage Description | Loss Estimate | Address 1     | City          | State      |
      | Prop description     | Damage description | 500           | 1 Main Street | San Francisco | California |
    And a bodily injury incident should be created on the claim
    Examples:
      | Damage Description                                   | Materials Damaged                | Estimate Received? | Already Repaired? |
      | Electrical fault that caused fire in the living room | Phone charger, Carpet and Floors | Yes                | No                |

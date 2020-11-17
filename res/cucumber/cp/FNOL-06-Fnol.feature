@commercial_property @FNOL-06-Fnol
Feature: Define financial summary presentation

  As an adjuster,
  I want to be able to capture basic FNOL details
  So that claims can be recorded and processed

  Background:
    Given I am a user with the "Adjuster" role

  @23390.8-2-GW-6
  Scenario: Select involved policy properties (Risk Unit) to create a claim
    Given a Commercial Property policy
    When I start filing a claim
    And I select the "1st" covered property
    And I finish filing the claim
    Then a "Commercial Property" claim should be created

  @23410.3-2-GW @23410.4-2-GW
  Scenario: Capture property damage information during FNOL for a Commercial Property policy
    Given a Commercial Property policy
    When I start filing a claim
    And I set claim loss cause to "Fire"
    And I add a property damage incident
      | Property Description | Damage Description  | Loss Estimate | Address 1     | City          | State      |
      | 2 bed apartment      | Flooding in kitchen | 500 USD       | 1 Main Street | San Francisco | California |
    And I finish filing the claim
    Then a property damage incident should be created on the claim
      | Property Description | Damage Description  | Loss Estimate | Address 1     | City          | State      |
      | 2 bed apartment      | Flooding in kitchen | 500 USD       | 1 Main Street | San Francisco | California |

  @23700-2-GW
  Scenario: Create Claim using Property Quick Claim Wizard for a Commercial Property claim
    Given a Commercial Property policy
    When I start filing a claim using Quick Claim Property
    And I set the claim reporter to "Insured"
    And I set claim loss cause to "Burglary"
    And I set the date of notice to "Today"
    And I set loss location to an address in state "California"
    And I set the claimant to "Insured"
    And I set the exposure property address to an address in state "California"
    And I finish filing the claim
    Then a "Commercial Property" claim should be created
    And the claim should be reported by the "Insured"
    And the claim loss cause should be "Burglary"
    And the claim date of notice should be "Today"
    And the claim loss location should be in state "California"
    And the claimant should be "Insured"
    And the claim exposure property address is in state "California"

  Scenario: Capture injury incident information during FNOL for a Commercial Property policy
    Given a Commercial Property policy
    When I start filing a claim
    And I set claim loss cause to "Hurricane"
    And I add an injury incident
      | Injured Person | Loss Party     | Severity | General Injury Type | Detailed Injury Type |
      | Jim Caron      | Insured's loss | Minor    | Loss of Limb        | Burn                 |
    And I finish filing the claim
    Then the claim loss cause should be "Hurricane"
    And the injury incident should be created on the claim
      | Injured Person | Loss Party     | Severity | General Injury Type | Detailed Injury Type |
      | Jim Caron      | Insured's loss | Minor    | Loss of Limb        | Burn                 |
    
  @23730-2-GW
  Scenario: Capture basic information during FNOL for a Commercial Property policy
    Given a Commercial Property policy
    When I start filing a claim
    And I set the Loss Date to "Today"
    And I add a person contact with "witness" role
    And I finish filing the claim
    And a person contact with "witness" role should be on the claim
    And the Loss Date should be "Today"

  @23740-2-GW
  Scenario: Capture loss detail information such as loss cause and location of the claim
    Given a Commercial Property policy
    When I start filing a claim
    And I set the Loss Date to "Today"
    And I set loss location to an address in state "California"
    And I set claim loss cause to "Fire"
    And I finish filing the claim
    Then the claim loss cause should be "Fire"
    And the claim loss location should be in state "California"
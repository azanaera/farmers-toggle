@personal_auto @PA-CaptureIncidentAndLossDetails-FNOL @suite
Feature: Capture Incident And Loss Details - CSR (PA-CaptureIncidentAndLossDetails-FNOL)

  As a customer service representative,
  I want to file claims against verified policies, and capture incident and loss details
  So that I can progress the claim

  Background:
    Given I am a user with the "Customer Service Associate" role
    And I have the "Toggle Auto APD Specialist Level 1" authority limit profile

  @23410.1-GW
  Scenario: 2. Filing a new Personal Auto Claim with vehicle damage information
    Given a Personal Auto policy
    When I start filing a claim
    And I add a third party vehicle
      | Vehicle Type | Year | Make | Model | Damage Description | Possible Total Loss? | Operable? | Airbags Deployed? | Equipment Failure? |
      | Owned        | 2001 | Ford | Focus | Left panel dented  | No                   | Yes       | Yes               | Yes                |
    And I finish filing the claim
    Then a "Personal Auto" claim should be created
    And a damaged vehicle should exist on the claim
      | Vehicle Type | Year | Make | Model | Damage Description | Possible Total Loss? | Operable? | Airbags Deployed? | Equipment Failure? |
      | Owned        | 2001 | Ford | Focus | Left panel dented  | No                   | Yes       | Yes               | Yes                |

  @23410.3-GW-2
  Scenario: 3. Filing a new Personal Auto Claim with property damage information
    Given a Personal Auto policy
    When I start filing a claim
    And I add a property damage liability
      | Property Description | Damage Description | Loss Estimate | Address 1     | City          | State      |
      | 2 bed apartment      | Flooded bathroom   | 500           | 1 Main Street | San Francisco | California |
    And I finish filing the claim
    Then a "Personal Auto" claim should be created
    And a property damage liability should exist on the claim
      | Property Description | Damage Description | Loss Estimate | Address 1     | City          | State      |
      | 2 bed apartment      | Flooded bathroom   | 500           | 1 Main Street | San Francisco | California |

  @23410-GW
  Scenario: 4. Filing a new Personal Auto Claim with reports by officials at the scene
    Given a Personal Auto policy
    When I start filing a claim
    And I select an involved vehicle from covered vehicles
    And I add a witness report
      | Name       | Statement Obtained | Where was the witness? | Perspective |
      | Ray Newton | Yes                | Pedestrian             | Side        |
    And I finish filing the claim
    Then a "Personal Auto" claim should be created
    And the claim should have a witness report
      | Name       | Statement Obtained | Where was the witness? | Perspective |
      | Ray Newton | Yes                | Pedestrian             | Side        |

  @23410-GW
  Scenario: 5. Filing a new Personal Auto Claim with specific categorization including fault rating
    Given a Personal Auto policy
    When I start filing a claim
    And I set the fault rating to "Other party at fault"
    And I finish filing the claim
    Then a "Personal Auto" claim should be created
    And the fault rating should be "Other party at fault"

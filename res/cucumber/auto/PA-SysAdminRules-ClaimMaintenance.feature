@personal_auto @PA-SysAdminRules-ClaimMaintenance @suite
Feature: Business Rules - Claim Maintenance - CSR (PA-SysAdminRules-ClaimMaintenance)

  As a customer service representative,
  I want to be able to validate exposure rules.
  While as Business Rules Admin,
  I want to be able to create and edit exposure rules.

  @23480-2-GW
  Scenario: 1. Validate a business rule doesn't run
    Given I am a user with the "Customer Service Associate" role
    And I have the "Toggle Auto APD Specialist Level 1" authority limit profile
    And an exposure rule named "TestRule2" is "Staged"
      | Enabled | Policy Type   | Incident Type   | Action Type     | Coverage Type | Coverage Subtype |
      | Yes     | Personal Auto | VehicleIncident | Create Exposure | Collision     | Collision        |
    And a Personal Auto policy
    When I start filing a claim
    And I finish filing the claim
    Then an exposure should not be created on the claim
      | Coverage Type | Coverage Subtype |
      | Collision     | Collision        |

  @23480-2-GW
  Scenario: 2. Validate a business rule runs
    Given I am a user with the "Customer Service Associate" role
    And I have the "Toggle Auto APD Specialist Level 1" authority limit profile
    And an exposure rule named "TestRule1" is "Staged"
      | Enabled | Policy Type   | Incident Type   | Action Type     | Coverage Type | Coverage Subtype |
      | Yes     | Personal Auto | VehicleIncident | Create Exposure | Collision     | Collision        |
    And a Personal Auto policy
    When I start filing a claim
    And I select the "1st" covered vehicle
    And I finish filing the claim
    Then an exposure should be created on the claim
      | Coverage Type | Coverage Subtype |
      | Collision     | Collision        |

  @23480-2-GW
  Scenario: 3. A business rule is created for automatically creating an Exposure
    Given I am a user with the "Business Rules Admin" role
    When I create a new exposure rule named "Test123"
      | Enabled | Policy Type   | Incident Type   |
      | Yes     | Personal Auto | VehicleIncident |
    And I promote the exposure rule "Test123" to staged
    Then the exposure rule "Test123" should be "Staged"

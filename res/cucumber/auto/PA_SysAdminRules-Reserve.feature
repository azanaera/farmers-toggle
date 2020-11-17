@personal_auto @PA-SysAdminRules-Reserve @suite
Feature: Business Rules - Reserve - CSR (PA-SysAdminRules-Reserve)

  As a customer service representative,
  I want to be able to validate reserve rules
  While as a Business Rules Admin,
  I want to be able to create and manage reserve rules

  @23590-2-GW
  Scenario: 1. Validate a business rule runs
    Given I am a user with the "Customer Service Associate" role
    And I have the "Toggle Auto APD Specialist Level 1" authority limit profile
    And a reserve rule named "TestRule1" is "Staged"
      | Enabled | Loss Type | Action Type    | Cost Type  | Cost Category   | Amount |
      | Yes     | Auto      | Create Reserve | Claim Cost | Material Damage | 500    |
    And a Personal Auto policy
    When I start filing a claim
    And I select the "1st" covered vehicle
    And I set claim loss cause to "Collision with bicycle"
    And I add a collision exposure
    And I finish filing the claim
    Then a reserve should be created on the claim
      | Cost Type  | Cost Category   | Amount |
      | Claim Cost | Material Damage | 500    |

  @23590-2-GW
  Scenario: 2. Validate a business rule doesn't run
    Given I am a user with the "Customer Service Associate" role
    And I have the "Toggle Auto APD Specialist Level 1" authority limit profile
    And a reserve rule named "TestRule2" is "Staged"
      | Enabled | Loss Type | Action Type    | Cost Type  | Cost Category   | Amount |
      | Yes     | Auto      | Create Reserve | Claim Cost | Material Damage | 500    |
    And a Personal Auto policy
    When I start filing a claim
    And I finish filing the claim
    Then a reserve should not be created on the claim
      | Cost Type  | Cost Category   | Amount |
      | Claim Cost | Material Damage | 500    |

  @23590-2-GW
  Scenario: 3. A business rule is created for automatically creating a Reserve Transaction
    Given I am a user with the "Business Rules Admin" role
    When I create a new reserve rule named "Test123"
      | Enabled | Loss Type |
      | Yes     | Auto      |
    And I promote the reserve rule "Test123" to staged
    Then the reserve rule "Test123" should be "Staged"

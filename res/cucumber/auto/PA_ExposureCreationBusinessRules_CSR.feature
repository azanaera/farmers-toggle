@personal_auto @PA_ExposureCreationBusinessRules_CSR @suite
Feature: Exposure Creation Business Rules CSR (PA_ExposureCreationBusinessRules_CSR)

  As a customer service representative,
  I want to utilize exposure creation business rules to create exposures while filing a new claim and on existing claims.

  Background:
    Given I am a user with the "Customer Service Associate" role

  Scenario: 1. Creating a collision exposure through business rule: EC01000 - Personal Auto Collision
    Given a Personal Auto policy
    # And exposure business rule: EC01000 - Personal Auto Collision is enabled
    When I start filing a claim
    And I select an involved vehicle from covered vehicles
    And I set claim loss cause to "Collision with bicycle"
    And I finish filing the claim
    Then a "Personal Auto" claim should be created
    And the claim should have "1" vehicle incident
    And a "Collision" exposure should be created on the claim
    And the exposure should reference the vehicle incident
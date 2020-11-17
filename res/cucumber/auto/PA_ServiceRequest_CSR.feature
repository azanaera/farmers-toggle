@personal_auto @PA_ServiceRequest_CSR @suite
Feature: Service Request CSR (PA_ServiceRequest_CSR)

  As a customer service representative,
  I want to request services for new claims,
  so that services can be quoted and performed to recover the losses.

  Background:
    Given I am a user with the "Adjuster" role

  Scenario: 1. A service request is created during FNOL for a new claim to "Quote and Perform Service" for "Auto Body"
    Given a Personal Auto policy
    When I start filing a claim
    And I select an involved vehicle from covered vehicles
    And I request a "Perform Service" for "Glass"
    And I finish filing the claim
    Then a "Glass" service should be requested on the claim
    And the request type should be "Perform Service"

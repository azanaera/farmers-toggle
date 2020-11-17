@workers_comp
Feature: Service Request

  As an adjuster,
  I want to request services to be performed as part of the adjudication process for existing claims.

  Background:
    Given I am a user with the "Adjuster" role
    And I am in the "Workers Comp" security zone

  Scenario: Requesting a doctor to perform medical service on an existing claim
    Given a Workers' Compensation claim
    When I start a request for a new service related to the "Medical Details" exposure
    And add a new vendor to the service for "Doctor"
    And I request to "Perform Service" for "Medical care" on the existing claim
    Then a "Medical care" service should be requested on the claim
    And the request type should be "Perform Service"
    And the "Doctor" should be listed as "Service Vendor"

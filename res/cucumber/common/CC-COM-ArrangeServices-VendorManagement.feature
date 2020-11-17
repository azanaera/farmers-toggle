@common @CC-COM-ArrangeServices-VendorManagement @suite
Feature: Common - FNOL-10 - Vendor Management (CC-COM-ArrangeServices-VendorManagement)

  As an adjuster,
  I want to be able to create a service request and select a vendor, based on the services they provide, then forward the service requests to that vendor for action.

  Background:
    Given I am a user with the "Adjuster" role

  @23257-GW
  Scenario: 1. A service request is created during FNOL for a new claim to "Quote and Perform Service" for "Glass" (PA)
    Given a Personal Auto policy
    When I start filing a claim
    And I request a "Quote and Perform Service" for "Glass"
    And I finish filing the claim
    Then a "Glass" service should be requested on the claim

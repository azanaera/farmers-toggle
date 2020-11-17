@homeowners @FNOL-10-Fnol-VendorServiceManagement
Feature: Service Request

  As an adjuster,
  I want to request services for both new claims and existing claims,
  so that services can be quoted and performed to recover the losses.

  Background:
    Given I am a user with the "Adjuster" role

  @23750-GW
  Scenario: Requesting a quote and perform service for roofing on an existing claim
    Given a Homeowners claim
    When I request a "Quote and Perform Service" for "Roofing" on the existing claim
    Then a "Roofing" service should be requested on the claim
    And the request type should be "Quote and Perform Service"

  @23750-GW
  Scenario Outline: Requesting a service on an existing claim
    Given a Homeowners claim
    When I request a "<Request Type>" for "<Services to Perform>" on the existing claim
    Then a "<Services to Perform>" service should be requested on the claim
    And the request type should be "<Request Type>"

    Examples:
      | Request Type              | Services to Perform       |
      | Quote only                | Alternative accommodation |
      | Quote and Perform Service | Auto body                 |
      | Perform Service           | Glass                     |
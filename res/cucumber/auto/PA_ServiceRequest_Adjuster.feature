@personal_auto @PA_ServiceRequest_Adjuster @suite
Feature: Service Request - Adjuster (PA_ServiceRequest_Adjuster)

  As an adjuster,
  I want to request services for both new claims and existing claims,
  so that services can be quoted and performed to recover the losses.

  Background:
    Given I am a user with the "Adjuster" role

  Scenario: 1. A service request is created for an existing claim related to "1st Party Vehicle" to "Quote and Perform Service" for "Auto body"
    Given a Personal Auto claim
    And the claim has a "Collision" exposure
    And I choose a third party to be the claimant for the vehicle exposure
    When I start a request for a new service related to the "Vehicle" exposure
    And add a new vendor to the service for "Auto Repair Shop"
    And I request to "Perform Service" for "Glass" on the existing claim
    Then a "Glass" service should be requested on the claim
    And the request type should be "Perform Service"

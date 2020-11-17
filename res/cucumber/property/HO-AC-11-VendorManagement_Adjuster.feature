@homeowners @HO-AC-11-VendorManagement
Feature: Vendor Management

  As an adjuster
  I want to create, track, and manage requests for services to be provided by vendors
  So that I can progress assessing or fulfilling my claim

  Background:
    Given I am a user with the "Adjuster" role

  @23258-GW
  Scenario: A service request is created for an existing claim related to "1st Party Vehicle" to "Quote and Perform Service" for "Cleaning"
    Given a Homeowners claim
    And the claim has a "Coverage A - Dwelling" exposure
    When I start a request for a new service related to the "Dwelling" exposure
    And add a new vendor to the service for "Vendor (Company)"
    And I request to "Quote and Perform Service" for "Plumber" on the existing claim
    Then a "Plumber" service should be requested on the claim
    And the request type should be "Quote and Perform Service"

  @23258-GW
  Scenario: Cancel a service request
    Given a Homeowners claim
    And the claim has a "Coverage A - Dwelling" exposure
    And an "Cleaning" service request of Type "Quote and Perform Service" is "Requested"
    When I cancel the service request
    Then the service request is "Canceled"

  @23258-GW
  Scenario: Assign Service
    Given a Homeowners claim
    And the claim has a "Coverage A - Dwelling" exposure
    And an "Cleaning" service request of Type "Quote and Perform Service" is "Requested"
    And the service request is assigned
    When I Re-assign the service request
    Then assignment has changed for service request

  @23258-GW
  Scenario: Record Vendor Progress
    Given a Homeowners claim
    And the claim has a "Coverage A - Dwelling" exposure
    And an "Cleaning" service request of Type "Quote and Perform Service" is "Requested"
    When I update Vendor Reference Number
    Then service request should reflect updated Reference Number

  @23258-GW
  Scenario: Request Requote for Service
    Given a Homeowners claim
    And the claim has a "Coverage A - Dwelling" exposure
    And an "Cleaning" service request of Type "Quote and Perform Service" is "Vendor Waiting"
    And the service request has been quoted
    When I request for requote
    Then Requote request is sent and history table is updated

  @23258-GW
  Scenario: Approve Quote for Service
    Given a Homeowners claim
    And the claim has a "Coverage A - Dwelling" exposure
    And an "Cleaning" service request of Type "Quote and Perform Service" is "In Progress"
    And the service request has been quoted
    When I approve the quote and the requested service completion date
    Then Quote Status is "Approved"

  @23258-GW
  Scenario: Revise Quote
    Given a Homeowners claim
    And the claim has a "Coverage A - Dwelling" exposure
    And an "Cleaning" service request of Type "Quote and Perform Service" is "In Progress"
    And the service request has been quoted
    When I approve the quote and the requested service completion date
    And I revise the quote to update the number of days to perform the service to "10" with line items as:
      | Category     | Description              | Amount |
      | Inspection   | Inspection description   | 100    |
      | Court costs  | Court Costs description  | 50     |
      | Other        | Other description        | 130    |
    Then the quote amount is "280 USD"
    And the number Of Days To Perform Service is "10" days
    And Quote Status is "Waiting for Approval"
    And the service request is "Vendor Waiting"

  @23258-GW
  Scenario: Add Invoice
    Given a Homeowners claim
    And the claim has a "Coverage A - Dwelling" exposure
    And an "Cleaning" service request of Type "Quote and Perform Service" is "In Progress"
    And the service request has been quoted
    When I approve the quote and the requested service completion date
    And I add an invoice described with "Invoice description" with line items as:
      | Category     | Description              | Amount |
      | Inspection   | Inspection description   | 100    |
      | Court costs  | Court Costs description  | 50     |
    Then a new invoice is added for a total of "150 USD"

  @23258-GW
  Scenario: Send Message to vendor
    Given a Homeowners claim
    And the claim has a "Coverage A - Dwelling" exposure
    And an "Cleaning" service request of Type "Quote and Perform Service" is "In Progress"
    And the service request has been quoted
    When I approve the quote and the requested service completion date
    And I send a question to the vendor
    Then a message is created
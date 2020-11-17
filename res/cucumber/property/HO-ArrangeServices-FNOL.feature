@homeowners @HO-ArrangeServices-FNOL
Feature: Service Request

  As a customer service representative,
  I want to request services for new claims,
  so that services can be quoted and performed to recover the losses.

  Background:
    Given I am a user with the "Customer Service Associate" role

  @23750-GW
  Scenario: Requesting a quote and perform service for roofing on a new claim
    Given a Homeowners policy
    When I start filing a claim
    And I request a "Quote and Perform Service" for "Roofing"
    And I finish filing the claim
    Then a "Homeowners" claim should be created
    And a "Roofing" service should be requested on the claim
    And the request type should be "Quote and Perform Service"
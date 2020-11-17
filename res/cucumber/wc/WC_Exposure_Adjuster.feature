@workers_comp
Feature: Exposure

  As a customer service representative,
  I want to manually create exposures on existing claims.

  Background:
    Given I am a user with the "Customer Service Associate" role
    And I have the "Clerical" role
    And I am in the "Workers Comp" security zone

  Scenario: Creating an Indemnity exposure on an existing Workers' Compensation claim
    Given a Workers' Compensation claim
    And the only exposure on claim is for Medical Details
    And the Injured Worker will lose time from work
    Then an "Indemnity" exposure should be created on the claim

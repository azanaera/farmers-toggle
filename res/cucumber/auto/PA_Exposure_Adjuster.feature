@personal_auto @PA_Exposure_Adjuster @suite
Feature: Exposure - Adjuster (PA_Exposure_Adjuster)

  As an adjuster,
  I want to create exposures while filing a new claim and on existing claims.

  Background:
    Given I am a user with the "Adjuster" role

  # TODO ignoring S1: Could not find widget with id Claim-ClaimMenuActions-ClaimMenuActions_NewExposure-NewExposureMenuItemSet-NewExposureMenuItemSet_ByCoverage-0-item-0-item
  @ignore
  Scenario: 1. Creating a collision exposure on an existing Personal Auto claim that has no vehicle incident
    Given a Personal Auto claim
    # And no "vehicle" incident has been added to the claim yet
    When I add a collision exposure by coverage
    # Create exposure by coverage: Actions->New Exposure->Choose by Coverage
    Then the claim should have "1" vehicle incident
    And a "Collision" exposure should be created on the claim
    And the exposure should reference the vehicle incident

  Scenario: 2. Editing claimant for an open vehicle exposure
    Given a Personal Auto claim
    And an "Open" collision exposure
    # With a new contact as claimant
    When I choose the insured to be the claimant for the vehicle exposure
    Then the vehicle exposure's claimant should be the insured

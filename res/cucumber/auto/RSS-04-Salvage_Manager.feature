@personal_auto @RSS-04-Salvage @suite
Feature: Salvage - Manager (RSS-04-Salvage_Manager)

  As a manager,
  I want the system to populate the vehicle recovery date when the salvage vehicle activity is completed,
  So that we can track completed vehicle salvages.

  Background:
    Given I am a user with the "Manager" role

  @23530-GW
  Scenario: 1. A vehicle recovery date is when I complete the salvage
    Given a Personal Auto claim
    And the claim has a "Collision" exposure
    And the vehicle incident is indicated as a total loss
    And I manually reassign the activity to group "Toggle Auto East Zone Generalist Group 1" and user "Andy Applegate"
    When I complete the "Salvage Vehicle" activity
    Then the vehicle recovery date should be today
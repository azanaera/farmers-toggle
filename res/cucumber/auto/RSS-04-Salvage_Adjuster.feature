@personal_auto @RSS-04-Salvage @suite
Feature: Salvage - Adjuster (RSS-04-Salvage_Adjuster)

  As an adjuster,
  I want to be able to manage the salvage for a vehicle that has been determined to be a total loss,
  So that we can recover the loss.

  Background:
    Given I am a user with the "Adjuster" role

  @23530-GW
  Scenario: 1. A total loss vehicle requires details to salvage
    Given a Personal Auto claim
    And the claim has a "collision" exposure
    When I indicate that a vehicle is a total loss
    Then additional Salvage information can be captured for a total loss

  @23530-GW
  Scenario: 2. A total loss vehicle should be recovered and salvaged
    Given a Personal Auto claim
    And the claim has a "collision" exposure
    When I indicate that a vehicle is a total loss
    Then the following activities should be on the claim:
      | Subject              | Related To | Status | Assigned To                                                     |
      | Salvage Vehicle      | Exposure   | open   | Toggle Salvage Activity Queue - Toggle National Salvage Group 1 |
      | New Claim Assignment | Claim      | open   | Claim Owner                                                     |
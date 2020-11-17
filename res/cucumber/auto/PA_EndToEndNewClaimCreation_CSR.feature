@personal_auto @PA_EndToEndNewClaimCreation_CSR @suite
Feature: End to End New Claim Creation - CSR (PA_EndToEndNewClaimCreation_CSR)

  As a customer service representative,
  I want to file a personal auto claim for collision with motor vehicle.

  Background:
    Given I am a user with the "Customer Service Associate" role
    # And exposure business rule: EC01000 - Personal Auto Collision is enabled
    # And gosu rules to automatically assign the claim: GCAA00010 - If the claim loss type is Auto, this rule uses the loss type and claim segment to get the top two matching group type choices for assigning this claim.
    # And gosu rules to automatically assign the exposure: GEA03000 - If the exposure is still not assigned, this rule assigns the exposure to the assigned owner and group for the claim.

  Scenario: 1. Filing a new Personal Auto claim for collision with motor vehicle
    Given a Personal Auto policy
    When I start filing a claim
    And I select the "1st" covered vehicle
    And I set loss location to an address in state "California"
    And I set claim loss cause to "Collision with motor vehicle"
    And I add a "Insured's loss" injury incident
    And I add a person contact with "Other" role
    And I add a note
    And I request a "Quote and Perform Service" for "Towing and Roadside service"
    And I add a bodily injury exposure
    And I assign the claim individually through automated assignment
    And I assign the "Collision" exposure through automated assignment
    And I manually assign the "Uninsured Motorist Bodily Injury" exposure to group "Toggle Auto East Zone Generalist Group 1" and user "Andy Applegate"
    And I finish filing the claim

    Then a "Personal Auto" claim should be created
    And an incident for the selected vehicle should be created on the claim
    And a bodily injury incident should be created on the claim
    And a person contact with "Other" role should be on the claim
    And a note should be on the claim
    And a "Towing and Roadside service" service should be requested on the claim
    And the claim should be assigned to a user in "Toggle Auto East Zone Generalist Group 1" group
    And the "Collision" exposure should be assigned to the claim owner
    And the "Uninsured Motorist Bodily Injury" exposure should be assigned to group "Toggle Auto East Zone Generalist Group 1"
    And the "Uninsured Motorist Bodily Injury" exposure should be assigned to user "Andy Applegate"

  # TODO ignoring S2: First and Final is broken
  @ignore
  Scenario: 2. Auto - Auto First and Final claim
    Given a Personal Auto policy
    When I start filing a claim in Auto First and Final Wizard
    And the claim was reported by the Insured
    And I select the "1st" covered vehicle
    And the insured is the claimant
    And I add an autobody repair shop "Advanced Auto Repair Center"
    And I select Ready To Pay option "No"
    And I finish filing the claim
    Then a "Personal Auto" claim should be created
    And a vehicle incident for the selected vehicle should be created on the claim
    And a "Vehicle" exposure should be created on the claim
    And the following services should be requested on the claim:
      | Vendor                      | Request Type      | Services to Perform |
      | Advanced Auto Repair Center | Unmanaged Service | Auto body           |

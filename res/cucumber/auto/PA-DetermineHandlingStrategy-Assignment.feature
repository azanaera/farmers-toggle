@personal_auto @PA-DetermineHandlingStrategy-Assignment @suite
Feature: Assignment - Adjuster (PA-DetermineHandlingStrategy-Assignment)

  As an adjuster,
  I want to reassign claims and exposures manually and automated using assignment rules.

  @23550-GW
  Scenario: 1. Reassigning an exposure through automated assignment on a Personal Auto claim
    Given I am a user with the "Adjuster" role
    And a Personal Auto claim
    And the claim is assigned to group "Toggle Auto East Zone Generalist Group 1" and user "Andy Applegate"
    And the claim has a "collision" exposure
    And the exposure is assigned to group "Toggle Auto East Zone Extended Handlers Group 1" and user "Justin Silvers"
    When I reassign the exposure through automated assignment
    Then the exposure should be assigned to the claim owner

  @23550-GW
  Scenario: 2. Manually reassigning an exposure on a Personal Auto claim
    Given I am a user with the "Adjuster" role
    And a Personal Auto claim
    And the claim has a "collision" exposure
    And the exposure is assigned to group "Toggle Auto East Zone APD Handlers Group 1" and user "Justin Silvers"
    When I manually reassign the exposure to group "Toggle Auto East Zone Generalist Group 1" and user "Samantha Bristol"
    Then the exposure should be assigned to group "Toggle Auto East Zone Generalist Group 1"
    And the exposure should be assigned to user "Samantha Bristol"

  @23550-GW
  Scenario: 3. Manually reassigning an activity on a Personal Auto claim
    Given I am a user with the "Adjuster" role
    And a Personal Auto claim
    And the claim has an activity
    And the activity is assigned to group "Toggle Auto East Zone APD Handlers Group 1" and user "Justin Silvers"
    When I manually reassign the activity to group "Toggle Auto East Zone Generalist Group 1" and user "Alexander Sleeman"
    Then the activity should be assigned to group "Toggle Auto East Zone Generalist Group 1"
    Then the activity should be assigned to user "Alexander Sleeman"

  @23550-GW-I
  Scenario: 4. Assigning a claim and exposure through automated assignment on new Personal Auto claim
    Given I am a user with the "Adjuster" role
    And a Personal Auto policy
    # And exposure business rule: EC01000 - Personal Auto Collision is enabled
    # And gosu rules to automatically assign the claim: GCAA00010 - If the claim loss type is Auto, this rule uses the loss type and claim segment to get the top two matching group type choices for assigning this claim.
    # And gosu rules to automatically assign the exposure: GEA03000 - If the exposure is still not assigned, this rule assigns the exposure to the assigned owner and group for the claim.
    When I start filing a claim
    And I select an involved vehicle from covered vehicles
    And I set loss location to an address in state "California"
    And I set claim loss cause to "Collision with bicycle"
    And I assign the claim individually through automated assignment
    And I assign the "Collision" exposure through automated assignment
    And I finish filing the claim
    Then a "Personal Auto" claim should be created
    And the claim should be assigned to a user in "Toggle Auto East Zone Generalist Group 1" group
    And the exposure should be assigned to the claim owner

  @23550-GW
  Scenario: 5. Assigning a claim manually and an exposure through automated assignment on new Personal Auto claim
    Given I am a user with the "Customer Service Associate" role
    And a Personal Auto policy
    When I start filing a claim
    And I select an involved vehicle from covered vehicles
    And I set loss location to an address in state "California"
    And I set claim loss cause to "Collision with bicycle"
    And I manually assign the claim individually to group "Toggle Auto East Zone Generalist Group 1" and user "Andy Applegate"
    And I assign the "Collision" exposure through automated assignment
    And I finish filing the claim
    Then a "Personal Auto" claim should be created
    And the claim should be assigned to group "Toggle Auto East Zone Generalist Group 1"
    And the claim should be assigned to user "Andy Applegate"
    And the exposure should be assigned to the claim owner

  @23550-GW
  Scenario: 6. Automatically-assigning a claim and manually-assigning an exposure on new Personal Auto claim
    Given I am a user with the "Customer Service Associate" role
    And a Personal Auto policy
    When I start filing a claim
    And I select an involved vehicle from covered vehicles
    And I set loss location to an address in state "California"
    And I set claim loss cause to "Collision with bicycle"
    And I assign the claim individually through automated assignment
    And I manually assign the "Collision" exposure to group "Toggle Auto East Zone APD Handlers Group 1" and user "Justin Silvers"
    And I finish filing the claim
    Then a "Personal Auto" claim should be created
    And the claim should be assigned to a user in "Toggle Auto East Zone Generalist Group 1" group
    And the exposure should be assigned to group "Toggle Auto East Zone APD Handlers Group 1"
    And the exposure should be assigned to user "Justin Silvers"

  @23550-GW
  Scenario: 7. Claim assignment via round-robin
    Given I am a user with the "Adjuster" role
    And no load factor is set for all users within the "Toggle Auto East Zone Generalist Group 1" group
    And a Personal Auto policy
    When I submit "7" claims for adjudication
    Then claims should be assigned to users within the "Toggle Auto East Zone Generalist Group 1" group via round-robin

  @23550-GW
  Scenario: 8. Manual Claim re-assignment
    Given I am a user with the "Adjuster" role
    And no load factor is set for all users within the "Toggle Auto East Zone Generalist Group 1" group
    And a Personal Auto claim
    And the claim is assigned to group "Toggle Auto East Zone Generalist Group 1" and user "Andy Applegate"
    And the claim has a "collision" exposure
    And the exposure is assigned to group "Toggle Auto East Zone Generalist Group 1" and user "Andy Applegate"
    And the claim has a "bodily injury" exposure
    And the exposure is assigned to group "Toggle Auto East Zone Generalist Group 1" and user "Alexander Sleeman"
    When I manually reassign the claim to group "Toggle Auto East Zone Generalist Group 1" and user "Samantha Bristol"

    Then the claim should be assigned to group "Toggle Auto East Zone Generalist Group 1"
    And the claim should be assigned to user "Samantha Bristol"
    And the "collision" exposure should be assigned to group "Toggle Auto East Zone Generalist Group 1"
    And the "collision" exposure should be assigned to user "Samantha Bristol"
    And the "bodily injury" exposure should be assigned to group "Toggle Auto East Zone Generalist Group 1"
    And the "bodily injury" exposure should be assigned to user "Alexander Sleeman"
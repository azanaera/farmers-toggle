@personal_auto @PA_EndToEndClaimAdjudication_Adjuster @suite
Feature: End to End Claim Adjudication - Adjuster (PA_EndToEndClaimAdjudication_Adjuster)

  As an adjuster,
  I want to add activities, notes and service requests on the claim, create and edit reserves and checks, then close the claim.

  Background:
    Given I am a user with the "Adjuster" role
    And I have the "Toggle Auto APD Specialist Level 1" authority limit profile

  Scenario: 1. Creating activities, notes and service requests, create reserves and issue payments, then close the claim
    Given a Personal Auto claim
    # And no "vehicle" incident has been added to the claim yet

    # Activities, Notes and Parties Involved
    When I add activities with following categories and subjects:
      | Reminder | 30 day diary    |
      | Reminder | Verify coverage |
      | Request  | Legal review    |
    Then activities with following subjects should be on the claim:
      | 30 day diary    |
      | Verify coverage |
      | Legal review    |

    When I complete all activities
    Then all activities should be completed

    When I add a note to the existing claim
    # Click New Note from Actions menu
    Then a note should be on the claim

    When I add a person contact with "Other" role to the existing claim
    Then a person contact with "Other" role should be on the claim

    ## "add a collision exposure by coverage" works on the UI, but not via ISBTF and for the life of me, I can't figure out why
#    When I add a collision exposure by coverage
#    # Create exposure by coverage: Actions->New Exposure->Choose by Coverage
#    Then the claim should have "1" vehicle incident
#    And a "Collision" exposure should be created on the claim
#    And the exposure should reference the vehicle incident

    # Service Requests
#    When I request a "Quote only" for "Alternative accommodation" on the existing claim
#    And I request a "Quote and Perform Service" for "Auto body" on the existing claim
#    And I request a "Perform Service" for "Glass" on the existing claim
#    Then the following services should be requested on the claim:
#      | Request Type              | Services to Perform       |
##      | Quote Only                | Alternative accommodation |
##      | Quote and Perform Service | Auto body                 |
#      | Perform Service | Glass |
#
#    # Reserves and Payments
#    When I create "500 USD" available reserves for "Claim Cost" and "Material Damage"
#    And I create "300 USD" available reserves for "Expense" and "Material Damage"
#    Then the exposure should have the following remaining reserves:
#      | Cost Type  | Cost Category   | Amount  |
#      | Claim Cost | Material Damage | 500 USD |
#      | Expense    | Material Damage | 300 USD |
#
#    When I set "600 USD" available reserves for "Claim Cost" and "Material Damage"
#    And I set "200 USD" available reserves for "Expense" and "Material Damage"
#    Then the exposure should have the following remaining reserves:
#      | Cost Type  | Cost Category   | Amount  |
#      | Claim Cost | Material Damage | 600 USD |
#      | Expense    | Material Damage | 200 USD |
#
#    When the exposure reaches the ability to pay
#    And I create a check with a "100 USD" "Partial" payment on the "Claim Cost" and "Material Damage" reserve line
#    Then a "100 USD" "Partial" payment should exist on the reserve line
#    Then the exposure should have the following remaining reserves:
#      | Cost Type  | Cost Category   | Amount  |
#      | Claim Cost | Material Damage | 500 USD |
#
#    When I change the payment amount to "200 USD"
#    Then a "200 USD" "Partial" payment should exist on the reserve line
#    Then the exposure should have the following remaining reserves:
#      | Cost Type  | Cost Category   | Amount  |
#      | Claim Cost | Material Damage | 400 USD |

    # Closing and then opening the claim
    When all activities are completed
    And all exposures are closed
    And all matters are closed
    And all service requests are completed
    And subrogation is closed
    And fault rating is determined
    And I close the claim
    Then the claim status should be "Closed"

    When I re-open the claim
    Then the claim status should be "Open"
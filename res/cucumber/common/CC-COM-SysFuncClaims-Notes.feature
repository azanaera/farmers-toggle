@common @CC-COM-SysFuncClaims-Notes @suite
Feature: Note (CC-COM-SysFuncClaims-Notes)

  As an adjuster,
  I want to add/update a note to an existing claim.
  While as a manager,
  I want to delete a note for an existing claim.

  @23160-GW
  Scenario: 1. Adding a note to an existing Personal Auto claim
    Given I am a user with the "Adjuster" role
    And a Personal Auto claim
    When I add a note to the existing claim
    Then a note should be on the claim

  @23160-GW
  Scenario: 2. Creating a new note on an existing claim
    Given I am a user with the "Adjuster" role
    And a Personal Auto claim
    And the claim has a bodily injury exposure
#    And I choose a third party to be the claimant for the vehicle exposure
    When I start creating a new note for "Medical"
    And Security Type is "Medical"
#    And the note is related to the claim (was exposure)
    And the note is confidential
    And I finish creating the note
    Then a note should be on the claim
    And a note has following details:
      | Create Date | Author | Topic   | Related To | Confidential |
      | Today       | Me     | Medical | Claim      | Yes          |

  @23160-GW
  Scenario Outline: 3. Update a note on an existing Personal Auto claim
    Given I am a user with the "Adjuster" role
    And a Personal Auto claim
    And the claim has a first party vehicle exposure
    And multiple notes exists on the claim
      | Author | Topic   | Related To | Confidential | Text        |
      | Me     | General | Exposure   | Yes          | First note  |
      | Me     | Medical | Claim      | Yes          | Second note |
    When I update the topic "<Topic>" in the note with text "First note"
    Then the topic "<Topic>" is updated in the note with text "First note"

    Examples:
      | Topic                         |
      | General                       |
      | Coverage                      |
      | Initial Contact w/Insd or Rep |
      | Investigation                 |
      | Liability                     |
      | Case Review                   |
      | Evaluation                    |
      | Negotiation                   |
      | Medical                       |
      | Subrogation                   |
      | Salvage                       |
      | Litigation                    |

  @23160-GW, @ignore
  Scenario: 4. Delete a note to an existing Personal Auto claim
    Given I am a user with the "Manager" role
    And a Personal Auto claim
    And the claim has a first party vehicle exposure
    And multiple notes exists on the claim
      | Author | Topic   | Related To | Confidential | Text        |
      | Me     | General | Exposure   | Yes          | First note  |
      | Me     | Medical | Claim      | Yes          | Second note |
    When I delete the note with text "First note"
    Then only the following notes exist on the claim
      | Author | Topic   | Related To | Confidential | Text        |
      | Me     | Medical | Claim      | Yes          | Second note |
@homeowners
Feature: Note

  As an adjuster,
  I want to add new notes for existing claims.

  Background:
    Given I am a user with the "Adjuster" role

  Scenario: Adding a note to an existing Homeowners claim
    Given a Homeowners claim
    # Click New Note from Actions menu
    When I add a note to the existing claim
    Then a note should be on the claim
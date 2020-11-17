@personal_auto @PA_PartiesInvolved_Adjuster @suite
Feature: Parties Involved - Adjuster (PA_PartiesInvolved_Adjuster)

  As an adjuster,
  I want to add contacts for existing claims.

  Background:
    Given I am a user with the "Adjuster" role

  Scenario: 1. Add a new contact on an existing claim
    Given a Personal Auto claim
    And the claim has a "collision" exposure
    And I choose the insured to be the claimant for the vehicle exposure
    When I add an "Auto Repair Shop" contact with "Vendor" role to the existing exposure
      | Name         | Express Auto      |
      | Address 1    | 8982 Merrydale Dr |
      | City         | San Francisco     |
      | ZIP Code     | 94104             |
      | State        | California        |
      | Country      | United States     |
      | Address Type | Business          |
      | Work         | 2092348728        |
      | Tax ID (EIN) | 77-7752421        |
    Then the contact is a Parties Involved contact
      | Name         | Express Auto      |
      | Address      | 8982 Merrydale Dr |
      | City         | San Francisco     |
      | ZIP Code     | 94104             |
      | State        | CA                |
      | Address Type | Business          |
      | Work         | 209-234-8728      |
      | Roles        | Vendor            |

@common @Common-FNOL-03-Common @suite
Feature: Search Verified Policies (Common-FNOL-03-Common_CSR)

  As a customer service representative,
  I want to be able to search for an existing Personal Auto policy so that I can continue to capture loss details.

  Background:
    Given I am a user with the "Customer Service Associate" role

  # TODO ignoring S1 and SO2: Does this need a mock integration?
  # This file is identical to CC-COM-SearchForPolicy-Common, which has been removed from the code base
  @23390-GW @ignore
  Scenario: 1. Search for a PA policy to file claims against verified PA policies
    Given a Personal Auto policy
    When I search for a known policy by policy number
    Then I can lodge a claim against that policy

  @23390-GW @ignore
  Scenario Outline: 2. Search for a policy to file a claim against verified policies
    Given I have the following search data:
      | Search Data   |
      | <Search Data> |
    When I search for a policy
    Then I have a list of policies matching the search criteria
    Examples:
      | Search Data                 |
      | Search by name, SSN and VIN |
      | Search by Organization Name |
      | Search by City              |
      | Search by Policy Type       |
      | Search by State             |
      | Search by Zip Code          |

@common @CC-COM-WriteChecks-ClaimFinancials @suite
Feature: Create reserves and checks (CC-COM-WriteChecks-ClaimFinancials)

  As an adjuster,
  I want to be able to create and edit reserves and checks, so that I can manage the payments on the claim

  Background:
    Given I am a user with the "Adjuster" role
    And I have the "Toggle Auto APD Specialist Level 1" authority limit profile

  @23290.1-GW
  Scenario Outline: 1. State withholding for Auto Towing Agencies, Auto Repair Shops and Vendor (Company) where Loss Location State is CA,GA, or MN
    Given a Personal Auto claim
    And the claim loss location is in state "<State>"
    And the claim has a "Collision" exposure
    And the exposure has "8000 USD" available reserves for "<Cost Type>" and "Material Damage"
    And a "<Contact Subtype>" contact exists in the address book
      | Name  | <Name>  |
      | State | <State> |
    And "<Contact Subtype>" contact is available for work
    And "<Contact Subtype>" contact has backup withholding
    When I start creating a check for "<Contact Subtype>" with contact name "<Name>"
    And I create payment on the reserve line as follows:
      | Cost Type     | <Cost Type>     |
      | Cost Category | Material Damage |
      | Payment Type  | Partial         |
      | Amount        | 5000 USD        |
    And I select the deductions link from the Instructions wizard
    Then State withholding with amount of "<Amount>" should be deducted

    Examples:
      | Contact Subtype    | Name                  | State      | Cost Type  | Amount |
      | Auto Towing Agency | 24-hour Towing        | California | Expense    | 350    |
      | Auto Repair Shop   | A1 Auto Body          | California | Expense    | 350    |
      | Vendor (Company)   | 3M                    | California | Expense    | 350    |
      | Auto Towing Agency | 24-hour Towing        | California | Claim Cost | 350    |
      | Auto Repair Shop   | A1 Auto Body          | California | Claim Cost | 350    |
      | Vendor (Company)   | 3M                    | California | Claim Cost | 350    |

      | Auto Towing Agency | Rapid Towing Services | Georgia    | Expense    | 300    |
      | Auto Repair Shop   | Quick Auto            | Georgia    | Expense    | 300    |
      | Vendor (Company)   | Motor Trade           | Georgia    | Expense    | 300    |
      | Auto Towing Agency | Rapid Towing Services | Georgia    | Claim Cost | 300    |
      | Auto Repair Shop   | Quick Auto            | Georgia    | Claim Cost | 300    |
      | Vendor (Company)   | Motor Trade           | Georgia    | Claim Cost | 300    |

  @23290.1-GW
  Scenario Outline: 2. State withholding for vendors that are not Auto Towing Agencies, Auto Repair Shops and Vendor (Company) where
  Primary Vendor address State is CA, GA or MN

    Given a Personal Auto claim
    And the claim loss location is in state "<State>"
    And the claim has a "Collision" exposure
    And the exposure has "8000 USD" available reserves for "<Cost Type>" and "Material Damage"
    And a "<Contact Subtype>" contact exists in the address book
      | Name  | <Name>  |
      | State | <State> |
    And "<Contact Subtype>" contact is available for work
    And "<Contact Subtype>" contact has backup withholding
    When I start creating a check for "<Contact Subtype>" with contact name "<Name>"
    And I create payment on the reserve line as follows:
      | Cost Type     | <Cost Type>     |
      | Cost Category | Material Damage |
      | Payment Type  | Partial         |
      | Amount        | 5000 USD        |
    And I select the deductions link from the Instructions wizard
    Then State withholding with amount of "<Amount>" should be deducted

    Examples:
      | Contact Subtype           | Name                          | State      | Cost Type  | Amount |
      | Medical Care Organization | Health South                  | California | Expense    | 350    |
      | Law Firm                  | Allendale, Myers & Associates | California | Expense    | 350    |
      | Medical Care Organization | Health South                  | California | Claim Cost | 350    |
      | Law Firm                  | Allendale, Myers & Associates | California | Claim Cost | 350    |

      | Medical Care Organization | Maxicare                      | Georgia    | Expense    | 300    |
      | Law Firm                  | Taylor Associates             | Georgia    | Expense    | 300    |
      | Medical Care Organization | Maxicare                      | Georgia    | Claim Cost | 300    |
      | Law Firm                  | Taylor Associates             | Georgia    | Claim Cost | 300    |

  @23290.1-GW
  Scenario Outline: 3. State withholding for vendors that are not Auto Towing Agencies, Auto Repair Shops and Vendor (Company) where
  Primary Vendor address State is CA, GA or MN

    Given a Personal Auto claim
    And the claim loss location is in state "<State>"
    And the claim has a "Collision" exposure
    And the exposure has "8000 USD" available reserves for "<Cost Type>" and "Material Damage"
    And a "<Contact Subtype>" contact exists in the address book
      | First name | <First Name> |
      | Last name  | <Last Name>  |
      | State      | <State>      |
    And "<Contact Subtype>" contact is available for work
    And "<Contact Subtype>" contact has backup withholding
    When I start creating a check for "<Contact Subtype>" with contact name "<First Name>" "<Last Name>"
    And I create payment on the reserve line as follows:
      | Cost Type     | <Cost Type>     |
      | Cost Category | Material Damage |
      | Payment Type  | Partial         |
      | Amount        | 5000 USD        |
    And I select the deductions link from the Instructions wizard
    Then State withholding with amount of "<Amount>" should be deducted

    Examples:
      | Contact Subtype | First Name | Last Name | State      | Cost Type  | Amount |
      | Vendor (Person) | Stephen    | Strange   | California | Expense    | 350    |
      | Doctor          | Samantha   | Andrews   | California | Expense    | 350    |
      | Attorney        | Lily       | Watson    | California | Expense    | 350    |
      | Vendor (Person) | Stephen    | Strange   | California | Claim Cost | 350    |
      | Doctor          | Samantha   | Andrews   | California | Claim Cost | 350    |
      | Attorney        | Lily       | Watson    | California | Claim Cost | 350    |

      | Vendor (Person) | Bobby      | Brown     | Georgia    | Expense    | 300    |
      | Doctor          | Lenore     | Urbane    | Georgia    | Expense    | 300    |
      | Attorney        | Sherlock   | Holmes    | Georgia    | Expense    | 300    |
      | Vendor (Person) | Bobby      | Brown     | Georgia    | Claim Cost | 300    |
      | Doctor          | Lenore     | Urbane    | Georgia    | Claim Cost | 300    |
      | Attorney        | Sherlock   | Holmes    | Georgia    | Claim Cost | 300    |

  @23290.2-GW
  Scenario: 4. Create a manual check
    Given a Personal Auto claim
    And the claim has a "Collision" exposure
    And I set the available reserves for "Claim Cost"/"Material Damage" to "300 USD"
    When I create a manual check with a "200 USD" "Partial" payment on the reserve line
    Then a "200 USD" "Partial" payment should exist on the reserve line
    And the exposure should have the following remaining reserves:
      | Cost Type  | Cost Category   | Amount  |
      | Claim Cost | Material Damage | 100 USD |

  @23290.2-GW
  Scenario: 5. Create a manual check exceeding the available reserve
    Given a Personal Auto claim
    And the claim has a "Collision" exposure
    And I set the available reserves for "Claim Cost"/"Material Damage" to "300 USD"
    When I create a manual check with a "400 USD" "Partial" payment on the reserve line
    Then a "400 USD" "Partial" payment should exist on the reserve line
    And the exposure should have the following remaining reserves:
      | Cost Type  | Cost Category   | Amount |
      | Claim Cost | Material Damage | 0 USD  |

  @23290.3-GW
  Scenario: 6. Create a payment quick check
    Given a Personal Auto claim
    And the claim has a "Collision" exposure
    And I set the available reserves for "Claim Cost"/"Material Damage" to "300 USD"
    When I create a quick check with the following details:
      | Cost Category       | Payee                 | Amount  | Currency | Payment Type | Eroding |
      | Material Damage USD | Quick Check Recipient | 300 USD | USD      | Partial      | Yes     |
    Then a "300 USD" "Partial" payment should exist on the reserve line
    And the exposure should have the following remaining reserves:
      | Cost Type  | Cost Category   | Amount |
      | Claim Cost | Material Damage | 0 USD  |

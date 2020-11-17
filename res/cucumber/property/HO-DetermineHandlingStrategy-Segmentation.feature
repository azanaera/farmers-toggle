@homeowners @HO-DetermineHandlingStrategy-Segmentation
Feature: Segmentation

  As an adjuster,
  I want the system to be able to categorize the claim and/or exposures based on key variables such as complexity, severity, etc...
#Review scenarios description

  Background:
    Given I am a user with the "Adjuster" role

  @23960-GW
  Scenario: Homeowners claim with default exposure segmentation
    Given a Homeowners policy
    When I file a new claim with a mid complexity exposure
    Then the claim segment should be "Property - mid complexity"

  @23960-GW
  Scenario: Homeowners claim with default claim segmentation
    Given a Homeowners policy
    When I file a new claim with no exposure
    Then the claim segment should be "Property - low complexity"

  @23960-GW
  Scenario Outline: Exposure Segmentation Rule for Property Low
    Given a Homeowners policy
    When I file a new claim with the following exposure:
      | Exposure Type   | Incident Severity   |
      | <Exposure Type> | <Incident Severity> |
    Then the exposure segment should be "Property - low complexity"
    Examples:
      | Exposure Type     | Incident Severity |
      | Personal Property | Minor             |
      | Property          | Minor             |

  @23960-GW
  Scenario Outline: Exposure Segmentation Rule for Property Medium
    Given a Homeowners policy
    When I file a new claim with the following exposure:
      | Exposure Type   | Incident Severity   | Loss Party   |
      | <Exposure Type> | <Incident Severity> | <Loss Party> |
    Then the exposure segment should be "Property - mid complexity"
    Examples:
      | Exposure Type     | Incident Severity  | Loss Party            |
      | Personal Property | Moderate (usable)  | Insured's loss        |
      | Loss Of Use       | Minor              | Insured's loss        |
      | Personal Property | Major (not usable) | Third-party liability |

  @23960-GW
  Scenario Outline: Exposure Segmentation Rule for Property high
    Given a Homeowners policy
    When I file a new claim with the following exposure:
      | Exposure Type   | Incident Severity   | Loss Party   |
      | <Exposure Type> | <Incident Severity> | <Loss Party> |
    Then the exposure segment should be "Property - high complexity"
    Examples:
      | Exposure Type     | Incident Severity  | Loss Party     |
      | Property          | Death              | Insured's loss |
      | Personal Property | Major (not usable) | Insured's loss |

  @23960-GW
  Scenario Outline: Exposure Segmentation Rule for Property default
    Given a Homeowners policy
    When I file a new claim with the following exposure:
      | Exposure Type   | Incident Severity   | Loss Party   |
      | <Exposure Type> | <Incident Severity> | <Loss Party> |
    Then the exposure segment should be "Property - mid complexity"
    Examples:
      | Exposure Type   | Incident Severity | Loss Party     |
      | Other Structure | Minor             | Insured's loss |
      | Dwelling        | Minor             | Insured's loss |

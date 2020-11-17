@personal_auto @PA-DetermineHandlingStrategy-Segmentation @suite
Feature: Segmentation - Adjuster (PA-DetermineHandlingStrategy-Segmentation)

  As an adjuster,
  I want the system to be able to categorize the claim and/or exposures based on key variables such as complexity, severity, etc...

  Background:
    Given I am a user with the "Adjuster" role

  @23650-GW
  Scenario: 1. Personal Auto claim with default exposure segmentation
    Given a Personal Auto policy
    When I file a new claim with a mid complexity exposure
    Then the claim segment should be "Auto - mid complexity"

  @23650-GW
  Scenario: 2. Personal Auto claim with default claim segmentation
    Given a Personal Auto policy
    When I file a new claim with no exposure
    Then the claim segment should be "Auto - low complexity"

  @23650-GW
  Scenario Outline: 3. Exposure Segmentation Rule for Auto Low
    Given a Personal Auto policy
    When I file a new claim with the following exposure:
      | Exposure Type   | Incident Severity   |
      | <Exposure Type> | <Incident Severity> |
    Then the exposure segment should be "Auto - low complexity"
    Examples:
      | Exposure Type    | Incident Severity   |
      | Vehicle          | Minor               |
      | Vehicle          | Moderate (drivable) |
      | Bodily Injury    | Minor               |
      | Towing and Labor | Minor               |
      | Towing and Labor | Moderate (drivable) |

  @23650-GW
  Scenario Outline: 4. Exposure Segmentation Rule for Auto Medium
    Given a Personal Auto policy
    When I file a new claim with the following exposure:
      | Exposure Type   | Loss Party   |
      | <Exposure Type> | <Loss Party> |
    Then the exposure segment should be "Auto - mid complexity"
    Examples:
      | Exposure Type | Loss Party            |
      | Vehicle       | Third-party liability |
      | PIP           | Insured's loss        |

  @23650-GW
  Scenario Outline: 5. Exposure Segmentation Rule for Auto High
    Given a Personal Auto policy
    When I file a new claim with the following exposure:
      | Incident Severity   | Total Loss?   |
      | <Incident Severity> | <Total Loss?> |
    Then the exposure segment should be "Auto - high complexity"
    Examples:
      | Incident Severity       | Total Loss? |
      | Life-threatening        | false       |
      | Major (hospitalization) | false       |
      | Death                   | false       |
      | Major (not usable)      | true        |

  @23650-GW
  Scenario Outline: 6. Exposure Segmentation Rule for Auto Default
    Given a Personal Auto policy
    When I file a new claim with the following exposure:
      | Incident Severity   | Total Loss?   |
      | <Incident Severity> | <Total Loss?> |
    Then the exposure segment should be "Auto - mid complexity"
    Examples:
      | Incident Severity    | Total Loss? |
      | Major (not drivable) | false       |

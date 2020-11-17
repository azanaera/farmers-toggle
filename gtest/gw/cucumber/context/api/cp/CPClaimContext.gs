package gw.cucumber.context.api.cp

uses cucumber.api.DataTable
uses gw.api.locale.DisplayKey
uses gw.cucumber.context.api.common.ClaimContext

interface CPClaimContext extends ClaimContext {

  final static var DK_ADDRESS1              : String = DisplayKey.get("Web.FixedPropertyIncident.Property.Address.AddressLine1")
  final static var DK_CITY                  : String = DisplayKey.get("entity.Address.City")
  final static var DK_CLAIMANT              : String = DisplayKey.get("LV.Claim.Claims.Claimant")
  final static var DK_DAMAGE_DESCRIPTION    : String = DisplayKey.get("Web.FixedPropertyIncident.Description")
  final static var DK_DETAILED_INJURY_TYPE  : String = DisplayKey.get("Web.InjuryIncidentInputSet.DetailedInjuryType.Label")
  final static var DK_GENERAL_INJURY_TYPE   : String = DisplayKey.get("Web.InjuryIncidentInputSet.GeneralInjuryType.Label")
  final static var DK_INJURED_PERSON        : String = DisplayKey.get("Web.InjuryIncidentDV.Injured.Picker")
  final static var DK_LOSS_ESTIMATE         : String = DisplayKey.get("Web.FixedPropertyIncident.LossEstimate")
  final static var DK_LOSS_PARTY            : String = DisplayKey.get("Web.InjuryIncidentInputSet.LossParty.Label")
  final static var DK_PROPERTY              : String = DisplayKey.get("DisplayName.Coverage.Property")
  final static var DK_PROPERTY_DESCRIPTION  : String = DisplayKey.get("Web.FixedPropertyIncident.PropertyDescription")
  final static var DK_SEVERITY              : String = DisplayKey.get("Web.InjuryIncidentInputSet.Severity.Label")
  final static var DK_STATE                 : String = DisplayKey.get("entity.Address.State")
  final static var DK_USE_AUTO_ASSIGNMENT   : String = DisplayKey.get("Java.Assign.AssignByRules")

  /**
   * Sets the claim date of notice
   * @param date
   */
  function setDateOfNotice(date : String)

  /**
   * Verify the claim date of notice
   * @param date
   */
  function verifyClaimDateOfNotice(date : String)

  /**
   * Verify the claim reported by contact
   * @param name - The name of the reporter
   */
  function verifyClaimReportedBy(name : String)

  /**
   * Verify the claimant type
   * @param type - Claimant type
   */
  function verifyClaimantTypeIs(type : String)

  /**
   * Create property damage incident using data from table
   * @param table
   *    - Property Description  - String              - A description of the damaged property
   *    - Damage Description    - String              - A description of the damage to the property
   *    - Loss Estimate         - Number              - The estimated value lost (in default currency)
   *    - Address 1             - String              - The street number and name of the property
   *    - City                  - String              - The city where the property is located
   *    - State                 - String (State)      - The state where the property is located
   * e.g
   * | Property Description | Damage Description  | Loss Estimate | Address 1     | City          | State      |
   * | 2 bed apartment      | Flooding in kitchen | 500 USD       | 1 Main Street | San Francisco | California |
   */
  function createPropertyDamageIncident(table : DataTable)

  /**
   * Verify Property damage incident matches data in table
   * @param table
   *    - Property Description  - String              - A description of the damaged property
   *    - Damage Description    - String              - A description of the damage to the property
   *    - Loss Estimate         - Number              - The estimated value lost (in default currency)
   *    - Address 1             - String              - The street number and name of the property
   *    - City                  - String              - The city where the property is located
   *    - State                 - String (State)      - The state where the property is located
   * e.g
   * | Property Description | Damage Description  | Loss Estimate | Address 1     | City          | State      |
   * | 2 bed apartment      | Flooding in kitchen | 500 USD       | 1 Main Street | San Francisco | California |
   */
  function verifyPropertyDamageIncidentExists(table : DataTable)

  /**
   * Adds property incident to claim using builder
   */
  function claimHasPropertyIncident()

  /**
   * Adds property incident to claim through UI using data from table
   * @param table
   *    - Property Description  - String              - A description of the property
   *    - Damage Description    - String              - A description of the damage to the property
   *    - Loss Estimate         - Number              - The amount estimated to be lost (in default currency)
   *    - Address 1             - String              - The street number and name of the property
   *    - City                  - String              - The city where the property is located
   *    - State                 - String (State)      - The state where the property is located
   * e.g
   * | Property Description | Damage Description | Loss Estimate | Address 1      | City          | State      |
   * | Beautiful office     | Big fire           | 420000 USD    | 25 Main Street | San Francisco | California |
   */
  function addPropertyIncident(table : DataTable)

  /**
   * Adds injury incident to claim through UI using data from table
   * @param table
   *    - Injured Person         - String                       - Name of the injured person (should be contact on the policy)
   *    - Loss Party             - String (LossPartyType)       - Insured's loss/third party loss
   *    - Severity               - String (SeverityType)        - How severe is the injury
   *    - General Injury Type    - String (InjuryType)          - Specific injury/multiple injuries/etc
   *    - Detailed Injury Type   - String (DetailedInjuryType)  - Break/fracture/sprain/etc
   * e.g
   * | Injured Person | Loss Party     | Severity | General Injury Type | Detailed Injury Type |
   * | Brooke Wynn    | Insured's loss | Moderate | Specific injury     | Puncture             |
   */
  function addInjuryIncident(table : DataTable)

  /**
   * Adds injury incident to claim through UI using data from table
   * @param table
   *    - Injured Person         - String                       - Name of the injured person (should be contact on the policy)
   *    - Loss Party             - String (LossPartyType)       - Insured's loss/third party loss
   *    - Severity               - String (SeverityType)        - How severe is the injury
   *    - General Injury Type    - String (InjuryType)          - Specific injury/multiple injuries/etc
   *    - Detailed Injury Type   - String (DetailedInjuryType)  - Break/fracture/sprain/etc
   * e.g
   * | Injured Person | Loss Party     | Severity | General Injury Type | Detailed Injury Type |
   * | Brooke Wynn    | Insured's loss | Moderate | Specific injury     | Puncture             |
   */
  function addInjuryIncidentToClaim(table : DataTable)

  /**
   * Updates pre-existing property incident on claim through UI using data from table
   * @param table
   *    - Property Description  - String              - A description of the property
   *    - Damage Description    - String              - A description of the damage to the property
   *    - Loss Estimate         - Number              - The amount estimated to be lost (in default currency)
   *    - Address 1             - String              - The street number and name of the property
   *    - City                  - String              - The city where the property is located
   *    - State                 - String (State)      - The state where the property is located
   * e.g
   * | Property Description | Damage Description | Loss Estimate | Address 1      | City          | State      |
   * | Beautiful office     | Big fire           | 420000 USD    | 25 Main Street | San Francisco | California |
   */
  function updatePropertyIncident(table : DataTable)

  /**
   * Updates pre-existing injury incident on claim through UI using data from table
   * @param table
   *    - Loss Party             - String (LossPartyType)       - Insured's loss/third party loss
   *    - Severity               - String (SeverityType)        - How severe is the injury
   *    - General Injury Type    - String (InjuryType)          - Specific injury/multiple injuries/etc
   *    - Detailed Injury Type   - String (DetailedInjuryType)  - Break/fracture/sprain/etc
   * e.g
   * | Loss Party     | Severity | General Injury Type | Detailed Injury Type |
   * | Insured's loss | Moderate | Specific injury     | Puncture             |
   */
  function updateInjuryIncident(table : DataTable)

  /**
   * Verifies property incident on claim matches data from table through UI
   * @param table
   *    - Property Description  - String              - A description of the property
   *    - Damage Description    - String              - A description of the damage to the property
   *    - Loss Estimate         - Number              - The amount estimated to be lost (in default currency)
   *    - Address 1             - String              - The street number and name of the property
   *    - City                  - String              - The city where the property is located
   *    - State                 - String (State)      - The state where the property is located
   * e.g
   * | Property Description | Damage Description | Loss Estimate | Address 1      | City          | State      |
   * | Beautiful office     | Big fire           | 420000 USD    | 25 Main Street | San Francisco | California |
   */
  function verifyPropertyIncidentOnClaim(table : DataTable)

  /**
   * Verifies injury incident on claim matches data from table through UI
   * @param table
   *    - Injured Person         - String                       - Name of the injured person (should be contact on the policy)
   *    - Loss Party             - String (LossPartyType)       - Insured's loss/third party loss
   *    - Severity               - String (SeverityType)        - How severe is the injury
   *    - General Injury Type    - String (InjuryType)          - Specific injury/multiple injuries/etc
   *    - Detailed Injury Type   - String (DetailedInjuryType)  - Break/fracture/sprain/etc
   * e.g
   * | Injured Person | Loss Party     | Severity | General Injury Type | Detailed Injury Type |
   * | Brooke Wynn    | Insured's loss | Moderate | Specific injury     | Puncture             |
   */
  function verifyInjuryIncidentOnClaim(table : DataTable)

  /**
   * Verifies updated property incident on claim matches data from table through UI
   * @param table
   *    - Loss Party             - String (LossPartyType)       - Insured's loss/third party loss
   *    - Severity               - String (SeverityType)        - How severe is the injury
   *    - General Injury Type    - String (InjuryType)          - Specific injury/multiple injuries/etc
   *    - Detailed Injury Type   - String (DetailedInjuryType)  - Break/fracture/sprain/etc
   * e.g
   * | Loss Party     | Severity | General Injury Type | Detailed Injury Type |
   * | Insured's loss | Moderate | Specific injury     | Puncture             |
   */
  function verifyInjuryIncidentUpdated(table : DataTable)

  /**
   * Select the covered property on select risk units step of FNOL
   * @param val
   */
  function selectCoveredProperty(prop : String)

  /**
   * Verifies the exposure property address is in the given state
   * @param state
   */
  function verifyClaimExposurePropertyAddressInState(state : String)

}
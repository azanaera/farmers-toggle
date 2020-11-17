package gw.cucumber.context.api.common

uses cucumber.api.DataTable

interface RulesContext {

  /**
   * Creates a reserve rule and (optionally) promotes it to a stated stage
   *
   * @param name
   * @param status (can be null)
   * @param table (*) = optional
   *    - Enabled               - String (YesNo)            - Is the exposure rule enabled?
   *    - Policy Type           - String (PolicyType)       - The policy type the exposure rule applies to
   *    - Incident Type         - String (IncidentType)     - The incident type the exposure rule applies to
   *    - Action Type (*)       - String                    - The action to be performed on rule execution?
   *    - Coverage Type (*)     - String (CoverageType)     - The coverage type of the exposure
   *    - Coverage Subtype (*)  - String (CoverageSubtype)  - The coverage subtype of the exposure
   * e.g
   * | Enabled | Policy Type   | Incident Type   | Action Type     | Coverage Type | Coverage Subtype |
   * | Yes     | Personal Auto | VehicleIncident | Create Exposure | Collision     | Collision        |
   */
  function createReserveRule(name : String, status : String, table : DataTable)

  /**
   * Creates an exposure rule
   * @param name
   * @param status
   * @param table (*) = optional
   *    - Enabled               - String (YesNo)            - Is the exposure rule enabled?
   *    - Policy Type           - String (PolicyType)       - The policy type the exposure rule applies to
   *    - Incident Type         - String (IncidentType)     - The incident type the exposure rule applies to
   *    - Action Type (*)       - String                    - The action to be performed on rule execution?
   *    - Coverage Type (*)     - String (CoverageType)     - The coverage type of the exposure
   *    - Coverage Subtype (*)  - String (CoverageSubtype)  - The coverage subtype of the exposure
   * e.g
   * | Enabled | Policy Type   | Incident Type   | Action Type     | Coverage Type | Coverage Subtype |
   * | Yes     | Personal Auto | VehicleIncident | Create Exposure | Collision     | Collision        |
   */
  function createExposureRule(name : String, status : String, table : DataTable)

  /**
   * Stages the stated rule
   * @param name
   */
  function stageReserveRuleWithName(name : String)

  /**
   * Sets the named exposure rule to 'Staged'
   * @param name
   */
  function stageExposureRuleWithName(name : String)

  /**
   * Verifies that a rule exists and it has the given status
   *
   * @param name
   * @param status
   */
  function verifyReserveRuleWithNameHasStatus(name : String, status : String)

  /**
   * Verifies that an exposure exists and has the given status
   * @param name
   * @param status
   */
  function verifyExposureRuleWithNameHasStatus(name : String, status : String)

}
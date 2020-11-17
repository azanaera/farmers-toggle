package gw.cucumber.context.api.common

uses cucumber.api.DataTable
uses gw.api.databuilder.ClaimBuilder
uses gw.api.databuilder.ExposureBuilder
uses gw.api.locale.DisplayKey

@SuppressWarnings("Method2Property")

/**
 * Methods related to new claim creation
 */
interface ClaimContext {

  final static var DK_LIABILITY           : String = DisplayKey.get("NVV.Claim.Subro.AdverseParty.PartyDetails.Liability")
  final static var DK_RESPONSIBLE_PARTY   : String = DisplayKey.get("LV.Claim.Subro.AdversePartyList.Contact")

  /**
   * Create a {@link gw.cucumber.setup.PolicyDataSet} object to hold policy type and sample policy number
   */
  function createPolicyDataSet()

  /**
   * Create an unverified policy and wrap it in the {@link gw.cucumber.setup.PolicyDataSet}
   */
  function createUnverifiedPolicy()

  /**
   * Create a claim
   */
  function createClaim()

  /**
   * Start filing a claim in FNOL wizard and choose the policy from {@link gw.cucumber.setup.PolicyDataSet}
   */
  function startFilingClaim()

  /**
   * Navigate to the last step and finish filing a claim in FNOL wizard
   */
  function finishFilingClaim()

  /**
   * Sets the loss date for the claim
   * @param lossDateText
   */
  function setLossDate(lossDateText : String)

  /**
   * Create injury incident on claim
   * @param table - (*) = optional
   *    - Injured Person (*)      - String                          - Name of a contact on the claim
   *    - Loss Party              - String (LossPartyType)          - The type of loss party (insured/third-party)
   *    - Severity                - String (SeverityType)           - The severity of the injury
   *    - General Injury Type     - String (InjuryType)             - The general type of injury
   *    - Detailed Injury Type    - String (DetailedInjuryType)     - Detailed description of the injury
   * e.g
   * | Injured Person | Loss Party     | Severity | General Injury Type | Detailed Injury Type |
   * | Brooke Wynn    | Insured's loss | Moderate | Specific injury     | Concussion           |
   */
  function claimHasInjuryIncident(table : DataTable)

  /**
   * Set claim reported by Insured
   */
  function reportedByInsured()

  /**
   * Set claim reported by Third Party
   */
  function reportedByThirdParty()

  /**
   * Associates a set of claims with the specified title through entities
   * @param associationTitle - The title of the Association
   */
  function associatedClaims(associationTitle : String)

  /**
   * Associates a set of claims with the specified title through PCF
   * @param associationTitle - The title of the Association
   */
  function associateClaims(associationTitle : String)

  /**
   * Set claim loss cause to the given value in FNOL wizard
   *
   * @param lossCause
   */
  function setLossCause(lossCauseText : String)

  /**
   * Set claim loss location to an address in the given state in FNOL wizard
   *
   * @param state
   */
  function setLossLocationInState(stateText : String)

  /**
   * Request a claim level service of the given specialist service and service request kind in FNOL wizard
   *
   * @param service
   * @param serviceRequestKind
   */
  function addClaimLevelServices(serviceName : String, serviceRequestKindText : String)

  /**
   * Create a bodily injury incident of the given loss party type in FNOL wizard
   *
   * @param lossPartyType Insured's loss or third party
   */
  function createInjuryIncident(lossPartyTypeText : String)

  /**
   * Create a Matter on the claim
   */
  function createOpenMatter()

  /**
   * Create a bodily injury exposure of the given coverage subtype in FNOL wizard
   *
   * @param coverageSubtype
   */
  function addInjuryExposure(coverageSubtype : CoverageSubtype = null)

  /**
   * Adds a collision exposure to the claim in FNOL wizard
   *
   * @param coverageSubtype
   */
  function addCollisionExposure(coverageSubtype : CoverageSubtype = null)

  /**
   * Add a note to claim in FNOL wizard
   */
  function addNote()

  /**
   * Verify claim is filed with the given policy type
   *
   * @param policyType
   */
  function verifyClaimIsCreated(policyTypeText : String)

  /**
   * Verify the claims created it distributed to users within the subgroup
   * via round-robin
   *
   * @param groupName
   */
  function verifyClaimsIsAssignedToUsersViaRoundRobin(groupName : String)

  /**
   * Verfiy claim is filed with the given loss cause
   *
   * @param lossCause
   */
  function verifyClaimLossCause(lossCauseText : String)

  /**
   * Verfiy claim has a loss location in the given state
   * @param lossState State where the loss occurred
   */
  function verifyClaimLossLocationInState(lossState : String)

  /**
   * Verify the policy on claim is unverified
   */
  function verifyPolicyIsUnverified()

  /**
   * Verify bodily injury incident exists on claim
   */
  function verifyInjuryIncidentExists()

  /**
   * Verify injury incident matches data in table
   * @param table
   *    - Injured Person        - String                           - The name of the injured person (should be a contact on the policy)
   *    - Loss Party            - String (LossPartyType)           - The loss party (insured's loss/third party loss)
   *    - Severity              - String (SeverityType)            - The severity of the injury
   *    - General Injury Type   - String (InjuryType)              - The injury type (specific/multiple)
   *    - Detailed Injury Type  - String (DetailedInjuryType)      - The specific injury type (break/fracture/sprain/etc)
   * e.g
   * | Injured Person | Loss Party     | Severity | General Injury Type | Detailed Injury Type |
   * | Jim Caron      | Insured's loss | Minor    | Specific Injury     | Burn                 |
   */
  function verifyInjuryIncidentMatchesTable(table : DataTable)

  /**
   * Verify the loss location has an address in the state given
   * @param state
   */
  function verifyLossLocationInState(state : String)

  /**
   * Verify loss party type on the bodily injury incident is set to the given value
   *
   * @param lossPartyType Insured's loss or third party
   */
  function verifyInjuryIncidentLossPartyType(lossPartyTypeText : String)

  /**
   * Assign claim and its exposures using automated assignment rules in FNOL wizard
   */
  function autoAssignClaimAndExposures()

  /**
   * Assign claim individually using automated assignment rules in FNOL wizard
   */
  function autoAssignClaimIndividually()

  /**
   * Assign exposure individually using automated assignment rules in FNOL wizard
   *
   * @param coverageTypeText Exposure's coverage type
   */
  function autoAssignExposureIndividually(coverageTypeText : String)

  /**
   * Assign claim and its exposures to the given group and user in FNOL wizard
   *
   * @param groupName
   * @param userDisplayName
   */
  function assignClaimAndExposuresToGroupAndUser(groupName : String, userDisplayName : String)

  /**
   * Assign claim individually to the given group and user in FNOL wizard
   *
   * @param groupName
   * @param userDisplayName
   */
  function assignClaimIndividuallyToGroupAndUser(groupName : String, userDisplayName : String)

  /**
   * Assign exposure individually to the given group and user in FNOL wizard
   *
   * @param coverageTypeText Exposure's coverage type
   * @param groupName
   * @param userDisplayName
   */
  function assignExposureIndividuallyToGroupAndUser(coverageTypeText : String, groupName : String, userDisplayName : String)

  /**
   * Add a person contact with the given role to claim in FNOL wizard
   *
   * @param claimContactRoleName
   */
  function addPersonContactWithRole(contactRoleName : String)

  /**
   * Set claim segment to the given value
   *
   * @param claimSegment
   */
  function setClaimSegment(claimSegmentText : String)

  /**
   * Set claim loss location to an address in the given state
   *
   * @param state
   */
  function setClaimLossLocationState(stateText : String)

  /**
   * Close all matters on claim
   */
  function closeAllMatters()

  /**
   * Close subrogation on claim
   */
  function closeSubrogation()

  /**
   * Set fault rating to "No fault"
   */
  function determineFaultRating()

  /**
   * Close claim and set the ourcome to "Completed"
   */
  function setClaimStatusToClosed()

  /**
   * Adds a property damage liability to the claim in FNOL Wizard
   * @param table
   *    - Property Description   - String          - A description of the property
   *    - Damage Description     - String          - A description of the damage to the property
   *    - Loss Estimate          - Number          - Estimated value of the loss (in default currency)
   *    - Address 1              - String          - Street number and name where the property is located
   *    - City                   - String          - City where the property is located
   *    - State                  - String (State)  - State where the property is located
   * e.g
   * | Property Description | Damage Description | Loss Estimate | Address 1     | City          | State      |
   * | 2 bed apartment      | Flooded bathroom   | 500           | 1 Main Street | San Francisco | California |
   */
  function addAPropertyDamageLiability(table : DataTable)

  /**
   * Close claim in UI
   */
  function closeClaim()

  /**
   * Reopen claim in UI
   */
  function reopenClaim()

  /**
   * Update the type of assocation matching $name and $type
   * @param name The name/title of the association
   * @param type The type of association from the ClaimAssocType typelist
   */
  function updateAssociationType(name : String, type : String)

  /**
   * Delete all associations on the claim
   * @param name The name of the association to be deleted
   */
  function deleteAssociationOnClaim(name : String)

  /**
   * Add a witness to the Claim
   * @param table
   *    - Name                    - String                        - Name of witness
   *    - Statement Obtained      - String (YesNo)                - Was a statement obtained from the witness?
   *    - Where was the witness?  - String (WitnessPosition)      - Location of the witness
   *    - Perspective             - String                        - From what direction/angle was the incident witnessed
   *    e.g
   *    | Name        | Statement Obtained | Where was the witness? | Perspective |
   *    | Ray Newton  | Yes                | Pedestrian             | Side        |
   */
  function addAWitness(table : DataTable)

  /**
   * Add an official report to the Claim
   * @param officialType - the type of official making the report
   * @param table
   *    - Name      - String  - Name of official
   *    - Report #  - Number  - The report number/ID
   *    e.g
   *    | Name              | Report # |
   *    | George Washington | 1337     |
   */
  function addAnOfficial(officialType : String, table : DataTable)

  /**
   * Add a police report to claim
   * @param table
   *    - Metro Report Type              - String (MetroReportType)      - The type of police report
   *    - City of Investigating Agency   - String                        - The city the police are based
   *    - State of Investigating Agency  - String                        - The state the police are based
   *    - Insured Vehicle                - String (Year Make Model)      - The year, make and model of the insured vehicle
   *    e.g
   *    | Metro Report Type | City of Investigating Agency | State of Investigating Agency | Insured Vehicle     |
   *    | Auto Accident     | San Francisco                | California                    | 1996 Toyota Corolla |
   */
  function addAPoliceReport(table : DataTable)

  /**
   * Add a fault rating of type faultRating
   * @param faultRating - type of fault rating being added
   */
  function setFaultRating(faultRating : String)

  /**
   * Verify the loss date
   * @param date - Either "Today" or a date with format equal to DateTransformer.DEFAULT_DATE_FORMAT
   */
  function verifyLossDate(date : String)

  /**
   * Verify claim state is set to the given value
   *
   * @param claimState
   */
  function verifyClaimStatus(claimStateText : String)

  /**
   * Verify claim has an exposure of the specified type
   * @param exposureType
   */
  function verifyClaimHasExposureOfType(exposureTypeText : String)

  /**
   * Verify the segmentation of the claim
   * @param claimSegment
   */
  function verifyClaimSegment(claimSegmentText : String)

  /**
   * Verify association of the specified title exists for the current claim
   * @param associationTitle - The title of the Association
   */
  function verifyAssociationWithNameExists(associationTitle : String)

  /**
   * Verify association of the specified title and type exists for the current claim
   * @param associationTitle - The title of the Association
   * @param type - The type of association from ClaimAssocType typelist
   */
  function verifyAssociationWithNameAndTypeExists(associationTitle : String, type : String)

  /**
   * Verify association of the specified title does not exist for the current claim
   * @param associationTitle - The title of the Association
   */
  function verifyAssociationDoesNotExist(associationTitle : String)

  /**
   * Similar to closeClaim but captures a possible exception
   */
  function tryToCloseTheClaim()

  /**
   * Checks if any error has been thrown
   */
  function iCouldNotCloseClaim()

  /**
   * Creates a ClaimBuilder
   * @return a ClaimBuilder for a given policyType
   */
  function createClaimBuilder() : ClaimBuilder

  /**
   * Executes the segmentation rules on both the claim an its exposures
   * @param claim
   */
  function executeSegmentationRulesOnClaim(claim : Claim)


  /**
   * Verify claim has a witness report attached
   * @param table
   *    - Name                    - String                        - Name of witness
   *    - Statement Obtained      - String (YesNo)                - Was a statement obtained from the witness?
   *    - Where was the witness?  - String (WitnessPosition)      - Location of the witness
   *    - Perspective             - String                        - From what direction/angle was the incident witnessed
   *    e.g
   *    | Name        | Statement Obtained | Where was the witness? | Perspective |
   *    | Ray Newton  | Yes                | Pedestrian             | Side        |
   */
  function verifyClaimHasAWitnessReport(table : DataTable)

  /**
   * Verify claim has a police report attached
   * @param table
   *    - Metro Report Type              - String (MetroReportType)      - The type of police report
   *    - City of Investigating Agency   - String                        - The city the police are based
   *    - State of Investigating Agency  - String                        - The state the police are based
   *    - Insured Vehicle                - String (Year Make Model)      - The year, make and model of the insured vehicle
   *    e.g
   *    | Metro Report Type | City of Investigating Agency | State of Investigating Agency | Insured Vehicle     |
   *    | Auto Accident     | San Francisco                | California                    | 1996 Toyota Corolla |
   */
  function verifyClaimHasAPoliceReport(table : DataTable)

  /**
   * Verify claim has an official report attached of type officialType
   * @param officialType - the type of official who made the report
   * @param table
   *    - Name      - String  - Name of official
   *    - Report #  - Number  - The report number/ID
   *    e.g
   *    | Name              | Report # |
   *    | George Washington | 1337     |
   */
  function verifyClaimHasAOfficialReportWithType(officialType : String, table : DataTable)

  /**
   * Verify claim has a faultRating attached
   * @param report Type
   */
  function verifyClaimHasFaultRating(reportType : String)

  /**
   * Creates a claim with an exposure
   * @param table (*) = optional
   *    - Incident Severity*  - String (SeverityType)       - The severity of the incident
   *    - Exposure Type*      - String (ExposureType)       - The type of exposure
   *    - Loss Party*         - String (LossPartyType)      - The type of loss party (first or third party)
   *    - Total Loss?*        - String (true/false)         - Was this a total loss? (nothing salvageable)
   *    e.g
   *    | Exposure Type    | Incident Severity    | Loss Party     | Total Loss? |
   *    | Vehicle          | Moderate (drivable)  | Insured's loss | false       |
   */
  function iCreateAClaimWithAnExposure(table : DataTable)

  /**
   * Creates a claim and finishes it throught the UI to launch the segmentation rules
   */
  function createClaimWithNoExposure()

  /**
   * Adds the exposure builder in the map to the claimBuilder
   * @param claimBuilder An initialized claimBuilder
   * @param exposureMap A map describing an exposure  (*) = optional
   *    - Incident Severity*  - String (SeverityType)       - The severity of the incident
   *    - Exposure Type*      - String (ExposureType)       - The type of exposure
   *    - Loss Party*         - String (LossPartyType)      - The type of loss party (first or third party)
   *    - Total Loss?*        - String (true/false)         - Was this a total loss? (nothing salvageable)
   *    e.g
   *    | Exposure Type    | Incident Severity    | Loss Party     | Total Loss? |
   *    | Vehicle          | Moderate (drivable)  | Insured's loss | false       |
   */
  function addExposureToClaimBuilder(claimBuilder : ClaimBuilder, exposureMap : Map<String,String>)

  /**
   * Creates an exposure builder with the given parameters
   * @param exposureMap A map describing an exposure  (*) = optional
   *    - Incident Severity*  - String (SeverityType)       - The severity of the incident
   *    - Exposure Type*      - String (ExposureType)       - The type of exposure
   *    - Loss Party*         - String (LossPartyType)      - The type of loss party (first or third party)
   *    - Total Loss?*        - String (true/false)         - Was this a total loss? (nothing salvageable)
   *    e.g
   *    | Exposure Type    | Incident Severity    | Loss Party     | Total Loss? |
   *    | Vehicle          | Moderate (drivable)  | Insured's loss | false       |
   * @param exposureType The type of the exposure
   * @param lossPartyType The loss party type
   * @param severityStr The severity (SeverityType)
   * @return A exposureBuilder
   */
  function getExposureBuilder(exposureMap : Map<String, String>, exposureType : ExposureType, lossPartyType : LossPartyType, severityStr : String) : ExposureBuilder

  /**
   * Creates a claim with a mid complexity exposure on it
   */
  function createAClaimWithMidComplexityExposure()

  /**
   * verify a bodily injury incident exist on claim
   */
  function verifyInjuryIncidentCreated()

  /**
   * Sets the claim loss cause without using the UI
   * @param lossCauseStr The loss cause (LossCause)
   */
  function setClaimLossCause(lossCauseStr : String)

  /**
   * Set scheduled items on the claim
   * @param table A one column table of scheduled items
   * |Grandfather Clock|
   */
  function setScheduledItems(table : DataTable)

  /**
   * Adds the responsible party of the claim and sets liability
   * @param table A table containing the liabilities of responsible parties
   *    - Responsible Party    - String                     - The name of the responsible party
   *    - Liability %          - Number                     - The liability percentage
   *  | Responsible Party | Liability % |
   *  | Responsible 1     | 60          |
   *  | Responsible 2     | 40          |
   */
  function addResponsiblePartiesLiability(table : DataTable)

  /**
   * Sets the policy type on the search policy screen
   * @param policyType - A string representing the readable value of the policy type
   */
  function setPolicyType(policyType : String)

  /**
   * Searchs for a policy using a known policy number
   */
  function searchForAPolicyByPolicyNumber()

  /**
   * Verifies there is one or more policies found that can be used to lodge a claim against
   */
  function verifyPoliciesMatchAGivenPolicyNumber()

  /**
   * Searchs for policies in the policy search using provided data
   */
  function searchForPoliciesByCriteria()

  /**
   * Verifies the result policies match the given criteria
   */
  function policiesFoundMatchTheCriteria()

  /**
   * Sets an internal state of the searchData to be used
   * @param table
   */
  function setSearchCriteria(table : DataTable)
}
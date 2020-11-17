package gw.cucumber.context.api.pa

uses cucumber.api.DataTable
uses gw.api.locale.DisplayKey
uses gw.cucumber.context.api.common.ExposureContext

/**
 * Methods related to hop homeowners exposure
 */
interface PAExposureContext extends ExposureContext {

  final static var DK_INJUREDPERSON           : String = DisplayKey.get("Web.InjuryIncidentDV.Injured.Picker")
  final static var DK_LOSSPARTY               : String = DisplayKey.get("Web.InjuryIncidentInputSet.LossParty.Label")
  final static var DK_SEVERITY                : String = DisplayKey.get("Web.InjuryIncidentInputSet.Severity.Label")
  final static var DK_GENERALINJURY           : String = DisplayKey.get("Web.InjuryIncidentInputSet.GeneralInjuryType.Label")
  final static var DK_DETAILEDINJURY          : String = DisplayKey.get("Web.InjuryIncidentInputSet.DetailedInjuryType.Label")
  final static var DK_PROPERTYDESC            : String = DisplayKey.get("Web.FixedPropertyIncident.PropertyDescription")
  final static var DK_DAMAGEDESC              : String = DisplayKey.get("Web.FixedPropertyIncident.Description")
  final static var DK_LOSSESTIMATE            : String = DisplayKey.get("Web.FixedPropertyIncident.LossEstimate")
  final static var DK_ADDRESS1                : String = DisplayKey.get("Web.FixedPropertyIncident.Property.Address.AddressLine1")
  final static var DK_CITY                    : String = DisplayKey.get("Web.FixedPropertyIncident.Property.Address.City")
  final static var DK_STATE                   : String = DisplayKey.get("Web.FixedPropertyIncident.Property.Address.State")
  final static var DK_FIRSTNOTICESUIT         : String = DisplayKey.get("Web.FNOLWizard.LossDetails.GeneralLiability.Notification.FirstNoticeSuit")
  final static var DK_STATEMENTOBTAINED       : String = DisplayKey.get("LV.Claim.EditableWitnesses.WitnessStatementInd")
  final static var DK_WITNESSPOSITION         : String = DisplayKey.get("LV.Claim.EditableWitnesses.WitnessPosition")
  final static var DK_WITNESSPERSPECTIVE      : String = DisplayKey.get("LV.Claim.EditableWitnesses.WitnessPerspective")
  final static var DK_PRIMARYCONTRIBFACTORS   : String = DisplayKey.get("LV.Claim.EditableContributingFactors.contribprimary")
  final static var DK_SECONDARYCONTRIBFACTORS : String = DisplayKey.get("LV.Claim.EditableContributingFactors.contribsecond")
  final static var DK_RESULTCONTRIBFACTORS    : String = DisplayKey.get("LV.Claim.EditableContributingFactors.contribresult")
  final static var DK_WEATHER                 : String = DisplayKey.get("NVV.Claim.SubView.LossDetailsAuto.Claim.Weather")
  final static var DK_FAULTRATING             : String = DisplayKey.get("NVV.Claim.SubView.LossDetailsAuto.Claim.Notification.Fault")
  final static var DK_HOWREPORTED             : String = DisplayKey.get("Web.FNOLWizard.LossDetails.GeneralLiability.Notification.HowReported")
  final static var DK_INSUREDVEHICLE          : String = DisplayKey.get("Web.MetroReportDV.Vehicle.Insured")
  final static var DK_METROREPORTTYPE         : String = DisplayKey.get("Web.MetroReportDV.Summary.Type")
  final static var DK_INVESTIGATINGCITY       : String = DisplayKey.get("Web.MetroReportDV.Investigate.AgencyCity")
  final static var DK_INVESTIGATINGSTATE      : String = DisplayKey.get("Web.MetroReportDV.Investigate.AgencyState")
  final static var DK_NEW                     : String = DisplayKey.get("Web.Financials.ReserveLineInputSet.ReserveLine.New")
  final static var DK_VEHICLEYEAR             : String = DisplayKey.get("Web.VehicleIncidentDV.Vehicle.Year")
  final static var DK_VEHICLEMAKE             : String = DisplayKey.get("Web.EditableVehicleIncidentsLV.Make")
  final static var DK_VEHICLEMODEL            : String = DisplayKey.get("Web.EditableVehicleIncidentsLV.Model")
  final static var DK_DRIVER                  : String = DisplayKey.get("Web.EditableVehicleIncidentsLV.Driver")
  final static var DK_DRIVERNAME              : String = DisplayKey.get("Web.VehicleIncidentDV.Driver.Picker")
  final static var DK_LOSSOCCURRED            : String = DisplayKey.get("Web.VehicleIncidentDV.LossOccured")
  final static var DK_PROPERTYNAME            : String = DisplayKey.get("Web.FixedPropertyIncident.Property.Picker")
  final static var DK_CLAIMANT                : String = DisplayKey.get("NVV.Exposure.SubView.NewGeneralDamage.Exposure.Claimant")
  final static var DK_CLAIMANTTYPE            : String = DisplayKey.get("NVV.Exposure.SubView.NewQuickClaimClaimGL.Exposure.Claimant.Type")
  final static var DK_COVERAGE                : String = DisplayKey.get("NVV.Exposure.SubView.NewGeneralDamage.Exposure.Coverage")
  final static var DK_TITLECOVERAGE           : String = DisplayKey.get("NVV.Exposure.NewPIPSummary.Title.Coverage")
  final static var DK_VEHICLE                 : String = DisplayKey.get("Web.Incident.PrefixName.VehicleIncident")
  final static var DK_LICENSEPLATE            : String = DisplayKey.get("Web.VehicleIncidentDV.Vehicle.LicensePlate")
  final static var DK_REPORTEDBY              : String = DisplayKey.get("NVV.Claim.SubView.NewQuickClaimTravel.Claim.ReportedBy")
  final static var DK_MAINCONTACT             : String = DisplayKey.get("Web.ClaimSnapshotExposure.Contact.MainContact")
  final static var NONE                       : String = "None"
  final static var FIRST                      : String = "First"
  final static var LAST                       : String = "Last"
  final static var CONTACT_RTI                : String = "Contact Relationship to Insured"
  final static var REPORTER_RTI               : String = "Reporter Relationship to Insured"

  /**
   * Select the first covered vehicle as the involved vehicle in FNOL wizard
   */
  function selectFirstInvolvedVehicle()

  /**
   * Create a collision exposure with the given state
   *
   * @param exposureState
   */
  function createCollisionExposureWithState(exposureStateText : String)

  /**
   * Add covered vehicles with the following values to the current policy
   *
   * @param table
   *    - Year    - Number    - The year the vehicle was registered
   *    - Make    - String    - The make of the vehicle
   *    - Model   - String    - The model of the vehicle
   * e.g
   * | Year | Make  | Model  |
   * | 2001 | Volvo | Estate |
   */
  function createCoveredVehicles(table : DataTable)

  /**
   * Creates a covered vehicle in the policy
   */
  function createCoveredVehicle()

  /**
   * Add covered parties with the following values to the current policy
   *
   * @param table
   *    - First   - String    - The contact's first name
   *    - Last    - String    - The contact's last name
   * e.g
   * | First  | Last    |
   * | Brooke | Wynn    |
   */
  function createCoveredParties(table : DataTable)

  /**
   * Create a collision exposure and its incident with the given vehicle
   *
   * @param vehicleText
   */
  function createCollisionExposureWithVehicle(vehicleText : String)

  /**
   * Creates a property on the claim
   * @param table
   *    - Property Description  - String              - A description of the property
   *    - Damage Description    - String              - A description of the damage to the property
   *    - Loss Estimate         - Number              - The estimated value lost (in default currency)
   *    - Address 1             - String              - The street name and number where the property is located
   *    - City                  - String              - The city where the property is located
   *    - State                 - String (State)      - The state where the property is located
   * e.g
   * | Property Description | Damage Description  | Loss Estimate | Address 1     | City          | State      |
   * | 2 bed apartment      | Flooding in kitchen | 800           | 1 Main Street | San Francisco | California |
   */
  function createPropertyOnClaim(table : DataTable)

  /**
   * Adds a property damage exposure to the claim
   * @param table
   *    - Coverage        - String                      - The covered entity
   *    - Claimant        - String                      - The name of a contact on the claim
   *    - Claimant Type   - String (ClaimantType)       - The type of claimant
   *    - Property Name   - String                      - Address of the property
   * e.g
   * | Coverage       | Claimant    | Claimant Type | Property Name                    |
   * | 2001 Acura RSX | Brooke Wynn | Insured       | 1 Main Street, San Francisco, CA |
   */
  function addPropertyDamageExposure(table : DataTable)

  /**
   * Adds a towing and labor exposure to the claim
   * @param table
   *    - Coverage        - String                      - The covered entity
   *    - Claimant        - String                      - The name of a contact on the claim
   *    - Claimant Type   - String (ClaimantType)       - The type of claimant
   * e.g
   * | Coverage       | Claimant    | Claimant Type |
   * | 2001 Acura RSX | Brooke Wynn | Insured       |
   */
  function addTowingAndLaborExposure(table : DataTable)

  /**
   * Add a collision exposure to claim using the Actions menu and then "Choose by Coverage"
   */
  function addCollisionExposureByCoverage()

  /**
   * Create a comprehensive exposure
   */
  function addFirstPartyComprehensiveExposure()

  /**
   * Select a claimant other than the original value for exposure
   */
  function changeClaimantForExposure()

  /**
   * Select the Insured as claimant for exposure
   */
  function chooseInsuredClaimantForExposure()

  /**
   * Select a third party as claimant for exposure
   */
  function chooseThirdPartyClaimantForExposure()

  /**
   * Set the involved vehicle to the given value for exposure
   *
   * @param vehicleName
   */
  function changeInvolvedVehicleTo(vehicleName : String)

  /**
   * Set the driver to the given value for vehicle incident
   *
   * @param driverName
   */
  function changeDriverForInvolvedVehicleTo(driverName : String)

  /**
   * Add a driver to the involved vehicle
   */
  function addDriverToInvolvedVehicle()

  /**
   * Add a passenger to the involved vehicle
   */
  function addPassengerToInvolvedVehicle()

  /**
   * Add a damage description to the involved vehicle
   */
  function addDamageDescriptionToInvolvedVehicle()

  /**
   * Add a property damage description
   */
  function addPropertyDamage()

  /**
   * Update the loss details on a pre-existing claim using fields from the Loss Details panel of the Loss Details page
   * @param table
   *    - Weather       - String (WeatherType)      - The weather at the time of the loss
   *    - Fault Rating  - String (FaultRating)      - The determined fault rating
   * e.g
   * | Weather | Fault rating         |
   * | Rain    | Other party at fault |
   */
  function updateLossDetails(table : DataTable)

  /**
   * Update the notification/contact details on the claim
   * @param table
   *    - First Notice Suit                  - String (YesNo)                   - Yes if at least one lawsuit has been filed at the time of FNOL
   *    - How Reported                       - String (HowReportedType)         - How was the loss reported
   *    - Reported By                        - String                           - Who reported the loss (should be a contact on the claim/policy)
   *    - Reporter Relationship to Insured   - String (PersonRelationType)      - The relationship between reported and insured
   *    - Main Contact                       - String                           - The main contact for the claim (should be a contact on the claim/policy)
   *    - Contact Relationship to Insured    - String (PersonRelationType)      - The relationship between the main contact and the insured
   * e.g
   * | First Notice Suit | How Reported | Reported By | Reporter Relationship to Insured | Main Contact | Contact Relationship to Insured |
   * | Yes               | Phone        | Brooke Wynn | Friend                           | Bo Simpson   | Self/Insured                    |
   */
  function updateNotificationDetails(table : DataTable)

  /**
   * Adds a witness to a pre-existing claim
   * @param table
   *    - Statement Obtained      - String (YesNo)                - Was a statement obtained
   *    - Where was the witness?  - String (WitnessPosition)      - Location of the witness at the time the loss occurred
   *    - Perspective             - String                        - More specific position of the witness at the time the loss occurred
   * e.g
   * | Statement Obtained | Position       | Perspective |
   * | Yes                | Inside vehicle | Yes         |
   */
  function addWitnessToClaim(table : DataTable)

  /**
   * Adds contributing factors to a pre-existing claim
   * @param table
   *    - Category      - String (PriContributingFactors)      - General contributing factor classification
   *    - Sub Category  - String (SecContributingFactors)      - Specific factor based on general classification
   *    - Value         - String (ResContributingFactors)      - Exact factor or numerical classification that contributed to the loss occurring
   * e.g
   * | Category                 | Sub Category   | Value         |
   * | Driver factors           | MPH over limit | 61 or greater |
   * | Environmental conditions | Visibility     | Fog           |
   */
  function addContributingFactors(table : DataTable)

  /**
   * Adds a new vehicle incident to a pre-existing claim
   * @param table
   *    - Year            - Number                    - The year the vehicle was made
   *    - Make            - String                    - The make of the vehicle
   *    - Model           - String                    - The model of the vehicle
   *    - Driver          - String                    - The name of the driver (should be a contact on the policy)
   *    - Loss Occurred?  - String (LossOccured)      - Where did the loss occur?
   * e.g
   * | Year | Make | Model   | Driver  | Loss Occurred? |
   * | 2010 | Ford | Mustang | Insured | At premises    |
   */
  function addNewVehicleToClaim(table : DataTable)

  /**
   * Adds a new injury incident to a pre-existing claim
   * @param table
   *    - Injured Person         - String                           - The name of the injured person (should be a contact on the policy)
   *    - Loss Party             - String (LossPartyType)           - The loss party type (insured/third-party)
   *    - Severity               - String (SeverityType)            - The severity of the injury
   *    - General Injury Type    - String (InjuryType)              - The type of injury
   *    - Detailed Injury Type   - String (DetailedInjuryType)      - More detail on the injury/injuries
   * e.g
   * | Injured Person | Loss Party     | Severity | General Injury Type | Detailed Injury Type |
   * | Insured        | Insured's loss | Moderate | Specific injury     | Concussion           |
   */
  function addNewInjuryIncident(table : DataTable)

  /**
   * Adds a new bodily injury exposure to the claim
   * @param table
   *    - Coverage       - String                     - The name of the covered entity
   *    - Claimant       - String                     - The name of the claimant (should be a contact on the policy)
   *    - Claimant Type  - String (ClaimantType)      - The type of claimant (insured/third party)
   * e.g
   * | Coverage       | Claimant    | Claimant Type |
   * | 2001 Acura RSX | Brooke Wynn | Insured       |
   */
  function addNewBodilyInjuryExposure(table : DataTable)

  /**
   * Adds a new bodily injury exposure to the claim
   * @param table
   *    - Coverage       - String                     - The name of the covered entity
   *    - Claimant       - String                     - The name of the claimant (should be a contact on the policy)
   *    - Claimant Type  - String (ClaimantType)      - The type of claimant (insured/third party)
   * e.g
   * | Coverage       | Claimant    | Claimant Type |
   * | 2001 Acura RSX | Brooke Wynn | Insured       |
   */
  function addNewMedPayExposure(table : DataTable)

  /**
   * Adds a PIP exposure to the claim
   * @param table
   *    - Title Coverage  - String                     - The name of the covered entity
   *    - Claimant        - String                     - The name of the claimant (should be a contact on the policy)
   *    - Claimant Type   - String (ClaimantType)      - The type of claimant (insured/third party)
   * e.g
   * | Title Coverage | Claimant    | Claimant Type |
   * | None           | Brooke Wynn | Insured       |
   */
  function addPipExposure(table : DataTable)

  /**
   * Adds a new fixed property incident to a pre-existing claim
   * @param table
   *    - Property Description   - String               - A description of the property
   *    - Damage Description     - String               - A description of the damage to the property
   *    - Loss Estimate          - Number               - The amount estimated to be lost (in default currency)
   *    - Address 1              - String               - The street number and name of the property
   *    - City                   - String               - The city where the property is located
   *    - State                  - String (State)       - The state where the property is located
   * e.g
   * | Property Description | Damage Description  | Loss Estimate | Address 1     | City          | State      |
   * | 2 bed apartment      | Flooding in kitchen | 800           | 1 Main Street | San Francisco | California |
   */
  function addNewProperty(table : DataTable)

  /**
   * Verify the bodily injury exposure exists on the claim
   * @param table
   *    - Coverage       - String                     - The name of the covered entity
   *    - Claimant       - String                     - The name of the claimant (should be a contact on the policy)
   *    - Claimant Type  - String (ClaimantType)      - The type of claimant (insured/third party)
   * e.g
   * | Coverage       | Claimant    | Claimant Type |
   * | 2001 Acura RSX | Brooke Wynn | Insured       |
   */
  function verifyBodilyInjuryExposureOnClaim(table : DataTable)

  /**
   * Verify the medical payments exposure exists on the claim
   * @param table
   *    - Coverage        - String                     - The name of the covered entity
   *    - Claimant        - String                     - The name of the claimant (should be a contact on the policy)
   *    - Claimant Type   - String (ClaimantType)      - The type of claimant (insured/third party)
   * e.g
   * | Coverage       | Claimant    | Claimant Type |
   * | 2001 Acura RSX | Brooke Wynn | Insured       |
   */
  function verifyMedPayExposureOnClaim(table : DataTable)

  /**
   * Verify the PIP exposure exists on the claim
   * @param table
   *    - Title Coverage  - String                     - The name of the covered entity
   *    - Claimant        - String                     - The name of the claimant (should be a contact on the policy)
   *    - Claimant Type   - String (ClaimantType)      - The type of claimant (insured/third party)
   * e.g
   * | Title Coverage | Claimant    | Claimant Type |
   * | None           | Brooke Wynn | Insured       |
   */
  function verifyPipExposure(table : DataTable)

  /**
   * Verify the property damage exposure exists on the claim
   * @param table
   *    - Coverage        - String                      - The covered entity
   *    - Claimant        - String                      - The name of a contact on the claim
   *    - Claimant Type   - String (ClaimantType)       - The type of claimant
   * e.g
   * | Coverage       | Claimant    | Claimant Type |
   * | 2001 Acura RSX | Brooke Wynn | Insured       |
   */
  function verifyPropertyDamageExposureOnClaim(table : DataTable)

  /**
   * Verify the towing and labor exposure exists on the claim
   * @param table
   *    - Coverage        - String                      - The covered entity
   *    - Claimant        - String                      - The name of a contact on the claim
   *    - Claimant Type   - String (ClaimantType)       - The type of claimant
   * e.g
   * | Coverage | Claimant    | Claimant Type |
   * | None     | Brooke Wynn | Insured       |
   */
  function verifyTowingAndLaborExposure(table : DataTable)

  /**
   * Verify a fixed property incident exists on a claim
   * @param table
   *    - Property Description   - String               - A description of the property
   *    - Damage Description     - String               - A description of the damage to the property
   *    - Loss Estimate          - Number               - The amount estimated to be lost (in default currency)
   *    - Address 1              - String               - The street number and name of the property
   *    - City                   - String               - The city where the property is located
   *    - State                  - String (State)       - The state where the property is located
   * e.g
   * | Property Description | Damage Description  | Loss Estimate | Address 1     | City          | State      |
   * | 2 bed apartment      | Flooding in kitchen | 800           | 1 Main Street | San Francisco | California |
   */
  function verifyPropertyExistsOnClaim(table : DataTable)

  /**
   * Verify an injury incident exists on a claim
   * @param table
   *    - Injured Person         - String                           - The name of the injured person (should be a contact on the policy)
   *    - Loss Party             - String (LossPartyType)           - The loss party type (insured/third-party)
   *    - Severity               - String (SeverityType)            - The severity of the injury
   *    - General Injury Type    - String (InjuryType)              - The type of injury
   *    - Detailed Injury Type   - String (DetailedInjuryType)      - More detail on the injury/injuries
   * e.g
   * | Injured Person | Loss Party     | Severity | General Injury Type | Detailed Injury Type |
   * | Brooke Wynn    | Insured's loss | Moderate | Specific injury     | Concussion           |
   */
  function verifyInjuryIncidentOnClaim(table : DataTable)

  /**
   * Verify a vehicle incident exists on a claim
   * @param table
   *    - Year            - Number                    - The year the vehicle was made
   *    - Make            - String                    - The make of the vehicle
   *    - Model           - String                    - The model of the vehicle
   *    - Driver          - String                    - The name of the driver (should be a contact on the policy)
   *    - Loss Occurred?  - String (LossOccured)      - Where did the loss occur?
   * e.g
   * | Year | Make | Model   | Driver      | Loss Occurred |
   * | 2010 | Ford | Mustang | Brooke Wynn | At premises   |
   */
  function verifyVehicleExistsOnClaim(table : DataTable)

  /**
   * Verify a metropolitan report is listed on a claim
   * @param table
   *    - Metro Report Type               - String (MetroReportType)      - The type of metropolitan report
   *    - City of Investigating Agency    - String                        - City of the metropolitan official(s)
   *    - State of Investigating Agency   - String (State)                - State of the metropolitan official(s)
   *    - Insured Vehicle                 - String                        - The insured vehicle (Year Make Model)
   * e.g
   * | Metro Report Type | City of Investigating Agency | State of Investigating Agency | Insured Vehicle |
   * | Auto Accident     | San Francisco                | California                    | 2001 Acura RSX  |
   */
  function verifyMetropolitanReport(table : DataTable)

  /**
   * Verify a contributing factor is listed on a claim
   * @param table
   *    - Category      - String (PriContributingFactors)      - General contributing factor classification
   *    - Sub Category  - String (SecContributingFactors)      - Specific factor based on general classification
   *    - Value         - String (ResContributingFactors)      - Exact factor or numerical classification that contributed to the loss occurring
   * e.g
   * | Category                 | Sub Category   | Value         |
   * | Driver factors           | MPH over limit | 61 or greater |
   * | Environmental conditions | Visibility     | Fog           |
   */
  function verifyContributingFactors(table : DataTable)

  /**
   * Verify witness is listed on a claim
   * @param table
   *    - Statement Obtained      - String (YesNo)                - Was a statement obtained
   *    - Where was the witness?  - String (WitnessPosition)      - Location of the witness at the time the loss occurred
   *    - Perspective             - String                        - More specific position of the witness at the time the loss occurred
   * e.g
   * | Statement Obtained | Where was the witness? | Perspective               |
   * | Yes                | Inside vehicle         | Sitting in passenger seat |
   */
  function verifyWitnessOnClaim(table : DataTable)

  /**
   * Verify the loss details on a claim
   * @param table
   *    - Weather       - String (WeatherType)       - The weather at the time the loss occurred
   *    - Fault Rating  - String (FaultRating)       - The determined fault rating
   * e.g
   * | Weather | Fault Rating         |
   * | Rain    | Other party at fault |
   */
  function verifyLossDetailsMatch(table : DataTable)

  /**
   * Verify notification details match on the claim
   * @param table
   *    - First Notice Suit                  - String (YesNo)                   - Yes if at least one lawsuit has been filed at the time of FNOL
   *    - How Reported                       - String (HowReportedType)         - How was the loss reported
   *    - Reported By                        - String                           - Who reported the loss (should be a contact on the claim/policy)
   *    - Reporter Relationship to Insured   - String (PersonRelationType)      - The relationship between reported and insured
   *    - Main Contact                       - String                           - The main contact for the claim (should be a contact on the claim/policy)
   *    - Contact Relationship to Insured    - String (PersonRelationType)      - The relationship between the main contact and the insured
   * e.g
   * | First Notice Suit | How Reported | Reported By | Reporter Relationship to Insured | Main Contact | Contact Relationship to Insured |
   * | Yes               | Phone        | Brooke Wynn | Friend                           | Bo Simpson   | Self/Insured                    |
   */
  function verifyNotificationDetails(table : DataTable)

  /**
   * Verify a vehicle incident created on claim
   * @param table
   *    - Vehicle              - String                     - Name of vehicle (should be vehicle on the policy)
   *    - License Plate        - String                     - License plate number
   *    - Driver Name          - String                     - The name of the driver (should be contact on the policy)
   *    - Loss Occurred?       - String (LossOccured)       - Where did the loss occur?
   *    - Damage Description   - String                     - A description of the damage to the vehicle
   * e.g
   * | Vehicle        | License Plate | Driver Name | Loss Occurred? | Damage Description              |
   * | 2001 Acura RSX | 64RJK12       | Brooke Wynn | At premises    | Side panel scratched and dented |
   */
  function verifyVehicleIncident(table : DataTable)

  /**
   * Verify a vehicle incident created on claim
   * @deprecated, use {@link #verifyClaimHasVehicleIncidentAmount(String)} instead
   */
  @Deprecated("Use verifyClaimHasVehicleIncidentAmount(String) instead")
  function verifyVehicleIncident()

  /**
   * Set the vehicle is a total loss (Through the user interface)
   */
  function iSetVehicleIncidentAsTotalLoss()

  /**
   * Set the vehicle is a total loss (Through the database update)
   */
  function theVehicleIncidentIsIndicatedAsTotalLoss()

  /**
   * Verify the vehicle's recovery date has been updated with today's date
   */
  function theVehicleRecoveryDateShouldBeUpdated()

  /**
   * The salvage tab must be available for editing
   */
  function aVehicleSalvageShouldBecomeAvailableForEditing()

  /**
   * Verify the claim has X vehicle incidents
   * @param number
   */
  function verifyClaimHasVehicleIncidentAmount(number : String)

  /**
   * Verify the exposure references the incident in _incidentWrapper
   */
  function verifyExposureReferenceVehicleIncident()

  /**
   * Verify the exposure claimant is the insured
   */
  function verifyExposureClaimantIsInsured()

  /**
   * Verify the exposure's incident references the given vehicle
   *
   * @param vehicleName
   */
  function verifyInvolvedVehicleIs(vehicleName : String)

  /**
   * Verify the exposure's incident references the given driver
   *
   * @param driverName
   */
  function verifyInvolvedVehicleDriverIs(driverName : String)

  /**
   * Verify the vehicle on the claim has a driver
   */
  function verifyVehicleHasDriver()

  /**
   * Verify the vehicle on the claim has a passenger
   */
  function verifyVehicleHasPassenger()

  /**
   * Verify the vehicle on the claim has a damage description
   */
  function verifyVehicleHasDamageDescription()

  /**
   * Verify the claim has fixed property damage
   */
  function verifyClaimHasFixedPropertyDamage()

  /**
   * Creates a Vehicle Incident on the claim
   * @param table
   *    - Vehicle              - String                     - Name of vehicle (should be vehicle on the policy)
   *    - License Plate        - String                     - License plate number
   *    - Driver Name          - String                     - The name of the driver (should be contact on the policy)
   *    - Loss Occurred?       - String (LossOccured)       - Where did the loss occur?
   *    - Damage Description   - String                     - A description of the damage to the vehicle
   * e.g
   * | Vehicle        | License Plate | Driver Name | Loss Occurred? | Damage Description              |
   * | 2001 Acura RSX | 64RJK12       | Brooke Wynn | At premises    | Side panel scratched and dented |
   */
  function createVehicleIncident(table : DataTable)

}
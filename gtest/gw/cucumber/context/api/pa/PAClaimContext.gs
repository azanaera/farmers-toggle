package gw.cucumber.context.api.pa

uses cucumber.api.DataTable
uses gw.cucumber.context.api.common.ClaimContext

/**
 * Methods related to new personal auto claim creation
 */
interface PAClaimContext extends ClaimContext {

  /**
   * Start filing a new claim in Auto First and Final wizard
   */
  function startFilingAutoFirstAndFinal()

  /**
   * submit multiple claims
   *
   * @param noOfClaims the number of claims to be submitted
   */
  function submitClaimsForAdjudication(noOfClaims : String)

  /**
   * Select the involved vehicle from the covered vehicle list in FNOL wizard
   *
   * @param indexString
   */
  function selectInvolvedVehicle(indexString : String)

  /**
   * Specifies the insured is the claimant for quick claims
   */
  function setInsuredAsClaimant()

  /**
   * Add a autobody repair shop with the given name in Auto First and Final wizard
   *
   * @param name autobody repair shop name
   */
  function addRepairShop(name : String)

  /**
   * Add third party vehicle to claim
   * @param table
   *    - Vehicle Type           - String (VehicleType)       - Owned/rental/leased/etc
   *    - Year                   - Number                     - The year the vehicle was made
   *    - Make                   - String                     - The make of the vehicle
   *    - Model                  - String                     - The model of the vehicle
   *    - Damage Description     - String                     - A description of the damage to the vehicle
   *    - Possible Total Loss?   - String (YesNo)             - Was this a total loss?
   *    - Operable?              - String (YesNo)             - Is the vehicle still operable?
   *    - Airbags Deployed?      - String (YesNo)             - Were the airbags deployed?
   *    - Equipment Failure?     - String (YesNo)             - Is there equipment failure?
   * e.g
   * | Vehicle Type | Year | Make | Model | Damage Description | Possible Total Loss? | Operable? | Airbags Deployed? | Equipment Failure? |
   * | Owned        | 2001 | Ford | Focus | Left panel dented  | No                   | Yes       | Yes               | Yes                |
   */
  function addThirdPartyVehicle(table : DataTable)

  /**
   * Create a check to the given payee with a payment of the given currency amount in Auto First and Final wizard
   *
   * @param checkAmount payment's amount and currency on the check
   * @param payeeName   check payee
   */
  function createCheckDuringAutoFirstAndFinal(checkAmount : String, payeeName : String)

  /**
   * Indicate if the Auto First and Final claim is ready to pay
   *
   * @param readyToPay if the claim is ready to pay
   */
  function selectReadyToPay(readyToPayText : String)

  /**
   * Verify a damaged vehicle exists on the claim
   * @param table
   *    - Vehicle Type           - String (VehicleType)   - Owned/rental/leased/etc
   *    - Year                   - Number                 - The year the vehicle was made
   *    - Make                   - String                 - The make of the vehicle
   *    - Model                  - String                 - The model of the vehicle
   *    - Damage Description     - String                 - A description of the damage to the vehicle
   *    - Possible Total Loss?   - String (YesNo)         - Was this a total loss?
   *    - Operable?              - String (YesNo)         - Is the vehicle still operable?
   *    - Airbags Deployed?      - String (YesNo)         - Were the airbags deployed?
   *    - Equipment Failure?     - String (YesNo)         - Is there equipment failure?
   * e.g
   * | Vehicle Type | Year | Make | Model | Damage Description | Possible Total Loss? | Operable? | Airbags Deployed? | Equipment Failure? |
   * | Owned        | 2001 | Ford | Focus | Left panel dented  | No                   | Yes       | Yes               | Yes                |
   */
  function verifyDamagedVehicleOnClaim(table : DataTable)

  /**
   * Verify property damage liability exists on claim
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
  function verifyPropertyDamageLiability(table : DataTable)

  /**
   * Verify a vehicle incident exist on claim
   */
  function verifyVehicleIncidentCreated()

  /**
   * verify a bodily injury incident exist on claim
   */
  function verifyInjuryIncidentCreated()

  /**
   * Sets fault rating to a third party
   */
  function iSetAnotherPartyIsAtFault()

  /**
   * Sets the fault rating of the claim to a third party
   */
  function otherPartiesAreAtFault()

  /**
   * Refers the claim for subrogation
   */
  function claimReferredForSubrogation()
}
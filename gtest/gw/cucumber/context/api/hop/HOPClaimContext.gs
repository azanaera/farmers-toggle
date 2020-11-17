package gw.cucumber.context.api.hop

uses cucumber.api.DataTable
uses gw.api.locale.DisplayKey
uses gw.cucumber.context.api.common.ClaimContext

/**
 * Methods related to new hop homeowners claim creation
 */
interface HOPClaimContext extends ClaimContext {

  final static var DK_PROPERTYCONTENTSDAMAGEDESC : String = DisplayKey.get("Web.FNOLWizard.LossDetails.Homeowners.PropertyContentsDamageDescription")
  final static var DK_WATERSOURCE                : String = DisplayKey.get("NVV.Claim.SubView.LossDetailsProperty.Claim.WaterDamage.WaterSource")
  final static var DK_WATERTURNEDOFF             : String = DisplayKey.get("NVV.Claim.SubView.LossDetailsProperty.Claim.WaterDamage.HasWaterBeenTurnedOff")
  final static var DK_ISROOFCOVERED              : String = DisplayKey.get("NVV.Claim.SubView.LossDetailsProperty.Claim.WaterDamage.IsRoofProtected")
  final static var DK_ARSONINVOLVED              : String = DisplayKey.get("NVV.Claim.SubView.LossDetailsProperty.Claim.ArsonInvolved")
  final static var DK_FIRESOURCE                 : String = DisplayKey.get("NVV.Claim.SubView.LossDetailsProperty.Claim.FireDamage.FireSource")
  final static var DK_HOWWASFIREDISCOVERED       : String = DisplayKey.get("NVV.Claim.SubView.LossDetailsProperty.Claim.FireDamage.HowWasFireDiscovered")
  final static var DK_FIREDEPTRESPONDED          : String = DisplayKey.get("NVV.Claim.SubView.LossDetailsProperty.Claim.FireDamage.FireDeptResponded")
  final static var DK_ANYONEINJURED              : String = DisplayKey.get("NVV.Claim.SubView.LossDetailsProperty.Claim.FireDamage.IsAnyoneInjured")
  final static var DK_SMOKEDAMAGEONLY            : String = DisplayKey.get("NVV.Claim.SubView.LossDetailsProperty.Claim.FireDamage.SmokeDamageOnly")
  final static var DK_ISHOMEHABITABLE            : String = DisplayKey.get("NVV.Claim.SubView.LossDetailsProperty.Claim.FireDamage.IsHomeHabitable")
  final static var DK_ISHOMESECURE               : String = DisplayKey.get("NVV.Claim.SubView.LossDetailsProperty.Claim.FireDamage.IsHomeSecure")
  final static var DK_PROPERTYDESCRIPTION        : String = DisplayKey.get("Web.DwellingIncident.PropertyDescription")
  final static var DK_DAMAGEDESCRIPTION          : String = DisplayKey.get("Web.DwellingIncident.Description")
  final static var DK_LOSSESTIMATE               : String = DisplayKey.get("Web.FixedPropertyIncident.LossEstimate")
  final static var DK_ADDRESS1                   : String = DisplayKey.get("Web.FixedPropertyIncident.Property.Address.AddressLine1")
  final static var DK_CITY                       : String = DisplayKey.get("Web.FixedPropertyIncident.Property.Address.City")
  final static var DK_STATE                      : String = DisplayKey.get("Web.FixedPropertyIncident.Property.Address.State")
  final static var DK_DESCRIPTION                : String = DisplayKey.get("Web.FNOLWizard.LossDetails.Homeowners.LivingExpensesDescription")
  final static var DK_MATERIALSDAMAGED           : String = DisplayKey.get("Web.FixedPropertyIncident.MaterialsDamaged")
  final static var DK_ESTIMATESRECEIVED          : String = DisplayKey.get("Web.DwellingIncident.EstimatedReceived")
  final static var DK_ALREADYREPAIRED            : String = DisplayKey.get("Web.FixedPropertyIncident.AlreadyRepaired")
  final static var DK_NEW                        : String = DisplayKey.get("Web.Financials.ReserveLineInputSet.ReserveLine.New")
  final static var DK_NEWPERSON                  : String = DisplayKey.get("Web.FNOLContactPopup.ContactDV.NewPerson.Value")
  final static var DK_DESCRIBEINJURIES           : String = DisplayKey.get("Web.InjuryIncidentInputSet.Description.Label")
  final static var DK_LOSSPARTY                  : String = DisplayKey.get("Web.InjuryIncidentInputSet.LossParty.Label")
  final static var DK_SEVERITY                   : String = DisplayKey.get("Web.InjuryIncidentInputSet.Severity.Label")
  final static var DK_INJURYTYPE                 : String = DisplayKey.get("Web.InjuryIncidentInputSet.GeneralInjuryType.Label")

  /**
   * Add a dwelling incident to claim in FNOL wizard
   *
   * @param table A table describing the dwelling incident
   *    - Damage Description         - String                     - The description of the damage
   *    - Materials Damaged          - String                     - The description of the types of materials damaged
   *    - Estimate Received?         - String (YesNo)             - Estimate Received?
   *    - Already Repaired?          - String (YesNo)             - Already Repaired?
   * e.g.
   * | Damage Description | Example description |
   * | Materials Damaged  | Carpet and floors   |
   * | Estimate Received? | Yes                 |
   * | Already Repaired?  | No                  |
   */
  function addDwellingIncident(table : DataTable)

  /**
   * Adds a personal property incident to the claim in FNOL Wizard
   *
   * @param table A table describing the personal property incident
   *    - Damage Description         - String                     - The description of the damage
   * e.g.
   * | Damage Description  |
   * | Example description |
   */
  function addPersonalPropertyIncident(table : DataTable)

  /**
   * Adds a Living Expenses incident to the claim in FNOL Wizard
   *
   * @param table A table describing the Living Expenses incident
   *    - Description         - String                     - The description of the damage
   * e.g.
   * | Description         | Example description |
   */
  function addLivingExpensesIncident(table : DataTable)

  /**
   * Create a dwelling incident on the claim using builders
   */
  function createDwellingIncident()

  /**
   * Sets the damage type during FNOL Wizard
   *
   * @param type (Fire or Water)
   */
  function setDamageTypeTo(type : String)

  /**
   * Answers the fire questions in FNOL Wizard
   *
   * @param table A table containing different answers to the fire questions
   *    - Arson Involved?               - String (YesNo)             - Arson Involved?
   *    - Source Of The Fire            - String                     - The description of the source of the fire
   *    - How Was The Fire Discovered?  - String                     - The description of how the fire was discovered
   *    - Fire Department Responded?    - String (YesNo)             - Fire Department Responded?
   *    - Is Anyone Injured?            - String (YesNo)             - Is Anyone Injured?
   *    - Smoke Damage Only?            - String (YesNo)             - Smoke Damage Only?
   *    - Is The Home Habitable?        - String (YesNo)             - Is The Home Habitable?
   *    - Is The Home Secure?           - String (YesNo)             - Is The Home Secure?
   * e.g.
   * | Arson Involved? | Source Of The Fire   | How Was The Fire Discovered? | Fire Department Responded? | Is Anyone Injured? | Smoke Damage Only? | Is The Home Habitable? | Is The Home Secure? |
   * | Yes             | Gasoline soaked rags | I saw it on fire             | Yes                        | No                 | No                 | No                     | No                  |
   */
  function answerFireQuestions(table : DataTable)

  /**
   * Answers the water questions in FNOL Wizard
   *
   * @param table A table containing different answers to the water questions
   *    - Source Of The Water           - String (WaterSource)        - Source Of The Water?
   *    - Is The Roof Damage Covered?   - String (YesNo)              - Is The Roof Damage Covered?
   * e.g.
   * | Source Of The Water | Is The Roof Damage Covered? |
   * | Roof                | Yes                         |
   */
  function answerWaterQuestions(table : DataTable)

  /**
   * Verify water questions are answered on claim
   *
   * @param table A table containing different answers to the water questions
   *    - Source Of The Water           - String (WaterSource)        - Source Of The Water?
   *    - Is The Roof Damage Covered?   - String (YesNo)              - Is The Roof Damage Covered?
   * e.g.
   * | Source Of The Water | Is The Roof Damage Covered? |
   * | Roof                | Yes                         |
   */
  function verifyWaterQuestionsOnClaim(table : DataTable)

  /**
   * Verify fire questions are answered on claim
   *
   * @param table A table containing different answers to the fire questions
   *    - Arson Involved?               - String (YesNo)             - Arson Involved?
   *    - Source Of The Fire            - String                     - The description of the source of the fire
   *    - How Was The Fire Discovered?  - String                     - The description of how the fire was discovered
   *    - Fire Department Responded?    - String (YesNo)             - Fire Department Responded?
   *    - Is Anyone Injured?            - String (YesNo)             - Is Anyone Injured?
   *    - Smoke Damage Only?            - String (YesNo)             - Smoke Damage Only?
   *    - Is The Home Habitable?        - String (YesNo)             - Is The Home Habitable?
   *    - Is The Home Secure?           - String (YesNo)             - Is The Home Secure?
   * e.g.
   * | Arson Involved? | Source Of The Fire   | How Was The Fire Discovered? | Fire Department Responded? | Is Anyone Injured? | Smoke Damage Only? | Is The Home Habitable? | Is The Home Secure? |
   * | Yes             | Gasoline soaked rags | I saw it on fire             | Yes                        | No                 | No                 | No                     | No                  |
   */
  function verifyFireQuestionsOnClaim(table : DataTable)

  /**
   * Verify property damage liability exists on claim
   *
   * @param table A table describing a property damage liability
   *    - Property Description   - String              - A description of the property
   *    - Damage Description     - String              - A description of the damage to the property
   *    - Loss Estimate          - Number              - Estimated value of the loss (in default currency)
   *    - Address 1              - String              - Street number and name where the property is located
   *    - City                   - String              - City where the property is located
   *    - State                  - String (State)      - State where the property is located
   * e.g.
   * | Property Description | Damage Description | Loss Estimate | Address 1     | City          | State      |
   * | 2 bed apartment      | Fire in bedroom    | 500           | 1 Main Street | San Francisco | California |
   */
  function verifyPropertyDamageLiability(table : DataTable)

  /**
   * Verify personal property incident exists on claim
   *
   * @param table A table describing a personal property incident
   *    - Damage Description         - String                     - The description of the damage
   * e.g.
   * | Damage Description  | Example description |
   */
  function verifyASpecificPersonalPropertyIncidentOnClaim(table : DataTable)

  /**
   * Verify living expenses exists on claim
   *
   * @param table A table describing a living expenses incident
   *    - Description         - String                     - The description of the damage
   * e.g.
   * | Description         |
   * | Example description |
   */
  function verifyLivingExpensesOnClaim(table : DataTable)


  /**
   * Verifies that a DwellingIncident exists on claim
   */
  function verifyADwellingIncidentExists()

  /**
   * Verify a given dwelling incident exists on claim
   * @param table (optional)
   *    - Damage Description    - String                - A description of the damage to the dwelling
   *    - Materials Damaged     - String                - A description of the materials damaged
   *    - Estimate Received?    - String (YesNo)        - Was an estimate of the damaged (monetary) amount received?
   *    - Already Repaired?     - String (YesNo)        - Was the damage already repaired?
   * e.g
   * | Damage Description | Example description |
   * | Materials Damaged  | Carpet and floors   |
   * | Estimate Received? | Yes                 |
   * | Already Repaired?  | No                  |
   */
  function verifyASpecificDwellingIncidentExists(table : DataTable)

  /**
   * Create a dwelling incident with damage and property information on the claim using builders
   */
  function addDwellingIncident()

  /**
   * Update dwelling incident adding property and damage info
   * @param table A table describing the dwelling incident
   *    - Damage Description         - String                     - The description of the damage
   *    - Materials Damaged          - String                     - The description of the types of materials damaged
   *    - Estimate Received?         - String (YesNo)             - Estimate Received?
   *    - Already Repaired?          - String (YesNo)             - Already Repaired?
   * e.g.
   * | Damage Description | Example description |
   * | Materials Damaged  | Carpet and floors   |
   * | Estimate Received? | Yes                 |
   * | Already Repaired?  | No                  |
   */
  function updateDwellingIncident(table : DataTable)

  /**
   * Create a bodily injury incident with person and injury details on the claim using builders
   */
  function addABodilyInjuryIncidentWithPersonAndInjuryDetails()

  /**
   * Create a bodily injury incident on the claim using builders
   */
  function createBodilyInjuryIncident()

  /**
   * Create a bodily injury incident on the claim using builders including a skin burn
   */
  function createBodilyInjuryIncidentForSkinBurns()

  /**
   * Update bodily injury incident adding Medical Diagnosis and Medical Services to Perform
   * @param table A table describing the bodily injury incident
   *    - Describe Injuries          - String                     - The description of the injuries
   *    - Loss Party                 - String (LossPartyType)     - The loss party
   *    - Severity                   - String (SeverityType)      - The description of the damage
   *    - General Injury Type        - String (InjuryType)        - The description of the damage
   * e.g.
   * | Describe Injuries    | Updated description   |
   * | Loss Party           | Third-party liability |
   * | Severity             | Moderate              |
   * | General Injury Type  | Multiple injuries     |
   */
  function updateBodilyInjuryIncident(table : DataTable)

  /**
   * Verify the bodily injury incident is updated
   * @param table A table describing the bodily injury incident
   *    - Describe Injuries          - String                     - The description of the injuries
   *    - Loss Party                 - String (LossPartyType)     - The loss party
   *    - Severity                   - String (SeverityType)      - The description of the damage
   *    - General Injury Type        - String (InjuryType)        - The description of the damage
   * e.g.
   * | Describe Injuries    | Updated description   |
   * | Loss Party           | Third-party liability |
   * | Severity             | Moderate              |
   * | General Injury Type  | Multiple injuries     |
   */
  function verifyASpecificBodilyInjuryIncidentExist(table : DataTable)


  /**
   * Create a living expenses incident on the claim using builders
   */
  function addALivingExpensesIncidentForMealAndLodging()

  /**
   * Create a other structures incident on the claim using builders
   */
  function addOtherStructuresIncident()

  /**
   * Verify living expenses incident exists on the claim
   */
  function verifyLivingExpensesIncidentExists()

  /**
   * Verify other structures incident exists on the claim
   */
  function verifyOtherStructuresIncidentExists()

  /**
   * Create a personal property incident on the claim using builders
   */
  function addPersonalPropertyIncident()

  /**
   * Verify a personal property incident exists on the claim
   */
  function verifyAPersonalPropertyIncidentExists()

  /**
   * Create a dwelling incident for a fire in the living room on the claim using builders
   */
  function createDwellingIncidentForLivingRoomFireAfterACandleFell()
}
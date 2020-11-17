package gw.api.print

uses gw.api.locale.DisplayKey
uses gw.api.system.CCConfigParameters
uses gw.config.CoverageSubtypeAbstraction
uses gw.config.LOBAbstraction

uses java.lang.Deprecated

/**
 *
 * Utility class for use exclusively with claim print out functionality. This class is
 * used in conjuction with ClaimPrintout.pcf, which defines and configures options available
 * for generating a claim file print.
 * 
 */
@Export
class ClaimPrintoutHelper
{
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////  
  // constants
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////  
  
  private static final var EXCLUDE_WIDGET_ID_LIST = { 
       "NoteSearchDV", 
       "ClaimDocumentSearchDV", 
       "ClaimNotesTitle", 
       "StatCodeFilterDV" 
  }
  
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////  
  // Members
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////  
  
  /**
   * Claim in context during claim printout operation
   */
  private var _claim : Claim

  // basic incidents
  private var _fixedPropIncidents : FixedPropertyIncident[]  
  private var _injuryIncidents : InjuryIncident[]

  // travel incidents
  private var _tripIncidents : TripIncident[]
  private var _baggageIncidents : BaggageIncident[]
  
  // homeowner-specific incidents
  private var _dwellingIncident : DwellingIncident
  private var _otherStructureIncident : OtherStructureIncident
  private var _livingExpenseIncident : LivingExpensesIncident
  private var _propContentIncident : PropertyContentsIncident
  
  
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////  
  // Construction
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////  
  construct(c  : Claim) {
    _claim = c    
  }
  
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////  
  // Methods
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////  
  
  function createPrintSettings() : PrintSettings {
    
    // new print settings object
    var newPrintSettings = new PrintSettings();
    
    // pretty print claim number 
    newPrintSettings.setHeaderLabel(DisplayKey.get("Web.PrintOut.ClaimNumber", Claim.ClaimNumber))
    
    // don't output these widgets/PCF elements in the claim print. These are specialized
    // objects that are unnecessary (e.g. the search criteria user values in a claim search)
    EXCLUDE_WIDGET_ID_LIST.each( \ wid -> newPrintSettings.InternalSettings.excludeWidget( wid ) )    
    
    return newPrintSettings;
  }

  function canPrintClaimSnapshot() : boolean {
    return gw.api.snapshot.ClaimSnapshotUtil.hasSnapshot(Claim)
      and 
        perm.Claim.view(Claim)
      and 
        perm.System.viewsnapshot
      and 
        (perm.System.viewclaimbasics
        or perm.System.viewclaimparties
        or perm.System.viewpolicy
        or perm.System.viewexposures
        or perm.System.viewclaimnotes
        or perm.System.viewdocs);
  }

  function isPropertyLossType() : boolean {
    return LOBAbstraction.ForClaim.ForLossType.isProperty(Claim)
  }
     
  function isTravelClaim() : boolean {
    return
        LOBAbstraction.ForClaim.ForLossType.isTravel(Claim)
      and
        LOBAbstraction.ForPolicy.isPersonalTravelPolicy(Claim.Policy)
  }
    
  function isHomeownersClaim() : boolean {
    return 
        isPropertyLossType()
    and
        LOBAbstraction.ForPolicy.isHomeownersPolicy(Claim.Policy)
  }
  
  function isAutoClaim() : boolean {
    return LOBAbstraction.ForClaim.ForLossType.isAuto(Claim)
  }

  function isWorkersCompClaim() : boolean {
    return LOBAbstraction.ForClaim.ForLossType.isWorkComp(Claim)
  }

  function getMedicalDetails() : Exposure {
    return findExposureForCoverageSubtype(CoverageSubtypeAbstraction.WorkersCompCoverageMedicalOnly)
  }

  function getIndemityTimeLoss() : Exposure {
    return findExposureForCoverageSubtype(CoverageSubtypeAbstraction.WorkersCompCoverageOtherThanMedical)
  }

  function getEmployerLiability() : Exposure {
    return findExposureForCoverageSubtype(CoverageSubtypeAbstraction.WorkersCompEmployersLiability)
  }

  /**
   * @deprecated Use {@link #findExposureForCoverageSubtype(CoverageSubtypeAbstraction)}
   */
  @Deprecated
  function findExposureForCoverageSubtype(cst : CoverageSubtype) : Exposure {
    return findExposureForCoverageSubtype(CoverageSubtypeAbstraction.forTypeKey(cst))
  }

  function findExposureForCoverageSubtype(cst: CoverageSubtypeAbstraction) : Exposure {
    return Claim.Exposures.firstWhere(\exp -> exp.CoverageSubType == cst.TypeKey)
  }

  /**
   * Generates the title for printing the Claim - Financial Transactions section, depending upon
   * which filter is applied. 
   * 
   * The method is here on the helper class because the PCF cannot access functions embedded in the
   * code section of the same PCF from Page attributes.
   */
  static function getTitleForFinancialTransactions(claim : Claim, mode : String) : String {
    var titleMap = new java.util.HashMap<String, String>(){
        "default" -> DisplayKey.get("Web.ClaimFinancials.Financials.Transactions"),
        "payment" -> DisplayKey.get("Web.ClaimFinancials.Financials.Payments"),
        "reserve" -> DisplayKey.get("Web.ClaimFinancials.Financials.Reserves"),
        "recovery" -> DisplayKey.get("Web.ClaimFinancials.Financials.Recoveries"),
        "recoveryreserve" -> DisplayKey.get("Web.ClaimFinancials.Financials.RecoveryReserves")
    }
    return titleMap.get(mode)
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////  
  // Properties
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////  

  /**
   * Returns true if the config.xml UseRecoveryReserves is set to true, false otherwise.
   */
  static property get UseRecoveryReserves() : boolean {
    var param = CCConfigParameters.UseRecoveryReserves.Value
    return param == null ? false : param.booleanValue()
  }
  
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////  
  // Common Incidents
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////  

  property get BaggageIncidents() : BaggageIncident[] {
    if (_baggageIncidents == null) {
      _baggageIncidents = Claim.BaggageIncidentsOnly
    }
    
    return _baggageIncidents
  }
  
  property get TripIncidents() : TripIncident[] {
    if (_tripIncidents == null) {
        _tripIncidents = Claim.TripIncidentsOnly
    }
    
    return _tripIncidents
  }
  
  property get InjuryIncidents() : InjuryIncident[] {
    if (_injuryIncidents == null) {
      _injuryIncidents = Claim.InjuryIncidentsOnly
    }
    
    return _injuryIncidents
  }

  property get FixedPropertyIncidents() : FixedPropertyIncident[] {
    if (_fixedPropIncidents == null) {
      _fixedPropIncidents = Claim.FixedPropertyIncidentsOnly
    }
    return _fixedPropIncidents
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////  
  // Homeowner Claim Incidents
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////  

  property get DwellingIncident() : DwellingIncident {
    if (_dwellingIncident == null) {
      _dwellingIncident = Claim.DwellingIncidentsOnly.first()
    }
        
    return _dwellingIncident
  }

  property get PersonalPropertyIncident() : PropertyContentsIncident {
    if (_propContentIncident == null) {
      _propContentIncident = Claim.PropertyContentsIncidentsOnly.first()
    }
    return _propContentIncident
  }
  
  property get OtherStructureIncident() : OtherStructureIncident {
    if (_otherStructureIncident == null) {
      _otherStructureIncident = Claim.OtherStructureIncidentsOnly.first()
    }
    return _otherStructureIncident
  }
  
  property get LivingExpensesIncident() : LivingExpensesIncident {
    if (_livingExpenseIncident == null) {
      _livingExpenseIncident = Claim.LivingExpensesIncidentsOnly.first()
    }
    return _livingExpenseIncident
  }
    
  protected property get Claim() : Claim {    
    return _claim
  }
}

package gw.plugin.taxframework
uses gw.api.financials.CurrencyAmount
uses gw.plugin.financials.IBackupWithholdingPlugin
uses gw.surepath.suite.integration.logging.StructuredLogger
uses gw.util.BackupWithholdingCalculator

uses java.math.RoundingMode

@Export
class BackupWithholdingPlugin implements IBackupWithholdingPlugin
{
  private var backupWithholdingCalculator : BackupWithholdingCalculator
  private static final var _logger = StructuredLogger.PLUGIN
  
  construct()
  {
    backupWithholdingCalculator = new BackupWithholdingCalculator()
  }

  override function getDeductions( check : Check ) : Deduction[]
  {
    _logger.trace("BackupWithholdingPlugin.getDeductions(Check): getting deductions for check with public id ${check.PublicID}")
    var returnValue = new ArrayList<Deduction>()
    var validVendor =  getValidVendor(check)
    if(validVendor != null){
      returnValue.addAll(backupWithholdingCalculator.computeDeductions(check).toList())
      var stateBackupWithholding = getStateBackupWithholdingForValidVendors(check,validVendor)
      if(stateBackupWithholding != null){
        returnValue.add(stateBackupWithholding)
        _logger.info("BackupWithholdingPlugin.getDeductions(Check): State Backup Withholding created for check with public id ${check.PublicID}")
      }
    }
    return returnValue.toTypedArray()
  }

  /**
   * Check to see if there are any vendors on the check that are eligable to pay Backup Withholding
   * and if so create a Deduction
   * @param check
   * @return Backup Withholding Deduction
   */
  private function getStateBackupWithholdingForValidVendors(check : Check, validVendor : Contact): Deduction{
    var state : State
    if(validVendor != null and hasValidCostType(check)){
      if(typeof validVendor == CompanyVendor or validVendor typeis AutoTowingAgcy or validVendor typeis AutoRepairShop){
        state = check.Claim.LossLocation.State
      }else{
        state = validVendor.PrimaryAddress.State
      }
      if(state != null){
        _logger.debug("BackupWithholdingPlugin.getStateBackupWithholdingForValidVendors(Check): Creating Backup Withholding for vendor ${validVendor}}")
        return createBackupWithholdingForState(check, state)
      }
      _logger.warn("BackupWithholdingPlugin.getStateBackupWithholdingForValidVendors(Check): The vendor ${validVendor} but does not have a state value"
          ,BackupWithholdingPlugin#getStateBackupWithholdingForValidVendors(Check,Contact))
    }
    //There are no valid vendors eligable to pay State Backup Withholding
    return null
  }

  /**
   * Creates a Backup Withholding Deduction using the State Withholding persentage from the Script Parameters
   * @param check
   * @param state
   * @return Backup Withholding Deduction
   */
  private function createBackupWithholdingForState(check : Check, state : State): Deduction{
    switch(state){
      case State.TC_CA:
        return createBackupWithholding(ScriptParameters.CA_State_Withholding_Ext, check)
      case State.TC_MN:
        return createBackupWithholding(ScriptParameters.MN_State_Withholding_Ext,check)
      case State.TC_GA:
        return createBackupWithholding(ScriptParameters.GA_State_Withholding_Ext,check)
      default:
        _logger.warn("BackupWithholdingPlugin.createBackupWithholdingForState(Check,State): There is not Backup Withholding for state ${state} on check with public id ${check.PublicID}"
            ,BackupWithholdingPlugin#createBackupWithholdingForState(Check, State))
        return null
    }
  }

  /**
   * Check to see if any of the check payees has the contact role Vendor and if the payee has Backupwithholding_Ext set
   * to true
   * @param check
   * @return The first valid payee
   */
  private function getValidVendor(check : Check):Contact{
    var returnValue = check.Payees.firstWhere(\payee -> payee.PayeeType == ContactRole.TC_VENDOR
        and payee.Payee.Backupwithholding_Ext).Payee
    _logger.trace("BackupWithholdingPlugin.getValidVendor(Check): Found valid vendor ${returnValue} for check with public id ${check.PublicID}")
    return returnValue
  }

  /**
   * Check is see if any payment on the check have a cost type of expence or claim cost
   * @param check
   * @return Boolean
   */
  private function hasValidCostType(check : Check): Boolean{
    var validCostType = check.Payments*.CostType.firstWhere(\costType -> costType == CostType.TC_CLAIMCOST
        or costType == CostType.TC_AOEXPENSE)
    var returnValue = validCostType != null
    _logger.trace("BackupWithholdingPlugin.hasValidCostType(Check): Returning value of ${returnValue} for check with public id ${check.PublicID}")
    return returnValue
  }

  /**
   * Create a Deduction entity for Backup Withholding. Sets the deduction amount as a percentage of the check amount
   * @param percent
   * @param check
   * @return Backup Withholding Deduction
   */
  private function createBackupWithholding(percent : Double ,check : Check) : Deduction{
    _logger.trace("BackupWithholdingPlugin.createBackupWithholding(Double,Check): Creating deduction on check with public id ${check.PublicID} for percent ${percent}")
    var deduction = new Deduction(check.Bundle)
    var deductionAmount = new CurrencyAmount(((check.getGrossAmount().Amount / 100) * percent).setScale(2,gw.api.util.CurrencyUtil.getRoundingMode()))
    _logger.trace("BackupWithholdingPlugin.createBackupWithholding(Double,Check): Calculated deduction amount is ${deductionAmount}")
    deduction.Amount = deductionAmount
    deduction.Check = check
    deduction.TransactionAmount = deductionAmount
    deduction.DeductionType = DeductionType.TC_STATE_WITHHOLDING_EXT
    deduction.ClaimAmount = deductionAmount
    deduction.ReportingAmount = deductionAmount
    return deduction
  }

}

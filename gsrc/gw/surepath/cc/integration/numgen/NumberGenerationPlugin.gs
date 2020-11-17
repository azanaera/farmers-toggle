package gw.surepath.cc.integration.numgen

uses java.lang.Long
uses java.lang.Throwable

uses gw.api.system.database.SequenceUtil
uses gw.plugin.claimnumbergen.IClaimNumGenAdapter
uses gw.surepath.suite.integration.logging.StructuredLogger

/**
 * Generate temporary and permanent claim numbers.
 */
class NumberGenerationPlugin implements IClaimNumGenAdapter {
  private static final var _properties = new NumberGenerationProperties()
  private static final var _logger = StructuredLogger.INTEGRATION

  /**
   * Generate a new claim number.
   *
   * @param clm the Claim.
   * @return a new claim number.
   */
  override function generateNewClaimNumber(claim : Claim) : String {
    _logger.debug("Entering NumberGenerationPlugin.generateNewClaimNumber()")
    var number = claim.InitialClaimNumber_Ext != null ?claim.InitialClaimNumber_Ext :generateTempClaimNumber(claim)
    _logger.debug("Leaving NumberGenerationPlugin.generateNewClaimNumber()")
    return number
  }

  /**
   * Generate a new temporary claim number.
   *
   * @param clm the Claim.
   * @return a new temporary claim number.
   */
  override function generateTempClaimNumber(claim : Claim) : String {
    _logger.debug("Entering NumberGenerationPlugin.generateTempClaimNumber()")
    var number = ""
    try {
      var format = _properties.TempClaimNumberFormat
      var initial = _properties.TempClaimNumberInitialValue
      _logger.debug("Temporary claim number", null, {"Format" -> format?:"", "Initial Value" -> (initial as String)?:""})

      var seq = SequenceUtil.next(initial, "claim.number")*3
      var args = buildClaimArguments(seq, claim)
      number = String.format(format, args)
      number = "${_properties.ClaimNumberPrefix_Ext}-${number.substring(0,2)}-${number.substring(2)}"
      _logger.debug("Generated temporary claim number", null,{"Number" -> number})
    }
    catch (e : Exception) {
      _logger.error("Exception generating temporary claim number", null, e)
      throw e
    }
    if(claim != null){
      //In the SurePath tests the claim can be null
      claim.InitialClaimNumber_Ext = number
      claim.BoxFolderId_Ext = null
    }
    _logger.debug("Leaving NumberGenerationPlugin.generateTempClaimNumber()")
    return number
  }

  /**
   * Cancel a previously allocated claim number. This method is intentionally left
   * unimplemented for FastPath.
   *
   * @param clm the Claim.
   * @param claimNumber the previously allocated claim number.
   */
  override function cancelNewClaimNumber(clm : Claim, claimNumber : String) : void {
    _logger.debug("Entering NumberGenerationPlugin.cancelNewClaimNumber()")
    _logger.debug("Ignoring request to cancel claim", null, {"ClaimNumber"->claimNumber})
    _logger.debug("Leaving NumberGenerationPlugin.cancelNewClaimNumber()")
  }

  /**
   * Build the arguments to pass to the formatter. The first argument should always be the next
   * sequence number. The default implementation only adds the next sequence number as an argument.
   * Override this method if needed to add additional arguments from the claim to support additional
   * components in the generated claim number. The format string must be changed also to utilize
   * the additional arguments.
   *
   * @param number the next sequence number.
   * @param clm the Claim.
   * @return an array of objects to be passed to the formatter.
   */
  protected function buildClaimArguments(number : Long, clm : Claim) : Object[] {
    return new Object[]{number}
  }
}
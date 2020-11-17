package gw.surepath.cc.integration.numgen

uses gw.api.properties.RuntimePropertyRetriever

/**
 * Properties for number generation.
 */
class NumberGenerationProperties extends RuntimePropertyRetriever {

  /**
   * Construct Number Generation Properties.
   */
  public construct() {
    super(RuntimePropertyGroup.TC_NUMGEN)
  }

  /**
   * Get the claim number format.
   *
   * @return the claim number format.
   */
  public property get ClaimNumberFormat() : String {return this.getRequiredStringProperty("ClaimNumberFormat")}

  /**
   * Get the temporary claim number initial value.
   *
   * @return the temporary claim number initial value.
   */
  public property get ClaimNumberInitialValue() : Long {return this.getRequiredLongProperty("ClaimNumberInitialValue")}

  /**
   * Get the claim number format.
   *
   * @return the claim number format.
   */
  public property get TempClaimNumberFormat() : String {return this.getRequiredStringProperty("TempClaimNumberFormat")}

  /**
   * Get the temporary claim number initial value.
   *
   * @return the temporary claim number initial value.
   */
  public property get TempClaimNumberInitialValue() : Long {return this.getRequiredLongProperty("TempClaimNumberInitialValue")}

  /**
   * Get the claim number prefix.
   *
   * @return the the claim number prefix.
   */
  public property get ClaimNumberPrefix_Ext() : Long {return this.getRequiredLongProperty("ClaimNumberPrefix_Ext")}
}
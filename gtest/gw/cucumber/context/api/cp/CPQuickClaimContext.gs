package gw.cucumber.context.api.cp

uses gw.api.locale.DisplayKey
uses gw.cucumber.context.api.common.ClaimContext

interface CPQuickClaimContext extends ClaimContext {

  final static var DK_QUICK_CLAIM_PR : String = DisplayKey.get("Wizard.NewClaimWizard.QuickClaimProperty.Label")

  /**
   * Start filing a commercial property claim using the Quick Claim Property wizard
   */
  function fileQuickClaimProperty()

  /**
   * Sets the exposure property address during FNOL to an address in the given state
   * @param state
   */
  function setExposurePropertyAddressState(state : String)

  /**
   * Sets the claimant and claimant type
   * @param type - Claimant type
   */
  function setClaimantTo(type : String)

  /**
   * Set the claim reported by contact
   * @param name - Name of contact
   */
  function setReportedByContactTo(name : String)

}
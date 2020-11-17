package gw.cucumber.context.api.pa

uses gw.cucumber.context.api.common.ClaimContext

interface PAQuickClaimContext extends ClaimContext {

  /**
   * Start filing a new claim in Auto - Quick Claim Auto wizard
   */
  function startFilingQuickClaimAuto()

}
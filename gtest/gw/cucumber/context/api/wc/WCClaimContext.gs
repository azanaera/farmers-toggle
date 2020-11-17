package gw.cucumber.context.api.wc

uses gw.cucumber.context.api.common.ClaimContext

/**
 * Methods related to new worker's comp claim creation
 */
@SuppressWarnings("Method2Property")
interface WCClaimContext extends ClaimContext {

  /**
   * Adds the Injured Worker as the claimant on the claim
   */
  function addInjuredWorker()

  /**
   * Sets the date employer notified for the claim
   * @param employerNotifiedDateText
   */
  function setDateEmployerNotified(employerNotifiedDateText : String)

  /**
   * Sets the incident location to an existing location from the policy
   */
  function setIncidentLocation()

  /**
   * Sets the Cause of Injury / Source for the claim
   */
  function setPrimaryInjuryType(injuryTypeText : String)

  /**
   * Sets the Detailed Cause / Source for the claim
   */
  function setDetailedInjuryType(detailedInjuryTypeText : String)

  /**
   * Sets that the Injured Worker lost time from work in FNOL wizard
   */
  function setLostTimeFromWork()

  /**
   * Sets that the Injured Worker lost time from work after claim creation
   */
  function setLoseTimeFromWork()

}
package gw.cucumber.context.api.wc

uses gw.cucumber.context.api.common.ExposureContext

/**
 * Methods related to hop homeowners exposure
 */
interface WCExposureContext extends ExposureContext {

  /**
  * Create an open medical details exposure using builders
  */
  function createMedicalDetailsExposure()

  /**
   * Ensures a single medical details exposure using builders
   */
  function createOnlyMedicalDetailsExposure()

}
package gw.cucumber.context.api.common

uses cucumber.api.DataTable

/**
 * Methods related to exposure
 */
@SuppressWarnings("Method2Property")
interface ExposureContext {

  /**
   * Create a bodily injury exposure with incident on claim
   */
  function createBodilyInjuryExposure()

  /**
   * Close the exposure and set the outcome to "Completed"
   */
  function closeExposure()

  /**
   * Close all open exposures and set the outcomes to "Completed"
   */
  function closeAllOpenExposures()

  /**
   * Create a comprehensive exposure with incident on claim
   */
  function createComprehensiveExposure()

  /**
   * Verify the exposure has the given coverage type
   *
   * @param coverageTypeText
   */
  function verifyExposure(coverageTypeText : String)

  /**
   * Set exposure validation level to the given value
   *
   * @param validationLevel
   */
  function setValidationLevel(validationLevel : ValidationLevel)

  /**
   * Verify an exposure exists on the claim with specific coverage type and subtype
   * @param table
   *    - Coverage Type       - String (CoverageType)       - The coverage type of the exposure
   *    - Coverage Subtype    - String (CoverageSubtype)    - The coverage subtype of the exposure
   * e.g
   * | Coverage Type | Coverage Subtype |
   * | Collision     | Collision        |
   */
  function anExposureShouldExistOnTheClaim(table : DataTable)

  /**
   * Verify an exposure does not exists on the claim with specific coverage type and subtype
   * @param table
   *    - Coverage Type       - String (CoverageType)       - The coverage type of the exposure
   *    - Coverage Subtype    - String (CoverageSubtype)    - The coverage subtype of the exposure
   * e.g
   * | Coverage Type | Coverage Subtype |
   * | Collision     | Collision        |
   */
  function anExposureShouldNotExistOnTheClaim(table : DataTable)

  /**
   * Checks the segment of the exposure
   * @param exposureSegmentText
   */
  function verifyExposureSegment(exposureSegmentText : String)

  /**
   * Create an open exposure for a specified coverage type using builders
   * @param coverageTypeText
   */
  function createExposureForCoverageType(coverageTypeText : String)
}
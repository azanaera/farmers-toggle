package gw.surepath.cc.integration.numgen

uses gw.plugin.Plugins
uses gw.plugin.claimnumbergen.IClaimNumGenAdapter
uses gw.suites.surepath.integration.SurePathIntegrationSuite
uses gw.suites.surepath.integration.SurePathIntegrationTestBase
uses org.apache.commons.lang.StringUtils
uses gw.api.test.CCServerTestClassBase
uses gw.testharness.v3.Suites

/**
 * GUnit tests for Number Generation.
 */
@gw.testharness.ServerTest
@Suites(SurePathIntegrationSuite.NAME)
class NumberGenerationTest extends SurePathIntegrationTestBase {

  construct(testname : String) {
    super(testname)
  }

  /**
   * Test new claim number generation.
   */
  public function testNewClaimNumber() {
    var plugin = Plugins.get(IClaimNumGenAdapter)
    var starting = Long.parseLong(plugin.generateNewClaimNumber(null))
    for (i in 1..5) {
      var number = plugin.generateNewClaimNumber(null)
      var expected = StringUtils.leftPad((starting + i) as String, 8, '0')
      assertEquals("Generated claim number not equal to expected value", expected, number)
    }
  }

  /**
   * Test temp claim number generation.
   */
  public function testTempClaimNumber() {
    var plugin = Plugins.get(IClaimNumGenAdapter)
    var starting = Long.parseLong(plugin.generateTempClaimNumber(null).remove("T-"))
    for (i in 1..5) {
      var number = plugin.generateTempClaimNumber(null)
      var expected = "T-" + StringUtils.leftPad((starting + i) as String, 8, '0')
      assertEquals("Generated temp claim number not equal to expected value", expected, number)
    }
  }
}
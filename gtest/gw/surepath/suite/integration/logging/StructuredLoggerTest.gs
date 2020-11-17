package gw.surepath.suite.integration.logging

uses gw.suites.surepath.integration.SurePathIntegrationSuite
uses gw.suites.surepath.integration.SurePathIntegrationTestBase
uses gw.testharness.v3.Suites

/**
 * GUnit tests for StructuredLogger.
 */
@Suites(SurePathIntegrationSuite.NAME)
class StructuredLoggerTest extends SurePathIntegrationTestBase {
  private static var _logger = StructuredLogger.TEST.createSubcategoryLogger("Test")
  private static var _address : Address

  /**
   * Setup for logging tests.
   */
  public function beforeClass() {
    super.beforeClass()
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      _address = new Address(bundle)
      _address.PublicID = "gw:123"
      _address.AddressLine1 = "2850 South Delaware Street"
      _address.City = "San Mateo"
      _address.State = State.TC_CA
      _address.Country = Country.TC_US
      _address.PostalCode = "94403"
    }, 'su')
  }

  /**
   * Test subcategory.
   */
  public function testSubcategory() {
    assertEquals("Unexpected logger subcategory name", _logger.Name, "Test.Test")
  }

  /**
   * Test all formatting.
   */
  public function testAllFormatting() {
    var str = "Test"
    var expected = "Message"
    expected = expected + " [Method=StructuredLoggerTest#testAllFormatting]"
    expected = expected + " [Address=gw:123] [Address(gw:123)#City=San Mateo] [java.lang.String=Test]"
    expected = expected + " [Key2=Value2] [Key1=Value1]"
    var actual = _logger.formatMessage("Message", {_address, _address#City, str},
        {"Key1"->"Value1", "Key2"->"Value2"}, #testAllFormatting())
    assertEquals("Unexpected all formatting message", expected, actual)
    _logger.info("Message", {_address, _address#City, str},
        {"Key1" -> "Value1", "Key2" -> "Value2"}, #testAllFormatting())
  }

  /**
   * Test method name.
   */
  public function testMethodName() {
    var expected = "Message [Method=StructuredLoggerTest#testMethodName]"
    var actual = _logger.formatMessage("Message", :method=#testMethodName())
    assertEquals("Unexpected method name message", expected, actual)
    _logger.info("Message", :method=#testMethodName())
  }

  /**
   * Test objects.
   */
  public function testObjects() {
    var str = "Test"
    var expected = "Message [Address=gw:123] [Address(gw:123)#City=San Mateo] [java.lang.String=Test]"
    var actual = _logger.formatMessage("Message", {_address, _address#City, str})
    assertEquals("Unexpected object message", expected, actual)
    _logger.info("Message", {_address, _address#City, str})
  }

  /**
   * Test parameters.
   */
  public function testParameters() {
    var expected = "Message [Key2=Value2] [Key1=Value1]"
    var actual = _logger.formatMessage("Message", :parameters={"Key1"->"Value1", "Key2"->"Value2"})
    assertEquals("Unexpected parameter message", expected, actual)
    _logger.info("Message", :parameters={"Key1"->"Value1", "Key2"->"Value2"})
  }
}
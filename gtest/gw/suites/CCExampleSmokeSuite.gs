package gw.suites

uses gw.api.test.CCSmokeTestClassBase
uses gw.api.test.SuiteBuilder
uses junit.framework.Test

@Export
class CCExampleSmokeSuite {

  public static final var NAME : String = "CCExampleSmokeSuite"

  public static function suite() : Test {
    return new SuiteBuilder(CCSmokeTestClassBase)
        .withSuiteName(NAME)
        .build()
  }

}
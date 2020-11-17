package gw.cucumber

uses com.guidewire.api.test.TestExecutionManager
uses com.google.inject.Singleton
uses cucumber.api.Scenario
uses cucumber.api.java.After
uses cucumber.api.java.Before
uses gw.api.test.CCSmokeTestClassBase
uses gw.test.TestEnvironment
uses gw.testharness.remote.ForwardingTestEnvironment

/**
 * <p>Dependency injection will cause this class to be instantiated for each Scenario.
 * Since this is slow and generally undesirable, we treat this as a singleton.
 *
 * <p>Class is <i>effectively</i> final as Cucumber will prevent extending any class containing hooks or glue,
 * however it may be modified in the configuration module
 */
@ReadOnly
@Singleton
class CCCucumberSmokeTestProxy extends CCSmokeTestClassBase implements ICucumberSmokeTestProxy {

  var _testEnv : TestEnvironment
  var _scenarioId : String as ScenarioId

  override property get ExecutionManager() : TestExecutionManager {
    return super.ExecutionManager
  }

  construct() {
    super("AB Smoke Test Proxy for Cucumber")
  }

  private function reallyInitTestEnv() {
    _testEnv = createDefaultEnvironment()
    _testEnv.initializeTypeSystem()
    if(!(_testEnv typeis ForwardingTestEnvironment)) {
      _testEnv.beforeTestSuite() //RFTE unnecessarily redirects output; don't call beforeTestSuite for remotely-invoked Cucumber tests
    }
  }

  @Before
  @BeforeAllScenarios
  function initTestEnv() {
    if(_testEnv == null) {
      reallyInitTestEnv()
    }
  }

  @Before
  function captureScenarioData(scenario : Scenario) {
    _scenarioId = scenario.Id
  }

}
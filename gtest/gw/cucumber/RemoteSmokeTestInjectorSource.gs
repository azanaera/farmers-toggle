package gw.cucumber

uses com.google.inject.Guice
uses com.google.inject.Injector
uses com.google.inject.Stage
uses cucumber.api.guice.CucumberModules
uses cucumber.runtime.java.guice.InjectorSource

@SuppressWarnings("unused")
@Export
class RemoteSmokeTestInjectorSource implements InjectorSource {

  override property get Injector(): Injector {
    return Guice.createInjector(Stage.PRODUCTION, {CucumberModules.SCENARIO, new CCRemoteSmokeTestHelperModule(CCCucumberSmokeTestProxy)})
  }

}
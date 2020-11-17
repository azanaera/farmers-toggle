package gw.cucumber.testdata

uses cucumber.runtime.java.guice.ScenarioScoped

@Export
@ScenarioScoped
class DataWrapper<T> {
  var _value : T = null

  function get() : T {
    return _value
  }

  function set(value : T) {
    _value = value
  }
}

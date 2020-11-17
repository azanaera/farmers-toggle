package gw.cucumber.context.impl.smoketest.util

uses gw.cucumber.CCCucumberSmokeTestProxy
uses gw.smoketest.platform.web.PCFLocation
uses pcftest.Login
uses pcftest.TabBar

class Navigation<T extends PCFLocation> {
  var _proxy : CCCucumberSmokeTestProxy

  construct(proxy : CCCucumberSmokeTestProxy) {
    _proxy = proxy
  }

  function ensureOnPage(setup : block(tabBar : TabBar) : T, username : String = "aapplegate", password : String = "gw") : T {
    if (_proxy.CurrentPage typeis T) {
      return _proxy.CurrentPage
    }
    if (_proxy.CurrentPage typeis Login) {
      _proxy.login(username, password)
    }
    return setup(_proxy.TabBar)
  }
}
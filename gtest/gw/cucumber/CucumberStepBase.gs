package gw.cucumber

uses com.google.inject.Inject
uses gw.api.database.Query
uses gw.api.financials.CurrencyAmount
uses gw.cucumber.testdata.DataWrapper
uses gw.cucumber.transformer.CurrencyAmountTransformer
uses gw.cucumber.transformer.DateTransformer
uses gw.fest.CurrencyAmountAssert
uses gw.sampledata.SampleDataGroup
uses gw.enhancement.util.ValueElementAssert
uses gw.smoketest.platform.web.ValueElement
uses gw.testharness.ChangesCurrentTimeUtil
uses gw.testharness.v3.PLAssertions
uses org.fest.assertions.*
uses org.slf4j.Logger
uses pcftest.TabBar

@SuppressWarnings("unused")
@ReadOnly
class CucumberStepBase {

  @Inject
  private var _currentUser : DataWrapper<String>

  @Inject
  protected var _proxy : CCCucumberSmokeTestProxy

  @Inject
  protected var _currencyAmountTransformer : CurrencyAmountTransformer

  protected var _defaultUser : String = "aapplegate"

  property get DefaultUser() : String {
    return _defaultUser
  }

  function loginDefaultUser() : TabBar {
    return login(DefaultUser, "gw")
  }

  function loginAsUser(username : String) : TabBar {
    return login(username, "gw")
  }

  function login(username : String, password : String) : TabBar {
    _proxy.TabBar = (_proxy.goToEntryPoint("Login") as pcftest.Login).loginAndReturnTabBar(username, password)
    return _proxy.TabBar
  }

  property set CurrentUser(username : String) {
    _currentUser.set(username)
  }

  property get CurrentUser() : String {
    if (_currentUser.get() == null) {
      CurrentUser = _defaultUser
    }
    return _currentUser.get()
  }

  function getUserByUsername(username : String) : User {
    return Query.make(User)
        .join(User#Credential)
        .compare(Credential#UserName, Equals, username)
        .select().AtMostOneRow
  }

  function setCurrentSystemTime(date : String) {
    _proxy.setUpMutableSystemClock()
    ChangesCurrentTimeUtil.setCurrentTime(_proxy, DateTransformer.transform(date).getTime())
  }

  property get Logger() : Logger {
    return _proxy.Logger
  }

  protected function assertThat(actual : Object) : ObjectAssert {
    return PLAssertions.assertThat(actual)
  }

  protected function assertThat(actual : String) : StringAssert {
    return PLAssertions.assertThat(actual)
  }

  protected function assertThat(actual : Object[]) : ObjectArrayAssert {
    return PLAssertions.assertThat(actual)
  }

  protected function assertThat(actual : Collection<Object>) : CollectionAssert {
    return PLAssertions.assertThat(actual)
  }

  protected function assertThat(actual : Boolean) : BooleanAssert {
    return PLAssertions.assertThat(actual)
  }

  protected function assertThat(actual : int) : IntAssert {
    return PLAssertions.assertThat(actual)
  }

  protected function assertThat(actual : long) : LongAssert {
    return PLAssertions.assertThat(actual)
  }

  protected function assertThat(amount : CurrencyAmount) : CurrencyAmountAssert {
    return new CurrencyAmountAssert(amount)
  }

  protected function assertThat(actual : ValueElement) : ValueElementAssert {
    return new ValueElementAssert(actual)
  }

  protected function loadTestSampleData() {
    try {
      gw.transaction.Transaction.runWithNewBundle(\bundle -> {
        SampleDataGroup.Test.load()
      }, User.util.UnrestrictedUser)
    } catch (e) {
      Logger.warn(e.Message)
      if (Logger.DebugEnabled) Logger.debug(e.Message, e)
    }
  }
}
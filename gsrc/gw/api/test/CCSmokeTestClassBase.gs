package gw.api.test

@ReadOnly
class CCSmokeTestClassBase extends CCSmokeTestJavaClassBase {
  /**
   * Any point in the application can be access starting from the tab bar.
   */
  var _tabBar: pcftest.TabBar as TabBar

  construct() {
    super("CC Customer Smoke Test")
  }

  construct( testname : String ) {
    super( testname )
  }

  /**
   * Logs in as the default user, and initializes the TabBar property. Note that sample data with aapplegate
   * should be imported first for this method to work!
   */
  final function loginDefaultUser() {
    login("aapplegate", "gw")
  }

  /**
   * Equivalent to calling login(username, password) using the default password
   */
  function loginAsUser(username: String) {
    login(username, "gw")
  }

  function logout() : gw.smoketest.platform.web.PCFLocation {
    if (TabBar.LogoutTabBarLink.Visible) {
      return TabBar.LogoutTabBarLink.click();
    }
    throw new IllegalStateException("logout link is not visible")
  }

  /**
   * Logs in using the given username and password, and initializes the TabBar property.
   */
  function login(username : String, password : String) {
    var startPage = (this.goToEntryPoint( "Login" ) as pcftest.Login).login(username, password)
    _tabBar = (startPage as pcftest.DesktopActivities)._parent.TabBar
  }
}
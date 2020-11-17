package gw.enhancement.login

uses pcftest.AccountAdmin
uses pcftest.ActivityRules
uses pcftest.ClaimSearch
uses pcftest.Desktop
uses pcftest.DesktopActivities
uses pcftest.ExposureRules
uses pcftest.GroupDetailPage
uses pcftest.ReserveRules
uses pcftest.TeamGroupSummary
uses pcftest.WorkloadClassifications

enhancement CCLoginTestEnhancement : pcftest.Login {

  /**
   * Attempts to log in the user using the specified credentials. This API explicitly assumes that the user being
   * logged in has permission to view Desktop Activities. Hence, using this to log in pure admin users (e.g. a user
   * who has only UserAdmin role) will break. Use CCLoginTestEnhancement#loginAndReturnTabBar instead in such cases.
   */
  function loginToDesktop(userName : String, password : String) : DesktopActivities {
    return this.login(userName, password) as DesktopActivities
  }

  function loginAndReturnTabBar(username : String, password : String): pcftest.TabBar {
    var landingPage = this.login(username, password)
    if (landingPage typeis DesktopActivities) {
      return landingPage._parent.TabBar
    } else if (landingPage typeis Desktop) {
      return landingPage.TabBar
    } else if (landingPage typeis ClaimSearch) {
      return landingPage._parent.TabBar
    } else if (landingPage typeis GroupDetailPage) {
      return landingPage._parent.TabBar
    } else if (landingPage typeis AccountAdmin) {
      return landingPage._parent.TabBar
    } else if (landingPage typeis WorkloadClassifications) {
      return landingPage._parent.TabBar
    } else if (landingPage typeis ActivityRules) {
      return landingPage._parent.TabBar
    } else if (landingPage typeis ExposureRules) {
      return landingPage._parent.TabBar
    } else if (landingPage typeis ReserveRules) {
      return landingPage._parent.TabBar
    } else if (landingPage typeis TeamGroupSummary) {
      return landingPage._parent.TabBar
    } else {
      throw new AssertionError("Unexpected landing page after login: " + (typeof landingPage))
    }
  }

  function loginAndReturnTabBar(): pcftest.TabBar {
    return loginAndReturnTabBar("aapplegate", "gw")
  }

}
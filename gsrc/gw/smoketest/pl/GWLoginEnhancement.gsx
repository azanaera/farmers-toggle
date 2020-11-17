package gw.smoketest.pl

uses gw.smoketest.platform.web.PCFLocation

/**
 * Defines the enhancements to the Login page for smoketests
 */
enhancement GWLoginEnhancement: pcftest.Login {
  /**
   * Login to the app
   */
  public function login(userName : String, password : String) : gw.smoketest.platform.web.PCFLocation {
    this.LoginScreen.LoginDV.username.Value = userName;
    this.LoginScreen.LoginDV.password.Value = password;
    return this.LoginScreen.LoginDV.submit.click();
  }

  public function login(user:User) : PCFLocation {
    var credential = user.Credential
    return login(credential.UserName, "gw")
  }
}

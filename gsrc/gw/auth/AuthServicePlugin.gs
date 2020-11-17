package gw.auth

uses gw.api.system.server.ServerUtil
uses gw.plugin.security.AuthenticationServicePluginCallbackHandler
uses gw.plugin.security.AuthenticationSource
uses gw.plugin.security.UserNamePasswordAuthenticationSource
uses org.slf4j.MarkerFactory

class AuthServicePlugin extends com.guidewire.pl.system.security.impl.DefaultAuthenticationServicePlugin {
  private static final var MARKER = MarkerFactory.getMarker("AuthServicePlugin")

  private var _localHandler : AuthenticationServicePluginCallbackHandler

  override function authenticate(authenticationSource : AuthenticationSource) : String {
    if (_localHandler == null) {
      throw new IllegalArgumentException("Callback handler not set")
    }
    if (authenticationSource typeis UserNamePasswordAuthenticationSource) {
      return super.authenticate(authenticationSource)
    }
    if (authenticationSource typeis AuthTokenAuthenticationSource) {
      try {
        var oAuthTokenAuthenticationSource = authenticationSource as AuthTokenAuthenticationSource
        if (!oAuthTokenAuthenticationSource.isActualNonceAMatchToExpectedNonce()) {
          throw "The OAuth nonce does not match.  Expected " + oAuthTokenAuthenticationSource.ExpectedNonce + " but received " + oAuthTokenAuthenticationSource.ActualNonce + "."
        }

        var userName = oAuthTokenAuthenticationSource.UserName
        var userPublicId = _localHandler.findUser(userName)
        if (userPublicId == null) {
          throw "There is no corresponding user in " + ServerUtil.Product.ProductName + " for the SSO user " + userName + "."
        }
        return userPublicId
      } catch (e : Exception) {
        AuthHelper.IL.logError(MARKER, e.getLocalizedMessage())
        AuthHelper.storeErrorMessageInSession(null)
        throw e
      }
    }

    throw new IllegalArgumentException("Authentication source type " + authenticationSource.getClass().getName() + " is not known to this plugin")
  }

  override property set Callback(callbackHandler : AuthenticationServicePluginCallbackHandler) {
    super.setCallback(callbackHandler)
    _localHandler = callbackHandler
  }
}
package gw.auth

uses gw.plugin.security.AuthenticationSource

class AuthTokenAuthenticationSource implements AuthenticationSource {
  private var _userName : String as UserName
  private var _expectedNonce : String as ExpectedNonce
  private var _actualNonce : String as ActualNonce

  construct(token : Map<String, Object>) {
    this._userName = token.get("username") as String
    this._actualNonce = token.get("nonce") as String
  }

  override property get Hash() : char[] {
    return _userName.toCharArray()
  }

  override function determineSourceComplete() : boolean {
    return (_userName != null) && (_userName.length() > 0)
  }

  function isActualNonceAMatchToExpectedNonce() : boolean {
    return ExpectedNonce == ActualNonce
  }
}
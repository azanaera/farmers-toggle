package gw.auth

uses gw.api.system.server.ServerUtil
uses gw.pl.logging.LogMessageParams
uses gw.plugin.InitializablePlugin
uses gw.plugin.Plugins
uses gw.plugin.credentials.CredentialsPlugin
uses gw.plugin.security.AuthenticationSource
uses gw.plugin.security.AuthenticationSourceCreatorPlugin
uses gw.plugin.security.UserNamePasswordAuthenticationSource
uses okhttp3.FormBody
uses okhttp3.Headers
uses okhttp3.OkHttpClient
uses okhttp3.Request
uses okhttp3.Response
uses org.apache.http.entity.ContentType
uses org.slf4j.MarkerFactory

uses javax.servlet.http.HttpServletRequest

class AuthSourceCreatorPlugin implements AuthenticationSourceCreatorPlugin, InitializablePlugin {
  private static final var MARKER = MarkerFactory.getMarker("AuthSourceCreatorPlugin")

  private static final var GUIDEWIRE_CC_AUTHENTICATION_CLIENT_KEY = "guidewire.cc.authentication.client"
  private static final var AUTHORIZATION_BASIC : String = "Basic "
  private static final var AUTHORIZATION_HEADER : String = "Authorization"
  private static final var TOKEN_TYPE_ID_TOKEN = "id_token"

  //private var _authServerUri : String as readonly AuthServerUri
  private var _redirectUri : String as readonly RedirectUri
  //  private var _authServiceUri : String as readonly AuthServiceUri
  private var _tokenServiceUri : String
  private var _introspectServiceUri : String
  private var _clientId : String as readonly ClientId
  private var _clientSecret : String as readonly ClientSecret
  private var _clientCredentials : String as readonly ClientCredentials

  override function createSourceFromHTTPRequest(request : HttpServletRequest) : AuthenticationSource {
    if (request == null) {
      AuthHelper.IL.logDebugEvent(MARKER, "Request was null in AuthSourceCreatorPlugin so returning empty UserNamePasswordAuthenticationSource")
      return new UserNamePasswordAuthenticationSource()
    }
    // Get the code, if it exists
    var code = request.getSession(true).getAttribute(AuthHelper.SESSION_ATTRIBUTE_OAUTH_CODE) as String
    if (code == null) {
      AuthHelper.IL.logDebugEvent(MARKER, "Code is not set, therefore treating as username/password case")
      var userName = request.getAttribute("username") as String
      var password = request.getAttribute("password") as String
      return new UserNamePasswordAuthenticationSource(userName, password)
    } else {
      try {
        AuthHelper.IL.logDebugEvent(MARKER, "Code is set", LogMessageParams.create().put("code", code))
        var expectedNonce = request.getSession(true).getAttribute(AuthHelper.SESSION_ATTRIBUTE_OAUTH_NONCE) as String
        if (expectedNonce == null) {
          throw "The expected OAuth nonce has not been set."
        }
        var token = exchangeCodeForToken(getPayloadMap(code), getHeaders())
        if (token != null) {
          var oAuthTokenAuthenticationSource = introspectToken(getIntrospectPayloadMap(token, TOKEN_TYPE_ID_TOKEN))
          AuthHelper.IL.logDebugEvent(MARKER, "Login to Okta was valid for user", LogMessageParams.create().put("username", oAuthTokenAuthenticationSource.UserName))
          oAuthTokenAuthenticationSource.ExpectedNonce = expectedNonce
          request.getSession(true).removeAttribute(AuthHelper.SESSION_ATTRIBUTE_OAUTH_STATE)
          request.getSession(true).removeAttribute(AuthHelper.SESSION_ATTRIBUTE_OAUTH_NONCE)
          request.getSession(true).removeAttribute(AuthHelper.SESSION_ATTRIBUTE_OAUTH_CODE)
          return oAuthTokenAuthenticationSource
        }
      } catch (e : Exception) {
        AuthHelper.IL.logError(MARKER, e.getLocalizedMessage())
        AuthHelper.storeErrorMessageInSession(request)
        return new UserNamePasswordAuthenticationSource()
      }
    }
    return null
  }

  private function getHeaders(clientCredentials : boolean = false) : Headers {
    var headers = new Headers.Builder()
        .add("Content-Type", ContentType.APPLICATION_FORM_URLENCODED.getMimeType())
    if (clientCredentials) {
      headers.add(AUTHORIZATION_HEADER, AUTHORIZATION_BASIC + _clientCredentials)
    }
    return headers.build()
  }

  /**
   * Given an OAuth 2.0 token, get the auth server to introspect it.
   *
   * @param token
   */
  private function introspectToken(payload : Map<String, String>) : AuthTokenAuthenticationSource {
    if (isInvalidPayload(payload)) {
      throw new IllegalArgumentException("Payload cannot be empty or null. Check payload for request to ${_introspectServiceUri}")
    }
    var response : Response
    var result : AuthTokenAuthenticationSource
    try {
      var request = setupRequest(_introspectServiceUri, getHeaders(:clientCredentials = true), payload)
      response = getResponse(request)
      var tokenResponse = AuthHelper.handleAuthServerResponse(response)
      if (tokenResponse.get("active") != true) {
        throw "The id token is not active."
      }
      result = new AuthTokenAuthenticationSource(tokenResponse)
    } finally {
      closeResponse(response)
    }
    return result
  }

  private function getPayloadMap(code : String) : Map<String, String> {
    var payloadMap : Map<String, String> = {
        "client_id" -> _clientId,
        "client_secret" -> _clientSecret,
        "grant_type" -> AuthHelper.GrantType,
        "response_type" -> AuthHelper.ResponseTypeCode,
        "redirect_uri" -> _redirectUri,
        "code" -> code
    }
    return payloadMap
  }

  private function getIntrospectPayloadMap(token : String, tokenType : String) : Map<String, String> {
    var payloadMap : Map<String, String> = {
        "token" -> token,
        "token_type_hint" -> tokenType
    }
    return payloadMap
  }

  private function exchangeCodeForToken(payload : Map<String, String>, headers : Headers) : String {
    if (isInvalidPayload(payload)) {
      throw new IllegalArgumentException("Payload cannot be empty or null. Check payload for request to ${_tokenServiceUri}")
    }
    var response : Response
    var result : String
    try {
      var request = setupRequest(_tokenServiceUri, headers, payload)
      response = getResponse(request)
      var tokenResponse = AuthHelper.handleAuthServerResponse(response)
      result = tokenResponse.get("id_token") as String
    } finally {
      closeResponse(response)
    }
    return result
  }

  private function setupRequest(url : String, headers : Headers, content : Map<String, String>) : Request {
    var builder = (headers == null) ? new Request.Builder() : new Request.Builder().headers(headers)
    var formBodyBuilder = new FormBody.Builder()
    content.entrySet().forEach(\entry -> formBodyBuilder.add(entry.getKey(), entry.getValue()))
    var requestBody = formBodyBuilder.build()
    var request = builder
        .url(url)
        .post(requestBody)
        .build()
    return request
  }

  private function isInvalidPayload(payload : Map<String, String>) : boolean {
    return payload == null || payload.Empty
  }

  private function getResponse(request : Request) : Response {
    var client = new OkHttpClient()
    return client.newCall(request).execute()
  }

  /**
   * Wrap closing the response in case an error was returned, in which case attempting to close the connection
   * will throw an IllegalStateException
   */
  private function closeResponse(response : Response) {
    try {
      response?.close()
    } catch (e : IllegalStateException) {
      AuthHelper.IL.logError(MARKER, "IllegalStateException when closing response", e)
    }
  }

  override property set Parameters(params : Map) {
    _redirectUri = params["redirectUri"] as String
    _tokenServiceUri = params["tokenServiceUri"] as String
    _introspectServiceUri = params["introspectServiceUri"] as String
    initializeCredentials()
  }

  private function initializeCredentials() {
    var credentialsPlugin = Plugins.get(CredentialsPlugin)
    if(credentialsPlugin == null){
      return
    }
    var product = ServerUtil.Product.ProductCode.toLowerCase()
    var credentialsKey = String.format(GUIDEWIRE_CC_AUTHENTICATION_CLIENT_KEY, new Object[]{product})

    var credentials = credentialsPlugin.retrieveUsernameAndPassword(credentialsKey)
    if (credentials == null) {
      AuthHelper.IL.logError(MARKER, "Unable to find value for key " + credentialsKey)
      throw "Unable to get authentication credentials."
    }
    _clientId = credentials.getUsername()
    _clientSecret = credentials.getPassword()
    _clientCredentials = Base64.Encoder.encodeToString((_clientId + ":" + _clientSecret).Bytes)
  }
}
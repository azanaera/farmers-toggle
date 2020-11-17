package gw.auth

uses com.fasterxml.jackson.databind.ObjectMapper
uses gw.api.intentionallogging.IntentionalLogger
uses gw.api.system.PLLoggerCategory
uses okhttp3.Response

uses javax.servlet.http.HttpServletRequest

class AuthHelper {
  public static final var IL : IntentionalLogger = IntentionalLogger.from(PLLoggerCategory.PLUGIN)

  public static final var SESSION_ATTRIBUTE_OAUTH_STATE : String = "OAuth-State"
  public static final var SESSION_ATTRIBUTE_OAUTH_NONCE : String = "OAuth-Nonce"
  public static final var SESSION_ATTRIBUTE_OAUTH_CODE : String = "OAuth-Code"
  public static final var SESSION_ATTRIBUTE_OAUTH_ERROR : String = "OAuth-Error"
  public static final var SESSION_ATTRIBUTE_FILTER_ACTIVE : String = "OAuth-Filter-Active"

  private static var _grant_type : String as readonly GrantType = "authorization_code"
  private static var _response_type_code : String as readonly ResponseTypeCode = "code"

  static function displayLoginFields() : boolean {
    var req = com.guidewire.pl.system.dependency.PLDependencies.getWebController().getRequestInfo().getRequestWrapper().getRequest()
    var filterActive = req.getSession(true).getAttribute(SESSION_ATTRIBUTE_FILTER_ACTIVE) as String
    var filterActiveBoolean = false
    if (filterActive != null) {
      filterActiveBoolean = Boolean.parseBoolean(filterActive)
    }
    return !filterActiveBoolean
  }

  static function storeErrorMessageInSession(req : HttpServletRequest) {
    if (req == null) {
      req = com.guidewire.pl.system.dependency.PLDependencies.getWebController().getRequestInfo().getRequestWrapper().getRequest()
    }
    req.getSession(true).setAttribute(SESSION_ATTRIBUTE_OAUTH_ERROR, "An error occurred during authentication. Please contact your system administrator.")
  }

  static function hasErrorMessage() : boolean {
    var message = errorMessage()
    return message != null && message.trim().length() > 0
  }

  /**
   * Extract the OAuth error message from the session by directly accessing the session.
   *
   * @return the error message if there is one, otherwise null.
   */
  static function errorMessage() : String {
    return com.guidewire.pl.system.dependency.PLDependencies.getWebController().getRequestInfo().getRequestWrapper().getRequest().getSession(true).getAttribute(SESSION_ATTRIBUTE_OAUTH_ERROR) as String
  }

  static function message(loginFormMessage : String) : String {
    if (loginFormMessage != null && !loginFormMessage.isBlank()) {
      return loginFormMessage
    }
    if (hasErrorMessage()) {
      return errorMessage()
    }
    return null
  }

  @Throws(Exception, "If there is an error in the responseMap after calling the Auth Server")
  static function checkAuthServerResponseForErrors(responseMap : Map<String, Object>) {
    //Check for errors, the format from Okta appears to vary, so check for both forms.
    var error = responseMap.get("errorCode") as String
    var errorDescription : String
    if (error != null) {
      errorDescription = responseMap.get("errorSummary") as String
    } else {
      error = responseMap.get("error") as String
      errorDescription = responseMap.get("error_description") as String
    }
    if (error != null) {
      throw "An error occurred while calling the Auth Server. " + error + "; " + errorDescription
    }
  }

  @Throws(Exception, "If there is an error contained in the response body.")
  static function handleAuthServerResponse(response : Response) : Map<String, Object> {
    var responseString = response.body()?.string()
    var mapper = new ObjectMapper()
    var tokenResponse = mapper.readValue(responseString, Map<String, Object>)

    if (!response.isSuccessful()) {
      checkAuthServerResponseForErrors(tokenResponse)
    }
    return tokenResponse
  }
}
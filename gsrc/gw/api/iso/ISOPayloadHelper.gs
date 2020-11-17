package gw.api.iso


uses gw.api.util.DisplayableException
uses gw.plugin.Plugins
uses gw.plugin.credentials.CredentialsPlugin
uses gw.surepath.suite.integration.logging.StructuredLogger
uses gw.webservice.cc.system.integration.messaging.isoxmlwebservice.xmlsoap.ISOXmlWebService
uses gw.webservice.cc.system.integration.messaging.isoxmlwebservice.xmlsoap.soapheaders.VaildateSchemaHeaders
uses gw.webservice.cc.system.integration.messaging.isoxmlwebservice.xmlsoap.soapheaders.SubmitToISOHeaders
uses gw.webservice.cc.system.integration.messaging.isoxmlwebservice.xmlsoap_xsd1.ISOLogin
uses gw.xml.ws.WsdlConfig

/**
 * Provides a utility for sending a request to the ISO web service
 *
 * @author jhuang
 */
@Export
class ISOPayloadHelper {
  private static var _logger = StructuredLogger.INTEGRATION
  public static function sendToISO(xml : String, properties : ISOProperties) : String {
    try {
      var service = new ISOXmlWebService()
      var overrideUrl = properties.getConnectionURL()
      service.Config.ServerOverrideUrl = overrideUrl
      setAuthenticationProperties(service.Config, properties)
      var isoLogin = new ISOLogin()
      var cred = gw.plugin.credentials.CredentialsUtil.getCredentialsFromPlugin("iso")
      isoLogin.setUserName(cred.getUsername())
      isoLogin.setPassword(cred.getPassword())
      return properties.shouldExpectResponses() ? service.SubmitToISO(xml, createHeaders(isoLogin)) : service.VaildateSchema(xml, createTestHeaders(isoLogin))
    }
    catch (e : Exception) {
      throw new ISOCommunicationException("Could not connect to ISO SOAP service", e, true)
    }
  }
 /* Set the ISO Basic Authentication Properties from secret manager instead of from ISO.properties.
    Value for key "iso.http.authentication" in secret manager must be ":" if  no extra request header required to be added.
  */
  private static function setAuthenticationProperties(config : WsdlConfig, properties : ISOProperties) {
   try{
     var cred = gw.plugin.credentials.CredentialsUtil.getCredentialsFromPlugin("iso.http.authentication")
     if (cred.getUsername() != "" and cred.getPassword() != "") {
       config.Http.Authentication.Basic.Username = cred.getUsername()
       config.Http.Authentication.Basic.Password = cred.getPassword()
     }
   }catch (e:Exception){
     _logger.error("Exception retrieving credentials", #setAuthenticationProperties(WsdlConfig, ISOProperties), e )
   }
  }

  private static function createHeaders(isoLogin : ISOLogin) : SubmitToISOHeaders {
    var headers = new SubmitToISOHeaders()
    headers.setISOLogin(isoLogin)
    return headers
  }
  private static function createTestHeaders(isoLogin : ISOLogin) : VaildateSchemaHeaders {
    var testHeaders = new VaildateSchemaHeaders()
    testHeaders.setISOLogin(isoLogin)
    return testHeaders
  }

}

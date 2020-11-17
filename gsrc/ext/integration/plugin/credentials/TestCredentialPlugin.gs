package ext.integration.plugin.credentials

uses gw.api.util.DisplayableException
uses gw.plugin.credentials.UsernamePasswordPairBase
uses gw.surepath.suite.integration.credentials.SecretsManagerCredentialsPlugin
uses gw.surepath.suite.integration.credentials.SecretsManagerService
uses gw.surepath.suite.integration.logging.StructuredLogger

class TestCredentialPlugin extends SecretsManagerCredentialsPlugin {
  private static var _logger = StructuredLogger.INTEGRATION
   /**
   * Provides hardcoded Dummy test value for key "ISO". To be used only for build test execution or in test environment.
   * Retrieve username and password credentials from AWS Secrets Manager. Credentials are cached in order to limit
   * per call costs. A plugin parameter (between 1 and 60 minutes) controls how frequently the cache is refreshed.
   * Credentials in AWS Secrets Manager must be stored as username and password separated by a colon.
   * @param key the credentials key (should be lower case, with words seperated by periods).
   * @return the username and password credentials.
   */
  override function retrieveUsernameAndPassword(key : String) : UsernamePasswordPairBase {
    var credentials : UsernamePasswordPairBase
    try {
      key = key.toLowerCase().trim()
      var secret:String
      if(key.equals("iso")){
        secret = "TESTUSER:TESTPAS"
      } else if (key.equals("wsi.remote.gw.webservice.ab.configurationprovider")){
        secret = "ClientAppCC:gw"
      }
      else{
        secret = SecretsManagerService.getSensitiveProperty(key)}
      var components = secret.split(":", 2)
      if (components.length != 2) {
        throw "Credentials must consist of a username and password seperated by a colon"
      }
      credentials = new UsernamePasswordPairBase(components[0].trim(), components[1].trim())
    }
    catch (e : Exception) {
      _logger.error("Exception retrieving credentials", #retrieveUsernameAndPassword(), e, :parameters={"Key" -> key})
      throw new DisplayableException("Unexpected exception retrieving credentials", e)
    }
    return credentials
  }

}
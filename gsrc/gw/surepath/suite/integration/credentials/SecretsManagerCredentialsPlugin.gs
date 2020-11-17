package gw.surepath.suite.integration.credentials

uses gw.api.util.DisplayableException
uses gw.plugin.InitializablePlugin
uses gw.plugin.credentials.CredentialsPlugin
uses gw.plugin.credentials.UsernamePasswordPairBase
uses gw.surepath.suite.integration.logging.StructuredLogger

/**
 * Implementation of CredentialsPlugin using AWS Secrets Manager.
 */
class SecretsManagerCredentialsPlugin implements CredentialsPlugin, InitializablePlugin {

  private static var _logger = StructuredLogger.INTEGRATION

  /**
   * Construct the plugin.
   */
  public construct() { }

  /**
   * Set the plugin parameters. The following parameters are expected:
   *   "AWSRegion" represents the AWS Region (required).
   *   "RefreshInterval" represents the cache refresh interval (in minutes), and should be between 1 and 60.
   *
   * The refresh interval defaults to 1 minute if not specified.
   *
   * @param map parameter map.
   */
  override property set Parameters(map : Map) {
    var region = map.get("AWSRegion") as String
    var secrets = map.get("AWSSecretNames") as String

    var minutes = map.get("RefreshInterval") as Long ?: 1
    minutes = Math.max(1, minutes)
    minutes = Math.min(60, minutes)
    var interval = minutes * 60000

    // Set parameters for SecretsManagerService
    SecretsManagerService._awsRegion = region
    SecretsManagerService._awsSecretNames = secrets.split(",")
    SecretsManagerService._refreshInterval = interval

    _logger.info("Credentials plugin initialized",
        :parameters={"AWS Region" -> region, "AWS Secret Names" -> secrets, "Refresh Interval" -> minutes as String})
  }

  /**
   * Retrieve username and password credentials from AWS Secrets Manager. Credentials are cached in order to limit
   * per call costs. A plugin parameter (between 1 and 60 minutes) controls how frequently the cache is refreshed.
   * Credentials in AWS Secrets Manager must be stored as username and password separated by a colon.
   *
   * @param key the credentials key (should be lower case, with words seperated by periods).
   * @return the username and password credentials.
   */
  override function retrieveUsernameAndPassword(key : String) : UsernamePasswordPairBase {
    var credentials : UsernamePasswordPairBase
    try {
      key = key.toLowerCase().trim()
      var secret = SecretsManagerService.getSensitiveProperty(key)
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
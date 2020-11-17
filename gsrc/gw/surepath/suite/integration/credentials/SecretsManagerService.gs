package gw.surepath.suite.integration.credentials

uses com.amazonaws.services.secretsmanager.AWSSecretsManagerClientBuilder
uses com.amazonaws.services.secretsmanager.model.GetSecretValueRequest
uses gw.api.util.DisplayableException
uses gw.plugin.Plugins
uses gw.plugin.credentials.CredentialsPlugin
uses gw.surepath.suite.integration.logging.StructuredLogger
uses org.json.JSONObject

uses java.util.concurrent.ConcurrentHashMap

class SecretsManagerService {
  private static var _initialized = initializePlugin()
  private static var _secretsCache = new ConcurrentHashMap<String, String>()
  private static var _lastRefreshTime : long = 0
  private static var _logger = StructuredLogger.INTEGRATION

  internal static var _refreshInterval : long = 1
  internal static var _awsRegion : String
  internal static var _awsSecretNames : String[]

  private static function initializePlugin() : boolean {
    // Force credentials plugin to initialize
    var plugin = Plugins.get(CredentialsPlugin)
    return true
  }

  /**
   * Get the value for a sensitive property from AWS Secrets Manager.
   *
   * @param key the sensitive property key.
   * @return the value of the sensitive property.
   */
  public static function getSensitiveProperty(key : String) : String {
    checkCacheExpiration()
    key = key.toLowerCase().trim()
    var sensitive = _secretsCache.get(key)
    if (sensitive == null) {
      _logger.warn("Sensitive property not found", #getSensitiveProperty(), :parameters={"Key" -> key})
      throw new DisplayableException("Sensitive property not found")
    }
    return sensitive
  }

  private static function checkCacheExpiration() {
    var currentTime = System.currentTimeMillis()
    if ((currentTime - _lastRefreshTime) > _refreshInterval) {
      var newCache = new ConcurrentHashMap<String, String>()
      for (name in _awsSecretNames) {
        newCache.putAll(retrieveAWSSecrets(name))
      }
      _secretsCache = newCache
      _lastRefreshTime = currentTime
      _logger.debug("Refreshed secrets cache")
    }
  }

  private static function retrieveAWSSecrets(name : String) : HashMap<String, String> {
    try {
      name = name.trim()
      _logger.debug("Retrieving AWS secrets", :parameters={"Name" -> name})
      var client = AWSSecretsManagerClientBuilder.standard().withRegion(_awsRegion).build()
      var rqst = new GetSecretValueRequest()
      rqst.setSecretId(name)
      var result = client.getSecretValue(rqst)
      var json = new JSONObject(result.getSecretString())
      var secrets = new HashMap<String, String>()
      var keys = json.keys() as Iterator<String>
      for (key in keys) {
        secrets.put(key, json.getString(key))
      }
      return secrets
    }
    catch (e : Exception) {
      _logger.warn("Unable to retrieve AWS secret", #retrieveAWSSecrets(), :parameters={"Secret Name" -> name})
      return new HashMap<String, String>()
    }
  }
}
package ext.integration.helper

uses com.box.sdk.BoxAPIConnection
uses com.box.sdk.BoxAPIResponseException
uses com.box.sdk.BoxConfig
uses com.box.sdk.BoxDeveloperEditionAPIConnection
uses gw.api.locale.DisplayKey
uses gw.api.system.server.ServerUtil
uses gw.surepath.suite.integration.credentials.SecretsManagerService
uses gw.surepath.suite.integration.logging.StructuredLogger

uses java.io.FileReader
uses java.io.IOException
uses java.io.StringReader

class BoxAPIConnectionHelper_Ext {
  private static final var _logger = StructuredLogger.INTEGRATION
  private static final var LOCAL = "local"
  private static final var IS_LOCAL = ServerUtil.Env.equalsIgnoreCase(LOCAL) or ServerUtil.Env.equalsIgnoreCase("h2mem")
  private static final var BOX_CONFIG_FILE_LOCATION = "./box_config.json"
  private static final var BOX_CONFIG_JSON = "box.configuration"

  /**
   * Establishes the API connetion to BOX for DMS. The credentials are handled from the
   * Secret Manager on the Guidewire Cloud Console environment. Setting up on local
   * requires the box credentials config json to be present in the root directory
   * @returns Box API connection to be used for API function calls
   */
  static function getBoxAPIConnection() : BoxAPIConnection {
    _logger.info("Initiating Connection to Box API", :method=#getBoxAPIConnection())
    var api : BoxAPIConnection
    var boxConfig: BoxConfig

    if(IS_LOCAL){
      _logger.warn("BOX API Connection is unavailable on Local Environment ", :method = #getBoxAPIConnection())
      throw new gw.api.util.DisplayableException("BOX API Connection is unavailable on Local Environment")
    } else{
      try {
        var boxConfigJson = SecretsManagerService.getSensitiveProperty(BOX_CONFIG_JSON).trim()
        var reader = new StringReader(boxConfigJson)
        boxConfig = BoxConfig.readFrom(reader)
        _logger.info("Reading Box credentials Json config file from Secret Manager  ", :method = #getBoxAPIConnection())
      }catch(ex: IOException) {
        _logger.error("Error reading configuration from Secret Manager", :method = #getBoxAPIConnection())
        throw new gw.api.util.DisplayableException("Error reading configuration from Secret Manager")
      }
    }
    api = BoxDeveloperEditionAPIConnection.getAppEnterpriseConnection(boxConfig);
    _logger.info("Box Connection availability ", { },{"API not Null" -> (api !=null) as String}, :method=#getBoxAPIConnection())

    try{
      api = BoxDeveloperEditionAPIConnection.getAppEnterpriseConnection(boxConfig);
    }
    catch(exception : BoxAPIResponseException){
      _logger.error("Error Response from BOX API ", #getBoxAPIConnection(), exception, {exception.StackTrace})
      BoxExceptionHandler_Ext.handleBoxResponseExceptions(exception)
    }
    catch(exception : Exception){
      _logger.error("Error in establishing BOX API Connection  ", #getBoxAPIConnection(), exception, {exception.StackTrace})
      throw new gw.api.util.DisplayableException(DisplayKey.get("Toggle.LV.Claim.Documents.Document.APIError_Ext")+ exception.Message)
    }
    if(api== null){
      throw new gw.api.util.DisplayableException("API Connection Unsuccessful")
    }
    return api
  }
}
package gw.surepath.suite.integration.credentials

uses gw.api.system.server.ServerUtil
uses gw.plugin.Plugins
uses gw.plugin.credentials.CredentialsPlugin
uses gw.plugin.dbauth.DBAuthenticationPlugin
uses gw.plugin.dbauth.UsernamePasswordPair
uses gw.surepath.suite.integration.logging.StructuredLogger

/**
 * Database authentication plugin that retrieves credentials using the CredentialsPlugin.
 */
class DatabaseAuthenticationPlugin implements DBAuthenticationPlugin {
  private static var _logger = StructuredLogger.INTEGRATION

  /**
   * Retrieve database authentication credentials using the CredentialsPlugin. The credentials key that is
   * retrieved is "guidewire.xx.database", where "xx" is the InsuranceSuite product code.
   *
   * @param name the database name (not used).
   * @return database authentication credentials.
   */
  override function retrieveUsernameAndPassword(name : String) : UsernamePasswordPair {
    try {
      var plugin = Plugins.get(CredentialsPlugin)
      var product = ServerUtil.Product.ProductCode.toLowerCase()
      var credentials = plugin.retrieveUsernameAndPassword("guidewire.${product}.database")
      return new UsernamePasswordPair(credentials.Username, credentials.Password)
    }
    catch (e : Exception) {
      _logger.warn("Database authentication credentials not found", #retrieveUsernameAndPassword())
      return null
    }
  }
}
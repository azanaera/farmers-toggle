package wsi.remote.gw.webservice.ab

uses javax.xml.namespace.QName

uses gw.plugin.Plugins
uses gw.plugin.credentials.CredentialsPlugin
uses gw.surepath.suite.integration.credentials.SecretsManagerCredentialsPlugin
uses gw.surepath.suite.integration.logging.StructuredLogger
uses gw.xml.ws.WsdlConfig
uses gw.xml.ws.IWsiWebserviceConfigurationProvider

@Export
/**
 * Use this class to specify authentication for WSI web services that talk to ContactManager.
 */
class ABConfigurationProvider implements IWsiWebserviceConfigurationProvider {
  private static var _logger = StructuredLogger.INTEGRATION

  override function configure( serviceName : QName, portName : QName, config : WsdlConfig ){
    try {
      var cred = gw.plugin.credentials.CredentialsUtil.getCredentialsFromPlugin("wsi.remote.gw.webservice.ab.configurationprovider")
      config.Guidewire.Authentication.Username = cred.Username
      config.Guidewire.Authentication.Password = cred.Password
    } catch (e : Exception) {
      _logger.error("Authentication for WSI web services that talk to ContactManager not found", ABConfigurationProvider#configure(QName, QName, WsdlConfig))
    }
  }

}

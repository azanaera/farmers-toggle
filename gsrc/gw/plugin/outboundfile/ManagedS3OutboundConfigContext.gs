package gw.plugin.outboundfile

uses com.guidewire.outboundfile.OutboundFileHandler
uses com.guidewire.properties.iofile.AbstractConfigFileContext
uses com.guidewire.properties.iofile.ConfigFileHandlerValidator
uses gw.api.database.Queries
uses gw.api.database.Query
uses gw.api.database.Relop
uses gw.plugin.outboundfile.xsd.outbound_file_configuration_ext.OutboundConfigurations
uses gw.plugin.outboundfile.xsd.outbound_file_configuration_ext.types.complex.ManagedS3OutboundConfiguration

uses java.io.File

@SuppressWarnings({"HiddenPackageReference"})
public class ManagedS3OutboundConfigContext extends AbstractConfigFileContext<OutboundFileS3Config, ManagedS3OutboundConfiguration> {

  private final var _s3BucketName : String
  private final var _s3OutputPrefix : String
  private final var _temporaryDir : String

  construct(s3BucketName : String, s3OutputPrefix : String, temporaryDir : String) {
    _s3BucketName = s3BucketName
    _s3OutputPrefix = s3OutputPrefix
    _temporaryDir = temporaryDir
  }

  override public function parseConfigFile(fileToRead : File) : List<ManagedS3OutboundConfiguration> {
    var configs = OutboundConfigurations.parse(fileToRead)
    return getS3Configurations(configs)
  }

  private function getS3Configurations(outboundConfigurations : OutboundConfigurations) : List<ManagedS3OutboundConfiguration> {
    return outboundConfigurations.ManagedS3Configuration.map(\c -> c.$TypeInstance)
  }

  override protected function validateConfigFileHandlerClass(xmlConfig : ManagedS3OutboundConfiguration) : void {
    ConfigFileHandlerValidator.validate(xmlConfig.getFileHandlerClass(), OutboundFileHandler)
  }

  override protected function findConfig(xmlConfig : ManagedS3OutboundConfiguration) : Optional<OutboundFileS3Config> {
    var query = Queries.createQuery(OutboundFileS3Config.TYPE.get()) as Query<OutboundFileS3Config>
    query.compare(OutboundFileS3Config.NAME_PROP.get(), Relop.Equals, xmlConfig.getName())
    return Optional.ofNullable(query.select().getAtMostOneRow())
  }

  override protected function createConfigFromXml(xmlConfig : ManagedS3OutboundConfiguration) : OutboundFileS3Config {
    var config = new OutboundFileS3Config()
    copyValues(config, xmlConfig)
    return config
  }

  override protected function copyValues(config : OutboundFileS3Config, xmlConfig : ManagedS3OutboundConfiguration) : void {
    copyConfigurableValues(config, xmlConfig)
    setManagedS3Values(config, xmlConfig.getName())
  }

  private function copyConfigurableValues(config : OutboundFileS3Config, xmlConfig : ManagedS3OutboundConfiguration) : void {
    config.setName(xmlConfig.getName())
    config.setFileHandlerClass(xmlConfig.getFileHandlerClass())
    config.setDaysTillPurge(xmlConfig.getDaysTillPurge().intValue())
    config.setExtension(xmlConfig.getExtension())
    config.setPrefix(xmlConfig.getPrefix())
  }

  private function setManagedS3Values(config : OutboundFileS3Config, configName : String) : void {
    config.setDestinationS3Bucket(_s3BucketName)
    config.setDestinationS3Prefix("${_s3OutputPrefix}/${configName}")
    config.setTemporaryDirectory(_temporaryDir)
  }
}
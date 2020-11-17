package gw.plugin.inboundfile

uses com.guidewire.inboundfile.handler.InboundFileHandler
uses com.guidewire.properties.iofile.AbstractConfigFileContext
uses com.guidewire.properties.iofile.ConfigFileHandlerValidator
uses gw.api.database.Queries
uses gw.api.database.Query
uses gw.api.database.Relop
uses gw.plugin.inboundfile.xsd.inbound_file_configuration_ext.InboundConfigurations
uses gw.plugin.inboundfile.xsd.inbound_file_configuration_ext.types.complex.ManagedS3InboundConfiguration
uses org.apache.commons.lang3.StringUtils

uses java.io.File

@SuppressWarnings({"HiddenPackageReference"})
public class ManagedS3InboundConfigContext extends AbstractConfigFileContext<InboundS3FileConfig, ManagedS3InboundConfiguration> {

  private final var _s3BucketName : String
  private final var _s3InputPrefix : String
  private final var _s3ArchivePrefix : String

  construct(s3BucketName : String, s3InputPrefix : String, s3ArchivePrefix : String) {
    _s3BucketName = s3BucketName
    _s3InputPrefix = s3InputPrefix
    _s3ArchivePrefix = s3ArchivePrefix
  }

  override public function parseConfigFile(fileToRead : File) : List<ManagedS3InboundConfiguration> {
    var configs = InboundConfigurations.parse(fileToRead)
    return getS3Configurations(configs)
  }

  private function getS3Configurations(inboundConfigurations : InboundConfigurations) : List<ManagedS3InboundConfiguration> {
    return inboundConfigurations.ManagedS3Configuration.map(\c -> c.$TypeInstance)
  }

  override protected function validateConfigFileHandlerClass(xmlConfig : ManagedS3InboundConfiguration) : void {
    ConfigFileHandlerValidator.validate(xmlConfig.getFileHandlerClass(), InboundFileHandler)
  }

  override protected function findConfig(xmlConfig : ManagedS3InboundConfiguration) : Optional<InboundS3FileConfig> {
    var query = Queries.createQuery(InboundS3FileConfig.TYPE.get()) as Query<InboundS3FileConfig>
    query.compare(InboundS3FileConfig.NAME_PROP.get(), Relop.Equals, xmlConfig.getName())
    return Optional.ofNullable(query.select().getAtMostOneRow())
  }

  override protected function createConfigFromXml(xmlConfig : ManagedS3InboundConfiguration) : InboundS3FileConfig {
    var config = new InboundS3FileConfig()
    copyValues(config, xmlConfig)
    return config
  }

  override protected function copyValues(config : InboundS3FileConfig, xmlConfig : ManagedS3InboundConfiguration) : void {
    copyConfigurableValues(config, xmlConfig)
    setManagedS3Values(config, xmlConfig.getName())
  }

  private function copyConfigurableValues(config : InboundS3FileConfig, xmlConfig : ManagedS3InboundConfiguration) : void {
    config.setName(xmlConfig.getName())
    config.setFileHandlerClass(xmlConfig.getFileHandlerClass())
    config.setChunkSize(xmlConfig.getChunkSize().intValue())
    config.setDaysTillPurge(xmlConfig.getDaysTillPurge().intValue())
  }

  private function setManagedS3Values(config : InboundS3FileConfig, configName : String) : void {
    config.setInputS3Bucket(_s3BucketName)
    config.setArchiveS3Bucket(_s3BucketName)
    config.setInputS3Prefix("${_s3InputPrefix}/${configName}")
    config.setArchiveS3Prefix("${_s3ArchivePrefix}/${configName}")
  }
}
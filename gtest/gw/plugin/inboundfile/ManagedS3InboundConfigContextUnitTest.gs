package gw.plugin.inboundfile

uses gw.api.test.CCUnitTestClassBase
uses gw.pl.util.FileUtil
uses gw.plugin.inboundfile.xsd.inbound_file_configuration_ext.types.complex.ManagedS3InboundConfiguration
uses gw.suites.ManagedS3InboundConfigUnitSuite
uses gw.testharness.v3.Suites
uses org.apache.commons.lang3.RandomStringUtils

uses java.io.File
uses java.io.PrintWriter

@Suites(ManagedS3InboundConfigUnitSuite.NAME)
class ManagedS3InboundConfigContextUnitTest extends CCUnitTestClassBase {

  public function testParseConfigFile() {
    //given
    var integrationName = "some-integration"
    var handler = "gw.SomeHandler"
    var chunkSize = 0
    var daysTillPurge = 0
    var sampleConfigXml = createSampleManagedS3InboundConfigXml(integrationName, handler, chunkSize, daysTillPurge)

    var tempDir = createTempDir()
    var sampleConfigFile = createSampleManagedS3InboundConfigFile(tempDir, "SampleConfig.xml", sampleConfigXml);

    var s3BucketName = "some-bucket"
    var s3InputPrefix = "input/prefix"
    var s3ArchivePrefix = "archive/prefix"
    var contextUnderTest = new ManagedS3InboundConfigContext(s3BucketName, s3InputPrefix, s3ArchivePrefix)

    //when
    var configs = contextUnderTest.parseConfigFile(sampleConfigFile)

    //then
    assertEquals("Expected one configuration", 1, configs.size())
    var config = configs.get(0)
    assertEquals("Expected configs to be of type ManagedS3InboundConfiguration", ManagedS3InboundConfiguration.Type, typeof config)
    assertEquals("Expected parsed config name to be the same as in the XML config", integrationName, config.Name)
    assertEquals("Expected parsed config file handler to be the same as in the XML config", handler, config.FileHandlerClass)
    assertEquals("Expected parsed config chunk size parameter to be the same as in the XML config", chunkSize, config.ChunkSize.intValue())
    assertEquals("Expected parsed config days till purge parameter to be the same as in the XML config", daysTillPurge, config.DaysTillPurge.intValue())

    //cleanup
    tempDir.delete()
  }


  private function createSampleManagedS3InboundConfigXml(name : String, handler : String, chunkSize: int, daysTillPuge : int) : String {
    return "<?xml version=\"1.0\"?>" +
        "<InboundConfigurations xmlns=\"http://guidewire.com/inbound/ext\">" +
        " <ManagedS3Configuration>" +
        "  <Name>${name}</Name>" +
        "  <FileHandlerClass>${handler}</FileHandlerClass>" +
        "  <ChunkSize>${chunkSize}</ChunkSize>" +
        "  <DaysTillPurge>${daysTillPuge}</DaysTillPurge>" +
        " </ManagedS3Configuration>" +
       "</InboundConfigurations>";
  }

  private function createTempDir() : File {
    var randomSuffix = RandomStringUtils.randomAlphabetic(5);
    return FileUtil.createTempDir("ManagedS3InboundConfigTest-${randomSuffix}")
  }

  private function createSampleManagedS3InboundConfigFile(parentDir : File, name : String, content : String) : File {
    var configFile = new File(parentDir, name)
    var writer = new PrintWriter(configFile)
    try {
      writer.print(content);
    } finally {
      writer.close()
    }
    return configFile
  }
}
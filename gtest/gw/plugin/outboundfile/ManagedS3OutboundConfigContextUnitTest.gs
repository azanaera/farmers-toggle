package gw.plugin.outboundfile

uses gw.api.test.CCUnitTestClassBase
uses gw.pl.util.FileUtil
uses gw.plugin.outboundfile.xsd.outbound_file_configuration_ext.types.complex.ManagedS3OutboundConfiguration
uses gw.suites.ManagedS3OutboundConfigUnitSuite
uses gw.testharness.v3.Suites
uses org.apache.commons.lang3.RandomStringUtils

uses java.io.File
uses java.io.PrintWriter

@Suites(ManagedS3OutboundConfigUnitSuite.NAME)
class ManagedS3OutboundConfigContextUnitTest extends CCUnitTestClassBase {

  public function testParseConfigFile() {
    //given
    var integrationName = "some-integration"
    var handler = "gw.SomeHandler"
    var daysTillPurge = 0
    var prefix = "pref"
    var extension = "xml"
    var tempDir = createTempDir()

    var sampleConfigXml = createSampleManagedS3OutboundConfigXml(integrationName, handler, daysTillPurge, prefix, extension)

    var sampleConfigFile = createSampleManagedS3OutboundConfigFile(tempDir, "SampleConfig.xml", sampleConfigXml);

    var s3BucketName = "some-bucket"
    var s3OutputPrefix = "Output/prefix"
    var contextUnderTest = new ManagedS3OutboundConfigContext(s3BucketName, s3OutputPrefix, tempDir.Name)

    //when
    var configs = contextUnderTest.parseConfigFile(sampleConfigFile)

    //then
    assertEquals("Expected one configuration", 1, configs.size())
    var config = configs.get(0)
    assertEquals("Expected configs to be of type ManagedS3OutboundConfiguration", ManagedS3OutboundConfiguration.Type, typeof config)
    assertEquals("Expected parsed config name to be the same as in the XML config", integrationName, config.Name)
    assertEquals("Expected parsed config file handler to be the same as in the XML config", handler, config.FileHandlerClass)
    assertEquals("Expected parsed config days till purge parameter to be the same as in the XML config", daysTillPurge, config.DaysTillPurge.intValue())
    assertEquals("Expected parsed config prefix parameter to be the same as in the XML config", prefix, config.Prefix)
    assertEquals("Expected parsed config extension parameter to be the same as in the XML config", extension, config.Extension)
    assertEquals("Expected parsed config prefix parameter to be the same as in the XML config", prefix, config.Prefix)

    //cleanup
    tempDir.delete()
  }


  private function createSampleManagedS3OutboundConfigXml(name : String, handler : String, daysTillPuge : int, prefix : String,
                                                          extension : String) : String {
    return "<?xml version=\"1.0\"?>" +
        "<OutboundConfigurations xmlns=\"http://guidewire.com/outbound/ext\">" +
        " <ManagedS3Configuration>" +
        "  <Name>${name}</Name>" +
        "  <Prefix>${prefix}</Prefix>" +
        "  <Extension>${extension}</Extension>" +
        "  <FileHandlerClass>${handler}</FileHandlerClass>" +
        "  <DaysTillPurge>${daysTillPuge}</DaysTillPurge>" +
        " </ManagedS3Configuration>" +
        "</OutboundConfigurations>";
  }

  private function createTempDir() : File {
    var randomSuffix = RandomStringUtils.randomAlphabetic(5);
    return FileUtil.createTempDir("ManagedS3OutboundConfigTest-${randomSuffix}")
  }

  private function createSampleManagedS3OutboundConfigFile(parentDir : File, name : String, content : String) : File {
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
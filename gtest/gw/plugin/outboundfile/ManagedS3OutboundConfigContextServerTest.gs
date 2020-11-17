package gw.plugin.outboundfile

uses gw.api.test.CCServerTestClassBase
uses gw.plugin.outboundfile.xsd.outbound_file_configuration_ext.types.complex.ManagedS3OutboundConfiguration
uses gw.suites.ManagedS3OutboundConfigServerSuite
uses gw.testharness.v3.Suites

@Suites(ManagedS3OutboundConfigServerSuite.NAME)
class ManagedS3OutboundConfigContextServerTest extends CCServerTestClassBase {

  public function testCreateConfigFromXml() {
    //given
    var integrationName = "some-integration"
    var handler = "gw.SomeHandler"
    var daysTillPurge = 0
    var prefix = "pref"
    var extension = "xml"
    var s3BucketName = "some-bucket"
    var s3OutputPrefix = "some-prefix"
    var tempDir = "tmp"

    var managedS3OutboundConfigXml = new ManagedS3OutboundConfiguration()
    managedS3OutboundConfigXml.setName(integrationName)
    managedS3OutboundConfigXml.setFileHandlerClass(handler)
    managedS3OutboundConfigXml.setPrefix(prefix)
    managedS3OutboundConfigXml.setDaysTillPurge(daysTillPurge)
    managedS3OutboundConfigXml.setExtension(extension)

    var contextUnderTest = new ManagedS3OutboundConfigContext(s3BucketName, s3OutputPrefix, tempDir)

    //when
    var outboundConfig = contextUnderTest.createConfigFromXml(managedS3OutboundConfigXml)

    //then
    assertNotNull("Expected non-null reference", outboundConfig)
    assertEquals("Expected instance of OutboundS3FileConfig class", OutboundFileS3Config.Type, typeof outboundConfig)
    assertEquals("Expected the Name param to be the same as in the XML config", integrationName, outboundConfig.Name)
    assertEquals("Expected the FileHandlerClass param to be the same as in the XML config", handler, outboundConfig.FileHandlerClass)
    assertEquals("Expected the Prefix param to be the same as in the XML config", prefix, outboundConfig.Prefix)
    assertEquals("Expected the DaysTillPurge param to be the same as in the XML config", daysTillPurge, outboundConfig.DaysTillPurge.intValue())
    assertEquals("Expected the Extension param to be the same as in the XML config", extension, outboundConfig.Extension)
    assertEquals("Expected the TemporaryDirectory param to be the same as in the XML config", tempDir, outboundConfig.TemporaryDirectory)
    assertEquals("Expected the OutputBucketName param to be the same as the one passed to the context", s3BucketName,
        outboundConfig.DestinationS3Bucket)
    assertEquals("Expected the OutputS3Prefix param to be the <Output-prefix-passed-to-the-context>/<integration-name>",
        "${s3OutputPrefix}/${integrationName}", outboundConfig.DestinationS3Prefix)
  }
}
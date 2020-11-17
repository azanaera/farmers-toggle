package gw.plugin.inboundfile

uses gw.api.test.CCServerTestClassBase
uses gw.plugin.inboundfile.xsd.inbound_file_configuration_ext.types.complex.ManagedS3InboundConfiguration
uses gw.suites.ManagedS3InboundConfigServerSuite
uses gw.testharness.v3.Suites

@Suites(ManagedS3InboundConfigServerSuite.NAME)
class ManagedS3InboundConfigContextServerTest extends CCServerTestClassBase {

  public function testCreateConfigFromXml() {
    //given
    var integrationName = "some-integration"
    var handler = "gw.SomeHandler"
    var chunkSize = 0
    var daysTillPurge = 0
    var s3BucketName = "some-bucket"
    var s3InputPrefix = "some-prefix"
    var s3ArchivePrefix = "some-archive-prefix"

    var managedS3InboundConfigXml = new ManagedS3InboundConfiguration()
    managedS3InboundConfigXml.setName(integrationName)
    managedS3InboundConfigXml.setFileHandlerClass(handler)
    managedS3InboundConfigXml.setChunkSize(chunkSize)
    managedS3InboundConfigXml.setDaysTillPurge(daysTillPurge)

    var contextUnderTest = new ManagedS3InboundConfigContext(s3BucketName, s3InputPrefix, s3ArchivePrefix)

    //when
    var inboundConfig = contextUnderTest.createConfigFromXml(managedS3InboundConfigXml)

    //then
    assertNotNull("Expected non-null reference", inboundConfig)
    assertEquals("Expected instance of InboundS3FileConfig class", InboundS3FileConfig.Type, typeof inboundConfig)
    assertEquals("Expected the Name param to be the same as in the XML config", integrationName, inboundConfig.Name)
    assertEquals("Expected the FileHandlerClass param to be the same as in the XML config", handler, inboundConfig.FileHandlerClass)
    assertEquals("Expected the ChunkSize param to be the same as in the XML config", chunkSize, inboundConfig.ChunkSize.intValue())
    assertEquals("Expected the DaysTillPurge param to be the same as in the XML config", daysTillPurge, inboundConfig.DaysTillPurge.intValue())
    assertEquals("Expected the InputBucketName param to be the same as the one passed to the context", s3BucketName,
        inboundConfig.InputS3Bucket)
    assertEquals("Expected the ArchiveBucketName param to be the same as the InputBucketName passed to the context",
        s3BucketName, inboundConfig.ArchiveS3Bucket)
    assertEquals("Expected the InputS3Prefix param to be the <input-prefix-passed-to-the-context>/<integration-name>",
        "${s3InputPrefix}/${integrationName}", inboundConfig.InputS3Prefix)
    assertEquals("Expected the ArchiveS3Prefix param to be the <archive-prefix-passed-to-the-context>/<integration-name>",
        "${s3ArchivePrefix}/${integrationName}", inboundConfig.ArchiveS3Prefix)
  }
}
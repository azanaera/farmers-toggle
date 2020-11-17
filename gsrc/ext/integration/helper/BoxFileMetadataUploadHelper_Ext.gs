package ext.integration.helper

uses com.box.sdk.BoxAPIConnection
uses com.box.sdk.BoxAPIException
uses com.box.sdk.BoxAPIResponseException
uses com.box.sdk.BoxFile
uses com.box.sdk.Metadata
uses com.box.sdk.MetadataTemplate
uses ext.integration.box.BoxPropeties
uses gw.api.locale.DisplayKey
uses gw.surepath.suite.integration.logging.StructuredLogger

class BoxFileMetadataUploadHelper_Ext {
  /**
   * The template key is derived from the metadata-template that was created on the Box. The scope is set to
   * 'enterprise' which is the Box app setting.
   */

  private static final var _logger = StructuredLogger.INTEGRATION
  private static final var _properties = new BoxPropeties()

  /**
   * The metadata is uploaded one time to the uploading file based on a pre-defined Metadata template on Box-DMS.
   * The Metadatatemplate has fields, the values of which are added from the document metadata in ClaimCenter.
   * @param api
   * @param boxFileID
   * @param document
   */
  static function applyMetadata(api: BoxAPIConnection, boxFileID: String, document: Document) {
    var file : BoxFile
    var fileMetadata = new Metadata()
    fileMetadata.add("/name", document.getName())
    fileMetadata.add("/description", document.Description == null ? "" : document.Description )
    fileMetadata.add("/fileType", document.MimeType == null ? "" : document.MimeType)
    fileMetadata.add("/language", document.Language == null ? "" : document.Language.toString())
    fileMetadata.add("/section", document.Section == null ? "" : document.Section.toString() )
    fileMetadata.add("/relatedTo", document.RelatedTo == null ? "" : document.RelatedTo.toString())
    fileMetadata.add("/author", User.util.CurrentUser.DisplayName == null ? "" : User.util.CurrentUser.DisplayName )
    fileMetadata.add("/recipient", document.Recipient == null ? "" : document.Recipient )
    fileMetadata.add("/inbound", document.isInbound() == null ? "" : document.isInbound().toString() )
    fileMetadata.add("/status", document.Status == null ? "" : document.Status.toString() )
    fileMetadata.add("/securityType", document.getSecurityType() == null ? "" :  document.getSecurityType().toString() )
    fileMetadata.add("/documentType", document.Type == null ? "" : document.Type.toString())
    fileMetadata.add("/receivedDate", document.ReceivedDate_Ext == null ? "" : document.ReceivedDate_Ext.toString())
    _logger.info("Uploading Metadata from BOX API " , {document} , :method = #applyMetadata())

    try {
      file = new BoxFile(api, boxFileID);
      file.setMetadata(_properties.BoxTemplateKey, _properties.BoxScope, fileMetadata)
    } catch (exception : BoxAPIResponseException) {
      _logger.error("Error Response from BOX API " , #applyMetadata(), exception)
      BoxExceptionHandler_Ext.handleBoxResponseExceptions(exception)

    } catch (exception : BoxAPIException) {
      _logger.error("Error in establishing BOX API Connection  "+ exception.Message, #applyMetadata(), exception)
      throw new gw.api.util.DisplayableException(DisplayKey.get("Toggle.LV.Claim.Documents.Document.APIError_Ext")+ exception.Message)
    }
  }

}
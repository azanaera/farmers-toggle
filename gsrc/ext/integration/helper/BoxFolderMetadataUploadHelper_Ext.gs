package ext.integration.helper

uses com.box.sdk.BoxAPIConnection
uses com.box.sdk.BoxAPIException
uses com.box.sdk.BoxAPIResponseException
uses com.box.sdk.BoxFolder
uses com.box.sdk.Metadata
uses ext.integration.box.BoxPropeties
uses gw.api.locale.DisplayKey
uses gw.surepath.suite.integration.logging.StructuredLogger

class BoxFolderMetadataUploadHelper_Ext {
  /**
   * The template key is derived from the metadata-template that was created on the Box. The scope is set to
   * 'enterprise' which is the Box app setting.
   */

  private static final var _properties = new BoxPropeties()
  private static final var _logger = StructuredLogger.INTEGRATION

  /**
   * The metadata is uploaded one time to the uploading file based on a pre-defined Metadata template on Box-DMS.
   * The Metadatatemplate has fields, the values of which are added from the document metadata in ClaimCenter.
   * eg. if the Claim Number: 600-00-480048, the corresponding folder that would be created on Box would be:
   * Top Level Folder name "600", 2nd level Folder name : "00-48", 3rd level folder name : "0048"
   * The corresponding metadata fields would be:
   * Top Level Folder name "600" : {name = 600, relatedTo = 600}
   * 2nd Level Folder name "00-48" : {name = 00-48, relatedTo = 600-0048}
   * 3rd Level Folder name "0048" : {name = 00-48, relatedTo = 600-00480048}
   * This format of metadata allows unique search value for an existing folder on BOX using Metadata Query.
   * @param api
   * @param boxFileID
   * @param document
   */
  static function applyMetadata(api: BoxAPIConnection, boxFolderID: String, relatedTo : String, folderName: String) {
    var folder : BoxFolder
    var folderMetadata = new Metadata()

    folderMetadata.add("/name", folderName)
    folderMetadata.add("/relatedTo", relatedTo)

    _logger.info("Started: Uploading Folder Metadata from BOX API ",
        :method = #applyMetadata(),
        :parameters = {"Folder Id: " -> boxFolderID, "Folder Name: " -> folderName})

    try {
      folder = new BoxFolder(api, boxFolderID);
      folder.setMetadata(_properties.BoxTemplateKey, _properties.BoxScope, folderMetadata)
    } catch (exception : BoxAPIResponseException) {
      _logger.error("Error Response from BOX API " , #applyMetadata(), exception)
      BoxExceptionHandler_Ext.handleBoxResponseExceptions(exception)

    } catch (exception : BoxAPIException) {
      _logger.error("Error in establishing BOX API Connection  ", #applyMetadata(), exception)
      throw new gw.api.util.DisplayableException(DisplayKey.get("Toggle.LV.Claim.Documents.Document.APIError_Ext")+ exception.Message)
    }
    _logger.info("Completed: Uploading Folder Metadata from BOX API ",
        :method = #applyMetadata(),
        :parameters = {"Folder Id: " -> boxFolderID, "Folder Name: " -> folderName})

  }

}
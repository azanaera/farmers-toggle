package ext.integration.helper

uses com.box.sdk.BoxAPIConnection
uses com.box.sdk.BoxAPIException
uses com.box.sdk.BoxAPIResponseException
uses com.box.sdk.BoxFile
uses gw.api.locale.DisplayKey
uses gw.surepath.suite.integration.logging.StructuredLogger
uses pcf.BoxPreview_Ext

class DocumentLVHelper_Ext {
  /**
   * Fetching the preview of a document via ootb setup which downloads
   * DMS- Box. Content disposition should be set to true or inline in DocumentLV for this view
   * @param document
   *
   */
  private static final var _logger = StructuredLogger.INTEGRATION

  private static function getBoxAPI () : BoxAPIConnection {
    var api = BoxAPIConnectionHelper_Ext.getBoxAPIConnection()
    if(api ==null ){
      throw new gw.api.util.DisplayableException("API Connection Unsuccessful")
    }
    return api
  }

  /**
   * This function would render the file in the browser. Content disposition shoud be set to default
   *  in DocumentLV for this view
   * @param document
   */
  static function previewFromBrowser(document: Document){
      document.downloadContent()
  }

  /**
   * Fetching the preview of a document via an exit point url which points to axternal integration
   * DMS- Box. Content disposition shoud be set to false in DocumentLV for this view
   * @param document
   */
  @Throws(BoxAPIResponseException, "Box Preview unavailable for this file format")
  static function previewFromBox(document:Document) {
    _logger.info("Attempting Preview From Box", :method = #previewFromBox())
    var documentID =  document.DocUID
    try{
      var api = getBoxAPI()
      var file = new BoxFile(api, documentID);
      var embedLink = file.getPreviewLink().toString();
      BoxPreview_Ext.push(embedLink)
    }
    catch(exception: BoxAPIResponseException){
      _logger.error("Error in in response returned by Box API "+  exception.Message, :method=#previewFromBox())
      BoxExceptionHandler_Ext.handleBoxResponseExceptions(exception)
    }
    catch(exception: BoxAPIException){
      _logger.error("Error in establishing BOX API Connection " + exception.Message, :method=#previewFromBox())
      throw new gw.api.util.DisplayableException(DisplayKey.get("Toggle.LV.Claim.Documents.Document.APIError_Ext") + exception.Message)
    }
    catch(exception : Exception){
      _logger.error("Unknown Exception encountered " + exception.Message, :method=#previewFromBox())
    }

  }

}
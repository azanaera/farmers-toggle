package ext.integration.plugin.document

uses com.box.sdk.BoxAPIConnection
uses com.box.sdk.BoxAPIException
uses com.box.sdk.BoxAPIResponseException
uses com.box.sdk.BoxFile
uses com.box.sdk.BoxFolder
uses ext.integration.helper.BoxAPIConnectionHelper_Ext
uses ext.integration.helper.BoxExceptionHandler_Ext
uses ext.integration.helper.BoxFileMetadataUploadHelper_Ext
uses gw.api.locale.DisplayKey
uses gw.document.ContentDispositionType
uses gw.plugin.document.IDocumentContentSource
uses com.guidewire.pl.system.dependency.PLDependencies


uses java.io.InputStream
uses gw.document.DocumentContentsInfo

uses java.util.Date
uses java.io.File
uses java.lang.StringBuffer
uses java.util.Calendar
uses gw.pl.util.FileUtil
uses gw.plugin.document.impl.BaseLocalDocumentContentSource
uses gw.surepath.suite.integration.logging.StructuredLogger

@Export
class SyncDocumentContentSource_Ext  implements IDocumentContentSource {
  private static final var _logger = StructuredLogger.PLUGIN
  private var _contentResponseType = DocumentContentsInfo.ContentResponseType.URL

  /**
   * This function is used to start the adding of the document to the dms.
   * @param documentContents
   * @param document
   * @return
   */
  override function addDocument(documentContents : InputStream, document : Document) : boolean {
    _logger.info("Adding Document to upload document to Box", :method=#addDocument(documentContents,document))
    uploadToBox(documentContents, document)
      document.DateModified = Date.CurrentDate
    return false
  }


  private static function getBoxAPI () : BoxAPIConnection{
    var api = BoxAPIConnectionHelper_Ext.getBoxAPIConnection()
    if(api ==null ){
      throw new gw.api.util.DisplayableException("API Connection Unsuccessful")
    }
    return api
  }


  /**
   * The upload currently works on the root folder. This needs to be refactored once the
   * folder structure is available
   * @param documentContents
   * @param document
   */
  public function uploadToBox(documentContents : InputStream, document : Document) {
    _logger.info("Uploading Document to Box synchrounous call", :method = #uploadToBox())
    var DocName = getDocNameWithExtension(document)
    var boxFileID : String
    var api = getBoxAPI()
    if(api != null){
      boxFileID = upLoadDocumentstoClaimFolder(document, documentContents, DocName)
      document.DocUID = boxFileID
      applyMetadataOnFile(boxFileID, document)
    }
    else{
      _logger.error("Box API connection is Null", #uploadToBox()  )
      throw new gw.api.util.DisplayableException("Box API connection not established")
    }

  }

  /**
   * Fetches the existing folder structure on Claim and then
   * makes Box API function call for uploading the documents
   * @param document
   * @param documentContents
   * @param docName
   * @return
   */
  private function upLoadDocumentstoClaimFolder(document : Document, documentContents : InputStream, docName : String) :  String {
    _logger.info("Uploading Document to the Claim Folder", :method = #upLoadDocumentstoClaimFolder())
    var fileId :String
    var folderId = document.Claim.getBoxFolderId_Ext()
    if(folderId == null){
      _logger.warn("No Claim Folder exist for this claim on Box", #upLoadDocumentstoClaimFolder())
      throw new gw.api.util.DisplayableException(DisplayKey.get("Toggle.LV.Claim.Documents.Document.folderexist") )
    }
    else{
      try{
        var api = getBoxAPI()
        var docFolder = new BoxFolder(api, folderId)
        fileId = docFolder.uploadFile(documentContents, docName, document.Description).getID()
      }catch(exception: BoxAPIResponseException){
        BoxExceptionHandler_Ext.handleBoxResponseExceptions(exception)
        _logger.error("Error in response returned by Box API when uploading File", #upLoadDocumentstoClaimFolder(), exception )
      }
      catch(exception: BoxAPIException){
        _logger.error("Error in establishing BOX API Connection when uploading File ", #upLoadDocumentstoClaimFolder(), exception, :parameters= {"Stack Trace" -> ((exception.StackTrace) as String)})
        throw new gw.api.util.DisplayableException(DisplayKey.get("Toggle.LV.Claim.Documents.Document.APIError_Ext")+ exception.Message)
      }
      catch(exception : Exception){
        _logger.error("Exception encountered when uploading File ", #upLoadDocumentstoClaimFolder(), exception)
        throw new gw.api.util.DisplayableException("Failed to upload file to box" + exception.Message)
      }
      _logger.info("Completed Uploading Document to the Claim Folder", :method = #upLoadDocumentstoClaimFolder())
    }
    return fileId
  }

  /**
   * Calls the helper function to upload the metadata for a file on Box. The metadata is captured from the fields in
   * the document upload process
   * @param boxFileID
   * @param document
   */
  private function applyMetadataOnFile(boxFileID : String, document : Document) : void {
    _logger.info("Attempting to uploaded file Metadata to box", {document}, {"Box File ID" -> boxFileID}, :method = #applyMetadataOnFile(boxFileID, document))
    try{
      var api = getBoxAPI()
      BoxFileMetadataUploadHelper_Ext.applyMetadata(api, boxFileID, document)

    }catch(exception: BoxAPIResponseException){
      _logger.error("Error in response returned by Box API when uploading Metadata", #applyMetadataOnFile(boxFileID, document), exception )
      BoxExceptionHandler_Ext.handleBoxResponseExceptions(exception)
    }
    catch(exception: BoxAPIException){
      _logger.error("Error in establishing BOX API Connection when uploading Metadata ", #applyMetadataOnFile(boxFileID, document), exception, :parameters= {"Stack Trace" -> ((exception.StackTrace) as String)})
      throw new gw.api.util.DisplayableException(DisplayKey.get("Toggle.LV.Claim.Documents.Document.APIError_Ext")+ exception.Message)
    }
    catch(exception : Exception){
      _logger.error("Exception encountered when uploading Metadata ", #applyMetadataOnFile(boxFileID, document), exception)
      throw new gw.api.util.DisplayableException("Failed to upload file to box"+ exception.Message)
    }
    _logger.info("Completed uploaded file Metadata to box", {document}, {"Box File ID" -> boxFileID}, :method = #applyMetadataOnFile(boxFileID, document))
  }

  /**
   * Getting the mime type of the document to upload to box with correct document type
   * @param document
   * @return the full ldocument name along with extension
   */
  private function getDocNameWithExtension(document : Document) : String {
    _logger.info("The document type attempting to upload:" ,{ }
        ,{"Document Name:" -> document.Name, "Dcument MimeType" -> document.MimeType.split("/")[1]} , :method=#getDocNameWithExtension())
    var fileExtension = PLDependencies.getMimeTypeManager().getFileExtension(document.MimeType);
    return document.Name + fileExtension
  }
  /**
   * Builds the DocumentContentsInfo containing the document url from external DMS. The call to this method is intended
   * when the "mode" parameter of the plugin is set to "url"
   * @param document The document object which is to be fetched.
   * @param includeContents If true, the actual contents of the document should be included in the DocumentContentsInfo
   * @return A DocumentContentsInfo object with the metadata of the Document Contents, and the contents which has
   * been fetched from the external DMS -Box via the downloadable URL
   */

  protected function getDocumentContents(document : Document, includeContents : boolean) : DocumentContentsInfo {
    _logger.info("Fetching Document from Box", :method=#getDocumentContents(document,includeContents))
    var api = getBoxAPI ()
    var file = new BoxFile(api, document.DocUID)
    var documentUrl = file.getDownloadURL().toString()
    _logger.info("Temporary Document URL found on Box : ", {}, {"DownloadURL:" -> file.getDownloadURL().toString() }, :method = #getDocumentContents(document,includeContents))
    return new DocumentContentsInfo(_contentResponseType, includeContents ? documentUrl  : null, document.MimeType);
  }

  override function isDocument(document : Document) : boolean {
    return document.DocUID != null
  }

  override function getDocumentContentsInfo(document : Document, includeDocumentContents : boolean) : DocumentContentsInfo {
    var dci = getDocumentContents(document, includeDocumentContents)
    dci.setResponseMimeType(document.getMimeType())
    return dci
  }

  override function getDocumentContentsInfoForExternalUse(document : Document) : DocumentContentsInfo {
    return null
  }

  override function updateDocument(document : Document, isDocument : InputStream) : boolean {
    return false
  }

  override function removeDocument(document : Document) : boolean {
    return false
  }

  override property get InboundAvailable() : boolean {
    return true
  }

  override property get OutboundAvailable() : boolean {
    return true
  }

  /**
   * Class which wraps required information into an identifying token for document contents
   */
  static class DocumentInfoWrapper implements BaseLocalDocumentContentSource.IDocumentInfoWrapper {
    private var _docName : String

    private var _claimNumber : String

    private var _exposureID : int

    private var _claimantID : int

    public construct(document : Document) {
      var claim = document.Claim
      var exposure = document.getExposure()
      var claimant = document.getClaimant()
      _docName = document.Name
      _claimNumber = claim.getClaimNumber()
      _exposureID = (exposure == null ? -1 : exposure.getID().getValue()) as int
      _claimantID = (claimant == null ? -1 : claimant.getID().getValue()) as int
    }

    override function getDocumentName() : String {
      return _docName
    }

    override function getSubDirForDocument() : String {
      var strSubDir = new StringBuffer()
      var cal = Calendar.getInstance()
      cal.setTime(Date.CurrentDate)
      strSubDir.append(cal.get(Calendar.YEAR)).append(File.separator)
      strSubDir.append(cal.get(Calendar.MONTH)).append(File.separator)
      strSubDir.append(cal.get(Calendar.DAY_OF_MONTH)).append(File.separator)
      strSubDir.append(_claimNumber).append(File.separator)
      if (_exposureID > 0) {
        strSubDir.append("Exposure").append(_exposureID).append(File.separator)
      } else if (_claimantID > 0) {
        strSubDir.append("Claimant").append(_claimantID).append(File.separator)
      }
      return strSubDir.toString()
    }
  }

}

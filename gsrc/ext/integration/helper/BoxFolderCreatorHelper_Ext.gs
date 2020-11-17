package ext.integration.helper

uses com.box.sdk.BoxAPIConnection
uses com.box.sdk.BoxAPIException
uses com.box.sdk.BoxAPIResponseException
uses com.box.sdk.BoxFolder
uses com.box.sdk.MetadataTemplate
uses com.eclipsesource.json.JsonObject
uses gw.api.locale.DisplayKey
uses gw.api.system.server.ServerUtil
uses gw.api.util.DisplayableException
uses gw.surepath.suite.integration.logging.StructuredLogger
uses ext.integration.box.BoxPropeties

class BoxFolderCreatorHelper_Ext {
  private static final var BOX_ENTITY_TYPE = "folder"
  private static final var _properties = new BoxPropeties()
  private static final var _logger = StructuredLogger.INTEGRATION
  private static final var IS_LOCAL = ServerUtil.Env.isBlank() or ServerUtil.Env == null or ServerUtil.Env.equalsIgnoreCase("local") or ServerUtil.Env.equalsIgnoreCase("h2mem")

  /**
   * Calls upon another function to create a new box folder based on Claim number. Stores the folder ID on the
   * Claim.BoxFolderId for future, when this will be reuired to upload documents on claim
   * @param claim
   */
  private static function getBoxAPI () : BoxAPIConnection {
    var api = BoxAPIConnectionHelper_Ext.getBoxAPIConnection()
    if(api ==null ){
      throw new gw.api.util.DisplayableException("API Connection Unsuccessful")
    }
    return api
  }

  /**
   * Calls function to create folder structure on Box DMS if the env is not local
   * @param claim
   */
  static function setupClaimFolderOnBox(claim : Claim) {
    if (!IS_LOCAL) {
      _logger.info("Starting : Setting up Claim Folder on Box DMS ", {}, {"Claim" -> claim.ClaimNumber}, :method = #setupClaimFolderOnBox(claim))
      if (claim.BoxFolderId_Ext == null) {
        var boxFolderId = createBoxFolder(claim)
        claim.BoxFolderId_Ext = boxFolderId
        _logger.info("Completed : Setting up Claim Folder on Box DMS ", {},
            {"Claim" -> claim.ClaimNumber, "BoxFolderId" -> boxFolderId},
            :method = #setupClaimFolderOnBox(claim))
      } else {
        _logger.info("Folder already created ", {},
            {"Claim" -> claim.ClaimNumber, "BoxFolderId" -> claim.BoxFolderId_Ext},
            :method = #setupClaimFolderOnBox(claim))
      }
    } else {
      _logger.info("Folder cannot be created for Local environment", {},
          {"Claim" -> claim.ClaimNumber}, :method = #setupClaimFolderOnBox(claim))
    }
  }

  /**
   * Creates folder structure on Box based on the claim number.
   * eg. if the Claim Number: 600-00-480048, the corresponding folder that would be created on Box would be:
   * Top Level Folder name "600", 2nd level Folder name : "00-48", 3rd level folder name : "0048"
   * Actual documents associated with the claim would get stored in the 3rd level folder.
   * (In Folder: "0048" for the given example)
   *
   *
   * @param claim
   * @return
   */
  private static function createBoxFolder(claim : Claim) : String {
    _logger.info("Creating  Claim Folder on Box DMS " , {},
        {"Claim" -> claim.ClaimNumber },
        :method = #createBoxFolder(claim))
    var api = getBoxAPI ()

    var claimNumber = claim.ClaimNumber
    if(claimNumber == null){
      throw new com.guidewire.pl.web.controller.UserDisplayableException("Claim Number is blank")
    }
    var homeFolder = new BoxFolder(api, _properties.BoxHomeFolderId)
    var metadataRelatedTo : String
    //        eg Claim Number: 600-00-480048
    var folderL1Name = claimNumber.substring(0,3) // Folder Level1 Name  : "600"
    var folderL2Name = claimNumber.substring(4,9) // Folder Level2 Name  : "00-48"
    var folderL3Name = claimNumber.substring(9)   // Folder Level3 Name  : "0048"

    metadataRelatedTo = folderL1Name
    var folderL1Id = getFolderIdByName(metadataRelatedTo, folderL1Name, _properties.BoxHomeFolderId)
    if (folderL1Id == null) {

      var firstLevelFolderInfo = createNewBoxFolder(folderL1Name, homeFolder)
      folderL1Id = firstLevelFolderInfo.getID();
      _logger.info("Created 1st level Claim Folder on Box DMS " , {},
          {"Folder" -> folderL1Name, "FolderID" -> folderL1Id},
          :method = #createBoxFolder(claim))
      metadataRelatedTo = folderL1Name
      applyMetadataOnFolder(folderL1Id, metadataRelatedTo, folderL1Name)
    }

    metadataRelatedTo = claimNumber.substring(0, 9)
    var folderL2Id = getFolderIdByName(metadataRelatedTo, folderL2Name, folderL1Id)
    if (folderL2Id == null) {
      var parentFolder = new BoxFolder(api, folderL1Id)
      var secondLevelFolderInfo = createNewBoxFolder(folderL2Name, parentFolder)
      folderL2Id = secondLevelFolderInfo.getID()
      _logger.info("Created 2nd level Claim Folder on Box DMS ", {},
          {"Folder" -> folderL2Name, "FolderID" -> folderL2Id},
          :method = #createBoxFolder(claim))
      applyMetadataOnFolder(folderL2Id, metadataRelatedTo, folderL2Name)
    }

    metadataRelatedTo = claimNumber
    if(getFolderIdByName(metadataRelatedTo, folderL3Name, folderL2Id) != null){
      _logger.error("Claim folder for the claim number already exists :" + claimNumber, #createNewBoxFolder())
      throw new DisplayableException("Claim folder for the claim number already exists")
    }

    var parentFolder = new BoxFolder(api, folderL2Id)
    var thirdLevelFolderInfo = createNewBoxFolder(folderL3Name, parentFolder)
    var folderL3Id = thirdLevelFolderInfo.getID()

    _logger.info("Created 3rd level Claim Folder on Box DMS ", {},
        {"Folder" -> folderL3Name, "FolderID" -> folderL3Id},
        :method = #createBoxFolder(claim))
    applyMetadataOnFolder(folderL3Id, metadataRelatedTo, folderL3Name)
    return folderL3Id
  }

  /**
   * Box API function call for folder creation
   * @param folderName
   * @param parentFolder
   * @return
   */
  private static function createNewBoxFolder(folderName : String, parentFolder : BoxFolder) :  com.box.sdk.BoxFolder.Info {
    _logger.info("Started Creating a new folder on Box ", :parameters = {"folderName" -> folderName},
        :method = #createNewBoxFolder())
    var newFolder : com.box.sdk.BoxFolder.Info
    try{
      newFolder =  parentFolder.createFolder(folderName)
    }catch (exception : BoxAPIResponseException) {
      _logger.error("Error Response from BOX API ", #createNewBoxFolder(), exception)
      BoxExceptionHandler_Ext.handleBoxResponseExceptions(exception)

    } catch (exception : BoxAPIException) {
      _logger.error("Error in establishing BOX API Connection  ", #createNewBoxFolder(), exception)
      throw new gw.api.util.DisplayableException(DisplayKey.get("Toggle.LV.Claim.Documents.Document.APIError_Ext")+ exception.Message)
    }
    _logger.info("Completed Creating a new folder on Box ", :parameters = {"folderName" -> folderName},
        :method = #createNewBoxFolder())

    return newFolder

  }

  /**
   * Applies Metadata on the folder
   * @param boxFolderId
   * @param metadataRelatedTo
   * @param folderName
   */
  private static function applyMetadataOnFolder(boxFolderId : String, metadataRelatedTo : String, folderName : String) : void {
    _logger.info("Started : Apply Metadata on Folder: ", :parameters = {"folderName" -> folderName, "folderId" -> boxFolderId},
        :method = #applyMetadataOnFolder())
    var api = getBoxAPI ()
    try {
      BoxFolderMetadataUploadHelper_Ext.applyMetadata(api, boxFolderId, metadataRelatedTo, folderName)
    } catch (exception : BoxAPIResponseException) {
      _logger.error("Error Response from BOX API ", #applyMetadataOnFolder(), exception)
      BoxExceptionHandler_Ext.handleBoxResponseExceptions(exception)

    } catch (exception : BoxAPIException) {
      _logger.error("Error in establishing BOX API Connection  ", #applyMetadataOnFolder(), exception)
      throw new gw.api.util.DisplayableException(DisplayKey.get("Toggle.LV.Claim.Documents.Document.APIError_Ext")+ exception.Message)
    }
    _logger.info("Completed : Apply Metadata on Folder:  ", :parameters = {"folderName" -> folderName, "folderId" -> boxFolderId},
        :method = #applyMetadataOnFolder())

  }


  /**
   * Searches the Box dms for a given folder name.
   * fields used for the Metadata Query API : from, query, queryParameters
   * from - This comtains the scope, enterpriseID and Metadata template details.
   * eg if (scope= "enterprise", enterpriseID = 535270974 and Metadata Template ID =  gwccV1)
   * Then from = "enterprise_535270974.gwccV1"
   * query: This would contain the metadata fields on which the actual query needs to be done
   * queryParameters : This maps the query parameters to the search keywords on a JSON object.
   * @param relatedTo
   * @param search_folderName
   * @param ancestorFolderId
   * @return folder ID if the folder is found and null if folder is not found
   */
   private static function getFolderIdByName(relatedTo: String, search_folderName : String, ancestorFolderId: String) : String {
    _logger.info("Searching Box for existence of Folder " , {},
        {"Folder Name" -> search_folderName },
        :method = #getFolderIdByName(relatedTo, search_folderName, ancestorFolderId ))
    var api = getBoxAPI ()
    var from = _properties.BoxScope + "_" + _properties.BoxEnterpriseId + "." + _properties.BoxTemplateKey
    var query = "relatedTo = :argrelatedTo AND name = :argName"
    var queryParameters = new JsonObject().add("argName", search_folderName).add("argrelatedTo", relatedTo)
    var results = MetadataTemplate.executeMetadataQuery(api, from, query, queryParameters, ancestorFolderId)
    var searchResult = results.firstWhere(\elt -> (elt.getItem().getType()==BOX_ENTITY_TYPE))
    if (searchResult != null) {
      var boxFolderId = searchResult.getItem().getID()

      _logger.info("Folder already exists on Box - " , {},
          {"Folder Name" -> search_folderName , "folderId" -> boxFolderId },
          :method = #getFolderIdByName(relatedTo, search_folderName, ancestorFolderId ))

      return boxFolderId
    }

    _logger.info("Folder does not exist on Box - " , {},
        {"Folder Name" -> search_folderName },
        :method = #getFolderIdByName(relatedTo, search_folderName, ancestorFolderId ))

    return null
  }
}



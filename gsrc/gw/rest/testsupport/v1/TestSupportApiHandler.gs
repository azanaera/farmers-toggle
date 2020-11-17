package gw.rest.testsupport.v1

uses com.guidewire.pl.modules.rest.framework.v1.operations.RestResourceOperationBase
uses com.guidewire.pl.system.gosu.GosuPluginContainer
uses gw.api.json.JsonObject
uses gw.api.modules.rest.framework.v1.operations.OperationContext
uses gw.api.modules.rest.framework.v1.resources.RestCollectionResource
uses gw.api.modules.rest.framework.v1.resources.RestResource
uses gw.api.rest.RequestContext
uses gw.api.rest.Response
uses gw.plugin.document.DocumentConfigUtil
uses gw.rest.pl.framework.v1.handler.AbstractApiHandler
uses gw.rest.testsupport.v1.contacts.ContactSearchResource
uses gw.rest.testsupport.v1.search.policies.PolicySearchResource

uses java.io.File
uses java.nio.file.Files
uses java.nio.file.Paths

@Export
class TestSupportApiHandler extends AbstractApiHandler {
  // POST /search/contacts
  function searchContacts(requestContext : RequestContext, body : JsonObject) : Response {
    // Currently the "generic" resource handling cannot infer that a POST like this should be treated as a collection get
    return getCollection<ContactSearchResource>(requestContext, {body})
  }

  // POST /policies
  function createPolicy(requestContext : RequestContext, body : JsonObject) : Response {
    return handleResourceRequest(requestContext, body)
  }

  // POST /search/policies
  function searchPolicies(requestContext : RequestContext, body : JsonObject) : Response {
    // Currently the "generic" resource handling cannot infer that a POST like this should be treated as a collection get
    return getCollection<PolicySearchResource>(requestContext, {body})
  }

  // POST /roles
  function createRole(requestContext : RequestContext, body : JsonObject) : Response {
    return handleResourceRequest(requestContext, body)
  }

  // GET /roles/{roleId}
  function getRole(requestContext : RequestContext) : Response {
    return handleResourceRequest(requestContext)
  }

  // POST /users
  function createUser(requestContext : RequestContext, body : JsonObject) : Response {
    return handleResourceRequest(requestContext, body)
  }

  // DELETE /documents
  function deleteAllDocuments(requestContext : RequestContext) : Response {
    // Delete all documents including subfolders
    // Document folder defined in OOTB default IDocumentContentSource plugin
    var tempDir = GosuPluginContainer.instance().getTempDir()
    var documentDirPath = DocumentConfigUtil.getAbsolutePath("", tempDir)
    if (new File(documentDirPath).exists()) {
      // Delete documents and directory as well
      Files.walk(Paths.get(documentDirPath))
          .map(\p -> p.toFile())
          .sorted(Comparator.reverseOrder<File>())
          .forEach(\file -> file.delete())
    }
    return Response.noContent().build()
  }

  protected override function buildCreateElementOperation(operationContext : OperationContext, childResourceName : String, resourceBuilder : block(OperationContext) : RestCollectionResource, body : JsonObject) : RestResourceOperationBase<RestResource> {
    if (childResourceName == "TestSupportPolicy") {
      return new CreateTestSupportResourceOperation(operationContext, childResourceName, resourceBuilder, body)
    } else {
      return super.buildCreateElementOperation(operationContext, childResourceName, resourceBuilder, body)
    }
  }
}
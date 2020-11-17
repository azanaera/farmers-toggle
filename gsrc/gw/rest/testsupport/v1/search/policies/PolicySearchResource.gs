package gw.rest.testsupport.v1.search.policies

uses com.guidewire.pl.modules.rest.framework.v1.updater.handler.RestUpdateApplier
uses gw.api.json.JsonObject
uses gw.api.modules.rest.framework.v1.RestApiConstants
uses gw.api.modules.rest.framework.v1.batch.BatchUpdateMap
uses gw.api.modules.rest.framework.v1.resources.ResourceName
uses gw.api.modules.rest.framework.v1.resources.RestStreamCollectionResource
uses gw.api.modules.rest.framework.v1.updater.handler.UpdateMode

uses java.util.stream.Stream

@ResourceName("PolicySearch")
@Export
class PolicySearchResource extends RestStreamCollectionResource {
  var _body : JsonObject as readonly Body

  function init(body : JsonObject) {
    _body = body
  }

  protected override function loadValues() : Stream<Object> {
    var policySearchCriteria = new PolicySearchCriteria(this.Bundle)

    var updater = this.OperationContext.Configuration.getUpdater(this.ResourceName)
    RestUpdateApplier.processUpdates(
        updater,
        policySearchCriteria,
        _body.getObject(RestApiConstants.DATA_PROP)?.getObject(RestApiConstants.ATTRIBUTES_PROP),
        RestApiConstants.DATA_PROP + "." + RestApiConstants.ATTRIBUTES_PROP,
        new BatchUpdateMap(),
        UpdateMode.create
    )

    return policySearchCriteria.performSearch().toList().stream()
  }

  override property get SelfUrl() : String {
    return getApiBasePath("testsupport") + "/search/policies"
  }

  protected override property get ChildType() : Class<PolicySearchResultResource> {
    return PolicySearchResultResource
  }
}
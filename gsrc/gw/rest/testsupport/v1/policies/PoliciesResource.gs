package gw.rest.testsupport.v1.policies

uses gw.api.database.IQueryBeanResult
uses gw.api.modules.rest.framework.v1.json.DataEnvelope
uses gw.api.modules.rest.framework.v1.query.filters.RestQueryFilter
uses gw.api.modules.rest.framework.v1.resources.ResourceName
uses gw.api.modules.rest.framework.v1.resources.RestElementResource
uses gw.api.modules.rest.framework.v1.resources.RootKeyableBeanRestQueryCollectionResource

uses java.time.LocalDate
uses java.time.LocalDateTime
uses java.time.LocalTime
uses java.time.ZoneOffset

@ResourceName("TestSupportPolicies")
@Export
class PoliciesResource extends RootKeyableBeanRestQueryCollectionResource {

  protected override function buildBaseQuery() : IQueryBeanResult<KeyableBean> {
    throw new UnsupportedOperationException("Getting the Policies collection is not supported from the testsupport context")
  }

  override property get ParentUrl() : String {
    return getApiBasePath("testsupport")
  }

  override property get CollectionId() : String {
    return "policies"
  }

  override function createMinimalChild(data : DataEnvelope) : RestElementResource {
    var policy = new Policy(this.Bundle)
    initializePolicyDefaults(policy)
    return buildElementResource(policy)
  }

  private function initializePolicyDefaults(policy : Policy) {
    var now = LocalDateTime.of(LocalDate.now(), LocalTime.MIN).atOffset(ZoneOffset.of("Z"))
    policy.EffectiveDate = Date.from(now.minusMonths(3).toInstant())
    policy.ExpirationDate = Date.from(now.minusMonths(3).plusYears(1).toInstant())
  }

  protected override property get ChildType() : Class<PolicyResource> {
    return PolicyResource
  }
}
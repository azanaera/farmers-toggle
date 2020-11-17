package gw.rest.testsupport.v1.roles

uses gw.api.database.IQueryBeanResult
uses gw.api.modules.rest.framework.v1.json.DataEnvelope
uses gw.api.modules.rest.framework.v1.query.filters.RestQueryFilter
uses gw.api.modules.rest.framework.v1.resources.ResourceName
uses gw.api.modules.rest.framework.v1.resources.RestElementResource
uses gw.api.modules.rest.framework.v1.resources.RootKeyableBeanRestQueryCollectionResource

@ResourceName("TestSupportRoles")
@Export
class RolesResource extends RootKeyableBeanRestQueryCollectionResource {

  protected override function buildBaseQuery() : IQueryBeanResult<KeyableBean> {
    throw new UnsupportedOperationException("Getting the Roles collection is not supported from the testsupport context")
  }

  override property get ParentUrl() : String {
    return getApiBasePath("testsupport")
  }

  override property get CollectionId() : String {
    return "roles"
  }

  override function createMinimalChild(data : DataEnvelope) : RestElementResource {
    return buildElementResource(new Role(this.Bundle))
  }

  protected override property get ChildType() : Class<RoleResource> {
    return RoleResource
  }
}
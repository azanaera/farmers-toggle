package gw.rest.testsupport.v1.roles

uses gw.api.modules.rest.framework.v1.batch.BatchUpdateMap
uses gw.api.modules.rest.framework.v1.json.DataEnvelope
uses gw.api.modules.rest.framework.v1.resources.ResourceName
uses gw.api.modules.rest.framework.v1.resources.TestOnlyResource
uses gw.api.modules.rest.framework.v1.resources.VersionableRestElementResource

@TestOnlyResource
@ResourceName("TestSupportRole")
@Export
class RoleResource extends VersionableRestElementResource<RolesResource, Role> {

  final function buildParentFromElement(element : Role) : RolesResource {
    return buildResource(RolesResource)
  }

  /**
   * This init is necessary because there is no /testsupport/v1/roles path on the schema. Normally we would construct the
   * parent first and then call init(parent, elementId), but we since we don't have an endpoint for the parent, we
   * can't construct the parent first. Instead, we call init(elementId) and this method constructs the parent
   */
  final function init(id : String) {
    var role = loadElementById(id)
    init(buildParentFromElement(role), role)
  }

  override property get Checksum() : String {
    return null
  }

  override function finishCreate(data : DataEnvelope, batchUpdateMap : BatchUpdateMap) {
    for (permissionCode in data.Attributes.getStringArray("permissions")) {
      var privilige = new RolePrivilege(this.Bundle)
      privilige.Permission = SystemPermissionType.get(permissionCode)
      privilige.Role = Element
    }
  }

  protected override property get BeanType() : Class<Role> {
    return entity.Role
  }
}
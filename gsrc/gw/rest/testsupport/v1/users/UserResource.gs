package gw.rest.testsupport.v1.users

uses gw.api.modules.rest.framework.v1.batch.BatchUpdateMap
uses gw.api.modules.rest.framework.v1.json.DataEnvelope
uses gw.api.modules.rest.framework.v1.resources.ResourceName
uses gw.api.modules.rest.framework.v1.resources.TestOnlyResource
uses gw.api.modules.rest.framework.v1.resources.VersionableRestElementResource

@TestOnlyResource
@ResourceName("TestSupportUser")
@Export
class UserResource extends VersionableRestElementResource<UsersResource, User> {

  /**
   * The resource exists for test-support purposes only. It is not fully implemented, therefore there is no selfUrl
   */
  override property get SelfUrl() : String {
    return null
  }

  override function finishCreate(data : DataEnvelope, batchUpdateMap : BatchUpdateMap) {
    Element.Contact.FirstName = Element.Credential.UserName
  }

  protected override property get BeanType() : Class<User> {
    return entity.User
  }
}
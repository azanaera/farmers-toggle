package gw.rest.testsupport.v1.users

uses entity.UserRole
uses gw.api.database.IQueryBeanResult
uses gw.api.database.Queries
uses gw.api.database.Relop
uses gw.api.modules.rest.framework.v1.json.DataEnvelope
uses gw.api.modules.rest.framework.v1.resources.ResourceName
uses gw.api.modules.rest.framework.v1.resources.RestElementResource
uses gw.api.modules.rest.framework.v1.resources.RootKeyableBeanRestQueryCollectionResource

@ResourceName("TestSupportUsers")
@Export
class UsersResource extends RootKeyableBeanRestQueryCollectionResource {

  protected override function buildBaseQuery() : IQueryBeanResult<KeyableBean> {
    throw new UnsupportedOperationException("Getting the Users collection is not supported from the testsupport context")
  }

  override property get ParentUrl() : String {
    return getApiBasePath("testsupport")
  }

  override property get CollectionId() : String {
    return "/users"
  }

  @SuppressWarnings("HiddenPackageReference")
  override function createMinimalChild(data : DataEnvelope) : RestElementResource {
    var user = new User(this.Bundle)
    user.Contact = new UserContact(this.Bundle)
    user.Credential = new Credential(this.Bundle)
    // This usage of internal classes is for testing purposes only
    user.Credential.Password = com.guidewire.commons.util.CryptUtil.getSharedInstance().hashPasswordString("gw")
    for (roleId in data.Attributes.getStringArray("roles")) {
      var role = Queries.createQuery<Role>(Role).compare(Role#PublicID, Relop.Equals, roleId).select().single()
      var userRole = new UserRole(this.Bundle)
      userRole.User = user
      userRole.Role = role
    }
    var profileName = data.Attributes.getString("authorityProfile")
    if (profileName != null) {
      var profile = Queries.createQuery<AuthorityLimitProfile>(AuthorityLimitProfile)
          .compare(AuthorityLimitProfile#Name, Relop.Equals, profileName).select().single()
      user.AuthorityProfile = profile
    }
    return buildElementResource(user)
  }

  protected override property get ChildType() : Class<UserResource> {
    return UserResource
  }
}
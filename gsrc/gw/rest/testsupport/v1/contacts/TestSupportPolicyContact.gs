package gw.rest.testsupport.v1.contacts

uses com.guidewire.cc.domain.contact.config.RoleConstraintType
uses entity.Contact
uses gw.api.modules.rest.framework.v1.resources.TestOnlyResource

@Export
@TestOnlyResource
@SuppressWarnings("HiddenPackageReference")
class TestSupportPolicyContact {
  private var _contact : Contact as Contact
  private var _roles : List<ContactRole> as Roles
  private var _policy : Policy

  construct(policy : Policy) {
    _policy = policy
    _roles = {}
  }

  function addRole(role : ContactRole) : void {
    Roles.add(role)
    addToPolicy(role)
  }

  function addToPolicy(role : ContactRole) : void {
    if (_policy.isRoleConstrained(role, RoleConstraintType.EXCLUSIVE)) {
      _policy.setContactByRole(role, Contact)
    } else {
      _policy.addRole(role, Contact)
    }
  }
}
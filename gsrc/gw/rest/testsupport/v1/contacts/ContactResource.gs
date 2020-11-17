package gw.rest.testsupport.v1.contacts

uses gw.api.modules.rest.framework.v1.resources.TestOnlyResource
uses gw.rest.core.pl.common.v1.contacts.ContactPlatformResource

@TestOnlyResource
@Export
class ContactResource extends ContactPlatformResource {

  override property get SelfUrl() : String {
    return ParentUrl + "/" + CanonicalId
  }
}
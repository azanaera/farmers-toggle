package gw.rest.testsupport.v1.contacts

uses entity.Contact
uses gw.api.database.IQueryBeanResult
uses gw.api.modules.rest.framework.v1.exceptions.LocalizedExceptionUtil
uses gw.api.modules.rest.framework.v1.json.DataAttributes
uses gw.api.modules.rest.framework.v1.json.DataEnvelope
uses gw.api.modules.rest.framework.v1.resources.RootKeyableBeanRestQueryCollectionResource

@Export
class ContactsResource extends RootKeyableBeanRestQueryCollectionResource {

  override property get SelfUrl() : String {
    return ParentUrl + "/" + CollectionId
  }

  override property get CollectionId() : String {
    return "contacts"
  }

  override property get ParentUrl() : String {
    return getApiBasePath("testsupport")
  }

  protected override function buildBaseQuery() : IQueryBeanResult<KeyableBean> {
    return null
  }

  override function createMinimalChild(data : DataEnvelope) : ContactResource {
    var attributes = data.Attributes
    validateRequiredFieldsForCreate(attributes)
    var subtype = attributes.getTypekey("subtype", typekey.Contact)
    var contact = this.Bundle.newBeanInstance(subtype.EntityType) as Contact
    validateSubtypes(contact, attributes)
    return buildResource(ContactResource, this, contact)
  }

  protected function validateSubtypes(contact : Contact, attributes : DataAttributes) {
    if (contact typeis Person) {
      validateRequiredFieldsForPerson(attributes)
    } else if (contact typeis Company) {
      validateRequiredFieldsForCompany(attributes)
    }
  }

  protected function validateRequiredFieldsForCompany(attributes : DataAttributes) {
    var companyName = attributes.getString("companyName")
    if (companyName == null) {
      throw LocalizedExceptionUtil.badInputInBody(attributes.PathFromRoot, "Rest.Common.V1.Contacts.Resources.MissingProperty", {"companyName"})
    }
  }

  protected function validateRequiredFieldsForPerson(attributes : DataAttributes) {
    var lastName = attributes.getString("lastName")
    if (lastName == null) {
      throw LocalizedExceptionUtil.badInputInBody(attributes.PathFromRoot, "Rest.Common.V1.Contacts.Resources.MissingProperty", {"lastName"})
    }
  }

  protected function validateRequiredFieldsForCreate(attributes : DataAttributes) {
    if (!attributes.containsKey("subtype")) {
      throw LocalizedExceptionUtil.badInputInBody(attributes.PathFromRoot + ".subtype", "Rest.Framework.V1.Resources.PropertyRequiredToCreate", {"subtype", Contact.RelativeName})
    }
  }

  override function buildElementResourceFromId(id : String) : ContactResource {
    return buildResource(ContactResource, this, id)
  }

  protected override property get ChildType() : Class<ContactResource> {
    return ContactResource
  }
}
package gw.rest.testsupport.v1.contacts

uses com.guidewire.pl.modules.rest.framework.v1.ids.PublicIdEntityResolver
uses com.guidewire.pl.modules.rest.framework.v1.updater.resolver.EntityReferenceValueResolver
uses entity.Contact
uses gw.api.modules.rest.framework.v1.batch.BatchUpdateMap
uses gw.api.modules.rest.framework.v1.updater.BadPropertyValueException
uses gw.api.modules.rest.framework.v1.updater.handler.ObjectUpdateContext
uses gw.pl.persistence.core.BundleProvider

@Export
class ContactJsonValueResolver extends EntityReferenceValueResolver {
  override function resolveReferenceById(id : String, propertyKey : String, resolutionRoot : Object, context : ObjectUpdateContext) : Object {
    var contact = new PublicIdEntityResolver<Contact>().loadEntity(Contact, id, (resolutionRoot as BundleProvider).Bundle)
    if (contact == null) {
      throw new BadPropertyValueException(propertyKey + ".id", "Rest.Common.V1.ContactJsoneResolver.InvalidId", {id})
    }
    return contact
  }

  override function resolveReferenceByRef(ref : String, propertyKey : String, resolutionRoot : Object, context : ObjectUpdateContext, batchUpdateMap : BatchUpdateMap) : Object {
    var contactResource = batchUpdateMap.getNewResourceByRefid<ContactResource>(ContactResource, ref)
    if (contactResource == null) {
      throw new BadPropertyValueException(propertyKey + ".refid", "Rest.Common.V1.ContactValueResolver.InvalidRefId", {ref})
    }
    return contactResource.Contact
  }
}
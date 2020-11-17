package gw.rest.testsupport.v1.contacts

uses com.guidewire.pl.modules.rest.framework.v1.updater.handler.RestUpdateApplier
uses gw.api.contact.TooLooseContactSearchCriteriaException
uses gw.api.database.IQueryBeanResult
uses gw.api.json.JsonObject
uses gw.api.modules.rest.framework.v1.RestApiConstants
uses gw.api.modules.rest.framework.v1.batch.BatchUpdateMap
uses gw.api.modules.rest.framework.v1.resources.ResourceName
uses gw.api.modules.rest.framework.v1.resources.RestQueryCollectionResource
uses gw.api.modules.rest.framework.v1.updater.handler.UpdateMode
uses gw.api.rest.exceptions.BadInputException

/**
 * Resource for performing the contact search
 *
 * @param <C> The contact resource type
 */
@Export
@ResourceName("ContactSearch")
class ContactSearchResource extends RestQueryCollectionResource {

  var _body : JsonObject as readonly Body

  function init(body : JsonObject) {
    _body = body
  }

  @SuppressWarnings("HiddenPackageReference")
  private function findContacts(searchCriteria : ContactSearchCriteria) : IQueryBeanResult<KeyableBean> {
    var result = searchCriteria.performSearch(this.Bundle)
    return result as IQueryBeanResult<KeyableBean>
  }

  @SuppressWarnings("HiddenPackageReference")
  protected override function buildBaseQuery() : IQueryBeanResult<KeyableBean> {

    var searchCriteria = new ContactSearchCriteria(this.Bundle)
    var attributes = _body.getObject(RestApiConstants.DATA_PROP)?.getObject(RestApiConstants.ATTRIBUTES_PROP)
    if (attributes.get("companyName") != null and (attributes.get("lastName") != null or attributes.get("firstName") != null)) {
      throw new BadInputException("Cannot specify both company name and first/last name in contact search criteria")
    }

    var updater = this.OperationContext.Configuration.getUpdater(this.ResourceName)
    RestUpdateApplier.processUpdates(
        updater,
        searchCriteria,
        attributes,
        RestApiConstants.DATA_PROP + "." + RestApiConstants.ATTRIBUTES_PROP,
        BatchUpdateMap.EMPTY_MAP,
        UpdateMode.create
    )

    // set some logical defaults for subtype
    if (attributes.get("contactSubtype") == null) {
      if (attributes.get("companyName") != null) {
        searchCriteria.ContactSubtype = typekey.Contact.TC_COMPANY
      } else if (attributes.get("lastName") != null) {
        searchCriteria.ContactSubtype = typekey.Contact.TC_PERSON
      } else {
        searchCriteria.ContactSubtype = typekey.Contact.TC_CONTACT
      }
    }
    try {
      return findContacts(searchCriteria)
    } catch (tle : TooLooseContactSearchCriteriaException) {
      throw new BadInputException(tle.Message)
    }
  }

  override property get SelfUrl() : String {
    return getApiBasePath("testsupport") + "/search/contacts"
  }

  protected override property get ChildType() : Class<ContactResource> {
    return ContactResource
  }
}
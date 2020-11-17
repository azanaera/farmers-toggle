package gw.rest.testsupport.v1.search.policies

uses gw.api.modules.rest.framework.v1.resources.DefaultRestElementResource
uses gw.api.modules.rest.framework.v1.resources.ResourceName

@ResourceName("PolicySearchResult")
@Export
class PolicySearchResultResource extends DefaultRestElementResource<PolicySearchResource, PolicySummary> {

  protected override function loadElementById(elementId : String) : PolicySummary {
    throw new UnsupportedOperationException()
  }

  property get PolicySummary() : PolicySummary {
    return this.Element
  }

  override property get Checksum() : String {
    return null
  }

  /**
   * This resource is only ever used when building a response to /search/policies. It's never possible to get an
   * individual PolicySearchResultResource
   */
  override property get SelfUrl() : String {
    return null
  }
}
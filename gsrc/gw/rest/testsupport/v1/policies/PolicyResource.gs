package gw.rest.testsupport.v1.policies

uses gw.api.modules.rest.framework.v1.batch.BatchUpdateMap
uses gw.api.modules.rest.framework.v1.json.DataEnvelope
uses gw.api.modules.rest.framework.v1.resources.ResourceName
uses gw.api.modules.rest.framework.v1.resources.TestOnlyResource
uses gw.api.modules.rest.framework.v1.resources.VersionableRestElementResource
uses gw.api.rest.exceptions.BadInputException

@TestOnlyResource
@ResourceName("TestSupportPolicy")
@Export
class PolicyResource extends VersionableRestElementResource<PoliciesResource, Policy> {

  /**
   * The resource exists for test-support purposes only. It is not fully implemented, therefore there is no selfUrl
   */
  override property get SelfUrl() : String {
    return null
  }

  property get Policy() : Policy {
    return Element
  }

  override function finishCreate(data : DataEnvelope, batchUpdateMap : BatchUpdateMap) {
    validateRiskUnits()
  }

  private function validateRiskUnits() {
    if (!Policy.RestV1.LocationBasedRiskUnits.isEmpty() && !new PolicyRestV1SupportMethods(Policy).PropertyPolicy) {
      throw new BadInputException("LocationBasedRU can only be created for property related policies")
    }
  }

  protected override property get BeanType() : Class<Policy> {
    return entity.Policy
  }
}
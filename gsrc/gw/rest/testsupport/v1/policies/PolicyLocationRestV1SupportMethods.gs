package gw.rest.testsupport.v1.policies

uses gw.api.json.JsonObject
uses gw.api.modules.rest.framework.v1.updater.BadPropertyValueException
uses gw.api.util.TypeUtil

@Export
class PolicyLocationRestV1SupportMethods {
  private final var _policyLocation : PolicyLocation

  construct(policyLocation : PolicyLocation) {
    _policyLocation = policyLocation
  }

  function createLocationBasedRU(json : JsonObject) : LocationBasedRU {
    var code = json.getObject("subtype").getString("code")
    var subtype = typekey.RiskUnit.getTypeKey(code).EntityType
    if (!TypeUtil.isNominallyOrStructurallyAssignable(LocationBasedRU.Type, subtype)) {
      throw new BadPropertyValueException("subtype", "LITERAL", {"Risk unit should be sub classes of LocationBasedBU"})
    }
    var riskUnit = _policyLocation.Bundle.newBeanInstance(subtype) as LocationBasedRU
    _policyLocation.Policy.addToRiskUnits(riskUnit)
    return riskUnit
  }

  function createBuilding() : Building {
    var building = new Building(_policyLocation)
    _policyLocation.addToBuildings(building)
    return building
  }
}


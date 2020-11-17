package gw.cucumber.setup

@Export
class PolicyDataSet {

  private var _policyType : PolicyType
  private var _claimMode : ClaimMode
  private var _policyNumber : String

  construct(policyType : PolicyType, claimMode : ClaimMode = null, policyNumber : String = null) {
    _policyType = policyType
    _claimMode = claimMode
    _policyNumber = policyNumber
  }

  property get PolicyType() : PolicyType {
    return _policyType
  }

  property set PolicyType(policyType : PolicyType) {
    _policyType = policyType
  }

  property get ClaimMode() : ClaimMode {
    return _claimMode
  }

  property set ClaimMode(claimMode : ClaimMode) {
    _claimMode = claimMode
  }

  property get PolicyNumber() : String {
    return _policyNumber
  }

  property set PolicyNumber(policyNumber : String) {
    _policyNumber = policyNumber
  }
}
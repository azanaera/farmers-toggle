package gw.rest.testsupport.v1.policies

uses gw.rest.testsupport.v1.contacts.TestSupportPolicyContact

@Export
class PolicyRestV1SupportMethods {
  private final var _policy : Policy

  construct(policy : Policy) {
    _policy = policy
  }

  property get TestSupportPolicyContacts() : TestSupportPolicyContact[] {
    return new TestSupportPolicyContact[0]
  }

  property get PropertyPolicy() : boolean {
    return {PolicyType.TC_HOPHOMEOWNERS,
        PolicyType.TC_BUSINESSOWNERS,
        PolicyType.TC_COMMERCIALPROPERTY,
        PolicyType.TC_INLANDMARINE
    }.contains(_policy.PolicyType)
  }
}

package gw.rest.testsupport.v1.plugin.policy.datastore.impl

uses com.guidewire.pl.system.bundle.BundleUtil
uses gw.api.locale.DisplayKey
uses gw.api.util.DisplayableException
uses gw.pl.persistence.core.Bundle

@SuppressWarnings("HiddenPackageReference")
@Export
class TestSupportPolicyDataStore extends PolicySearchArrayDataStore {
  private var _policies : List<Policy>

  construct() {
    _policies = new ArrayList<Policy>()
  }

  override property get Policies() : Policy[] {
    return _policies.toTypedArray()
  }

  /**
   * Adds the policy to the data store.
   */
  function addPolicy(policy : Policy) {
    addPolicies({policy})
  }

  /**
   * Adds the policies to the data store.
   */
  function addPolicies(policiesToAdd : Collection<Policy>) {
    var newBundle = gw.transaction.Transaction.newBundle()
    for (policy in policiesToAdd) {
      _policies.add(copyPolicyToBundle(policy, newBundle))
    }
  }

  /**
   * Does defensive copy of all policy beans to the new bundle.
   */
  private function copyPolicyToBundle(policyToCopy : Policy, newBundle : Bundle) : Policy {
    var policyToAdd = BundleUtil.copyBeanGraphToBundle(policyToCopy, newBundle) as Policy
    if(newBundle.UpdatedBeans.Count>0 or newBundle.RemovedBeans.Count>0) {
      throw new DisplayableException(DisplayKey.get("LITERAL", "All beans in added Policy must be NEW"))
    }
    return policyToAdd
  }
}
package gw.rest.testsupport.v1.plugin.policy.impl

uses entity.Policy
uses gw.rest.testsupport.v1.plugin.policy.PolicyStorePlugin
uses gw.rest.testsupport.v1.plugin.policy.datastore.PolicySearchDataStore
uses gw.rest.testsupport.v1.plugin.policy.datastore.impl.TestSupportPolicyDataStore

@Export
class TestSupportPolicyPlugin extends DataStorePolicySearchPlugin implements PolicyStorePlugin {

  private var _dataStore : TestSupportPolicyDataStore

  construct() {
    _dataStore = new TestSupportPolicyDataStore()
  }

  /**
   * Returns the dynamically customizable implementation of the policy
   * search data store.
   */
  override protected property get DataStore() : PolicySearchDataStore {
    return _dataStore
  }

  /**
   * Adds a searchable Policy to the plugin. The policy will be copied
   * into a new bundle to prevent it from being accidentally committed.
   * An exception will be thrown if the argument is already persistent.
   */
  override function addPolicy(policy : Policy) {
    _dataStore.addPolicy(policy)
  }
}
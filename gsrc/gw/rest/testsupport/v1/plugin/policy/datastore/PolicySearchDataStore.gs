package gw.rest.testsupport.v1.plugin.policy.datastore

/**
 * Interface for the backing data store used for retrieving test
 * or demo policies from the IPolicySearchAdapter.
 */
@Export
interface PolicySearchDataStore {
  /**
   * Retrieves a Policy by its policy number and loss date.
   */
  public function getPolicy(policyNumber : String, lossDate : Date) : Policy
  
  /**
   * Retrieves (zero or more) policies according to the search criteria.
   */
  public function findPolicies(criteria : PolicySearchCriteria) : Policy[]
}

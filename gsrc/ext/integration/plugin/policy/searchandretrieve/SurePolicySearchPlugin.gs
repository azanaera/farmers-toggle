package ext.integration.plugin.policy.searchandretrieve

uses ext.integration.plugin.policy.SurePersonalAuto
uses gw.plugin.policy.search.IPolicySearchAdapter

class SurePolicySearchPlugin implements IPolicySearchAdapter{

  /**
   * Function retrieves a Policy from a Policy Summary
   *
   * @param aPolicySummary a Policy Summary for which we want the full Policy object
   * @return a Policy object which can be used to create a new claim
   */
  override function retrievePolicyFromPolicySummary(policySummary : PolicySummary) : PolicyRetrievalResultSet {
    var resultSet = new PolicyRetrievalResultSet()

    resultSet = SurePersonalAuto.retrievePersonalAutoPolicy(policySummary)

    return resultSet
  }

  /**
   * Function retrieves a Policy from a unverified Policy
   *
   * @param policy a Policy
   * @return an updated Policy object which can be used in an existing claim
   */
  override function retrievePolicyFromPolicy(policy : Policy) : PolicyRetrievalResultSet {
    var resultSet = new PolicyRetrievalResultSet()

    resultSet = SurePersonalAuto.retrievePersonalAutoPolicyFromPolicy(policy.PolicyNumber, policy.Claim.LossDate)

    return resultSet
  }

  /**
   * Function which takes in search criteria from step 1 of the New Claim Wizard and retrieves a set of policy summaries
   * by calling the appropriate method(s) for the input Policy Type
   *
   * @param criteria from the New Claim Wizard
   * @return a PolicySearchResult set containing a set of Policy Summaries for policies matching the search criteria
   */
  override function searchPolicies(criteria : PolicySearchCriteria) : PolicySearchResultSet {
    var resultsToReturn = new PolicySearchResultSet()

    resultsToReturn = SurePersonalAuto.searchForPersonalAutoPolicies(criteria)

    return resultsToReturn
  }

  override function retrievePolicySummaryFromPolicy(policy : Policy) : PolicySummary {
    return null
  }
}
package gw.rest.testsupport.v1.plugin.policy.impl

uses gw.api.locale.DisplayKey
uses gw.api.util.CCBundleUtil
uses gw.api.util.DisplayableException
uses gw.rest.testsupport.v1.plugin.policy.datastore.PolicySearchDataStore
uses gw.plugin.policy.search.IPolicySearchAdapter
uses gw.rest.testsupport.v1.plugin.policy.util.PolicySearchUtil
uses gw.rules.ExecutionSession

/**
 *  Data store based implementation of IPolicySearchAdapter for REST API testing purposes.
 */
@SuppressWarnings("HiddenPackageReference")
@Export
abstract class DataStorePolicySearchPlugin implements IPolicySearchAdapter {
  private var _dbAdapter = new com.guidewire.cc.plugin.policy.search.internal.PolicySearchDBAdapter() {
    protected override function convertPolicyToSummary(policy : Policy, insured : Contact) : PolicySummary {
      // fixes a bug in PolicySearchDemoAdapater where the summary's address and property addresses are not being correctly set
      var result = super.convertPolicyToSummary(policy, insured)
      if (insured != null && insured.PrimaryAddress != null) {
        result.AddressLine1 = insured.PrimaryAddress.AddressLine1
        result.AddressLine2 = insured.PrimaryAddress.AddressLine2
      }

      for (var propertySummary in result.Properties) {
        if (propertySummary.Address != null) {
          propertySummary.AddressLine1 = propertySummary.Address
          // We can assume if Address is filled out on the summary, that's what AddressLine1 should be.
          // But addressLine2 is harder to recover at this point because it's nowhere on the summary.
          // If it's really necessary we'd have to either match up policy properties with the corresponding propertySummaries to figure out the correct values
          // or copy the entire original implementation of the super method and correct the address fields accordingly.
          // Or ideally, we'd fix PolicySearchDemoAdapter in base CC and avoid the need for this override in the first place.
          // It doesn't seem immediately critical so it is being deliberately left out for now.
        }
      }
      return result
    }
  }

  /**
   * Implementations must override to provide the data store from which
   * policies will be searched and retrieved.
   */
  abstract protected property get DataStore() : PolicySearchDataStore

  override function searchPolicies(criteria : PolicySearchCriteria) : PolicySearchResultSet {
    var resultSet = new PolicySearchResultSet()
    resultSet.ResultsCapped = Boolean.FALSE
    var policies = DataStore.findPolicies(criteria)

    if (policies.length == 0) {
      return _dbAdapter.searchPolicies(criteria)
    }

    for (var policy in policies) {
      var summary = PolicySearchUtil.convertPolicyToSummary(policy)
      summary.LossDate = criteria.LossDate
      resultSet.addToSummaries(summary)
    }
    resultSet.UncappedResultCount = policies.length
    return resultSet
  }

  override function retrievePolicyFromPolicySummary(policySummary : PolicySummary) : PolicyRetrievalResultSet {
    var effectiveDate = policySummary.LossDate ?: policySummary.EffectiveDate
    var resultSet = retrievePolicy(policySummary.PolicyNumber, effectiveDate)
    if (resultSet.Result == null) {
      return _dbAdapter.retrievePolicyFromPolicySummary(policySummary)
    }
    filterRiskUnits(resultSet.Result, policySummary)
    return resultSet
  }

  private function filterRiskUnits(policy:Policy, policySummary:PolicySummary) {
    if (!isPolicySummaryApplicable(policySummary)) {
      return
    }
    if (policy != null) {
      policy.RiskUnits = policy.RiskUnits.where(\riskUnit -> isRiskUnitOnThePolicySummary(riskUnit, policySummary))
    }
  }

  private function isPolicySummaryApplicable(policySummary : PolicySummary) : boolean {
    var selectedCount = policySummary.Properties.countWhere(\aProperty -> aProperty.Selected == true) +
        policySummary.Vehicles.countWhere(\vehicle -> vehicle.Selected == true)
    return policySummary.ContentExtensions.CanSelectRiskUnits || selectedCount != 0
  }

  private function isRiskUnitOnThePolicySummary(riskUnit : RiskUnit, policySummary : PolicySummary) : boolean {
    if (riskUnit typeis VehicleRU) {
      return isVehicleRiskUnitOnThePolicySummary(riskUnit, policySummary)
    }
    if (riskUnit typeis LocationBasedRU) {
      return isLocationBasedRiskUnitOnThePolicySummary(riskUnit, policySummary)
    }
    return true
  }

  private function isVehicleRiskUnitOnThePolicySummary(riskUnit : VehicleRU, policySummary : PolicySummary) : boolean {
    var policySummaryVehicles = policySummary.Vehicles.where(\vehicle -> vehicle.Selected
        and policySummary.ContentExtensions.matchVehicle(riskUnit, vehicle))
    return policySummaryVehicles.Count > 0
  }

  private function isLocationBasedRiskUnitOnThePolicySummary(riskUnit : LocationBasedRU, policySummary : PolicySummary): boolean {
    var policySummaryProperties = policySummary.Properties.where(\aProperty -> aProperty.Selected
        and policySummary.ContentExtensions.matchProperty(riskUnit, aProperty))
    return policySummaryProperties.Count > 0
  }

  /**
   * Retrieves the policy from the underlying datastore using the given policy. The policy
   * argument should be persistent, i.e. has a Claim with a Claim.LossDate populated.
   */
  override function retrievePolicyFromPolicy(policy : Policy) : PolicyRetrievalResultSet {
    var date = policy.Claim!=null ? policy.Claim.LossDate : policy.EffectiveDate
    var resultSet = retrievePolicy(policy.PolicyNumber, date)
    if (resultSet.Result == null) {
      return _dbAdapter.retrievePolicyFromPolicy(policy)
    }
    return resultSet
  }

  override function retrievePolicySummaryFromPolicy(policy : Policy) : PolicySummary {
    var resultSet = retrievePolicy(policy.PolicyNumber, policy.Claim.LossDate)
    if (resultSet.Result == null) {
      return _dbAdapter.retrievePolicySummaryFromPolicy(policy)
    }
    var summary : PolicySummary = null
    summary = PolicySearchUtil.convertPolicyToSummary(resultSet.Result)
    summary.LossDate = policy.Claim.LossDate
    return summary
  }

  private function retrievePolicy(policyNumber : String, lossDate : Date) : PolicyRetrievalResultSet {
    var policy : Policy
    var resultSet = new PolicyRetrievalResultSet(gw.transaction.Transaction.newBundle())
    if (lossDate == null) {
      throw new DisplayableException(DisplayKey.get("Java.PolicyItemHandler.LossDateRequired"))
    }

    try {
      policy = DataStore.getPolicy(policyNumber, lossDate)
    } catch (e : Exception) {
      ExecutionSession.getContextualLogger().error(e.Message)
      resultSet.NotUnique = true
      return resultSet
    }

    resultSet.NotUnique = false
    if (policy == null) {
      return resultSet
    }

    var copiedPolicy = CCBundleUtil.copyBeanGraphToBundle(policy, resultSet.Bundle) as Policy
    ensureCurrencyIsSetForAllCoverages(copiedPolicy)
    resultSet.Result = copiedPolicy
    return resultSet
  }

  private function ensureCurrencyIsSetForAllCoverages(policy : Policy) {
    policy.AllCoverages.each(\coverage -> {
      if (coverage.Currency == null) {
        coverage.Currency = policy.Currency
      }
    })
  }
}

package gw.rest.testsupport.v1.plugin.policy.datastore.impl

uses entity.Person
uses gw.api.locale.DisplayKey
uses gw.rest.testsupport.v1.plugin.policy.util.PolicySearchUtil
uses gw.rest.testsupport.v1.plugin.policy.datastore.PolicySearchDataStore
uses gw.util.GosuStringUtil
uses typekey.SearchContactType
uses entity.Company
uses java.lang.String
uses entity.PolicySearchCriteria
uses entity.Address
uses java.util.Date
uses gw.api.util.DisplayableException

/**
 * Base class for customizable Policy data stores to be used in test
 * Policy search adapters.
 */
@Export
abstract class PolicySearchArrayDataStore implements PolicySearchDataStore {

  /**
   * Template property to retrieve all of the searchable policies.
   */
  abstract property get Policies() : Policy[]

  /**
   * Returns the Policy for the given policy number and loss date. Throws an
   * exception if it is not unique or no policy is found.
   */
  override function getPolicy(policyNumber : String, lossDate : Date) : Policy {
    var foundPolicies = Policies.where(\policy -> policy.PolicyNumber == policyNumber and isPolicyValidForLossDate(policy, lossDate))
    if (foundPolicies.length > 1) {
      throw new RuntimeException("The policy store was not able to find a unique policy for policy number " + policyNumber + " and date " + lossDate + ". Expected 1, found " + foundPolicies.length)
    }
    if (foundPolicies.length == 0) {
      throw new RuntimeException("The policy store was not able to find any policy for policy number " + policyNumber + " and date " + lossDate + ".")
    }
    return foundPolicies.single()
  }

  private static function isPolicyValidForLossDate(policy : Policy, lossDate : Date) : boolean {
    return lossDate == null or (policy.EffectiveDate <= lossDate and policy.ExpirationDate >= lossDate)
  }

  /**
   * Finds all policies according to the given policy search criteria.
   */
  override function findPolicies(criteria : PolicySearchCriteria) : Policy[] {
    return Policies.where(\policy -> policyMatchesCriteria(policy, criteria))
  }

  protected function policyMatchesCriteria(policy : Policy, criteria : PolicySearchCriteria) : boolean {
    return basicCriteriaMatch(policy, criteria) and contactFieldsMatch(policy, criteria) and taxIdsMatch(policy, criteria)
        and adressesMatch(policy, criteria) and vinNumbersMatch(policy, criteria)
  }
  
  /**
   * Test whether or not the basic search criteria match the given Policy, including the
   * loss date vs. effective/expiration dates, the policy type and loss type, and the
   * policy number.
   */
  private static function basicCriteriaMatch(policy:Policy, criteria:PolicySearchCriteria) : boolean {
    return isPolicyValidForLossDate(policy, criteria.LossDate) and policyTypesMatch(policy, criteria) and
        lossTypesMatch(policy, criteria) and policyNumbersMatch(policy, criteria)
  }

  private static function policyTypesMatch(policy : Policy, criteria : PolicySearchCriteria) : boolean {
    return criteria.PolicyType == null or criteria.PolicyType == policy.PolicyType
  }

  private static function lossTypesMatch(policy : Policy, criteria : PolicySearchCriteria) : boolean {
    var potentialLossTypes = policy.PotentialLossTypes
    var lossType = potentialLossTypes.HasElements ? potentialLossTypes.first() : null
    return criteria.LossType == null or criteria.LossType == lossType
  }

  private static function policyNumbersMatch(policy : Policy, criteria : PolicySearchCriteria) : boolean {
    return GosuStringUtil.isEmpty(criteria.PolicyNumber) or
        (policy.PolicyNumber != null and policy.PolicyNumber.startsWith(criteria.PolicyNumber))
  }

  private static function contactFieldsMatch(policy : Policy, criteria : PolicySearchCriteria) : boolean {
    if (!isContactSearchable(criteria)) {
      return true
    }
    var isCompany = criteria.ContactType == SearchContactType.TC_COMPANY or criteria.CompanyName.HasContent
    var isPerson = criteria.ContactType == SearchContactType.TC_PERSON or criteria.FirstName.HasContent or criteria.LastName.HasContent
    if (isCompany and not isPerson) {
      return companyContactsMatch(policy, criteria)
    } else if (isPerson and not isCompany) {
      return personContactsMatch(policy, criteria)
    } else {
      throw new DisplayableException(DisplayKey.get("LITERAL", "Invalid Search Criteria: Cannot have CompanyName and FirstName/LastName populated or incompatible SearchContactType and name fields"))
    }
  }

  private static function isContactSearchable(criteria : PolicySearchCriteria) : boolean {
    return criteria.ContactType != null or criteria.CompanyName !=null or criteria.FirstName !=null or criteria.LastName !=null
  }

  private static function companyContactsMatch(policy : Policy, criteria : PolicySearchCriteria) : boolean {
    var insured = PolicySearchUtil.getPolicyInsured(policy)
    return insured != null and insured typeis Company and stringEmptyOrEquals(criteria.CompanyName, insured.Name)
  }

  private static function personContactsMatch(policy : Policy, criteria : PolicySearchCriteria) : boolean {
    var insured = PolicySearchUtil.getPolicyInsured(policy)
    return insured != null and insured typeis Person and stringEmptyOrEquals(criteria.FirstName, insured.FirstName) and stringEmptyOrEquals(criteria.LastName, insured.LastName)
  }

  private static function taxIdsMatch(policy : Policy, criteria : PolicySearchCriteria) : boolean {
    var insured = PolicySearchUtil.getPolicyInsured(policy)
    return GosuStringUtil.isEmpty(criteria.TaxIdString) or (insured != null and stringEmptyOrEquals(criteria.TaxIdString, insured.TaxID))
  }

  private static function adressesMatch(policy : Policy, criteria : PolicySearchCriteria) : boolean {
    return insuredAddressesMatch(policy, criteria.InsuredAddress) and propertyAddressMatches(policy, criteria.PropertyAddress)
  }

  private static function insuredAddressesMatch(policy : Policy, address : Address) : boolean {
    if (!hasAddressSearchableData(address)) {
      return true
    }
    var insured = PolicySearchUtil.getPolicyInsured(policy)
    return insured != null and insured.AllAddresses.hasMatch(\insuredAddress-> addressEmptyOrEqual(address, insuredAddress))
  }

  private static function propertyAddressMatches(policy : Policy, address : Address) : boolean {
    if (!hasAddressSearchableData(address)) {
      return true
    }
    return policy.PolicyLocations.hasMatch(\ pl -> addressEmptyOrEqual(address, pl.Address))
  }

  private static function hasAddressSearchableData(address : Address) : boolean {
    return address != null and
        (address.City.HasContent or
            address.PostalCode.HasContent or
            address.State != null or
            address.Country != null)
  }

  private static function vinNumbersMatch(policy : Policy, criteria : PolicySearchCriteria) : boolean {
    return criteria.Vin == null or policy.Vehicles.hasMatch(\vehicleRU -> stringEmptyOrEquals(criteria.Vin, vehicleRU.Vehicle.Vin))
  }

  private static function addressEmptyOrEqual(actual : Address, expected : Address) : boolean {
    if (actual == null ) {
      return true
    }
    if (expected == null) {
      return false
    }
    return stringEmptyOrEquals(actual.AddressLine1, expected.AddressLine1) and
        stringEmptyOrEquals(actual.City, expected.City) and
        stringEmptyOrEquals(actual.PostalCode, expected.PostalCode) and
        (actual.State == null or actual.State == expected.State) and
        (actual.Country == null or actual.Country == expected.Country)
  }

  private static function stringEmptyOrEquals(actual : String, expected : String) : boolean {
    if (GosuStringUtil.isEmpty(actual)) {
      return true
    }
    if (expected == null) {
      return false
    }
    return expected.toLowerCase().startsWith(actual.toLowerCase())
  }
}

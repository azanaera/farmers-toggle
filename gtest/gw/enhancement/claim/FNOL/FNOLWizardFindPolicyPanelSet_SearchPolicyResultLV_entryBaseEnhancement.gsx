package gw.enhancement.claim.FNOL

uses gw.api.locale.DisplayKey
uses gw.smoketest.platform.web.ValueElement
uses pcftest.FNOLWizardFindPolicyPanelSet_Search

enhancement FNOLWizardFindPolicyPanelSet_SearchPolicyResultLV_entryBaseEnhancement : FNOLWizardFindPolicyPanelSet_Search.PolicyResultLV.entry {

  function verifyMatchesCriteria(criteria : Map<String, String>) : boolean {
    return fieldMatchesExpectedValue(this.Insured, criteria.get(DisplayKey.get("Web.ContactDetail.Person.FirstName")))
        and fieldMatchesExpectedValue(this.Insured, criteria.get(DisplayKey.get("Web.ContactDetail.Person.LastName")))
        and fieldMatchesExpectedValue(this.Insured, criteria.get(DisplayKey.get("Web.AddressBook.Search.OrganizationName")))
        and fieldMatchesExpectedValue(this.City, criteria.get(DisplayKey.get("entity.Address.City")))
        and fieldMatchesExpectedValue(this.State, criteria.get(DisplayKey.get("entity.Address.State")))
        and fieldMatchesExpectedValue(this.Zip, criteria.get(DisplayKey.get("Web.Address.Default.ZIP")))
        and fieldMatchesExpectedValue(this.Type, criteria.get(DisplayKey.get("NVV.Policy.PolicySearch.Policy.PolicyType")))
  }

  private function fieldMatchesExpectedValue(field : ValueElement, expected : String) : boolean {
    return expected == null or expected.Empty or field.Text.contains(expected)
  }

}

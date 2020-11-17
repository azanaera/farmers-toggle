package gw.enhancement.claim.FNOL

uses gw.smoketest.platform.web.IteratorEntriesWithPaging
uses gw.smoketest.platform.web.ValueElement
uses pcftest.FNOLWizardFindPolicyPanelSet_Search

enhancement FNOLWizard_FindPolicyScreenBaseEnhancement : pcftest.FNOLWizard_FindPolicyScreen {

  property get SearchPanel() : pcftest.FNOLWizardFindPolicyPanelSet_Search {
    return this.FNOLWizardFindPolicyPanelSet_Search
  }
  function findPolicy(policyNumber : String) : pcftest.FNOLWizardFindPolicyPanelSet_Search {
    this.setToFindMode()
    // A selected policy result disables the search and reset buttons on this search screen.
    // Unselect to allow searching.
    if (SearchPanel.getPolicyResultLV()._Entries.Count > 0) {
      SearchPanel.getPolicyResultLV()._Entries.where(\result -> result.unselectButton.Visible)
          .forEach(\selected -> selected.unselectButton.click())
    }
    SearchPanel.policyNumber.Value = policyNumber
//    SearchPanel.Search.click()
    return SearchPanel
  }

  function findPolicy(policyNumber : String, lossDate : Date) : pcftest.FNOLWizardFindPolicyPanelSet_Search {
    findPolicy(policyNumber)
    SearchPanel.date.DateValue = lossDate
    return SearchPanel
  }

  function setToFindMode() : pcftest.FNOLWizard_FindPolicyScreen {
    // if the ScreenMode control isn't visible, then the user doesn't have permission to create a policy
    // and therefore should already be in find mode
    if (this.ScreenMode.Visible) {
      this.ScreenMode.BoolValue = true
    }
    return this
  }

  function setPolicyType(policyType : PolicyType) {
    this.FNOLWizardFindPolicyPanelSet_Search.PolicyType.getOptionByTypeKey(policyType).click()
  }

  function setFirstName(firstName : String) {
    if (firstName.HasContent) {
      this.SearchPanel.GlobalPersonNameInputSet_default.FirstName.Value = firstName
    }
  }

  function setLastName(lasttName : String) {
    if (lasttName.HasContent) {
      this.SearchPanel.GlobalPersonNameInputSet_default.LastName.Value = lasttName
    }
  }

  function setOrganizationName(organizationName : String) {
    if (organizationName.HasContent) {
      this.SearchPanel.GlobalContactNameInputSet_default.Name.Value = organizationName
    }
  }

  function setPolicyType(policyType : String) {
    if (policyType.HasContent) {
      this.SearchPanel.PolicyType.getOptionByLabel(policyType).click()
    }
  }

  function setCountry(country : String) {
    if (country.HasContent) {
      var countryWidget = this.SearchPanel.FNOLWizard_PolicySearchInputSet_default.CCAddressInputSet.globalAddressContainer.globalAddress.GlobalAddressInputSet_default.Country
      countryWidget.getOptionByLabel(country).click()
    }
  }

  function setCity(city : String) {
    if (city.HasContent) {
      var cityWidget = this.SearchPanel.FNOLWizard_PolicySearchInputSet_default.CCAddressInputSet.globalAddressContainer.globalAddress.GlobalAddressInputSet_default.City
      cityWidget.Value = city
    }
  }

  function setState(state : String) {
    if (state.HasContent) {
      var stateWidget = this.SearchPanel.FNOLWizard_PolicySearchInputSet_default.CCAddressInputSet.globalAddressContainer.globalAddress.GlobalAddressInputSet_default.State
      stateWidget.getOptionByLabel(state).click()
    }
  }

  function setZip(zip : String) {
    if (zip.HasContent) {
      var zipWidget = this.SearchPanel.FNOLWizard_PolicySearchInputSet_default.CCAddressInputSet.globalAddressContainer.globalAddress.GlobalAddressInputSet_default.PostalCode
      zipWidget.Value = zip
    }
  }

  function setVIN(vin : String) {
    if (vin.HasContent) {
      this.SearchPanel.FNOLWizard_PolicySearchInputSet_default.vin.Value = vin
    }
  }

  function verifyPoliciesMatchAGivenPolicyNumber(policyNumber : String) : boolean {
    return policiesAreFound() and allPoliciesMatchPolicyNumber(this.FNOLWizardFindPolicyPanelSet_Search.PolicyResultLV, policyNumber)
  }

  private function policiesAreFound() : boolean {
    return this.FNOLWizardFindPolicyPanelSet_Search.PolicyResultLV._Entries.HasElements
  }

  private function allPoliciesMatchPolicyNumber(policies : FNOLWizardFindPolicyPanelSet_Search.PolicyResultLV, policyNumber : String) : boolean {
    return not policies._Entries.hasMatch(\policy -> policy.PolicyNumber.Value != policyNumber);
  }
}

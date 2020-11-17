package gw.enhancement.claim.FNOL

uses gw.api.locale.DisplayKey
uses junit.framework.Assert

enhancement FNOLWizard_AutoFirstAndFinalScreenTestEnhancement : pcftest.FNOLWizard_AutoFirstAndFinalScreen {

  property get Wizard() : pcftest.FNOLWizard {
    return this.SmokeTest.CurrentPage as pcftest.FNOLWizard
  }

  function assertOnStep() {
    Assert.assertTrue("Should be on 'auto first and final' wizard step", Wizard.QuickClaimAutoFirstAndFinal.Current)
  }

  function setRequiredFieldsIfNotPresent() {
    var lossLocation = this.CCAddressInputSet
    if (lossLocation.Address_Picker.Value == "<none>" or lossLocation.Address_Picker.Text == "New...") {
      lossLocation.setAddress("200 Somewhere Street", "San Mateo", TC_CA, "94404")
    }

    var firstAndFinalPanelSetVendor = this.AutoFirstAndFinalReportedPanelSet.FNOLWizardAutoFirstAndFinalPanelSet_VENDOR
    if (firstAndFinalPanelSetVendor.GlassScreenVendorReporter.Visible and firstAndFinalPanelSetVendor.GlassScreenVendorReporter.Value.isEmpty()) {
      var contact = firstAndFinalPanelSetVendor.GlassScreenVendorReporter.ClaimNewRepairShopOnlyPickerMenuItemSet.NewContactPickerMenuItemSet_AutoRepairShop.click()
      contact.ContactDetailScreen.ContactBasicsDV_AutoRepairShop.OrganizationName.GlobalContactNameInputSet_default.Name.Value = "test"
      contact.ContactDetailScreen.ContactBasicsDV_AutoRepairShop.PrimaryAddressInputSet.CCAddressInputSet.setAddress("100 Somewhere Street", "San Mateo", TC_CA, "94404")
      contact.ContactDetailScreen.update()
    }

    if (this.Description.Value.isEmpty()) {
      this.Description.Value = "Hit by a meteorite."
    }

    if (this.Claimant_Picker.Value.isEmpty()) {
      this.Claimant_Picker.selectFirstValidOption()
      this.Claimant_Type.clickByLabelSubstr("Other")
    }

    if (this.RepairShop_Picker.Visible and this.RepairShop_Picker.Value.isEmpty()) {
      newRepairShop("auto1")
    }

    if (this.ReadyToPay.BoolValue) {
      if (this.FNOLWizardCheckDV_ready.Payee_Picker.Value.isEmpty()) {
        this.FNOLWizardCheckDV_ready.Payee_Picker.selectFirstValidOption()
        this.FNOLWizardCheckDV_ready.PayeeRole.selectFirstValidOption()
      }

      if (this.FNOLWizardCheckDV_ready.MailingAddressInputSet.CCAddressInputSet.Address_City.Value.isEmpty()) {
        this.FNOLWizardCheckDV_ready.MailingAddressInputSet.CCAddressInputSet.Address_City.Value = "San Mateo"
      }

      if (this.FNOLWizardCheckDV_ready.MailingAddressInputSet.CCAddressInputSet.Address_State.Value.isEmpty()) {
        this.FNOLWizardCheckDV_ready.MailingAddressInputSet.CCAddressInputSet.Address_State.selectFirstValidOption()
      }
    }
  }

  function setRequiredFieldsExcludingRepairShop() {
    this.FirstFinalReportedAgencyRadioButton.getOptionByLabel("Insured").click()
    this.AutoFirstAndFinalReportedPanelSet.FNOLWizardAutoFirstAndFinalPanelSet_INSURED.FirstAndFinalScreenInsuredClaimant.selectFirstValidOption()
    this.Vehicle_Name.selectFirstValidOption()
    this.Description.Value = "Hit by a meteorite."
    this.Claimant_Picker.selectFirstValidOption()
    this.Claimant_Type.getOptionByLabel("Employee").click()
    this.FNOLWizardCheckDV_ready.Payee_Picker.selectFirstValidOption()
    this.FNOLWizardCheckDV_ready.PayeeRole.getOptionByLabel("Other").click()
    this.FNOLWizardCheckDV_ready.CheckAmount.Value = "515"
    this.FNOLWizardCheckDV_ready.CheckMailTo.Value = "Temp address"
    this.CCAddressInputSet.Address_Picker.selectFirstValidOption()
    if (this.FNOLWizardCheckDV_ready.ApplyDeductible.Visible) {
      this.FNOLWizardCheckDV_ready.ApplyDeductible.BoolValue = true
    }
  }

  function setRequiredFields() {
    setRequiredFieldsExcludingRepairShop()
    selectNamedRepairShop("European")
  }

  function setRequiredFieldsIncludingNewRepairShop(newRepairShopName : String) {
    setRequiredFieldsExcludingRepairShop()
    newRepairShop(newRepairShopName)
  }

  function newRepairShop(newRepairShopName : String) {
    var newContactPopup = this.RepairShop_Picker.ClaimNewRepairShopOnlyPickerMenuItemSet.NewContactPickerMenuItemSet_AutoRepairShop.click()
    var contactBasicsDV_repairShop = newContactPopup.ContactDetailScreen.ContactBasicsDV_AutoRepairShop
    contactBasicsDV_repairShop.OrganizationName.GlobalContactNameInputSet_default.Name.Value = newRepairShopName

    var addressInputSet = contactBasicsDV_repairShop.PrimaryAddressInputSet.CCAddressInputSet
    addressInputSet.Address_AddressLine1.Value = "Address line 1"
    addressInputSet.Address_City.Value = "San Jose"
    addressInputSet.Address_State.clickByLabelSubstr("California")
    newContactPopup.update()
  }

  function searchForRepairShop() : pcftest.AddressBookPickerPopup {
    return this.RepairShop_Picker.MenuItem_Search.click()
  }

  function selectNamedRepairShop(name : String) : pcftest.FNOLWizard_AutoFirstAndFinalScreen {
    var addressBookPickerPopup = searchForRepairShop()
    // the initial values for the state and country drop-downs are taken from the claim's loss location, which may not
    // match the repair shop we are looking for for existing tests, so just
    addressBookPickerPopup.AddressBookSearchScreen.AddressBookSearchDV.CCAddressBookSearchLocationInputSet.CCAddressInputSet.Address_State.clickByLabelSubstr(DisplayKey.get("Java.NameValueView.NoneSelected"))
    addressBookPickerPopup.AddressBookSearchScreen.AddressBookSearchDV.CCAddressBookSearchLocationInputSet.CCAddressInputSet.globalAddressContainer.globalAddress.GlobalAddressInputSet_default.Country.clickByLabelSubstr(DisplayKey.get("Java.NameValueView.NoneSelected"))
    var fnolWizard = addressBookPickerPopup.pickByKeyword(name, false) as pcftest.FNOLWizard
    return fnolWizard.QuickClaimAutoFirstAndFinal.FNOLWizard_AutoFirstAndFinalScreen
  }
}

package gw.enhancement.claim.FNOL.auto

uses gw.smoketest.platform.web.OptionElement
uses gw.smoketest.platform.web.SelectElement
uses pcftest.FNOLWizard
uses pcftest.FNOLWizardAutoFirstAndFinalPanelSet_INSURED
uses pcftest.FNOLWizardAutoFirstAndFinalPanelSet_VENDOR
uses pcftest.FNOLWizard_AutoFirstAndFinalScreen

enhancement QuickClaimAutoFirstAndFinalEnhnacement : FNOLWizard.QuickClaimAutoFirstAndFinal {

  property get Wizard() : pcftest.FNOLWizard {
    return this.SmokeTest.CurrentPage as pcftest.FNOLWizard
  }

  property get AutoFirstAndFinalReportedPanelSet() : FNOLWizard_AutoFirstAndFinalScreen.AutoFirstAndFinalReportedPanelSet {
    return this.FNOLWizard_AutoFirstAndFinalScreen.AutoFirstAndFinalReportedPanelSet
  }

  property get WhoReportedClaim() : FNOLWizard_AutoFirstAndFinalScreen.FirstFinalReportedAgencyRadioButton {
    return this.FNOLWizard_AutoFirstAndFinalScreen.FirstFinalReportedAgencyRadioButton
  }

  property get InsuredReported() : FNOLWizardAutoFirstAndFinalPanelSet_INSURED.FirstAndFinalScreenInsuredClaimant {
    return this.AutoFirstAndFinalReportedPanelSet.FNOLWizardAutoFirstAndFinalPanelSet_INSURED.FirstAndFinalScreenInsuredClaimant
  }

  property get VendorReported() : FNOLWizardAutoFirstAndFinalPanelSet_VENDOR.GlassScreenVendorReporter {
    return this.AutoFirstAndFinalReportedPanelSet.FNOLWizardAutoFirstAndFinalPanelSet_VENDOR.GlassScreenVendorReporter
  }

  property get Vehicle_Name() : SelectElement<OptionElement> {
    return this.FNOLWizard_AutoFirstAndFinalScreen.Vehicle_Name
  }

  function setReportedByToInsured() {
    this.WhoReportedClaim.TypeKeyValue = FirstFinalReportedAgency.TC_INSURED
    if (this.InsuredReported.Value.isEmpty()) {
      this.InsuredReported.selectFirstValidOption()
    }
  }

  function setReportedByToThirdParty() {
    this.WhoReportedClaim.TypeKeyValue = FirstFinalReportedAgency.TC_VENDOR
    var newContactPopup = this.VendorReported.ClaimNewRepairShopOnlyPickerMenuItemSet.NewContactPickerMenuItemSet_AutoRepairShop.click()
    newContactPopup.ContactDetailScreen.setRequiredFieldsIfNotPresent()
    newContactPopup.update()
  }

}

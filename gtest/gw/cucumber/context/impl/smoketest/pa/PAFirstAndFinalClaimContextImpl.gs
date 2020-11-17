package gw.cucumber.context.impl.smoketest.pa

uses gw.api.locale.DisplayKey
uses gw.cucumber.context.api.pa.PAClaimContext
uses gw.cucumber.util.common.UIHelper
uses pcftest.NewClaimSaved
uses pcftest.NewContactPopup

@SuppressWarnings("unused")
class PAFirstAndFinalClaimContextImpl extends PAClaimContextImpl implements PAClaimContext {

  override function startFilingAutoFirstAndFinal() {
    var wizard = _proxy.TabBar.goToNewClaim()
    if (_policyDataSetWrapper.get() != null) {
      wizard.SelectPolicy.findPolicy(_policyDataSetWrapper.get().PolicyNumber, Date.Today)
      wizard.SelectPolicy.SearchPanel.Search.click()
      wizard.SelectPolicy.FNOLWizardFindPolicyPanelSet_Search.ClaimMode.clickByLabelSubstr(DisplayKey.get("Wizard.NewClaimWizard.AutoFirstAndFinal.Label"))
    }
  }

  override function reportedByInsured() {
    var wizard = Wizard
    wizard.goToAutoFirstAndFinal()
    wizard.QuickClaimAutoFirstAndFinal.setReportedByToInsured()
  }

  override function reportedByThirdParty() {
    var wizard = Wizard
    wizard.goToAutoFirstAndFinal()
    wizard.QuickClaimAutoFirstAndFinal.setReportedByToThirdParty()
  }

  override function selectInvolvedVehicle(indexString : String) {
    var index = indexString.substring(0, 1).toInt() - 1

    var wizard = Wizard
    wizard.goToAutoFirstAndFinal()
    var vehicleDisplayName = wizard.QuickClaimAutoFirstAndFinal.Vehicle_Name.OptionLabels[index]
    wizard.QuickClaimAutoFirstAndFinal.Vehicle_Name.clickByLabelSubstr(vehicleDisplayName)
    _vehicleDisplayNameWrapper.set(vehicleDisplayName)
  }

  override function addRepairShop(name : String) {
    var wizard = Wizard
    wizard.goToAutoFirstAndFinal()

    var newContactPopup : NewContactPopup
    if (wizard.QuickClaimAutoFirstAndFinal.WhoReportedClaim.TypeKeyValue == FirstFinalReportedAgency.TC_VENDOR) {
      newContactPopup = wizard.QuickClaimAutoFirstAndFinal.VendorReported
          .ClaimNewRepairShopOnlyPickerMenuItemSet.NewContactPickerMenuItemSet_AutoRepairShop.click()
    } else {
      newContactPopup = wizard.QuickClaimAutoFirstAndFinal.FNOLWizard_AutoFirstAndFinalScreen.RepairShop_Picker
          .ClaimNewRepairShopOnlyPickerMenuItemSet.NewContactPickerMenuItemSet_AutoRepairShop.click()
    }
    var contactBasicsDV_repairShop = newContactPopup.ContactDetailScreen.ContactBasicsDV_AutoRepairShop
    contactBasicsDV_repairShop.OrganizationName.GlobalContactNameInputSet_default.Name.Value = name

    var addressInputSet = contactBasicsDV_repairShop.PrimaryAddressInputSet.CCAddressInputSet
    addressInputSet.Address_AddressLine1.Value = "Address line 1"
    addressInputSet.Address_City.Value = "San Jose"
    addressInputSet.Address_State.clickByLabelSubstr("California")
    newContactPopup.ContactDetailScreen.setRequiredFieldsIfNotPresent()
    var location = newContactPopup.update()
    UIHelper.assertNoMessages(location)
  }

  override function setInsuredAsClaimant() {
    var wizard = Wizard
    wizard.goToAutoFirstAndFinal()
    var insured = wizard.ClaimInfoBar.Insured.Text.substring(DisplayKey.get("Web.ClaimInfoBar.Insured").length()).trim()
    wizard.QuickClaimAutoFirstAndFinal.FNOLWizard_AutoFirstAndFinalScreen.Claimant_Picker.clickByLabelSubstr(insured)
    wizard.QuickClaimAutoFirstAndFinal.FNOLWizard_AutoFirstAndFinalScreen.Claimant_Type.clickByLabelSubstr(ClaimantType.TC_INSURED.DisplayName)
  }

  override function selectReadyToPay(readyToPayText : String) {
    var readyToPay = Boolean.valueOf(readyToPayText)
    var wizard = Wizard
    wizard.goToAutoFirstAndFinal()
    var autoFirstAndFinalScreen = wizard.QuickClaimAutoFirstAndFinal.FNOLWizard_AutoFirstAndFinalScreen
    autoFirstAndFinalScreen.ReadyToPay.BoolValue = readyToPay
  }

  override function finishFilingClaim() {
    var wizard = Wizard
    wizard.goToAutoFirstAndFinal()

    wizard.QuickClaimAutoFirstAndFinal.FNOLWizard_AutoFirstAndFinalScreen.setRequiredFieldsIfNotPresent()

    var newClaimSaved = wizard.finish()
    if (wizard.ignoreDuplicateClaimsWarningIfPresent()) {
      newClaimSaved = wizard.finish()
    }
    captureNewlyCreatedClaim((newClaimSaved as NewClaimSaved).ClaimEntity)
  }

}
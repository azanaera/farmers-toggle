package gw.enhancement.claim.FNOL

uses gw.api.util.DateUtil
uses gw.enhancement.validationmessagehandler.FinishCancellableValidationMessageHandler
uses gw.smoketest.platform.web.PCFLocation
uses gw.testharness.v3.PLAssertions
uses org.junit.Assert
uses pcftest.ClaimSummary
uses pcftest.FNOLWizard
uses pcftest.FNOLWizard_NewLossDetailsPanelSet_CommercialProperty
uses pcftest.FNOLWizard_ServicesPolicyPanelSet_CommercialProperty
uses pcftest.NewClaimSaved

enhancement FNOLWizardTestEnhancement : pcftest.FNOLWizard {

  property get ValidationMessageHandler() : FinishCancellableValidationMessageHandler<FNOLWizard, NewClaimSaved> {
    return new (this)
  }

  function finishSuccessfully() : NewClaimSaved {
    return ValidationMessageHandler.finishSuccessfully()
  }

  function finishAndGotoClaim() : ClaimSummary {
    var saved = finishSuccessfully()
    return saved.goToClaim()
  }

  /**
   * Note that cancel does not always go to DesktopActivities - e.g.
   * for customer service reps cancel will take them to the claim search
   * page, because they don't have access to DesktopActivities
   */
  function cancel() : PCFLocation {
    return this.Cancel.click()
  }

  property get BasicInfoWC() : pcftest.FNOLWizard_BasicInfoScreen_WC {
    return this.BasicInfo.WC
  }

  property get BasicInfoHomeowners() : pcftest.FNOLWizard_BasicInfoScreen_default {
    return this.BasicInfo.FNOLWizard_BasicInfoScreen_default
  }

  property get InvolvedPropertiesCommercialProperty() : pcftest.FNOLWizard_PickPolicyRiskUnitsScreen {
    return this.SelectRiskUnitsStep.FNOLWizard_PickPolicyRiskUnitsScreen
  }

  property get BasicInfoCommercialProperty() : pcftest.FNOLWizard_BasicInfoScreen_default {
    return this.BasicInfo.FNOLWizard_BasicInfoScreen_default
  }

  property get BasicInfoTravel() : pcftest.FNOLWizard_BasicInfoScreen_default {
    return this.BasicInfo.FNOLWizard_BasicInfoScreen_default
  }

  property get LossDetailsTrav() : pcftest.FNOLWizard_NewLossDetailsScreen_Trav {
    return this.LossDetails.Trav
  }

  property get LossDetailsWC() : pcftest.FNOLWizard_NewLossDetailsScreen_WC {
    return this.LossDetails.WC
  }

  property get LossDetailsHomeowners() : pcftest.FNOLWizard_NewLossDetailsPanelSet_homeowners {
    return this.FullWizardStepSet.LossDetails.PR.LossDetailsPanel.FNOLWizard_NewLossDetailsPanelSet_homeowners
  }

  property get LossDetailsCommercialProperty() : FNOLWizard_NewLossDetailsPanelSet_CommercialProperty {
    return this.FullWizardStepSet.LossDetails.PR.LossDetailsPanel.FNOLWizard_NewLossDetailsPanelSet_CommercialProperty
  }

  property get Services() : FNOLWizard.FullWizardStepSet.Services {
    return this.FullWizardStepSet.Services
  }

  property get ServicesAUTO() : pcftest.FNOLWizard_ServicesScreen_Auto {
    return this.FullWizardStepSet.Services.FNOLWizard_ServicesScreen_Auto
  }

  property get ServicesHomeowners() : pcftest.FNOLWizard_ServicesPolicyPanelSet_Homeowners {
    return this.FullWizardStepSet.Services.FNOLWizard_ServicesScreen_Pr.PolicyPanelSet.FNOLWizard_ServicesPolicyPanelSet_Homeowners
  }

  property get ServicesCommercialProperty() : FNOLWizard_ServicesPolicyPanelSet_CommercialProperty {
    return this.FullWizardStepSet.Services.FNOLWizard_ServicesScreen_Pr.PolicyPanelSet.FNOLWizard_ServicesPolicyPanelSet_CommercialProperty
  }

  property get ServicesCommercialPackage() : pcftest.FNOLWizard_ServicesPolicyPanelSet_CommercialPackage {
    return this.FullWizardStepSet.Services.FNOLWizard_ServicesScreen_Pr.PolicyPanelSet.FNOLWizard_ServicesPolicyPanelSet_CommercialPackage
  }

  function findPolicy(policyNumber : String) {
    this.SelectPolicy.findPolicy(policyNumber, DateUtil.currentDate())
  }

  function goToFindPolicy() {
    if (!this.FindPolicy.Current) {
      this.FindPolicy.click()
    }
    this.FindPolicy.assertOnStep()
  }

  function goToQuickClaimProperty() {
    if (this.FindPolicy.Current) {
      this.next()
    }
    Assert.assertTrue("Should be on basic info step for quick claim property wizard", this.QuickClaimPr.Current)
  }

  function goToBasicInfoAuto() {
    if (this.FindPolicy.Current) {
      this.next()
    } else {
      this.BasicInfo.click()
    }
    this.BasicInfoAUTO.assertOnStep()
  }

  function goToBasicInfoHomeowners() {
    if (this.FindPolicy.Current) {
      this.next()
    } else {
      this.BasicInfo.click()
    }
    this.BasicInfoHomeowners.assertOnStep()
  }

  function goToBasicInfoCommercialProperty() {
    if (this.FindPolicy.Current) {
      this.next()
      this.InvolvedPropertiesCommercialProperty.setRequiredFieldsIfNotPresent()
      this.next()
    }
    else if (this.SelectRiskUnitsStep.Current) {
        this.InvolvedPropertiesCommercialProperty.setRequiredFieldsIfNotPresent()
        this.next()
    } else {
      this.BasicInfo.click()
    }
    this.BasicInfoCommercialProperty.assertOnStep()
  }

  function goToBasicInfoWorkersComp() {
    if (this.FindPolicy.Current) {
      this.next()
    } else {
      this.BasicInfo.click()
    }
    this.BasicInfoWC.assertOnStep()
  }

  function goToLossDetailsPage() {
    if (this.FindPolicy.Current) {
      this.next()
    }
    if (!this.LossDetails.Current) {
      this.BasicInfo.FNOLWizard_BasicInfoScreen_default.setRequiredFieldsIfNotPresent()
      this.nextIgnoringClaimDuplicates()
    }
    Assert.assertTrue(this.LossDetails.Current)
  }

  function goToLossDetailsAuto() {
    if (this.FindPolicy.Current) {
      this.next()
      this.BasicInfoAUTO.setRequiredFieldsIfNotPresent()
      this.nextIgnoringClaimDuplicates()
    } else if (this.BasicInfo.Current) {
      this.BasicInfoAUTO.setRequiredFieldsIfNotPresent()
      this.nextIgnoringClaimDuplicates()
    } else {
      this.LossDetails.click()
    }
    this.LossDetailsAUTO.assertOnStep()
  }

  function goToLossDetailsHomeowners() {
    if (this.FindPolicy.Current) {
      this.next()
      this.BasicInfoHomeowners.setRequiredFieldsIfNotPresent()
      this.nextIgnoringClaimDuplicates()
    } else if (this.BasicInfo.Current) {
      this.BasicInfoHomeowners.setRequiredFieldsIfNotPresent()
      this.nextIgnoringClaimDuplicates()
    } else {
      this.LossDetails.click()
    }
    this.LossDetailsHomeowners.assertOnStep()
  }

  function goToInvolvedPropertiesCommercialProperty() {
    if (this.FindPolicy.Current) {
      this.next()
      this.InvolvedPropertiesCommercialProperty.setRequiredFieldsIfNotPresent()
    } else {
      this.SelectRiskUnitsStep.click()
    }
    this.InvolvedPropertiesCommercialProperty.assertOnStep()
  }

  function goToLossDetailsCommercialProperty() {
    if (this.FindPolicy.Current) {
      this.next()
      this.InvolvedPropertiesCommercialProperty.setRequiredFieldsIfNotPresent()
      this.next()
      this.BasicInfoCommercialProperty.setRequiredFieldsIfNotPresent()
      this.nextIgnoringClaimDuplicates()
    } else if (this.SelectRiskUnitsStep.Current) {
      this.InvolvedPropertiesCommercialProperty.setRequiredFieldsIfNotPresent()
      this.next()
      this.BasicInfoCommercialProperty.setRequiredFieldsIfNotPresent()
      this.nextIgnoringClaimDuplicates()
    } else if (this.BasicInfo.Current) {
      this.BasicInfoCommercialProperty.setRequiredFieldsIfNotPresent()
      this.nextIgnoringClaimDuplicates()
    } else {
      this.LossDetails.click()
    }
    this.LossDetailsHomeowners.assertOnStep()
  }

  function goToLossDetailsWorkersComp() {
    if (this.FindPolicy.Current) {
      this.next()
      this.BasicInfoWC.setRequiredFieldsIfNotPresent()
      this.nextIgnoringClaimDuplicates()
    } else if (this.BasicInfo.Current) {
      this.BasicInfoWC.setRequiredFieldsIfNotPresent()
      this.nextIgnoringClaimDuplicates()
    } else {
      this.LossDetails.click()
    }
    this.LossDetailsWC.assertOnStep()
  }

  function goToServicesAuto() {
    if (this.FindPolicy.Current) {
      this.next()
      this.BasicInfoAUTO.setRequiredFieldsIfNotPresent()
      this.nextIgnoringClaimDuplicates()
      this.LossDetailsAUTO.setRequiredFieldsIfNotPresent()
      this.nextIgnoringClaimDuplicates()
    } else if (this.BasicInfo.Current) {
      this.BasicInfoAUTO.setRequiredFieldsIfNotPresent()
      this.nextIgnoringClaimDuplicates()
      this.LossDetailsAUTO.setRequiredFieldsIfNotPresent()
      this.nextIgnoringClaimDuplicates()
    } else if (this.LossDetails.Current){
      this.LossDetailsAUTO.setRequiredFieldsIfNotPresent()
      this.nextIgnoringClaimDuplicates()
    } else {
      this.Services.click()
    }
    this.ServicesAUTO.assertOnStep()
  }

  function goToServicesHomeowners() {
    if (this.FindPolicy.Current) {
      this.next()
      this.BasicInfoHomeowners.setRequiredFieldsIfNotPresent()
      this.nextIgnoringClaimDuplicates()
      this.LossDetailsHomeowners.setRequiredFieldsIfNotPresent()
      this.nextIgnoringClaimDuplicates()
    } else if (this.BasicInfo.Current) {
      this.BasicInfoHomeowners.setRequiredFieldsIfNotPresent()
      this.nextIgnoringClaimDuplicates()
      this.LossDetailsHomeowners.setRequiredFieldsIfNotPresent()
      this.nextIgnoringClaimDuplicates()
    } else if (this.LossDetails.Current){
      this.LossDetailsHomeowners.setRequiredFieldsIfNotPresent()
      this.nextIgnoringClaimDuplicates()
    } else {
      this.Services.click()
    }
    this.ServicesHomeowners.assertOnStep()
  }

  function goToServicesCommercialProperty() {
    if (this.FindPolicy.Current) {
      this.next()
      this.BasicInfoCommercialProperty.setRequiredFieldsIfNotPresent()
      this.nextIgnoringClaimDuplicates()
      this.LossDetailsCommercialProperty.setRequiredFieldsIfNotPresent()
      this.nextIgnoringClaimDuplicates()
    } else if (this.BasicInfo.Current) {
      this.BasicInfoCommercialProperty.setRequiredFieldsIfNotPresent()
      this.nextIgnoringClaimDuplicates()
      this.LossDetailsCommercialProperty.setRequiredFieldsIfNotPresent()
      this.nextIgnoringClaimDuplicates()
    } else if (this.LossDetails.Current){
      this.LossDetailsCommercialProperty.setRequiredFieldsIfNotPresent()
      this.nextIgnoringClaimDuplicates()
    } else {
      this.Services.click()
    }
    this.ServicesCommercialProperty.assertOnStep()
  }

  function goToAssignAndSaveAuto() {
    if (this.FindPolicy.Current) {
      this.next()
      this.BasicInfoAUTO.setRequiredFieldsIfNotPresent()
      this.nextIgnoringClaimDuplicates()
      this.LossDetailsAUTO.setRequiredFieldsIfNotPresent()
      this.nextIgnoringClaimDuplicates()
      // no field is required on auto service request screen
      this.nextIgnoringClaimDuplicates()
    } else if (this.BasicInfo.Current) {
      this.BasicInfoAUTO.setRequiredFieldsIfNotPresent()
      this.nextIgnoringClaimDuplicates()
      this.LossDetailsAUTO.setRequiredFieldsIfNotPresent()
      this.nextIgnoringClaimDuplicates()
      // no field is required on auto service request screen
      this.nextIgnoringClaimDuplicates()
    } else if (this.LossDetails.Current) {
      this.LossDetailsAUTO.setRequiredFieldsIfNotPresent()
      this.nextIgnoringClaimDuplicates()
      // no field is required on auto service request screen
      this.nextIgnoringClaimDuplicates()
    } else if (this.Services.Current) {
      // no field is required on auto service request screen
      this.nextIgnoringClaimDuplicates()
    }
    this.AssignSave.assertOnStep()
  }

  function goToAssignAndSaveHomeowners() {
    if (this.FindPolicy.Current) {
      this.next()
      this.BasicInfoHomeowners.setRequiredFieldsIfNotPresent()
      this.nextIgnoringClaimDuplicates()
      this.LossDetailsHomeowners.setRequiredFieldsIfNotPresent()
      this.nextIgnoringClaimDuplicates()
      // no field is required on homeowners service request screen
      this.nextIgnoringClaimDuplicates()
    } else if (this.BasicInfo.Current) {
      this.BasicInfoHomeowners.setRequiredFieldsIfNotPresent()
      this.nextIgnoringClaimDuplicates()
      this.LossDetailsHomeowners.setRequiredFieldsIfNotPresent()
      this.nextIgnoringClaimDuplicates()
      // no field is required on homeowners service request screen
      this.nextIgnoringClaimDuplicates()
    } else if (this.LossDetails.Current) {
      this.LossDetailsHomeowners.setRequiredFieldsIfNotPresent()
      this.nextIgnoringClaimDuplicates()
      // no field is required on homeowners service request screen
      this.nextIgnoringClaimDuplicates()
    } else if (this.Services.Current) {
      // no field is required on homeowners service request screen
      this.nextIgnoringClaimDuplicates()
    }
    this.AssignSave.assertOnStep()
  }

  function goToAssignAndSaveCommercialProperty() {
    if (this.FindPolicy.Current) {
      this.next()
      this.InvolvedPropertiesCommercialProperty.setRequiredFieldsIfNotPresent()
      this.next()
      this.BasicInfoCommercialProperty.setRequiredFieldsIfNotPresent()
      this.nextIgnoringClaimDuplicates()
      this.LossDetailsCommercialProperty.setRequiredFieldsIfNotPresent()
      this.nextIgnoringClaimDuplicates()
      // no field is required on homeowners service request screen
      this.nextIgnoringClaimDuplicates()
    } else if (this.SelectRiskUnitsStep.Current) {
      this.InvolvedPropertiesCommercialProperty.setRequiredFieldsIfNotPresent()
      this.next()
      this.BasicInfoCommercialProperty.setRequiredFieldsIfNotPresent()
      this.nextIgnoringClaimDuplicates()
      this.LossDetailsCommercialProperty.setRequiredFieldsIfNotPresent()
      this.nextIgnoringClaimDuplicates()
      // no field is required on homeowners service request screen
      this.nextIgnoringClaimDuplicates()
    } else if (this.BasicInfo.Current) {
      this.BasicInfoCommercialProperty.setRequiredFieldsIfNotPresent()
      this.nextIgnoringClaimDuplicates()
      this.LossDetailsCommercialProperty.setRequiredFieldsIfNotPresent()
      this.nextIgnoringClaimDuplicates()
      // no field is required on homeowners service request screen
      this.nextIgnoringClaimDuplicates()
    } else if (this.LossDetails.Current) {
      this.LossDetailsCommercialProperty.setRequiredFieldsIfNotPresent()
      this.nextIgnoringClaimDuplicates()
      // no field is required on homeowners service request screen
      this.nextIgnoringClaimDuplicates()
    } else if (this.Services.Current) {
      // no field is required on homeowners service request screen
      this.nextIgnoringClaimDuplicates()
    }
    this.AssignSave.assertOnStep()
  }

  function goToAssignAndSaveWC() {
    if (this.FindPolicy.Current) {
      this.next()
      this.BasicInfoWC.setRequiredFieldsIfNotPresent()
      this.nextIgnoringClaimDuplicates()
      PLAssertions.assertThat(this.BasicInfoWC._msgs.AllMessages).isEmpty()
      this.LossDetailsWC.setRequiredFieldsIfNotPresent()
      this.nextIgnoringClaimDuplicates()
    } else if (this.BasicInfo.Current) {
      this.BasicInfoWC.setRequiredFieldsIfNotPresent()
      this.nextIgnoringClaimDuplicates()
      PLAssertions.assertThat(this.BasicInfoWC._msgs.AllMessages).isEmpty()
      this.LossDetailsWC.setRequiredFieldsIfNotPresent()
      this.nextIgnoringClaimDuplicates()
    } else if (this.LossDetails.Current) {
      this.LossDetailsWC.setRequiredFieldsIfNotPresent()
      this.nextIgnoringClaimDuplicates()
    }
    PLAssertions.assertThat(this.LossDetailsWC._msgs.AllMessages).isEmpty()
    this.AssignSave.assertOnStep()
  }

  function goToPartiesInvolved(): pcftest.NewClaimWizard_PartiesInvolvedScreen {
    if (this.FindPolicy.Current) {
      this.nextIgnoringClaimDuplicates()
    }
    if (this.SelectRiskUnitsStep.Current) {
      this.InvolvedPropertiesCommercialProperty.setRequiredFieldsIfNotPresent()
      this.nextIgnoringClaimDuplicates()
    }
    var step = this.IndependentWizardStepSet.PartiesInvolved.click()
    this.IndependentWizardStepSet.PartiesInvolved.NewClaimWizard_PartiesInvolvedScreen.assertOnStep()
    return step
  }

  function goToAutoFirstAndFinal(){
    if(this.FindPolicy.Current){
      this.nextIgnoringClaimDuplicates()
    }
    this.QuickClaimAutoFirstAndFinal.FNOLWizard_AutoFirstAndFinalScreen.assertOnStep()
  }

}
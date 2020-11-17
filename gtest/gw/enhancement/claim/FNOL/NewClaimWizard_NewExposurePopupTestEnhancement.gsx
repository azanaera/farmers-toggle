package gw.enhancement.claim.FNOL

uses com.google.common.base.Strings
uses gw.api.util.TypelistMappingUtil
uses gw.smoketest.platform.web.PCFLocation
uses junit.framework.Assert

enhancement NewClaimWizard_NewExposurePopupTestEnhancement : pcftest.NewClaimWizard_NewExposurePopup {

  function setRequiredFields(coverageSubtype : CoverageSubtype) {
    var exposureType = TypelistMappingUtil.getExposureTypeForCoverageSubtype(coverageSubtype)
    switch (exposureType) {
      case TC_BODILYINJURYDAMAGE:
        setBodilyInjuryRequiredFields()
        break
      case TC_LOSTWAGES:
        Assert.fail("Exposure type  " + exposureType + " not yet implemented in setRequiredFields()")
        break
      case TC_WCINJURYDAMAGE:
        Assert.fail("Exposure type  " + exposureType + " not yet implemented in setRequiredFields()")
        break
      case TC_PIPDAMAGES:
        setPIPDamagesRequiredFields()
        break
      case TC_LOSSOFUSEDAMAGE:
        setLossOfUseDamageRequiredFields()
        break
      case TC_PERSONALPROPERTYDAMAGE:
        setPersonalPropertyDamageRequiredFields()
        break
      case TC_PROPERTYDAMAGE:
        setPropertyDamageRequiredFields()
        break
      case TC_VEHICLEDAMAGE:
        setVehicleDamageRequiredFields()
        break
      case TC_EMPLOYERLIABILITY:
        Assert.fail("Exposure type  " + exposureType + " not yet implemented in setRequiredFields()")
        break
      case TC_GENERALDAMAGE:
        setGeneralDamageRequiredFields()
        break
      case TC_MEDPAY:
        setMedPayRequiredFields()
        break
      case TC_TOWONLY:
        setTowOnlyRequiredFields()
        break
      case TC_OTHERSTRUCTURE:
        setOtherStructureDamageRequiredFields()
        break
      case TC_LIVINGEXPENSES:
        setLivingExpensesRequiredFields()
        break
      case TC_CONTENT:
        setContentsRequiredFields()
        break
      case TC_DWELLING:
        setDwellingRequiredFields()
        break
    }
  }

  function setBodilyInjuryRequiredFields() {
    var dv = this.NewClaimWizard_ExposurePageScreen.NewClaimExposureDV_Bodilyinjurydamage
    Assert.assertTrue("Should be on bodily injury damage page", dv.Claimant_Picker.Visible)
    dv.Claimant_Picker.getOption(1).click()
    dv.Claimant_Type.getOptionByValue("other").click()
    var injuryIncident = dv.BIDamageInputSet.Injury_Incident.BodilyInjuryDamageDV_NewIncidentMenuItem.click()
    injuryIncident.setRequiredFields()
    injuryIncident.update()
  }

  function setPIPDamagesRequiredFields() {
    var dv = this.NewClaimWizard_ExposurePageScreen.NewClaimExposureDV_Pipdamages.NewClaimPIPSummaryDV
    Assert.assertTrue("Should be on loss of use damage page", dv.PIPDamages_Claimant.Visible)
    dv.PIPDamages_Claimant.getOption(1).click()
    dv.Exposure_ClaimantType.getOptionByValue("other").click()
    var injuryIncident = dv.BIDamageInputSet.Injury_Incident.BodilyInjuryDamageDV_NewIncidentMenuItem.click()
    injuryIncident.setRequiredFields()
    injuryIncident.update()
  }

  function setLossOfUseDamageRequiredFields() {
    var dv = this.NewClaimWizard_ExposurePageScreen.NewClaimExposureDV_Lossofusedamage
    Assert.assertTrue("Should be on loss of use damage page", dv.Claimant_Picker.Visible)
    dv.Claimant_Picker.getOption(1).click()
    dv.Claimant_Type.getOptionByValue("other").click()
    dv.CCAddressInputSet.Address_Picker.getOptionByLabel("New...").click()
    dv.CCAddressInputSet.setAddress("123 St", "San Mateo", State.TC_CA, "94440")
  }

  function setPersonalPropertyDamageRequiredFields() {
    var dv = this.NewClaimWizard_ExposurePageScreen.NewClaimExposureDV_Personalpropertydamage.NewClaimThirdPartyPropertyDamageDV
    Assert.assertTrue("Should be on personal property damage page", dv.Claimant_Picker.Visible)
    dv.Claimant_Picker.getOption(1).click()
    dv.Claimant_Type.getOptionByValue("other").click()
  }

  function setPropertyDamageRequiredFields() {
    var dv = this.NewClaimWizard_ExposurePageScreen.NewClaimExposureDV_Propertydamage.NewClaimPropertyDamageDV
    Assert.assertTrue("Should be on new exposure page in Propertydamage mode", dv.NewClaimIncidentInputSet_Propertydamage.Property_Incident.Visible)
    dv.Claimant_Picker.getOption(1).click()
    dv.Claimant_Type.getOptionByValue("other").click()
    var propertyIncident = dv.NewClaimIncidentInputSet_Propertydamage.Property_Incident.NewClaimPropertyDamageDV_NewIncidentMenuItem.click()
    propertyIncident.setPropertyFromPolicy()
    propertyIncident.update()
  }

  function setDwellingRequiredFields() {
    var dwellingIncident = setDwellingRequiredFieldsAndOpenNewIncidentPopupWithRequiredFieldsSet()
    dwellingIncident.update()
  }

  function setDwellingRequiredFieldsAndOpenNewIncidentPopupWithRequiredFieldsSet() : pcftest.NewDwellingIncidentPopup {
    var dv = this.NewClaimWizard_ExposurePageScreen.NewClaimExposureDV_Propertydamage.NewClaimPropertyDamageDV
    Assert.assertTrue("Should be on new exposure page in Dwelling mode", dv.NewClaimIncidentInputSet_Dwelling.Dwelling_Incident.Visible)
    dv.Claimant_Picker.getOption(1).click()
    dv.Claimant_Type.getOptionByValue("other").click()
    var dwellingIncident = dv.NewClaimIncidentInputSet_Dwelling.Dwelling_Incident.NewClaimDwellingDV_NewIncidentMenuItem.click()
    dwellingIncident.DamageDV.Description.Value = "Dwelling damage"
    return dwellingIncident
  }

  function setVehicleDamageRequiredFields() {
    var dv = this.NewClaimWizard_ExposurePageScreen.NewClaimExposureDV_Vehicledamage.NewClaimVehicleDamageDV
    Assert.assertTrue("Should be on vehicle damage page", dv.Claimant_Picker.Visible)
    dv.Claimant_Picker.getOption(1).click()
    dv.Claimant_Type.getOptionByValue("other").click()
    var vehicleIncident = dv.Vehicle_Incident.NewClaimVehicleDamageDV_NewIncidentMenuItem.click()
    vehicleIncident.setRequiredFields()
    vehicleIncident.update()
  }

  function setGeneralDamageRequiredFields() {
    var dv = this.NewClaimWizard_ExposurePageScreen.NewClaimExposureDV_Generaldamage
    Assert.assertTrue("Should be on general damage page", dv.Claimant_Picker.Visible)
    dv.Claimant_Picker.getOption(1).click()
    dv.Claimant_Type.getOptionByValue("other").click()
  }

  function setMedPayRequiredFields() {
    var dv = this.NewClaimWizard_ExposurePageScreen.NewClaimExposureDV_Medpay
    Assert.assertTrue("Should be on med pay page", dv.Claimant_Picker.Visible)
    dv.Claimant_Picker.getOption(1).click()
    dv.Claimant_Type.getOptionByValue("other").click()
    var injuryIncident = dv.BIDamageInputSet.Injury_Incident.BodilyInjuryDamageDV_NewIncidentMenuItem.click()
    injuryIncident.setRequiredFields()
    injuryIncident.update()
  }

  function setTowOnlyRequiredFields() {
    var dv = this.NewClaimWizard_ExposurePageScreen.NewClaimExposureDV_Towonly.NewClaimTowOnlyDV
    Assert.assertTrue("Should be on vehicle damage page", dv.Claimant_Picker.Visible)
    dv.Claimant_Picker.getOption(1).click()
    dv.Claimant_Type.getOptionByValue("other").click()
    var vehicleIncident = dv.Vehicle_Incident.NewClaimTowOnlyDV_NewIncidentMenuItem.click()
    vehicleIncident.setRequiredFields()
    vehicleIncident.update()
  }

  function setOtherStructureDamageRequiredFields() {
    var dv = this.NewClaimWizard_ExposurePageScreen.NewClaimExposureDV_OtherStructure.NewClaimOtherStructureDamageDV
    Assert.assertTrue("Should be on other structure damage page", dv.ExposureDetailInputSet.Claimant_Picker.Visible)
    dv.ExposureDetailInputSet.Claimant_Picker.getOption(1).click()
    dv.ExposureDetailInputSet.Claimant_Type.getOptionByValue("other").click()
    var otherStructureIncident = dv.Other_Structure_Incident.OtherStructureDamageDV_NewIncidentMenuItem.click()
    otherStructureIncident.NewOtherStructureIncidentScreen.OtherStructureIncidentCV.OtherStructureIncidentPanelSet.Description.Value = "Fences etc."
    otherStructureIncident.NewOtherStructureIncidentScreen.Update.click()
  }

  function setLivingExpensesRequiredFields() {
    var dv = this.NewClaimWizard_ExposurePageScreen.NewClaimExposureDV_LivingExpenses.NewClaimLivingExpensesDV
    Assert.assertTrue("Should be on living expenses page", dv.ExposureDetailInputSet.Claimant_Picker.Visible)
    dv.ExposureDetailInputSet.Claimant_Picker.getOption(1).click()
    dv.ExposureDetailInputSet.Claimant_Type.getOptionByValue("other").click()
    var livingExpensesIncident = dv.Living_Expenses_Incident.LivingExpensesDV_NewIncidentMenuItem.click()
    livingExpensesIncident.NewLivingExpensesIncidentScreen.LivingExpensesIncidentPanelSet.Description.Value = "Living Expense damage"
    livingExpensesIncident.NewLivingExpensesIncidentScreen.Update.click()
  }

  function setContentsRequiredFields() {
    var dv = this.NewClaimWizard_ExposurePageScreen.NewClaimExposureDV_Content.NewClaimContentsDamageDV
    Assert.assertTrue("Should be on contents page", dv.ExposureDetailInputSet.Claimant_Picker.Visible)
    dv.ExposureDetailInputSet.Claimant_Picker.getOption(1).click()
    dv.ExposureDetailInputSet.Claimant_Type.getOptionByValue("other").click()
    var propertyContentsIncident = dv.Property_Contents_Incident.ContentsDamageDV_NewIncidentMenuItem.click()
    propertyContentsIncident.NewPropertyContentsIncidentScreen.PropertyContentsIncidentPanelSet.Description.Value = "A large TV"
    var storageLocation = propertyContentsIncident.NewPropertyContentsIncidentScreen.PropertyContentsIncidentPanelSet.StorageLocation
    if (Strings.isNullOrEmpty(storageLocation.Value)) {
      storageLocation.selectFirstValidOption()
    }
    propertyContentsIncident.NewPropertyContentsIncidentScreen.Update.click()
  }

  function setTripRequiredFields() {
    var dv = this.NewClaimWizard_ExposurePageScreen.NewClaimExposureDV_TripCancellationDelay.NewClaimTripCancellationDV
    Assert.assertTrue("Should be on trip page", dv.ExposureDetailInputSet.Claimant_Picker.Visible)
    dv.ExposureDetailInputSet.Claimant_Picker.getOption(1).click()
    dv.ExposureDetailInputSet.Claimant_Type.getOptionByValue("other").click()
    var tripIncident = dv.TripIncident.NewIncidentMenuItem.click()

    tripIncident.NewTripIncidentScreen.Description.Value = "trip incident"
    tripIncident.NewTripIncidentScreen.TripIncidentDV.TripRU.selectFirstValidOption()
    tripIncident.update()
    dv.TripIncident.selectFirstValidOption()
  }

  function setBaggageRequiredFields() {
    var dv = this.NewClaimWizard_ExposurePageScreen.NewClaimExposureDV_Baggage.NewClaimBaggageDamageDV
    Assert.assertTrue("Should be on baggage page", dv.ExposureDetailInputSet.Claimant_Picker.Visible)
    dv.ExposureDetailInputSet.Claimant_Picker.getOption(1).click()
    dv.ExposureDetailInputSet.Claimant_Type.getOptionByValue("other").click()
    var baggageIncident = dv.BaggageIncident.NewIncidentMenuItem.click()

    baggageIncident.EditBaggageIncidentScreen.BaggageIncidentDetailDV.BaggageIncidentDV.BaggageType.selectFirstValidOption()
    baggageIncident.EditBaggageIncidentScreen.BaggageIncidentDetailDV.BaggageIncidentDV.PropertyDescription.Value = "property description"
    baggageIncident.EditBaggageIncidentScreen.BaggageIncidentDetailDV.BaggageIncidentDV.Description.Value = "description"
    baggageIncident.EditBaggageIncidentScreen.BaggageIncidentDetailDV.BaggageIncidentDV.CCAddressInputSet.setAddress("123 St", "San Mateo", State.TC_CA, "94440")
    baggageIncident.update()
    dv.BaggageIncident.selectFirstValidOption()
  }


  function update() : PCFLocation {
    return this.UpdateButton.click()
  }

  property get UpdateButton() : pcftest.NewClaimWizard_NewExposurePopup.NewClaimWizard_ExposurePageScreen.Update {
    return this.NewClaimWizard_ExposurePageScreen.Update
  }
}

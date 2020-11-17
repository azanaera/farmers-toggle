package gw.enhancement.claim.FNOL

uses junit.framework.Assert


enhancement FNOLWizard_AssignSaveScreenTestEnhancement : pcftest.FNOLWizard_AssignSaveScreen {
  
  property get Wizard() : pcftest.FNOLWizard {
    return this.SmokeTest.CurrentPage as pcftest.FNOLWizard
  }
  
  function assertOnStep() {
    Assert.assertTrue("Should be on assign/save wizard step", Wizard.FullWizardStepSet.Summary.Current)
  }
  
  property get NumExposures() : int {
    return this.NewExposureLV._Entries.size()
  }
  
  function goToNewExposureByCoverageSubtype(type : CoverageSubtype) : pcftest.NewClaimWizard_NewExposurePopup {
    var covTypeMenu = this.NewExposureLV_tb.AddExposure.NewExposureMenuItemSet_ByCoverageType
    var newExp = findItemForCoverageSubtypeLevel0( covTypeMenu, type )
    Assert.assertTrue("Didn't find New Exposure entry for CovSubType " + type.DisplayName, newExp != null );

    return newExp
  }

  function goToNewExposureByCoverage(riskUnitMatcher: (text: String): boolean, covSubtype: CoverageSubtype): pcftest.NewClaimWizard_NewExposurePopup {
    return goToNewExposureByCoverage(riskUnitMatcher, \txt -> txt == covSubtype.DisplayName)
  }

  function goToNewExposureByCoverage(riskUnitMatcher: (text: String): boolean, covSubtypeMatcher: (text: String): boolean): pcftest.NewClaimWizard_NewExposurePopup {
    var menuItemEntriesNamedByRiskUnit = this.NewExposureLV_tb.AddExposure._Entries

    var riskUnitMenuItem = menuItemEntriesNamedByRiskUnit.firstWhere(\r -> riskUnitMatcher(r.item.Text))
    var coverageMenuItem = riskUnitMenuItem.item._Entries?.firstWhere(\n -> covSubtypeMatcher(n.item.Text))

    return coverageMenuItem.item?.click()
  }

  function createExposure(coverageSubtype : CoverageSubtype): pcftest.NewClaimWizard_NewExposurePopup {
    var newExposure = goToNewExposureByCoverageSubtype(coverageSubtype)
    newExposure.setRequiredFields(coverageSubtype)
    newExposure.update()
    return newExposure
  }
  
  /** Creates minimal vehicle damage exposure */
  function createVehicleDamageExposure(coverageSubtype : CoverageSubtype) {
    var newExposure = goToNewExposureByCoverageSubtype(coverageSubtype)
    var dv = newExposure.NewClaimWizard_ExposurePageScreen.NewClaimExposureDV_Vehicledamage.NewClaimVehicleDamageDV
    dv.Claimant_Picker.getOption(1).click()
    dv.Claimant_Type.getOptionByValue("other").click()
    newExposure.update()
  }

  function createTripCancellationExposure(coverageSubtype : CoverageSubtype) {
    var newExposure = goToNewExposureByCoverageSubtype(coverageSubtype)
    var dv = newExposure.NewClaimWizard_ExposurePageScreen.NewClaimExposureDV_TripCancellationDelay.NewClaimTripCancellationDV
    //dv.TripIncident.getOption(1).click()
    dv.ExposureDetailInputSet.Claimant_Picker.getOption(1).click()
    dv.ExposureDetailInputSet.Claimant_Type.getOption(1).click()
    newExposure.update()
  }

  function createBaggageDamageExposure(coverageSubtype : CoverageSubtype) {
    var newExposure = goToNewExposureByCoverageSubtype(coverageSubtype)
    var dv = newExposure.NewClaimWizard_ExposurePageScreen.NewClaimExposureDV_Baggage.NewClaimBaggageDamageDV
    dv.ExposureDetailInputSet.Coverage.selectFirstValidOption()
    dv.ExposureDetailInputSet.Claimant_Picker.getOption(1).click()
    dv.ExposureDetailInputSet.Claimant_Type.getOption(1).click()
    newExposure.update()
  }
  
  /** Creates minimal general damage exposure */
  function createGeneralDamageExposure(coverageSubtype : CoverageSubtype) {
    var newExposure = goToNewExposureByCoverageSubtype(coverageSubtype)
    newExposure.setGeneralDamageRequiredFields()
    newExposure.update()
  }
  
  /** Creates minimal bodily injury exposure */
  function createBodilyInjuryExposure(coverageSubtype : CoverageSubtype) {
    var newExposure = goToNewExposureByCoverageSubtype(coverageSubtype)
    newExposure.setBodilyInjuryRequiredFields()
    newExposure.update()
  }

  /** Removes all exposures */
  function removeAllExposures() {
    this.NewExposureLV._Entries.each(\entry -> entry._Checkbox.click())
    this.NewExposureLV_tb.Remove.click()
  }
  
  /** Creates minimal medical payments exposure - only one coverage subtype ("mpay_mp") is possible */
  function createMedicalPaymentsExposure() {
    var newExposure = goToNewExposureByCoverageSubtype(CoverageSubtype.TC_MED_COVR_EXT)
    newExposure.setMedPayRequiredFields()
    newExposure.update()
  }
  
  function findItemForCoverageSubtypeLevel0(menuItem : pcftest.FNOLWizard_AssignSaveScreen.NewExposureLV_tb.AddExposure.NewExposureMenuItemSet_ByCoverageType, type : CoverageSubtype) : pcftest.NewClaimWizard_NewExposurePopup {
    var clickEntry = menuItem._Entries.firstWhere(\r->r.item.Text==type.DisplayName and r.item._Entries.Empty)
    if(clickEntry != null) {
      return clickEntry.item.click()
    } else {
      for (i in 0..|(menuItem._Entries.size())) {
        var nextItem = menuItem._Entries[i].item
        var newExp = findItemForCoverageSubtypeLevel1( nextItem, type)
        if(newExp != null) {
          return newExp
        }
      }
      return null
    }
  }

  function findItemForCoverageSubtypeLevel1(menuItem : pcftest.FNOLWizard_AssignSaveScreen.NewExposureLV_tb.AddExposure.NewExposureMenuItemSet_ByCoverageType.entry.item, type : CoverageSubtype) : pcftest.NewClaimWizard_NewExposurePopup {
    var clickEntry = menuItem._Entries.firstWhere(\r->r.item.Text==type.DisplayName and r.item._Entries.Empty)
    if(clickEntry != null) {
      return clickEntry.item.click()
    } else {
      for (i in 0..|(menuItem._Entries.size())) {
        var nextItem = menuItem._Entries[i].item
        var newExp = findItemForCoverageSubtypeLevel1( nextItem, type)
        if(newExp != null) {
          return newExp
        }
      }
      return null
    }
  }
}

package gw.enhancement.claim.FNOL

uses junit.framework.Assert

enhancement FNOLWizard_NewLossDetailsScreen_WCTestEnhancement : pcftest.FNOLWizard_NewLossDetailsScreen_WC {

  property get Wizard() : pcftest.FNOLWizard {
    return this.SmokeTest.CurrentPage as pcftest.FNOLWizard
  }

  function assertOnStep() {
    Assert.assertTrue("Should be on default basic info wizard step",
        Wizard.LossDetails.Current)
  }

  function setRequiredFieldsIfNotPresent() {
    if (this.Claimant_Picker.Value.isEmpty()) {
      setClaimant()
    }
    if (this.InjurySeverity_TimeLossReport.Value.isEmpty()) {
      setTimeLoss()
    }
    if (this.DateReportedtoEmployer.Value.isEmpty()) {
      setDateReportedtoEmployer()
    }
    if (this.Claim_ReportedDate.Value.isEmpty()) {
      setReportedDate()
    }
    if (this.CCAddressInputSet.globalAddressContainer.Address_Picker.Value.isEmpty()) {
      setIncidentLocation()
    }
    if (this.getInjurySeverity_DeathReport().Value.isEmpty()) {
      setDeathReport()
    }
    if (this.Claim_InjuryIllnessCause.Value.isEmpty()) {
      setInjuryIllnessCause()
    }
    if (this.Claim_PrimaryInjury.Value.isEmpty()) {
      setPrimaryInjury()
    }
    if (this.Claim_DetailedInjury.Value.isEmpty()) {
      setDetailedInjury()
    }
    if (this.InjurySeverity_MedicalReport.Value.isEmpty()) {
      setInjurySeverity_MedicalReport()
    }
    this.EditableBodyPartDetailsLV._Entries.each(\bodyPart -> {
      if (bodyPart.PrimaryBodyPart.Value.isEmpty()) {
        bodyPart.PrimaryBodyPart.selectFirstValidOption()
      }
      if (bodyPart.DetailedBodyPart.Value.isEmpty()) {
        bodyPart.DetailedBodyPart.selectFirstValidOption()
      }
    })
  }

  function setClaimant() {
    this.Claimant_Picker.selectFirstValidOption()
  }

  function setTimeLoss() {
    this.InjurySeverity_TimeLossReport.setBoolValue(true)
  }

  function setDateReportedtoEmployer() {
    this.DateReportedtoEmployer.setDateValue(Date.Today)
  }

  function setReportedDate() {
    this.Claim_ReportedDate.setDateValue(Date.Today)
  }

  function setIncidentLocation() {
    this.CCAddressInputSet.globalAddressContainer.Address_Picker.selectFirstValidOption()
    if (this.CCAddressInputSet.Address_City.Visible) {
      this.CCAddressInputSet.Address_City.Value = "Foster City"
    }
    if (this.CCAddressInputSet.Address_State.Visible) {
      this.CCAddressInputSet.Address_State.Value = State.TC_CA.Code
    }
  }

  function setDeathReport() {
    this.InjurySeverity_DeathReport.setBoolValue(false)
  }

  function setInjuryIllnessCause() {
    this.Claim_InjuryIllnessCause.selectFirstValidOption()
  }

  function setPrimaryInjury() {
    this.Claim_PrimaryInjury.selectFirstValidOption()
  }

  function setDetailedInjury() {
    this.Claim_DetailedInjury.selectFirstValidOption()
  }

  function setInjurySeverity_MedicalReport() {
    this.InjurySeverity_MedicalReport.setBoolValue(false)
  }

}

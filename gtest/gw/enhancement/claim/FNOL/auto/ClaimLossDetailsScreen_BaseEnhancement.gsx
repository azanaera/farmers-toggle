package gw.enhancement.claim.FNOL.auto

uses pcftest.NewFixedPropertyIncidentPopup
uses pcftest.NewInjuryIncidentPopup
uses pcftest.NewVehicleIncidentPopup

enhancement ClaimLossDetailsScreen_BaseEnhancement : pcftest.ClaimLossDetails.ClaimLossDetailsScreen {

  function edit() {
    this.Edit.click()
  }

  function update() {
    this.Update.click()
  }

  function goToNewVehicleIncidentPopup() : NewVehicleIncidentPopup {
    return this.LossDetailsPanelSet_default.LossDetailsCardCV.LossDetailsDV_Auto.EditableVehicleIncidentsLV_tb.Add.click() as NewVehicleIncidentPopup
  }

  function goToNewPropertyIncidentPopup() : NewFixedPropertyIncidentPopup {
    return this.LossDetailsPanelSet_default.LossDetailsCardCV.LossDetailsDV_Auto.Claim_Properties.EditableFixedPropertyIncidentsLV_tb.Add.click() as NewFixedPropertyIncidentPopup
  }

  function goToNewInjuryIncidentPopup() : NewInjuryIncidentPopup {
    return this.LossDetailsPanelSet_default.LossDetailsCardCV.LossDetailsDV_Auto.EditableInjuryIncidentsLV_tb.Add.click() as NewInjuryIncidentPopup
  }
}

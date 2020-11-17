package gw.enhancement.exposure

uses pcftest.NewExposureDV_Bodilyinjurydamage
uses pcftest.NewInjuryIncidentPopup

enhancement NewExposureDV_BodilyinjurydamageTestEnhancement : NewExposureDV_Bodilyinjurydamage {

  function setRequiredFields(){
    this.Claimant_Picker.selectFirstValidOption()
    this.Claimant_Type.selectFirstValidOption()
  }

  function newIncident(): NewInjuryIncidentPopup
  {
    return this.BIDamageInputSet.Injury_Incident.BodilyInjuryDamageDV_NewIncidentMenuItem.click()

  }

}

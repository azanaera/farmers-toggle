package gw.enhancement.incident

uses gw.smoketest.platform.web.PCFLocation
uses pcftest.NewInjuryIncidentPopup

enhancement NewInjuryIncidentPopupTestEnhancement : NewInjuryIncidentPopup {

  function setRequiredFields() {
    var dv = this.NewInjuryIncidentScreen.InjuryIncidentDV
    dv.InjuryIncidentInputSet.LossParty.getOptionByTypeKey(LossPartyType.TC_INSURED).click()
    dv.InjuryIncidentInputSet.InjuryDescription.Value = "Test injury description"
    dv.InjuryIncidentInputSet.EditableBodyPartDetailsLV_tb.Add.click()
    var newEntry = dv.InjuryIncidentInputSet.EditableBodyPartDetailsLV._Entries[0]
    newEntry.PrimaryBodyPart.getOptionByTypeKey(BodyPartType.TC_TRUNK).click()
    newEntry.DetailedBodyPart.getOptionByTypeKey(typekey.DetailedBodyPartType.TC_40).click()
  }

  function update() : PCFLocation {
    return this.NewInjuryIncidentScreen.Update.click()
  }

}

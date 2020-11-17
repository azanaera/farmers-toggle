package gw.enhancement.incident

enhancement NewDwellingIncidentPopupTestEnhancement : pcftest.NewDwellingIncidentPopup
{
  function update() {
    this.NewDwellingIncidentScreen.Update.click()
  }
  
  property get DamageDV() : pcftest.DwellingIncidentPanelSet.DamageDV {
    return this.NewDwellingIncidentScreen.DwellingIncidentCV.DwellingIncidentPanelSet.DamageDV
  }
}
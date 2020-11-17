package gw.enhancement.incident

enhancement NewFixedPropertyIncidentPopupTestEnhancement : pcftest.NewFixedPropertyIncidentPopup {

  function setPropertyFromPolicy() {
    this.NewFixedPropertyIncidentScreen.FixPropIncidentDetailDV.FixedPropertyIncidentDV.CCAddressInputSet.Address_Picker.getOption(1).click()
  }

  function update() {
    this.NewFixedPropertyIncidentScreen.Update.click()
  }
}
package gw.enhancement.address

uses gw.smoketest.platform.web.SelectElement
uses gw.smoketest.platform.web.ValueElement

enhancement CCAddressInputSetBaseEnhancement : pcftest.CCAddressInputSet {

  function setAddress(address1Value : String, cityValue : String, stateValue : State, zipValue : String) {
    var picker = this.Address_Picker
    if (picker.Visible) {
      var currentOption = picker.getOptionByValue(picker.Value)
      if (currentOption.Text != "(Newly Created)") {
        picker.getOptionByValue("__new").click()
      }
    }

    this.Address_AddressLine1.Value = address1Value
    this.Address_City.Value = cityValue
    if (this.Address_State.Visible) {
      this.Address_State.Value = stateValue.Code
    }
    this.Address_PostalCode.Value = zipValue
  }

  property get Address_Picker() : SelectElement {
    return this.globalAddressContainer.Address_Picker
  }

  property get Address_AddressLine1() : ValueElement {
    return this.globalAddressContainer.globalAddress.GlobalAddressInputSet_default.AddressLine1
  }

  property get Address_City() : pcftest.GlobalAddressInputSet_default.City {
    return this.globalAddressContainer.globalAddress.GlobalAddressInputSet_default.City
  }

  property get Address_State() : SelectElement {
    return this.globalAddressContainer.globalAddress.GlobalAddressInputSet_default.State
  }

  property get Address_PostalCode() : pcftest.GlobalAddressInputSet_default.PostalCode {
    return this.globalAddressContainer.globalAddress.GlobalAddressInputSet_default.PostalCode
  }

}
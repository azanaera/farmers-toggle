package gw.enhancement.claim.FNOL.auto

enhancement FNOLWizard_BasicInfoRightPanelSet_AutoBaseEnhancement : pcftest.FNOLWizard_BasicInfoRightPanelSet_Auto {

  function getVehicleByIndex(index : int) : pcftest.FNOLWizard_BasicInfoRightPanelSet_Auto.entry.InsuredVehicleDV.InsuredVehicleInputGroup {
    return this._Entries[index].InsuredVehicleDV.InsuredVehicleInputGroup
  }
  
  function toggleVehicleCheckboxByIndex(index : int) {
    this.getVehicleByIndex(index)._checkbox.click()
  }

}

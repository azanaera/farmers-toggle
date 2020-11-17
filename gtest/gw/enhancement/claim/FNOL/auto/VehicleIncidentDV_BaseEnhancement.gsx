package gw.enhancement.claim.FNOL.auto

enhancement VehicleIncidentDV_BaseEnhancement : pcftest.VehicleIncidentDV {

  function setRequiredVehicleFields() {
    if (this.Vehicle_Picker.Value.isEmpty()) {
      this.Vehicle_Picker.selectFirstValidOption()
    }
    if (this.Driver_Picker.Value.isEmpty()) {
      this.Driver_Picker.selectFirstValidOption()
    }
    if (this.RelationToInsured.Value.isEmpty()) {
      this.RelationToInsured.selectFirstValidOption()
    }
  }
}

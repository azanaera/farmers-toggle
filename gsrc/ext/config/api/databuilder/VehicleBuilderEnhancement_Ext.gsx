package ext.config.api.databuilder

uses gw.api.databuilder.VehicleBuilder

enhancement VehicleBuilderEnhancement_Ext : VehicleBuilder {

  public function withVehicleStatus_Ext(vehicleStatus : PolicyStatus) : VehicleBuilder {
    this.set(Vehicle#VehicleStatus_Ext, vehicleStatus)
    return this
  }
}

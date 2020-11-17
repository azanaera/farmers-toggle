package ext.config.exposure

uses gw.api.locale.DisplayKey
uses gw.api.util.LocationUtil

class ExposureUIHelper {

  public static function initializeIncident(exposure : Exposure) : Incident{
    checkThatIncidentExistsForCoverage(exposure)
    return exposure.initializeIncident()
  }

  public static function checkThatIncidentExistsForCoverage(exposure : Exposure){
    var coverage = exposure.Coverage
    if(coverage typeis VehicleCoverage){
      var vehicleIncidents = exposure.Claim.Incidents.whereTypeIs(VehicleIncident)
      var vehicles = vehicleIncidents.where(\elt -> not elt.New)*.Vehicle
      if(coverage.RiskUnit typeis VehicleRU and not vehicles.contains(coverage.RiskUnit.Vehicle)){
        LocationUtil.addRequestScopedWarningMessage(DisplayKey.get("Toggle.NewExposure.ClaimMenu.NewExposure.NewIncident_Ext"))
      }
    }
  }
}
package gw.scriptparameter

uses java.lang.Integer

@Export
enhancement ScriptParametersEnhancement: ScriptParameters {

  public static property get InitialReserve_AutoMediumVehicleDamageInspection(): Integer {
    return ScriptParameters.getParameterValue("InitialReserve_AutoMediumVehicleDamageInspection") as Integer;
  }

  public static property get InitialReserve_AutoMajorVehicleDamageBody(): Integer {
    return ScriptParameters.getParameterValue("InitialReserve_AutoMajorVehicleDamageBody") as Integer;
  }

  public static property get InitialReserve_AutoMinorVehicleDamageBody(): Integer {
    return ScriptParameters.getParameterValue("InitialReserve_AutoMinorVehicleDamageBody") as Integer;
  }

  public static property get InitialReserve_AutoMediumVehicleDamageBody(): Integer {
    return ScriptParameters.getParameterValue("InitialReserve_AutoMediumVehicleDamageBody") as Integer;
  }

  public static property get InitialReserve_AutoMajorVehicleDamageInspection(): Integer {
    return ScriptParameters.getParameterValue("InitialReserve_AutoMajorVehicleDamageInspection") as Integer;
  }

  public static property get InitialReserve_AutoGlassVehicleDamage(): Integer {
    return ScriptParameters.getParameterValue("InitialReserve_AutoGlassVehicleDamage") as Integer;
  }

  public static property get SpecialInvestigation_CreateActivityForSupervisorThreshold(): Integer {
    return ScriptParameters.getParameterValue("SpecialInvestigation_CreateActivityForSupervisorThreshold") as Integer;
  }

  public static property get InitialReserve_TravelBaggageLoss(): Integer {
    return ScriptParameters.getParameterValue("InitialReserve_TravelBaggageLoss") as Integer;
  }

  public static property get UtilizeMatterBudget(): Boolean {
    return ScriptParameters.getParameterValue("UtilizeMatterBudget") as Boolean;
  }

  public static property get ParentGroupType_Generalists_Ext(): String {
    return ScriptParameters.getParameterValue("ParentGroupType_Generalists_Ext") as String;
  }

  public static property get VendorAvailability_Ext(): String {
    return ScriptParameters.getParameterValue("VendorAvailability_Ext") as String;
  }

  public static property get BoxDevToken_Temp_Ext(): String {
    return ScriptParameters.getParameterValue("BoxDevToken_Temp_Ext") as String;
  }

  public static property get CA_State_Withholding_Ext(): Double {
    return ScriptParameters.getParameterValue("CA_State_Withholding_Ext") as Double;
  }

  public static property get GA_State_Withholding_Ext (): Double {
    return ScriptParameters.getParameterValue("GA_State_Withholding_Ext") as Double;
  }

  public static property get MN_State_Withholding_Ext(): Double {
    return ScriptParameters.getParameterValue("MN_State_Withholding_Ext") as Double;
  }

}

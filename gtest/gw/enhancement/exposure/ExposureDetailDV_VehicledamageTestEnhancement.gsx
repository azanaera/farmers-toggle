package gw.enhancement.exposure

uses pcftest.ExposureDetailDV_Vehicledamage
uses pcftest.VehicleDamageDV

enhancement ExposureDetailDV_VehicledamageTestEnhancement : ExposureDetailDV_Vehicledamage {

  property get Claimant() : VehicleDamageDV.Claimant_Picker {
    return this.VehicleDamageDV.Claimant_Picker
  }

  property get ClaimantType() : VehicleDamageDV.Claimant_Type {
    return this.VehicleDamageDV.Claimant_Type
  }

}

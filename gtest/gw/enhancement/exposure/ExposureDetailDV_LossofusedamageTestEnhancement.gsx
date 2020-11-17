package gw.enhancement.exposure

uses pcftest.ExposureDetailDV_Lossofusedamage
uses pcftest.LossOfUseDamageDV

enhancement ExposureDetailDV_LossofusedamageTestEnhancement : ExposureDetailDV_Lossofusedamage {

  property get Claimant() : LossOfUseDamageDV.Claimant_Picker {
    return this.LossOfUseDamageDV.Claimant_Picker
  }

  property get ClaimantType() : LossOfUseDamageDV.Claimant_Type {
    return this.LossOfUseDamageDV.Claimant_Type
  }

}

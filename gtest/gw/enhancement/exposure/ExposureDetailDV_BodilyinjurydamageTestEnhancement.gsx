package gw.enhancement.exposure

uses pcftest.ExposureDetailDV_Bodilyinjurydamage
uses pcftest.BodilyInjuryDamageDV

enhancement ExposureDetailDV_BodilyinjurydamageTestEnhancement : ExposureDetailDV_Bodilyinjurydamage {

  property get Claimant() : BodilyInjuryDamageDV.Claimant_Picker {
    return this.BodilyInjuryDamageDV.Claimant_Picker
  }

  property get ClaimantType() : BodilyInjuryDamageDV.Claimant_Type {
    return this.BodilyInjuryDamageDV.Claimant_Type
  }

}

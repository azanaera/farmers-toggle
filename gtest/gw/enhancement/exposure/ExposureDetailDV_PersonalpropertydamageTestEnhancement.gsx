package gw.enhancement.exposure

uses pcftest.ExposureDetailDV_Personalpropertydamage

enhancement ExposureDetailDV_PersonalpropertydamageTestEnhancement : ExposureDetailDV_Personalpropertydamage {

  property get Claimant() : ExposureDetailDV_Personalpropertydamage.ExposureDetailDV.Claimant_Picker {
    return this.ExposureDetailDV.Claimant_Picker
  }

  property get ClaimantType() : ExposureDetailDV_Personalpropertydamage.ExposureDetailDV.Claimant_Type {
    return this.ExposureDetailDV.Claimant_Type
  }

}

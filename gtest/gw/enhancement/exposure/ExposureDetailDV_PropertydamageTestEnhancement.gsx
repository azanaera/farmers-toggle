package gw.enhancement.exposure

uses pcftest.ExposureDetailDV_Propertydamage
uses pcftest.PropertyDamageDV

enhancement ExposureDetailDV_PropertydamageTestEnhancement : ExposureDetailDV_Propertydamage {

  property get Claimant() : PropertyDamageDV.Claimant_Picker {
    return this.PropertyDamageDV.Claimant_Picker
  }

  property get ClaimantType() : PropertyDamageDV.Claimant_Type {
    return this.PropertyDamageDV.Claimant_Type
  }

}

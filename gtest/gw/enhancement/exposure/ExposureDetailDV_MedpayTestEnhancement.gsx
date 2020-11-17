package gw.enhancement.exposure

uses pcftest.ExposureDetailDV_Medpay

enhancement ExposureDetailDV_MedpayTestEnhancement : ExposureDetailDV_Medpay {

  property get Claimant() : ExposureDetailDV_Medpay.ExposureDetailDV.Claimant_Picker {
    return this.ExposureDetailDV.Claimant_Picker
  }

  property get ClaimantType() : ExposureDetailDV_Medpay.ExposureDetailDV.Claimant_Type {
    return this.ExposureDetailDV.Claimant_Type
  }

}

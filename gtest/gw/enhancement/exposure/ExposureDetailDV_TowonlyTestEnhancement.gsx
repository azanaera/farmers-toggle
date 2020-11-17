package gw.enhancement.exposure

uses pcftest.ExposureDetailDV_Towonly
uses pcftest.TowOnlyDV

enhancement ExposureDetailDV_TowonlyTestEnhancement : ExposureDetailDV_Towonly {

  property get Claimant() : TowOnlyDV.Claimant_Picker {
    return this.TowOnlyDV.Claimant_Picker
  }

  property get ClaimantType() : TowOnlyDV.Claimant_Type {
    return this.TowOnlyDV.Claimant_Type
  }

}

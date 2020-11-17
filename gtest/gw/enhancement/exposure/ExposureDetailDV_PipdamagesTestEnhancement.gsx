package gw.enhancement.exposure

uses pcftest.ExposureDetailDV_Pipdamages
uses pcftest.PIPSummaryDV


enhancement ExposureDetailDV_PipdamagesTestEnhancement : ExposureDetailDV_Pipdamages {

  property get Claimant() : PIPSummaryDV.PIPDamages_Claimant {
    return this.PIPSummaryDV.PIPDamages_Claimant
  }

  property get ClaimantType() : PIPSummaryDV.Exposure_ClaimantType {
    return this.PIPSummaryDV.Exposure_ClaimantType
  }

}

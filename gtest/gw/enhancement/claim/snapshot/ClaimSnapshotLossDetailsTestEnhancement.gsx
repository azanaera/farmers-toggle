package gw.enhancement.claim.snapshot

enhancement ClaimSnapshotLossDetailsTestEnhancement : pcftest.ClaimSnapshotLossDetails {

  function goToClaimSnapshotExposures() : pcftest.ClaimSnapshotExposures {
    return this._parent.MenuLinks.ClaimSnapshotGroup_ClaimSnapshotExposures.click()
  }

  property get Screen() : pcftest.ClaimSnapshotLossDetailsScreen_default {
    return this.ClaimSnapshotLossDetailsScreen_default
  }

  property get GeneralAuto() : pcftest.ClaimSnapshotGeneralPanelSet_auto.ClaimSnapshotGeneralDV {
    return Screen.ClaimSnapshotGeneralPanelSet_auto.ClaimSnapshotGeneralDV
  }

  property get TravelPanelSet() : pcftest.ClaimSnapshotGeneralPanelSet_Trav {
    return Screen.ClaimSnapshotGeneralPanelSet_Trav
  }

  property get GeneralTravel() : pcftest.ClaimSnapshotGeneralPanelSet_Trav.ClaimSnapshotGeneralDV {
    return TravelPanelSet.ClaimSnapshotGeneralDV
  }

  property get GeneralHomeownersPanelSet() : pcftest.ClaimSnapshotGeneralPRPanelSet_Homeowners {
    return Screen.ClaimSnapshotGeneralPanelSet_Pr.ClaimSnapshotGeneralPRPanelSet_Homeowners
  }

}

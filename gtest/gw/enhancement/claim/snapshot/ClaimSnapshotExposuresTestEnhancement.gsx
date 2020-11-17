package gw.enhancement.claim.snapshot

enhancement ClaimSnapshotExposuresTestEnhancement : pcftest.ClaimSnapshotExposures {
  
  property get ExposuresLV() : pcftest.ClaimSnapshotExposuresScreen_default.ClaimSnapshotExposuresLV {
    return this.ClaimSnapshotExposuresScreen_default.ClaimSnapshotExposuresLV
  }

  property get Screen() : pcftest.ClaimSnapshotExposuresScreen_default {
    return this.ClaimSnapshotExposuresScreen_default
  }

  property get Content() : pcftest.ClaimSnapshotExposureDV_Content {
    return this.ClaimSnapshotExposuresScreen_default.ClaimSnapshotExposureDV_Content
  }

}

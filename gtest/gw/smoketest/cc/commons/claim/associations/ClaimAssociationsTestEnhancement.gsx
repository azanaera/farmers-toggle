package gw.smoketest.cc.commons.claim.associations

enhancement ClaimAssociationsTestEnhancement : pcftest.ClaimAssociations {

  property get AssociatedClaimsLV() : pcftest.AssociatedClaimsLV {
    return this.ClaimAssociationsScreen.AssociatedClaimsLV
  }

  property get NumAssocations() : int {
    return this.AssociatedClaimsLV._Entries.length
  }
  
  function findEntryWithTitle(title : String) : pcftest.AssociatedClaimsLV.entry {
    return this.AssociatedClaimsLV._Entries.firstWhere( \ e -> e.Association.Text == title )
  }

  function goToNewAssociation() : pcftest.NewClaimAssociation {
    return this.ClaimAssociationsScreen.ClaimAssociations_NewButton.click()
  }

  function findAssociation() : pcftest.ClaimAssociationSearchPopup {
    return this.ClaimAssociationsScreen.ClaimAssociations_FindButton.click()
  }

}

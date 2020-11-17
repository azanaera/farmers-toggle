package gw.smoketest.cc.commons.claim.associations

uses gw.smoketest.platform.web.PCFLocation
uses gw.smoketest.platform.web.ValueElement
uses pcftest.ClaimAssociationDetailDV
uses pcftest.EditableClaimsInAssociationLV

enhancement NewClaimAssociationTestEnhancement : pcftest.NewClaimAssociation {

  function update() : PCFLocation {
    return this.ClaimAssociationDetailScreen.Update.click()
  }
  
  function cancel() {
    this.ClaimAssociationDetailScreen.Cancel.click()
  }

  property get Title() : ValueElement {
    return this.ClaimAssociationDetailScreen.ClaimAssociationDetailDV.Title
  }

  property get ClaimAssociationDetailDV() : ClaimAssociationDetailDV {
    return this.ClaimAssociationDetailScreen.ClaimAssociationDetailDV
  }
  
  property get ClaimsInAssociationLV()  : EditableClaimsInAssociationLV {
    return this.ClaimAssociationDetailScreen.ClaimAssociationDetailDV.EditableClaimsInAssociationLV
  }
  
  function add() : pcftest.EditableClaimsInAssociationLV.entry {
    this.ClaimAssociationDetailScreen.ClaimAssociationDetailDV.EditableClaimsInAssociationLV_tb.Add.click()
    return ClaimsInAssociationLV._Entries.last()
  }
}

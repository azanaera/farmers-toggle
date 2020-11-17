package gw.enhancement.admin

uses gw.api.locale.DisplayKey
uses pcftest.*

enhancement Claim_gw_MenuLinksTestEnhancement : pcftest.Claim.MenuLinks {

  function goToLossDetails() : ClaimLossDetails {
    return this.Claim_ClaimLossDetailsGroup.click() as ClaimLossDetails
  }

  function goToAssociations() : ClaimAssociations {
    return this.Claim_ClaimLossDetailsGroup.ClaimLossDetailsGroup_ClaimAssociations.click()
  }

  function goToPolicy() : ClaimPolicyGeneral {
    return this.Claim_ClaimPolicyGroup.click() as ClaimPolicyGeneral
  }

  function goToServiceRequests() : ClaimServiceRequests {
    return this.Claim_ClaimServiceRequests.click()
  }

  function goToExposure() : ClaimExposures {
    return this.Claim_ClaimExposures.click()
  }

  function goToWCExposure(exposureType : ExposureType) :pcftest.TopLevelExposureDetail{
    return this._Entries.singleWhere(\e -> (e.Claim_TopLevelExposureDetail.Visible && e.Claim_TopLevelExposureDetail.Text == DisplayKey.get("Web.PrintValue", exposureType))).Claim_TopLevelExposureDetail.click()
  }

  function goToNotes() : ClaimNotes {
    return this.Claim_ClaimNotes.click()
  }

  function goToFinancials() : ClaimFinancialsSummary {
    return this.Claim_ClaimFinancialsGroup.click() as ClaimFinancialsSummary
  }

  function goToClaimChecks() : ClaimFinancialsChecks {
    return this.Claim_ClaimFinancialsGroup.ClaimFinancialsGroup_ClaimFinancialsChecks.click()
  }

  function goToClaimTransactions() : ClaimFinancialsTransactions {
    return this.Claim_ClaimFinancialsGroup.ClaimFinancialsGroup_ClaimFinancialsTransactions.click()
  }

  function goToWorkplan() : ClaimWorkplan {
    return this.Claim_ClaimWorkplan.click()
  }

  function goToPartiesInvolved() : ClaimContacts {
    return this.Claim_ClaimPartiesGroup.click() as ClaimContacts
  }

  function goToSubrogationGeneral() : SubrogationGeneral {
    return this.Claim_ClaimSubrogationGroup.click() as SubrogationGeneral
  }
}

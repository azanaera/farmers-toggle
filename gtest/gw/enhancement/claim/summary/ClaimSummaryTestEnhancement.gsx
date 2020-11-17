package gw.enhancement.claim.summary

uses gw.api.database.Query
uses gw.api.locale.DisplayKey
uses pcftest.*

@Export
enhancement ClaimSummaryTestEnhancement : pcftest.ClaimSummary {

  property get MenuLinks() : pcftest.Claim.MenuLinks {
    return this._parent._parent.MenuLinks
  }

  property get ClaimMenuActions() : pcftest.ClaimMenuActions {
    return this._parent._parent.ClaimMenuActions
  }


  property get TabBar() : pcftest.TabBar {
    return this._parent.TabBar
  }

  //-------- Go To Shortcuts ------------------------------
  function goToClaimSnapshot() : pcftest.ClaimSnapshotLossDetails {
    return MenuLinks.Claim_ClaimSnapshotGroup.click() as ClaimSnapshotLossDetails
  }

  property get ClaimNumber() : String {
    var claimTabText = this._parent.TabBar.ClaimTab.Text
    // Claim number is usually displayed as "Claim (xxx-xx-xxxx)",
    // so we want to strip out the characters before the claim number and the characters after it.
    // The number of characters to strip is dependent on the localization,
    // so we use a test string to determine how many to strip.
    var testClaimNumber = "xxx"
    var testString = DisplayKey.get("Web.TabBar.ClaimWithNumber", testClaimNumber)
    var startIndex = testString.indexOf(testClaimNumber)
    var trailingCharacters = testString.length - (startIndex + testClaimNumber.length)
    return claimTabText.substring(startIndex, claimTabText.length - trailingCharacters)
  }

  function OpenClaimMenuActions() : ClaimMenuActions {
    ClaimMenuActions.click()
    return ClaimMenuActions
  }

  function goToNewExposureByCoverageSubtype(type : CoverageSubtype) : pcftest.NewExposure {
    return this.ClaimMenuActions.goToNewExposureByCoverageSubtype(type)
  }

  function goToNewReserveSet() : NewReserveSet {
    return this.ClaimMenuActions.goToNewReserveSet()
  }

  function goToNewRecoveryReserveSet() : NewRecoveryReserveSet {
    return this.ClaimMenuActions.goToNewRecoveryReserveSet()
  }

  function goToNewCheck() : NormalCreateCheckWizard {
    return this.ClaimMenuActions.goToNewCheck()
  }

  function goToCloseClaim() : pcftest.CloseClaimPopup {
    return this.ClaimMenuActions.goToCloseClaim()
  }

  function goToServiceRequests() : pcftest.ClaimServiceRequests {
    return this.MenuLinks.goToServiceRequests()
  }

  function goToNotes() : pcftest.ClaimNotes {
    return this.MenuLinks.goToNotes()
  }

  function goToPolicy() : pcftest.ClaimPolicyGeneral {
    return this.MenuLinks.goToPolicy()
  }

  function goToLossDetails() : pcftest.ClaimLossDetails {
    return this.MenuLinks.goToLossDetails()
  }

  function goToAssociations() : pcftest.ClaimAssociations {
    return this.MenuLinks.goToAssociations()
  }

  function goToClaimStatus() : pcftest.ClaimStatus {
    return this._parent.MenuLinks.ClaimSummaryGroup_ClaimStatus.click()
  }

  function goToExposures() : pcftest.ClaimExposures {
    return this.MenuLinks.goToExposure()
  }

  function goToWCExposure(exposureType: ExposureType) : pcftest.TopLevelExposureDetail {
    return this.MenuLinks.goToWCExposure(exposureType)
  }

  function goToClaimFinancials() : pcftest.ClaimFinancialsSummary {
    return this.MenuLinks.goToFinancials()
  }

  function goToClaimFinancialsTransactions() : ClaimFinancialsTransactions {
    return this.MenuLinks.goToClaimTransactions()
  }

  function goToClaimTransactions() : ClaimFinancialsTransactions {
    return this.MenuLinks.goToClaimTransactions()
  }

  property get ClaimInfoBar() : pcftest.ClaimInfoBar {
    return this._parent._parent.ClaimInfoBar
  }


  /**
   * convenience for getting a reference to the actual claim
   */
  property get ClaimEntity() : Claim {
    return Query.make(Claim).compare("ClaimNumber", Equals, this.ClaimNumber).select().single()
  }

  function goToWorkplan() : pcftest.ClaimWorkplan {
    return this.MenuLinks.goToWorkplan()
  }

  function goToClaimParties() : pcftest.ClaimContacts {
    return this.MenuLinks.goToPartiesInvolved()
  }

  function goToNewManualCheck() : ManualCreateCheckWizard {
    return this.ClaimMenuActions.goToNewManualCheck()
  }
  function goToSubrogationGeneral() : SubrogationGeneral {
    return this.MenuLinks.goToSubrogationGeneral()
  }
}

package ext.config.claim.indicator

enhancement ClaimIndicatorEnhancement_Ext : Claim {

  /**
   * Toggle do not want to use the large loss indicator so this property will return all indicators
   * excluding LargeLossClaimIndicator
   * @return ClaimIndicator[] excluding LargeLossClaimIndicators
   */
  property get ToggleOrderedIndicators_Ext() : ClaimIndicator[]{
    return this.ClaimIndicators.where(\elt -> not (elt typeis LargeLossClaimIndicator)).sortBy(\ i -> i.Subtype)
  }
}

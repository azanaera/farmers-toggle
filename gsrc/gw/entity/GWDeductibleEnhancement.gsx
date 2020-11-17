package gw.entity
uses gw.api.financials.CurrencyAmount
uses gw.api.locale.DisplayKey
uses gw.api.util.CurrencyUtil
uses gw.util.DeductibleCalculator
uses gw.api.util.DisplayableException

@Export
enhancement GWDeductibleEnhancement : Deductible {
  /**
   * Recalculates the amount that this deductible should use to apply to a payment.
   * Assumes that this deductible is already linked to a coverage.
   */
  public function recalculateAmount() {
    this.Currency = this.Coverage.Currency
    this.Amount = DeductibleCalculator.calculateDeductibleAmountForCoverage(this.Coverage)
  }

  /**
   * Associates the given line item with this deductible.
   * If the given line item's line category is not "Deductible", this method throws an exception.
   */
  public function linkItem(tli : TransactionLineItem) {
    if (tli.LineCategory != TC_DEDUCTIBLE) {
      throw new DisplayableException(DisplayKey.get("Deductible.Error.CannotLinkDeductibleToNonDeductibleTLI"))
    }
    tli.Deductible = this
  }

  /**
   * generate a string for "amount paid/unpaid/waived" to display on the DeductibleInputSet
   */
  property get DisplayAmount() : String {
    return this.Waived ?
        DisplayKey.get("Deductible.Summary.Waived", this.Amount) :
        DisplayKey.get("Deductible.Summary.Applied", this.AmountApplied, this.Amount)
  }

  /**
   * Returns whether this deductible's remaining amount is zero.
   *
   * @return true if this deductible's remaining amount is zero
   */
  property get HasRemainingAmount(): boolean {
    return this.AmountRemaining.Amount != 0
  }

  /**
   * Returns whether this deductible's linked transaction line items match or underutilized its amount.
   * This is equivalent to whether this deductible has a positive remaining amount.
   *
   * @return true if this deductible has positive remaining amount
   */
  property get HasUnappliedDeductible(): boolean {
    return this.AmountRemaining.Amount > 0
  }

  /**
   * Returns whether this deductible's linked transaction line items match or overutilized its amount.
   * This is equivalent to whether this deductible has a negative remaining amount.
   *
   * @return true if this deductible has negative remaining amount
   */
  property get HasOverwithheldDeductible(): boolean {
    return this.AmountRemaining.Amount < 0
  }

  /**
   * Returns the amount applied on this deductible.
   * This is computed by summing up all the appropriate amounts of TransactionLineItems linked to this deductible.
   * The "appropriate" amount of a TLI is one whose currency matches that of this deductible.
   * TLIs that do not have an amount matching this deductible's currency are ignored.
   * This method must not return a null value; if no TLIs apply, it should return zero.
   *
   * @return amount applied on this deductible
   */
  property get AmountApplied() : CurrencyAmount {
    var currency = this.Currency
    var result = 0bd.ofCurrency(currency)
    for (var tli in this.TransactionLineItems) {
      if (currency == tli.Currency) {
        result += tli.TransactionAmount
      } else if (currency == tli.ReservingCurrency) {
        result += tli.ReservingAmount
      } else if (currency == tli.ClaimCurrency) {
        result += tli.ClaimAmount
      } else if (currency == CurrencyUtil.ReportingCurrency) {
        result += tli.ReportingAmount
      }
    }
    return result.negateStrict()
  }

  /**
   * Returns the amount of this deductible that has not yet been applied.
   * This is equal to Amount - AmountApplied.
   * This may be a negative number, in which case the deductible has been overapplied.
   * If this deductible's amount is null, this method returns null.
   *
   * @return amount of deductible not yet applied
   */
  property get AmountRemaining() : CurrencyAmount {
    return this.Amount == null ? null : this.Amount.subtractStrict(this.AmountApplied)
  }
}

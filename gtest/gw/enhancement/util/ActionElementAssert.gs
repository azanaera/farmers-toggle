package gw.enhancement.util
uses gw.smoketest.platform.web.ActionElement
uses org.fest.assertions.AssertExtension
uses org.fest.assertions.Assertions
uses gw.api.financials.CurrencyAmount
uses gw.api.util.CurrencyUtil
uses java.math.BigDecimal
uses java.util.regex.Pattern

class ActionElementAssert implements AssertExtension {

  private var actual : ActionElement
  private var displayZeroAsNumber = false  // by default, zero is displayed as '-'
  final var EXCHANGE_RATE_DECIMAL_PATTERN = Pattern.compile("(\\.\\d)\\d*")

  construct(a : ActionElement) {
    this.actual = a
  }

  function isEnabled() : ActionElementAssert {
    Assertions.assertThat(actual.Enabled as boolean)
        .as(ExpectationFailureMessagePrefix + " to be enabled, but it wasn't")
        .isTrue()
    return this
  }

  function isDisabled() : ActionElementAssert {
    Assertions.assertThat(actual.Enabled as boolean)
        .as(ExpectationFailureMessagePrefix + " to be disabled, but it was enabled")
        .isFalse()
    return this
  }

  function isVisible() : ActionElementAssert {
    Assertions.assertThat(actual.Visible as boolean)
        .as(ExpectationFailureMessagePrefix + " to be visible, but it wasn't")
        .isTrue()
    return this
  }

  function isHidden() : ActionElementAssert {
    Assertions.assertThat(actual.Visible as boolean)
        .as(ExpectationFailureMessagePrefix + " to be hidden, but it was visible")
        .isFalse()
    return this
  }

  function hasText(expectedText : String) : ActionElementAssert {
    Assertions.assertThat(actual.Text)
        .as(ExpectationFailureMessagePrefix + " to have text")
        .isEqualTo(expectedText)
    return this
  }

  function hasEmptyText() : ActionElementAssert {
    Assertions.assertThat(actual.Text)
        .as(ExpectationFailureMessagePrefix + " to have empty text")
        .isEmpty()
    return this
  }

  function hasNonEmptyText() : ActionElementAssert {
    Assertions.assertThat(actual.Text)
        .as(ExpectationFailureMessagePrefix + " to have non empty text")
        .isNotEmpty()
    return this
  }

  /**
   * Changes the behavior of subsequent displays() and displaysAsMoney() calls
   * such that zero amounts are expected to be rendered as numbers rather than
   * using the currency format's special zero value. DOES NOT ASSERT ANYTHING
   * ITSELF.
   */
  @Deprecated("Use displaysZeroMoneyAsNumber() instead")
  function withZeroDisplayedAsANumber() : ActionElementAssert {
    displayZeroAsNumber = true
    return this
  }

  /**
   * Asserts that this element currently displays the given currency amount.
   * Zero values are expected to be rendered according to the currency
   * format's special zero value unless withZeroDisplayedAsANumber() has been
   * called.
   */
  @Deprecated("Use hasCurrencyAmount(currencyAmount) instead")
  function displays(currencyAmount : CurrencyAmount) : ActionElementAssert {
    if (currencyAmount != null)
      return hasText(CurrencyUtil.renderAsCurrency(currencyAmount.Amount,currencyAmount.Currency,!displayZeroAsNumber))
    else
      return hasText("") // money/currencyamount field renders as blank when null
  }

  /**
   * Asserts that this element currently displays the given currency amount.
   * Zero values are expected to be rendered according to the currency
   * format's special zero value unless withZeroDisplayedAsANumber() has been
   * called.
   */
  @Deprecated("Use hasCurrencyAmount(new CurrencyAmount(amount, currency)) instead")
  function displays(amount : BigDecimal, currency : Currency) : ActionElementAssert {
    if (amount != null) {
      return displays(amount.ofCurrency(currency))
    } else {
      return displays(null);
    }
  }

  /**
   * Asserts that this element currently displays the given amount in the
   * default currency. Zero values are expected to be rendered according to the
   * currency format's special zero value unless withZeroDisplayedAsANumber()
   * has been called.
   */
  function displaysAsMoney(amount : BigDecimal) : ActionElementAssert {
    return displays(amount, CurrencyUtil.getDefaultCurrency())
  }

  /**
   * Asserts that this element currently displays zero in the default currency,
   * as a number rather than using the currency format's special zero value.
   */
  function displaysZeroMoneyAsNumber() : ActionElementAssert {
    return hasText(CurrencyUtil.renderAsCurrency(0, CurrencyUtil.getDefaultCurrency(), false))
  }

  /**
   * Asserts that this element currently displays the string representation of the market exchange rate for the
   * passed-in currencies.
   *
   * @param fromCurrency
   * @param toCurrency
   * @param marketRate Optional. If specified, this would be considered as the market rate to assert against. Else, the
   *                   currently set market rate is used. Useful to test scenarios that deal with a "preserved" market
   *                   rate, such as in the case of Recovery/Check Transfer etc.
   *
   * @see #hasExchangeRate(typekey.Currency, typekey.Currency, java.math.BigDecimal) Details about the assertion logic
   */
  function hasMarketExchangeRate(fromCurrency : Currency, toCurrency : Currency, marketRate : BigDecimal = null)
  : ActionElementAssert {
    return marketRate == null ?
        hasExchangeRate(CurrencyUtil.getMarketExchangeRateEntity(fromCurrency, toCurrency)):
        hasExchangeRate(fromCurrency, toCurrency, marketRate)
  }

  /**
   * Asserts that this element currently displays the following description using the passed-in exchange rate
   * parameters : <p/><code>
   *
   *    1 fromCurrency = rate toCurrency
   *
   * </code><p/>
   * Note : In order to avoid issues caused by rounding and variation in decimal places, this assert checks only up to
   * one decimal place and ignores any places there after. It also correctly handles trailing zeroes, i.e. the assert
   * would pass if the passed in rate was just "2" but the rate displayed on the UI was "2.0" or "2.00".
   */
  function hasExchangeRate(fromCurrency : Currency, toCurrency : Currency, rate : BigDecimal)
  : ActionElementAssert {

    var exchangeRateString = rate as String
    var decimalMatcher = EXCHANGE_RATE_DECIMAL_PATTERN.matcher(exchangeRateString)
    var regexSuffix : String

    if(decimalMatcher.find()) {
      exchangeRateString = decimalMatcher.replaceFirst("$1")
      regexSuffix = "\\d*"
    } else {
      regexSuffix = "(\\.0+)?"
    }

    var exchangeRateRegex =  "${exchangeRateString}${regexSuffix}"
    var fullDescriptionRegex =
        "^\\s*1\\s*${fromCurrency.DisplayName}\\s*=\\s*${exchangeRateRegex}\\s*${toCurrency.DisplayName}\\s*$"

    Assertions.assertThat(actual.Text)
        .as(ExpectationFailureMessagePrefix + " to display exchange rate")
        .matches(fullDescriptionRegex)
    return this
  }

  /**
   * Asserts that this element currently displays the string representation of the passed-in exchange rate.
   *
   * @see #hasExchangeRate(typekey.Currency, typekey.Currency, java.math.BigDecimal) Details about the assertion logic
   */
  function hasExchangeRate(exchangeRate : ExchangeRate) : ActionElementAssert {
    return hasExchangeRate(exchangeRate.BaseCurrency, exchangeRate.PriceCurrency, exchangeRate.Rate)
  }

  internal property get ExpectationFailureMessagePrefix() : String {
    return "expected element '" + actual.NewId.IdPart + "'"
  }

}
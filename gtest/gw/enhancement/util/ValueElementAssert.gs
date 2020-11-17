package gw.enhancement.util

uses gw.api.financials.IMoney
uses gw.api.upgrade.Coercions
uses gw.api.util.CurrencyUtil
uses gw.smoketest.platform.web.ValueElement
uses org.fest.assertions.Assertions

uses java.math.BigDecimal

uses typekey.Currency

class ValueElementAssert extends ActionElementAssert {

  private var actual : ValueElement

  construct( a : ValueElement ) {
    super( a )
    this.actual = a
  }

  function isEditable() : ValueElementAssert {
    Assertions.assertThat( actual.Editable as boolean )
        .as("expected element to be editable, but it wasn't")
        .isTrue()
    return this
  }

  function isNotEditable() : ValueElementAssert {
    Assertions.assertThat( actual.Editable as boolean )
        .as("expected element not to be editable, but it was")
        .isFalse()
    return this
  }

  /**
   * asserts that the label is a string that contains <code>expectedSubstring</code> as a substring
   * (case-insensitive)
   */
  function hasLabelContainingSubstring( expectedSubstring : String ) : ValueElementAssert {
    Assertions.assertThat( actual.Label )
        .containsIgnoringCase( expectedSubstring )
    return this
  }

  /**
   * asserts that the label is a string that is equal to <code>expectedLabel</code> (case-insensitive)
   */
  function hasLabelIgnoringCase( expectedLabel : String ) : ValueElementAssert {
    Assertions.assertThat( actual.Label )
        .isEqualToIgnoringCase( expectedLabel )
    return this
  }

  /**
   * Asserts that this element's value is equal to the given amount. Ignores
   * differences in trailing zeroes after the decimal point.
   */
  function hasAmount(amount : BigDecimal) : ValueElementAssert {
    Assertions.assertThat(new BigDecimal(actual.Value)).isEqualByComparingTo(amount)
    return this
  }

  /**
   * Asserts that this element displays the given amount and currency.
   */
  function hasCurrencyAmount(amount : IMoney) : ValueElementAssert {
    return hasCurrencyAmount(amount.Amount, amount.Currency)
  }

  function hasCurrencyAmount(amount : BigDecimal, currency : Currency) : ValueElementAssert {
    if (actual.Editable) {
      // when in edit mode, the text and value do not include the currency symbols, so only check the amount
      return hasAmount(amount)
    } else {
      Assertions.assertThat(actual.Text).isEqualTo(CurrencyUtil.renderAsCurrency(amount, currency, true))
      return this
    }
  }

  /**
   * Asserts that this element displays the given amount and currency. Performs a lenient assert, which accommodates for
   * rounding errors (i.e. if the expected amount is 201.23, the assert would pass if the element displays an amount of
   * 201.22 -or- 201.23 -or- 201.24). This assert should be used only in exceptional scenarios where rounding errors can
   * happen despite using the correct Rounding Mode in the test case. One such scenario is where inverse rates are
   * involved (for e.g. when we recalculate Tx amounts from Reserving/Claim amounts).
   *
   * IMPORTANT: Unless you are specifically testing any of the exceptional scenarios mentioned above, avoid using this
   * method in your test cases. Most of the rounding errors encountered in test cases are valid ones and can(should) be
   * fixed by using the correct Rounding Mode while calculating amounts in the test case. In particular, do not use
   * this assert for verifying Reserving/Claim/Reporting amounts, since they are all set using direct market rates
   * and are hence not included in the exceptional scenario mentioned above.
   */
  function hasCurrencyAmountIgnoreRoundingError(amount : IMoney) : ValueElementAssert {
    var assertionFailed : boolean
    var oneCent = 0.01
    var currencyAmount = amount.toCurrencyAmount()
    var amountsAdjustedForRounding = { currencyAmount.subtract(Coercions.makeCurrencyAmountFrom(oneCent)), currencyAmount, currencyAmount.add(Coercions.makeCurrencyAmountFrom(oneCent))}

    if (actual.Editable) {
      // when in edit mode, the text and value do not include the currency symbols, so only check the amount
      var actualAmount = new BigDecimal(actual.Value)
      assertionFailed = not amountsAdjustedForRounding.hasMatch( \ adjustedAmount ->
          adjustedAmount.compareTo(Coercions.makeCurrencyAmountFrom(actualAmount)) == 0)
    } else {
      var elementText = actual.Text
      assertionFailed = not amountsAdjustedForRounding.hasMatch( \ adjustedAmount ->
          elementText == CurrencyUtil.renderAsCurrency(adjustedAmount))
    }

    if(assertionFailed) {
      throw new AssertionError("Expected <'${CurrencyUtil.renderAsCurrency(amount)}'> ± 1 cent, but was <'${actual.Text}'>")
    }

    return this
  }

  /**
   * Asserts that this element displays the given amount and currency as its
   * secondary (alternate) value.
   */
  function hasSecondaryCurrencyAmount(amount : IMoney) : ValueElementAssert {
//    Assertions.assertThat(actual.AltValue).isEqualTo("= " + CurrencyUtil.renderAsCurrency(amount))
    Assertions.assertThat(actual.AltValue).isEqualTo(normalizeText("= " + CurrencyUtil.renderAsCurrency(amount)))
    return this
  }

  function hasSecondaryCurrencyAmount(amount : BigDecimal, currency : Currency) : ValueElementAssert {
    Assertions.assertThat(actual.AltValue).isEqualTo(normalizeText("= " + CurrencyUtil.renderAsCurrency(amount, currency)))
    return this
  }

  // this is what jsoup does to things like AltValue. We need to do the same in order for isEqualTo to succeed. :-(
  static function normalizeText(t : String) : String {
    var b = new StringBuilder()
    org.jsoup.helper.StringUtil.appendNormalisedWhitespace(b, t, false)
    return b.toString()
  }

  /**
   * Asserts that this element displays the given currency (only).
   */
  function hasCurrency(currency : Currency) : ValueElementAssert {
    Assertions.assertThat(actual.Text).isEqualTo(currency.DisplayName)
    return this
  }
}
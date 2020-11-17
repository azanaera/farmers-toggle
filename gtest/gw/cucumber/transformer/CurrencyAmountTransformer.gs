package gw.cucumber.transformer

uses gw.api.financials.CurrencyAmount

class CurrencyAmountTransformer {

  /**
   * Transforms the given string into a CurrencyAmount type. The expected string is <amount>SPACE<currency>.
   * For example: 100 USD, 50 EUR, etc
   *
   * @param amountStr - the String representation of the amount.
   * @return - a CurrencyAmount object
   */
  function transform(amountStr : String) : CurrencyAmount {
    try {
      return new CurrencyAmount(amountStr)
    } catch (e: Exception) {
      throw new IllegalArgumentException("Unsupported CurrencyAmount format: ${amountStr}" +
          e.getMessage() != null ? " - error: ${e.getMessage()}" : "" )
    }
  }
}
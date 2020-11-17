package gw.cucumber.transformer

uses gw.api.util.DateUtil
uses gw.testharness.v3.PLAssertions

uses java.text.DateFormat
uses java.text.SimpleDateFormat

/**
 * Helper class which defines methods for converting an object to {@link Date}
 */
@Export
class DateTransformer {

  static final var DEFAULT_DATE_FORMAT = new SimpleDateFormat("MM/dd/yyyy")

  static function transform(dateString : String, format : DateFormat = null) : Date {
    if (dateString.equalsIgnoreCase("today")) {
      return DateUtil.currentDate()
    }
    if (format == null) {
      format = DEFAULT_DATE_FORMAT
    }
    format.setLenient(false)
    var date = format.parse(dateString)
    PLAssertions.assertThat(date).isNotNull()
    return date
  }

}
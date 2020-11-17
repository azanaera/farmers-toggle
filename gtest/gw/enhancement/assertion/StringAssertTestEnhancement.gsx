package gw.enhancement.assertion

uses org.fest.assertions.Formatting
uses org.fest.assertions.StringAssert
uses org.fest.util.Strings

enhancement StringAssertTestEnhancement : StringAssert {

  public function isContainsWithToIgnoringCase(expected : String) : StringAssert {
    if (this.actual == null and expected == null) {
      return this
    }
    this.isNotNull()
    if (this.actual.containsIgnoreCase(expected)) {
      return this
    }
    this.failIfCustomMessageIsSet()
    throw this.failure(Strings.concat({this.actual, " should be equal to :", Formatting.inBrackets(expected), " ignoring case"}))
  }

  public function isEndsWithToIgnoringCase(expected : String) : StringAssert {
    if (this.actual == null and expected == null) {
      return this
    }
    this.isNotNull()
    if (this.actual.endsWithIgnoreCase(expected)) {
      return this
    }
    this.failIfCustomMessageIsSet()
    throw this.failure(Strings.concat({this.actual, " should be equal to :", Formatting.inBrackets(expected), " ignoring case"}))
  }

  public function isStartWithToIgnoringCase(expected : String) : StringAssert {
    if (this.actual == null and expected == null) {
      return this
    }
    this.isNotNull()
    if (this.actual.startsWithIgnoreCase(expected)) {
      return this
    }
    this.failIfCustomMessageIsSet()
    throw this.failure(Strings.concat({this.actual, " should be equal to :", Formatting.inBrackets(expected), " ignoring case"}))
  }

}

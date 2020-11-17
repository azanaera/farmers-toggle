package gw.enhancement.validationmessagehandler

uses com.google.common.collect.Multimap
uses org.fest.assertions.Fail

uses java.util.regex.Pattern
uses java.util.stream.Collectors

abstract class ValidationMessageMatchResult {

  abstract property get ExpectedActualMatches() : Multimap<Pattern, String>

  abstract property get IgnoredActualMatches() : Multimap<Pattern, String>

  abstract property get DuplicateMessages() : Set<String>

  abstract property get UnexpectedMessages() : Set<String>

  abstract property get UnmatchedExpectedPatterns() : Set<Pattern>

  abstract property get UnmatchedIgnoredPatterns() : Set<Pattern>

  property get HadMatches() : boolean {
    return !(ExpectedActualMatches.Empty and IgnoredActualMatches.Empty)
  }

  /**
   * Processes any validation messages results according to the following algorithm:
   * <ol>
   * <li><b>Assert</b> that every ExpectMessage pattern matched at least one message.</li>
   * <li><b>Assert</b> that every validation message was matched by at least one pattern..</li>
   *
   * @throws AssertionError if either assertion fails
   */
  function assertAllMessagesMatched() {
    if (!UnmatchedExpectedPatterns.Empty or !UnexpectedMessages.Empty) {
      Fail.fail(DisplayString)
    }
  }

  property get HasFailures() : boolean {
    return UnmatchedExpectedPatterns.HasElements or UnexpectedMessages.HasElements
  }

  var _displayString: String

  property get DisplayString() : String {
    if (_displayString == null) {
      var lineSeparator = System.lineSeparator()

      var sb = new StringBuilder()

      sb.append(HasFailures
          ? "Failure matching validation message(s)!"
          : "Successfully matched validation message(s)!")

      sb.append(lineSeparator)

      var newLine = \ label: String, value: String ->
          sb.append("  | ").append(label).append(": ").append(value).append(lineSeparator)

      section(sb, "MATCH FAILURES ", \-> {
        newLine("Expected but absent", patternsString(UnmatchedExpectedPatterns))
        newLine("Unexpected messages", messagesString(UnexpectedMessages))
        if (DuplicateMessages.HasElements) {  // since PL filters duplicates this will almost always be false
          newLine("Duplicate messages", messagesString(DuplicateMessages))
        }
      })

      section(sb, "MATCH SUCCESSES", \-> {
        var expectedPatterns = ExpectedActualMatches.keySet()
        newLine("Expected patterns", patternsString(expectedPatterns))
        if (expectedPatterns.HasElements) {
          newLine("          matches", messagesString(ExpectedActualMatches.values()))
        }
        var ignoredPatterns = IgnoredActualMatches.keySet()
        newLine(" Ignored patterns", patternsString(ignoredPatterns))
        if (ignoredPatterns.HasElements) {
          newLine("          matches", messagesString(IgnoredActualMatches.values()))
          newLine("        unmatched", patternsString(UnmatchedIgnoredPatterns))
        }
      })

      _displayString = sb.toString()
    }
    return _displayString
  }

  private function section(sb : StringBuilder, title : String, content : ()) {
    var lineSeparator = System.lineSeparator()
    sb.append("  +- ").append(title).append(" -------").append(lineSeparator)
    content()
    sb.append("  +-------------------------").append(lineSeparator)
  }

  private function patternsString(patterns : Set<Pattern>): String {
    var patternsString = "{}"
    if (patterns.HasElements) {
      patternsString = patterns.stream()
          .map(\pattern -> pattern.pattern())
          .collect(Collectors.joining("/, /", "{/", "/}"))
    }
    return patternsString
  }

  private function messagesString(messages : Collection<String>) : String {
    var matchesString = "{}"
    if (messages.HasElements) {
      matchesString = messages.stream()
          .unordered()
          .distinct()
          .collect(Collectors.joining("\", \"", "{\"", "\"}"))
    }
    return matchesString
  }

}

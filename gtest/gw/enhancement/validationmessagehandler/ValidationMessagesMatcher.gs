package gw.enhancement.validationmessagehandler

uses com.google.common.collect.HashMultimap
uses com.google.common.collect.Multimap
uses com.google.common.collect.Multimaps

uses java.util.regex.Pattern

class ValidationMessagesMatcher {

  var _expected : Set<Pattern> as ExpectedPatterns
  var _ignored : Set<Pattern> as IgnoredPatterns

  construct() { }

  /**
   * Attempts to successfully complete the action, processing any resulting validation messages according to the following
   * algorithm:
   * <ol>
   * <li>For each expect pattern, discard <i>every</i> matching validation message.</li>
   * <li>For each ignore pattern, discard <i>every</i> matching validation message.</li>
   * <p>
   * The new instance reports the results of that algorithm.
   *
   * @param allValidationMessages All validation messages that were displayed
   * @param ignoredPatterns       The set of patterns describing messages that are not required and can be safely ignored
   */
  function match(allValidationMessages : List<String>) : ValidationMessageMatchResult {
    var result = new EditableMatchResult()
    var uniqueMessages: Set<String>  = {}

    for (message in allValidationMessages) {
      if (uniqueMessages.add(message)) {
        var wasMatched = false
        for (pattern in ExpectedPatterns) {
          if (pattern.matcher(message).find()) {
            // Note *every* pattern that matches
            result.ExpectedActualMatches.put(pattern, message)
            wasMatched = true
          }
        }
        if (!wasMatched) {
          for (pattern in IgnoredPatterns) {
            if (pattern.matcher(message).find()) {
              // Note *every* pattern that matches
              result.IgnoredActualMatches.put(pattern, message)
              wasMatched = true
            }
          }
        }
        if (!wasMatched) {  // if it was neither 'expected' nor 'ignored'
          result.UnexpectedMessages.add(message)
        }
      } else {
        result.DuplicateMessages.add(message)
      }
    }

    return result.freeze()
  }

  private class EditableMatchResult extends ValidationMessageMatchResult {
    var _expectedActualMatches :     Multimap<Pattern, String> as readonly ExpectedActualMatches     = HashMultimap.create<Pattern, String>()
    var _ignoredActualMatches :      Multimap<Pattern, String> as readonly IgnoredActualMatches      = HashMultimap.create<Pattern, String>()

    var _duplicateMessages :         Set<String>               as readonly DuplicateMessages         = {}
    var _unexpectedMessages :        Set<String>               as readonly UnexpectedMessages        = {}
    var _unmatchedExpectedPatterns : Set<Pattern>              as readonly UnmatchedExpectedPatterns = {}
    var _unmatchedIgnoredPatterns :  Set<Pattern>              as readonly UnmatchedIgnoredPatterns  = {}

    function freeze(): ValidationMessageMatchResult {
      _expectedActualMatches     = Multimaps.unmodifiableMultimap(_expectedActualMatches)
      _ignoredActualMatches      = Multimaps.unmodifiableMultimap(_ignoredActualMatches)

      _duplicateMessages         = Collections.unmodifiableSet(_duplicateMessages)
      _unexpectedMessages        = Collections.unmodifiableSet(_unexpectedMessages)

      var unmatcheExpected       = ExpectedPatterns.subtract(ExpectedActualMatches.keySet())
      _unmatchedExpectedPatterns = Collections.unmodifiableSet(unmatcheExpected)

      var unmatchedIgnored       = IgnoredPatterns.subtract(IgnoredActualMatches.keySet())
      _unmatchedIgnoredPatterns  = Collections.unmodifiableSet(unmatchedIgnored)

      return this
    }
  }

}

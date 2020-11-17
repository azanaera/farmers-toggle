package gw.enhancement.validationmessagehandler

uses gw.enhancement.util.StructuralType
uses gw.smoketest.platform.web.PCFLocation
uses org.fest.assertions.Assertions
uses pcftest.CheckDuplicatesWorksheet
uses pcftest.NewClaimDuplicatesWorksheet
uses pcftest.WebMessageWorksheet

uses java.util.logging.Level
uses java.util.logging.Logger
uses java.util.regex.Pattern

/**
 * Specifies a set of {@link Pattern} objects to be matched against any validation messages that are encountered during
 * {@link #handleWhile(}. There are two kinds:<ol>
 * <li><b>Expected</b> - These patterns are processed first. Each one them must match at least one of the validation
 * messages.</li>
 * <li><b>Ignored</b> - These patterns describe validation messages that, should they occur, can be safely ignored.</li>
 * </ol>
 * If there are any unmatched Expected patterns, or any messages that were neither Expected nor Ignored, it is a failure.
 *
 * @param <START>                 The type of the starting point for navigation
 * @param <MSG_PROCESSOR_SUBTYPE> The concrete subtype of this class to be returned by many of the methods (in the style
 *                                of the Builder pattern).
 */
class BasicValidationMessageHandler<START, MSG_PROCESSOR_SUBTYPE extends BasicValidationMessageHandler<START, MSG_PROCESSOR_SUBTYPE>> {
  /**
   * Describes how to handle any duplicates warning worksheets
   */
  enum DuplicatesWorksheetStrategy {
    /** Expect the duplicates warning worksheet to appear, and once it does quietly dismiss it. */
    Expect,

    /** If the duplicates warning worksheet appears, quietly dismiss it. */
    Ignore,

    /** Do not expect the duplicates warning worksheet to appear. */
    DoNotExpect
  }

  /**
   * Describe how to handle the duplicates warning worksheet. The default is {@link BasicValidationMessageHandler.DuplicatesWorksheetStrategy#Ignore}.
   */
  var _handleDupsWorksheetStrategy: DuplicatesWorksheetStrategy as HandleDuplicatesWorksheetStrategy = Ignore
  var _uiValidationMessageReader:   block(): List<String>

  var _logMatchResults:             boolean      as          LogMatchResults            = false
  var _start:                       START        as readonly Start
  var _expectPatterns:              Set<Pattern> as readonly ExpectPatterns             = {}
  var _ignorePatterns:              Set<Pattern> as readonly IgnorePatterns             = {}
  var _repeatIfValidationMessages:  boolean      as readonly RepeatIfValidationMessages = true

  construct(start: START, uiValidationMessageReader: block(): List<String> = null) {
    _start = start
    _uiValidationMessageReader = uiValidationMessageReader ?: \-> Collections.emptyList()
  }

  //
  // Basic Configuration
  //

  property get UIValidationMessages() : List<String> {
    return new ArrayList<String>(_uiValidationMessageReader())
  }

  /**
   * Answer the list of validation messages being displayed at the specified location
   *
   * @param location
   * @return a Set of message Strings
   */
  function getValidationMessages(location: PCFLocation): List<String> {
    var currentWorksheet = location.SmokeTest.CurrentWorksheet
    var msgs = UIValidationMessages
    if (currentWorksheet typeis WebMessageWorksheet) {
      msgs.addAll(currentWorksheet.WebMessageWorksheetScreen.grpMsgs.AllMessages ?: {})
    }
    return msgs
  }

  /**
   * Whether the navigation action should be re-run if the initial attempt caused validation messages.
   *
   * @param shouldRepeat
   * @return
   */
  function withRepeatIfValidationMessages(shouldRepeat : boolean) : MSG_PROCESSOR_SUBTYPE {
    _repeatIfValidationMessages = shouldRepeat
    return this as MSG_PROCESSOR_SUBTYPE
  }

  function doNotRepeatIfValidationMessages() : MSG_PROCESSOR_SUBTYPE {
    return withRepeatIfValidationMessages(false)
  }

  /**
   * Specify whether to log the match results if no error is found. Defaults to false. Useful for debugging.
   */
  function withLogMatchResults(shouldLog : boolean) : MSG_PROCESSOR_SUBTYPE {
    _logMatchResults = shouldLog
    return this as MSG_PROCESSOR_SUBTYPE
  }

  function logMatchResults() : MSG_PROCESSOR_SUBTYPE {
    return withLogMatchResults(true)
  }

  function doNotLogMatchResults() : MSG_PROCESSOR_SUBTYPE {
    return withLogMatchResults(false)
  }


  //
  // Expected Messages
  //

  /**
   * The supplied string is compiled into a {@link Pattern} object using {@link Pattern#compile(String, int)} with the
   * flag {@link Pattern#LITERAL}. We expect the resulting Pattern to match at least one validation message.
   *
   * @param msg String
   */
  function expect(msg : String) : MSG_PROCESSOR_SUBTYPE {
    return expect(Pattern.LITERAL, msg)
  }

  /**
   * The supplied string is compiled into a {@link Pattern} object using the supplied flags. We expect the resulting
   * Pattern to match at least one validation message.
   *
   * @param flags Flags to be passed to {@link Pattern#compile(String, int)}
   * @param msg   String
   */
  function expect(flags : int, msg : String) : MSG_PROCESSOR_SUBTYPE {
    return expect(flags, {msg})
  }

  /**
   * The supplied strings are compiled into {@link Pattern} objects using the supplied flags. We expect each resulting
   * Pattern to match at least one validation message.
   *
   * @param flags Flags to be passed to {@link Pattern#compile(String, int)}
   * @param msgs  Strings
   */
  function expect(flags : int, msgs : Collection<String>) : MSG_PROCESSOR_SUBTYPE {
    var patterns = msgs.map(\msg -> Pattern.compile(msg, flags))
    return expect(patterns)
  }

  /**
   * The supplied Strings are OR'ed into a single {@link Pattern} object, which we then 'expect' to match at least one
   * validation message. The individual strings are treated as regexp's--you must escape any literal characters.
   *
   * @param msgs Strings to be OR'ed together
   */
  function expectAtLeastOneOf(msgs : Collection<String>) : MSG_PROCESSOR_SUBTYPE {
    return expect(Pattern.compile(msgs.join("|")))
  }

  /**
   * We expect the supplied {@link Pattern} to match at least one validation message.
   *
   * @param msg Pattern instance
   */
  function expect(msg : Pattern) : MSG_PROCESSOR_SUBTYPE {
    return expect({msg})
  }

  /**
   * We expect every supplied {@link Pattern} to match at least one validation message.
   *
   * @param msgs Pattern instances
   */
  function expect(msgs : Collection<Pattern>) : MSG_PROCESSOR_SUBTYPE {
    ExpectPatterns.addAll(msgs)
    return this as MSG_PROCESSOR_SUBTYPE
  }


  //
  // Ignored Messages
  //

  /**
   * The supplied string is compiled into a {@link Pattern} object using {@link Pattern#compile(String, int)} with the
   * flag {@link Pattern#LITERAL}. Every validation message that matches the resulting Pattern will be ignored.
   *
   * @param msg String
   */
  function ignore(msg : String) : MSG_PROCESSOR_SUBTYPE {
    return ignore(Pattern.LITERAL, msg)
  }

  /**
   * The supplied string is compiled into a {@link Pattern} object using the supplied flags. Every validation message
   * that matches the resulting pattern will be ignored.
   *
   * @param flags Flags to be passed to {@link Pattern#compile(String, int)}
   * @param msg   String
   */
  function ignore(flags : int, msg : String) : MSG_PROCESSOR_SUBTYPE {
    return ignore(flags, {msg})
  }

  /**
   * The supplied strings are compiled into {@link Pattern} objects using the supplied flags. Any validation message
   * that matches any of the resulting patterns will be ignored.
   *
   * @param flags Flags to be passed to {@link Pattern#compile(String, int)}
   * @param msgs  Strings
   */
  function ignore(flags : int, msgs : Collection<String>) : MSG_PROCESSOR_SUBTYPE {
    var patterns = msgs.map(\msg -> Pattern.compile(msg, flags))
    return ignore(patterns)
  }

  /**
   * Every message that matches the supplied {@link Pattern} will be ignored.
   *
   * @param msg Pattern instance
   */
  function ignore(msg : Pattern) : MSG_PROCESSOR_SUBTYPE {
    return ignore({msg})
  }

  /**
   * Any message that matches any of the supplied {@link Pattern}s will be ignored.
   *
   * @param msgs Pattern instances
   */
  function ignore(msgs : Collection<Pattern>) : MSG_PROCESSOR_SUBTYPE {
    IgnorePatterns.addAll(msgs)
    return this as MSG_PROCESSOR_SUBTYPE
  }

  /**
   * Ignore all messages that you do not explicitly {@link #expect(String)}. Use with caution, as this could make it
   * harder to spot a validation message that should not have appeared (e.g. from a buggy rule).
   */
  function ignoreAllUnexpected() : MSG_PROCESSOR_SUBTYPE {
    return ignore(Pattern.compile("^.*$"))
  }


  //
  // Duplicate warnings
  //

  /**
   * Use the strategy {@link BasicValidationMessageHandler.DuplicatesWorksheetStrategy#Expect}
   */
  function expectDuplicatesWorksheet(): MSG_PROCESSOR_SUBTYPE {
    HandleDuplicatesWorksheetStrategy = DuplicatesWorksheetStrategy.Expect
    return this as MSG_PROCESSOR_SUBTYPE
  }

  /**
   * Use the strategy {@link BasicValidationMessageHandler.DuplicatesWorksheetStrategy#Ignore}
   */
  function ignoreDuplicatesWorksheet(): MSG_PROCESSOR_SUBTYPE {
    HandleDuplicatesWorksheetStrategy = DuplicatesWorksheetStrategy.Ignore
    return this as MSG_PROCESSOR_SUBTYPE
  }

  /**
   * Use the strategy {@link BasicValidationMessageHandler.DuplicatesWorksheetStrategy#DoNotExpect}
   */
  function doNotExpectDuplicatesWorksheet(): MSG_PROCESSOR_SUBTYPE {
    HandleDuplicatesWorksheetStrategy = DuplicatesWorksheetStrategy.DoNotExpect
    return this as MSG_PROCESSOR_SUBTYPE
  }

  //
  // Navigation
  //

  /**
   * Attempt to handleWhile to the destination, asserting all and only the expected messages
   *
   * @param navigateBlock
   * @return
   */
  protected function handleWhile(navigateBlock : () : PCFLocation) : PCFLocation {
    var newLocation = navigateBlock()

    // handle the duplicates warning per the set strategy
    var currentWorksheet = newLocation.SmokeTest.CurrentWorksheet
    if (currentWorksheet typeis CheckDuplicatesWorksheet) {
      Assertions.assertThat(HandleDuplicatesWorksheetStrategy)
          .overridingErrorMessage("Unexpectedly encountered the duplicates warning worksheet!")
          .isNotEqualTo(DuplicatesWorksheetStrategy.DoNotExpect)

      (currentWorksheet as StructuralType.DefinesClose).close()
      newLocation = navigateBlock()
    }
    else if (currentWorksheet typeis NewClaimDuplicatesWorksheet) {
      currentWorksheet.NewClaimDuplicatesScreen.NewClaimDuplicatesWorksheet_CloseButton.click()
      newLocation = navigateBlock()
    }
    else {
      Assertions.assertThat(HandleDuplicatesWorksheetStrategy)
          .overridingErrorMessage("Did not encounter the duplicates warning worksheet as expected!")
          .isNotEqualTo(DuplicatesWorksheetStrategy.Expect)
    }

    // Process any resulting validation messages
    var matcher = new ValidationMessagesMatcher() {
      :ExpectedPatterns = ExpectPatterns,
      :IgnoredPatterns = IgnorePatterns
    }
    var matchResults = matcher.match(getValidationMessages(newLocation))

    matchResults.assertAllMessagesMatched()

    if (LogMatchResults) {
      Logger.AnonymousLogger.log(Level.INFO, matchResults.DisplayString)
    }

    if (RepeatIfValidationMessages and matchResults.HadMatches) {
      newLocation = navigateBlock()
    }

    return newLocation
  }

  protected reified function navigate<T extends PCFLocation>(navBlock : () : PCFLocation) : T {
    var newLocation = handleWhile(navBlock)
    try {
      return newLocation as T
    } catch (ex : ClassCastException) {
      throw new IllegalStateException("Navigation failure: expected to be on " + T.RelativeName + " but was on " + newLocation.NewId + " instead.")
    }
  }
}

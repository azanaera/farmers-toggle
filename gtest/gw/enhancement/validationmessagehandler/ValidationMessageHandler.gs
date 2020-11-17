package gw.enhancement.validationmessagehandler

uses com.google.common.collect.ImmutableSet
uses gw.api.locale.DisplayKey

uses java.util.regex.Pattern

/**
 * A BasicValidationMessageHandler that adds the ability to explicitly handle the deductible warning patterns.
 *
 * @param <STARTING_PCF>          The type of the PCF from which the navigation will start
 * @param <MSG_PROCESSOR_SUBTYPE> The concrete subtype of this class to be returned by many of the methods (in the style
 *                                of the Builder pattern).
 */
abstract class ValidationMessageHandler<STARTING_PCF, MSG_PROCESSOR_SUBTYPE extends ValidationMessageHandler<STARTING_PCF, MSG_PROCESSOR_SUBTYPE>> extends BasicValidationMessageHandler<STARTING_PCF, MSG_PROCESSOR_SUBTYPE> {

  static final var _deductibleWarningPatterns : Set<Pattern>as readonly DeductibleWarningPatterns = ImmutableSet.copyOf({
      Pattern.compile(DisplayKey.get("Web.NewCheckWizard.NewPaymentDetail.DeductibleUnapplied", ".*", ".*"), Pattern.CASE_INSENSITIVE),
      Pattern.compile(DisplayKey.get("Web.NewCheckWizard.NewPaymentDetail.DeductibleOverwithheld", ".*", ".*"), Pattern.CASE_INSENSITIVE)
  })

  construct(start: STARTING_PCF, uiValidationMessageReader: block(): List<String> = null) {
    super(start, uiValidationMessageReader)
  }

  function expectAtLeastOneDeductibleWarningMessage() : MSG_PROCESSOR_SUBTYPE {
    return expectAtLeastOneOf(DeductibleWarningPatterns.map(\pattern -> pattern.pattern()))
  }

  function ignoreDeductibleWarningMessages() : MSG_PROCESSOR_SUBTYPE {
    return ignore(DeductibleWarningPatterns)
  }

}

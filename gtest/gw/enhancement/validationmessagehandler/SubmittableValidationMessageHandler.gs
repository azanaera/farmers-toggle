package gw.enhancement.validationmessagehandler

uses gw.enhancement.util.StructuralType
uses gw.smoketest.platform.web.PCFLocation

class SubmittableValidationMessageHandler<START extends PCFLocation, DEST extends PCFLocation> extends ValidationMessageHandler<START, SubmittableValidationMessageHandler<START, DEST>> {
  construct(start: START, uiValidationMessageReader: block(): List<String> = null) {
    super(start, uiValidationMessageReader)
  }

  function submitSuccessfully() : DEST {
    return navigate(\-> (Start as StructuralType.DefinesSubmit).submit())
  }

  function submitUnsuccessfully() : START {
    return navigate(\-> (Start as StructuralType.DefinesSubmit).submit())
  }

}

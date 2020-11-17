package gw.enhancement.validationmessagehandler

uses gw.enhancement.util.StructuralType
uses gw.smoketest.platform.web.PCFLocation

class FinishCancellableValidationMessageHandler<START extends PCFLocation, DEST extends PCFLocation> extends ValidationMessageHandler<START, FinishCancellableValidationMessageHandler<START, DEST>> {
  construct(start: START, uiValidationMessageReader: block(): List<String> = null) {
    super(start, uiValidationMessageReader)
  }

  function finishSuccessfully() : DEST {
    return navigate(\-> (Start as StructuralType.DefinesFinish).finish())
  }

  function finishUnsuccessfully() : START {
    return navigate(\-> (Start as StructuralType.DefinesFinish).finish())
  }

  function cancelSuccessfully() : DEST {
    return navigate(\-> (Start as StructuralType.DefinesCancel).cancel())
  }

  function cancelUnsuccessfully() : START {
    return navigate(\-> (Start as StructuralType.DefinesCancel).cancel())
  }

}

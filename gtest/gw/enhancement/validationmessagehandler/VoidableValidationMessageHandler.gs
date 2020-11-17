package gw.enhancement.validationmessagehandler

uses gw.enhancement.util.StructuralType
uses gw.smoketest.platform.web.PCFLocation

class VoidableValidationMessageHandler<START extends PCFLocation, DEST extends PCFLocation> extends ValidationMessageHandler<START, VoidableValidationMessageHandler<START, DEST>> {
  construct(start: START, uiValidationMessageReader: block(): List<String> = null) {
    super(start, uiValidationMessageReader)
  }

  function voidCheckSuccessfully() : DEST {
    return navigate(\-> (Start as StructuralType.DefinesVoid).voidCheck())
  }

  function voidCheckUnsuccessfully() : START {
    return navigate(\-> (Start as StructuralType.DefinesVoid).voidCheck())
  }

  function stopCheckSuccessfully() : DEST {
    return navigate(\-> (Start as StructuralType.DefinesStopCheck).stopCheck())
  }

  function stopCheckUnsuccessfully() : START {
    return navigate(\-> (Start as StructuralType.DefinesStopCheck).stopCheck())
  }

}

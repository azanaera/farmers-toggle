package gw.enhancement.validationmessagehandler

uses gw.enhancement.util.StructuralType
uses gw.smoketest.platform.web.PCFLocation

class ClickableValidationMessageHandler<START, DEST extends PCFLocation> extends ValidationMessageHandler<START, ClickableValidationMessageHandler<START, DEST>> {
  construct(start: START, uiValidationMessageReader: block(): List<String> = null) {
    super(start, uiValidationMessageReader)
  }

  function click() : DEST {
    return navigate(\-> (Start as StructuralType.DefinesClick).click())
  }

}

package gw.enhancement.validationmessagehandler

uses gw.enhancement.util.StructuralType
uses gw.smoketest.platform.web.PCFLocation

class RecodableValidationMessageHandler<START extends PCFLocation, DEST extends PCFLocation> extends ValidationMessageHandler<START, RecodableValidationMessageHandler<START, DEST>> {
  construct(start: START, uiValidationMessageReader: block(): List<String> = null) {
    super(start, uiValidationMessageReader)
  }

  function recodeSuccessfully() : DEST {
    return navigate(\-> (Start as StructuralType.DefinesRecode).recode())
  }

  function recodeUnsuccessfully() : START {
    return navigate(\-> (Start as StructuralType.DefinesRecode).recode())
  }

}

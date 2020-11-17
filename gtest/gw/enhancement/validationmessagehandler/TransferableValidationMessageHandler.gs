package gw.enhancement.validationmessagehandler

uses gw.enhancement.util.StructuralType
uses gw.smoketest.platform.web.PCFLocation

class TransferableValidationMessageHandler<START extends PCFLocation, DEST extends PCFLocation> extends ValidationMessageHandler<START, TransferableValidationMessageHandler<START, DEST>> {
  construct(start: START, uiValidationMessageReader: block(): List<String> = null) {
    super(start, uiValidationMessageReader)
  }

  function transferSuccessfully() : DEST {
    return navigate(\-> (Start as StructuralType.DefinesTransfer).transfer())
  }

  function transferUnsuccessfully() : START {
    return navigate(\-> (Start as StructuralType.DefinesTransfer).transfer())
  }

}

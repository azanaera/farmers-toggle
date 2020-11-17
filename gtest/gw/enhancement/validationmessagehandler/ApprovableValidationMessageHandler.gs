package gw.enhancement.validationmessagehandler

uses gw.enhancement.util.StructuralType
uses gw.smoketest.platform.web.PCFLocation

class ApprovableValidationMessageHandler<START extends PCFLocation, DEST extends PCFLocation> extends ValidationMessageHandler<START, ApprovableValidationMessageHandler<START, DEST>> {
  construct(start: START, uiValidationMessageReader: block(): List<String> = null) {
    super(start, uiValidationMessageReader)
  }

  function approveSuccessfully() : DEST {
    return navigate(\-> (Start as StructuralType.DefinesApprove).approve())
  }

  function approveUnsuccessfully() : START {
    return navigate(\-> (Start as StructuralType.DefinesApprove).approve())
  }

  function rejectSuccessfully() : DEST {
    return navigate(\-> (Start as StructuralType.DefinesReject).reject())
  }

  function rejectUnsuccessfully() : START {
    return navigate(\-> (Start as StructuralType.DefinesReject).reject())
  }
}
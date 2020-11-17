package gw.enhancement.validationmessagehandler

uses gw.enhancement.util.StructuralType
uses gw.smoketest.platform.web.PCFLocation

class UpdatableValidationMessageHandler<START extends PCFLocation, DEST extends PCFLocation> extends ValidationMessageHandler<START, UpdatableValidationMessageHandler<START, DEST>> {
  construct(start: START, uiValidationMessageReader: block(): List<String> = null) {
    super(start, uiValidationMessageReader)
  }

  reified function update<T extends PCFLocation>() : T {
    return navigate(\-> (Start as StructuralType.DefinesUpdate).update())
  }

  function updateSuccessfully(): DEST {
    return update()
  }

  function updateUnsuccessfully(): START {
    return update()
  }
}

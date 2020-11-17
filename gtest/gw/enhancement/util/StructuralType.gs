package gw.enhancement.util

uses gw.smoketest.platform.web.PCFLocation

class StructuralType {

  private construct() { }

  structure DefinesApprove {
    function approve() : PCFLocation
  }

  structure DefinesCancel {
    function cancel() : PCFLocation
  }

  structure DefinesClick {
    function click() : PCFLocation
  }

  structure DefinesClose {
    function close()
  }

  structure DefinesFinish {
    function finish() : PCFLocation
  }

  structure DefinesRecode {
    function recode() : PCFLocation
  }

  structure DefinesReject {
    function reject() : PCFLocation
  }

  structure DefinesStopCheck {
    function stopCheck() : PCFLocation
  }

  structure DefinesSubmit {
    function submit() : PCFLocation
  }

  structure DefinesTransfer {
    function transfer() : PCFLocation
  }

  structure DefinesUpdate {
    function update() : PCFLocation
  }

  structure DefinesVoid {
    function voidCheck() : PCFLocation
  }

}

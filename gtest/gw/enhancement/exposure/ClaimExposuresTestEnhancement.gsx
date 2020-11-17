package gw.enhancement.exposure

uses gw.testharness.v3.PLAssertions
uses pcftest.ClaimExposures
uses pcftest.CloseExposurePopup

enhancement ClaimExposuresTestEnhancement : ClaimExposures {

  property get ClaimMenuActions() : pcftest.ClaimMenuActions {
    return this._parent.ClaimMenuActions
  }

  property get MenuLinks() : pcftest.Claim.MenuLinks {
    return this._parent.MenuLinks
  }

  public function closeAllExposures() {
    for (exposure in this.ClaimExposuresScreen.ExposuresLV._Entries) {
      // If an exposure is already closed, it can't be closed again.
      // Only attempting to close an exposure if it isn't already closed.
      if (exposure.Status.TypeKeyValue != ExposureState.TC_CLOSED) {
        closeExposureByEntry(exposure)
      }
    }
  }

  function closeExposureByEntry(entry : pcftest.ExposuresLV.entry) {
    // assumes that no other checkboxes are selected
    entry._Checkbox.BoolValue = true
    var closeExposurePopup = this.ClaimExposuresScreen.ClaimExposures_CloseExposure.click() as pcftest.CloseExposurePopup
    var pcfLocation = closeExposurePopup.CloseExposureScreen.Update.click()

    if (pcfLocation typeis CloseExposurePopup) {
      if (pcfLocation.SmokeTest.isConfirmationShowing()) {
        PLAssertions.fail("Unable to close exposure because:\n" + pcfLocation.SmokeTest.dismissAndGetConfirmation())
      } else if (!pcfLocation._parent._msgs.AllMessages.Empty) {
        PLAssertions.fail("Unable to close exposure because:\n" + pcfLocation._parent._msgs.AllMessages.join(", "))
      } else if (!pcfLocation._parent.ClaimWorkplan.getClaimWorkplanScreen()._msgs.AllMessages.Empty) {
        PLAssertions.fail("Unable to close exposure because:\n" + pcfLocation._parent.ClaimWorkplan.getClaimWorkplanScreen()._msgs.AllMessages.join(", "))
      }
    }
    PLAssertions.assertThat(this.OnPage).as("Close Exposure Update did not return to exposure summary. Actually on: " + typeof pcfLocation).isTrue()
  }

}

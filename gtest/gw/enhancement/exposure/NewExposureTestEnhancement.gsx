package gw.enhancement.exposure

uses pcftest.NewExposure
uses pcftest.WebMessageWorksheet

enhancement NewExposureTestEnhancement : NewExposure {

  property get Dwelling() : pcftest.NewClaimPropertyDamageDV {
    return this.NewExposureScreen.NewExposureDV_Dwelling.NewClaimPropertyDamageDV
  }

  property get VehicleDamage() : pcftest.NewClaimVehicleDamageDV {
    return this.NewExposureScreen.NewExposureDV_Vehicledamage.NewClaimVehicleDamageDV
  }

  public function update() : pcftest.ClaimExposures {
    var newPage = this.NewExposureScreen.Update.click()
    if (newPage typeis pcftest.ClaimExposures) {
      return newPage
    } else {
      var type : String = null
      if (this.NewExposureScreen.NewExposureDV_Pipdamages.NewPIPSummaryDV.PIPDamages_Claimant.Visible) {
        type = "PIP"
      } else if (this.NewExposureScreen.NewExposureDV_Generaldamage.Claimant_Address.Visible) {
        type = "GeneralDamage"
      } else if (this.NewExposureScreen.NewExposureDV_Propertydamage.NewClaimPropertyDamageDV.Claimant_Picker.Visible) {
        type = "PropertyDamage"
      }

      var currentWorksheet = this.getSmokeTest().CurrentWorksheet as WebMessageWorksheet
      //check for error messages or validation worksheet popup
      if(this.NewExposureScreen._msgs.Messages.Count > 0 or currentWorksheet != null) {
        var errorMsg = this.NewExposureScreen._msgs.Messages.Count>0 ? this.NewExposureScreen._msgs.Messages.join(", ") :
            currentWorksheet.WebMessageWorksheetScreen.grpMsgs.getErrorMessages()
        throw new IllegalStateException("Could not save new ${type} exposure, errors are: ${errorMsg}")
      } else {
        var currentPageName = (typeof this.getSmokeTest().CurrentPage).Name
        throw new IllegalStateException("Expected to be on screen ${pcftest.ClaimExposures.Type.Name} but on screen ${currentPageName}")
      }
    }
  }

}

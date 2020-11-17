package gw.enhancement.lossdetails

uses gw.smoketest.platform.web.PCFLocation
uses pcftest.AppraisalServiceInputSet.AppraisalServiceInputGroup
uses pcftest.ClaimLossDetails

enhancement ClaimLossDetailsScreenTestEnhancement : ClaimLossDetails {

  /**
   * Go to the new incident popup in edit mode
   *
   * @param incidentButtonLabel     the name of the type of incident as in gw.api.claim.IncidentUIHelper.CreateLabel
   * @return A PCFLocation with the new incident popup for this incidentType
   */
  public function goToNewIncidentPopup(incidentButtonLabel : String) : PCFLocation {
    this.ClaimLossDetailsScreen.edit()
    var incidentButton = this.ClaimLossDetailsScreen.LossDetailsPanelSet_Homeowners.IncidentPanelSet_tb.AddIncidentButton
        ._Entries.singleWhere(\elt -> elt.CreateIncident.Text == incidentButtonLabel)
    return incidentButton.CreateIncident.click()
  }

  /**
   * Go to the edit incident popup in edit mode
   *
   * @param incidentButtonLabel     the name of the type of incident as in gw.api.claim.IncidentUIHelper.getInstanceDisplayName(Incident)
   * @return A PCFLocation with the edit incident popup for this incidentType
   */
  public function goToEditIncidentPopup(incidentButtonLabel : String) : PCFLocation {
    this.ClaimLossDetailsScreen.edit()
    var editIncidentPopup = this.ClaimLossDetailsScreen.LossDetailsPanelSet_Homeowners.IncidentPanelSet
        .IncidentIterator1._Entries.firstWhere(\elt -> elt.Name.Text == incidentButtonLabel).Name.click()
    return editIncidentPopup
  }

}

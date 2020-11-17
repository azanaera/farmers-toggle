package gw.enhancement.lossdetails

uses gw.api.locale.DisplayKey

enhancement LossDetailsPanelSet_HomeownersTestEnhancement : pcftest.LossDetailsPanelSet_Homeowners {

  function addDwellingIncident() : pcftest.NewDwellingIncidentPopup {
    return this.CreateDwellingIncidentItem.click() as pcftest.NewDwellingIncidentPopup
  }

  function addInjuryIncident() : pcftest.NewInjuryIncidentPopup {
    return this.CreateInjuryIncidentItem.click() as pcftest.NewInjuryIncidentPopup
  }

  function addPropertyContentsIncident() : pcftest.NewPropertyContentsIncidentPopup {
    return this.CreatePropertyContentsIncidentItem.click() as pcftest.NewPropertyContentsIncidentPopup
  }

  function addOtherStructureIncident() : pcftest.NewOtherStructureIncidentPopup {
    return this.CreateOtherStructureIncidentItem.click() as pcftest.NewOtherStructureIncidentPopup
  }

  function addFixedPropertyIncident() : pcftest.NewFixedPropertyIncidentPopup {
    return this.CreatePropertyLiabilityIncidentItem.click() as pcftest.NewFixedPropertyIncidentPopup
  }

  function addLivingExpensesIncident() : pcftest.NewLivingExpensesIncidentPopup {
    return this.CreateLivingExpensesIncidentItem.click() as pcftest.NewLivingExpensesIncidentPopup
  }

  property get CreateInjuryIncidentItem() : pcftest.LossDetailsPanelSet_Homeowners.IncidentPanelSet_tb.AddIncidentButton.entry.CreateIncident {
    return this.getCreateIncidentItem(DisplayKey.get("Web.CreateIncident.InjuryIncident"))
  }

  property get CreatePropertyContentsIncidentItem() : pcftest.LossDetailsPanelSet_Homeowners.IncidentPanelSet_tb.AddIncidentButton.entry.CreateIncident {
    return this.getCreateIncidentItem(DisplayKey.get("Web.CreateIncident.PersonalPropertyIncident"))
  }

  property get CreateOtherStructureIncidentItem() : pcftest.LossDetailsPanelSet_Homeowners.IncidentPanelSet_tb.AddIncidentButton.entry.CreateIncident {
    return this.getCreateIncidentItem(DisplayKey.get("Web.CreateIncident.OtherStructuresIncident"))
  }

  property get CreatePropertyLiabilityIncidentItem() : pcftest.LossDetailsPanelSet_Homeowners.IncidentPanelSet_tb.AddIncidentButton.entry.CreateIncident {
    return this.getCreateIncidentItem(DisplayKey.get("Web.CreateIncident.PropertyLiabilityIncident"))
  }

  property get CreateLivingExpensesIncidentItem() : pcftest.LossDetailsPanelSet_Homeowners.IncidentPanelSet_tb.AddIncidentButton.entry.CreateIncident {
    return this.getCreateIncidentItem(DisplayKey.get("Web.CreateIncident.LivingExpensesIncident"))
  }

  function getCreateIncidentItem(label : String) : pcftest.LossDetailsPanelSet_Homeowners.IncidentPanelSet_tb.AddIncidentButton.entry.CreateIncident {
    var entry = this.IncidentPanelSet_tb.AddIncidentButton._Entries.firstWhere(\e -> e.CreateIncident.Visible and e.CreateIncident.Text == label)
    return entry.CreateIncident
  }

  property get CreateDwellingIncidentItem() : pcftest.LossDetailsPanelSet_Homeowners.IncidentPanelSet_tb.AddIncidentButton.entry.CreateIncident {
    return this.getCreateIncidentItem(DisplayKey.get("Web.CreateIncident.DwellingIncident"))
  }
}
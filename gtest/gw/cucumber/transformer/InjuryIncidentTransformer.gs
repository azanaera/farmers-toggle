package gw.cucumber.transformer

uses gw.api.database.Query
uses gw.api.databuilder.InjuryIncidentBuilder
uses gw.api.locale.DisplayKey

class InjuryIncidentTransformer {

  function transform(claim : Claim, row : Map<String, String>) : InjuryIncident {
    return InjuryIncidentBuilder.uiReadyInjuryIncident()
        .onClaim(claim)
        .withInjured(Query.make(Person).compare(Person#Name, Equals, row.get(DisplayKey.get("Web.InjuryIncidentDV.Injured.Picker"))).select().AtMostOneRow)
        .withLossParty(new TypelistTransformer<LossPartyType>().transform(row.get(DisplayKey.get("Web.InjuryIncidentInputSet.LossParty.Label"))))
        .withSeverity(new TypelistTransformer<SeverityType>().transform(row.get(DisplayKey.get("Web.InjuryIncidentInputSet.Severity.Label"))))
        .withGeneralInjuryType(new TypelistTransformer<InjuryType>().transform(row.get(DisplayKey.get("Web.InjuryIncidentInputSet.GeneralInjuryType.Label"))))
        .withDetailedInjuryType(new TypelistTransformer<DetailedInjuryType>().transform(row.get(DisplayKey.get("Web.InjuryIncidentInputSet.DetailedInjuryType.Label"))))
        .createAndCommitInNewBundle()
  }

}
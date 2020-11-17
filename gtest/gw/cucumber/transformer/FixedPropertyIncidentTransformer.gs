package gw.cucumber.transformer

uses gw.api.databuilder.AddressBuilder
uses gw.api.databuilder.FixedPropertyIncidentBuilder
uses gw.api.databuilder.PolicyLocationBuilder
uses gw.api.locale.DisplayKey

class FixedPropertyIncidentTransformer {

  function transform(claim : Claim, row : Map<String, String>) : FixedPropertyIncident {
    return FixedPropertyIncidentBuilder.uiReadyFixedPropertyIncident()
        .onClaim(claim)
        .withPropertyDesc(row.get(DisplayKey.get("Web.FixedPropertyIncident.PropertyDescription")))
        .withDescription(row.get(DisplayKey.get("Web.FixedPropertyIncident.Description")))
        .withLossEstimate(new CurrencyAmountTransformer().transform(row.get(DisplayKey.get("Web.FixedPropertyIncident.LossEstimate"))))
        .withProperty(new PolicyLocationBuilder()
            .onPolicy(claim.Policy)
            .withNextLocationNumber()
            .withAddress(new AddressBuilder()
                .withAddressLine1(row.get(DisplayKey.get("Web.FixedPropertyIncident.Property.Address.AddressLine1")))
                .withCity(row.get(DisplayKey.get("Web.FixedPropertyIncident.Property.Address.City")))
                .withState(new TypelistTransformer<State>().transform(row.get(DisplayKey.get("Web.FixedPropertyIncident.Property.Address.State"))))
            )
            .withRiskUnitIfNonePresent()
        ).createAndCommitInNewBundle()
  }

}
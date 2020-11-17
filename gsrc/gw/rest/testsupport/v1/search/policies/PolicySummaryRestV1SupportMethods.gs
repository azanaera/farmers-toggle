package gw.rest.testsupport.v1.search.policies

@Export
class PolicySummaryRestV1SupportMethods {

  private final var _policySummary : PolicySummary as readonly PolicySummary

  construct(policySummary : PolicySummary) {
    _policySummary = policySummary
  }

  property get DisplayAddress() : String {
    var sb = new StringBuilder()
    //Japan
    if(_policySummary.AddressLine1Kanji.HasContent){
      sb.append(_policySummary.AddressLine1Kanji)
      if(_policySummary.AddressLine2Kanji.HasContent){
        sb.append(_policySummary.AddressLine2Kanji)
      } else if(_policySummary.AddressLine2.HasContent){
        sb.append(_policySummary.AddressLine2)
      }
      //Other country
    } else if(_policySummary.AddressLine1.HasContent){
      sb.append(_policySummary.AddressLine1)
      if(_policySummary.AddressLine2.HasContent){
        sb.append(", ")
            .append(_policySummary.AddressLine2)
      }
    }
    return sb.toString()
  }

  property get DisplayCity() : String {
    return _policySummary.CityKanji.HasContent ? _policySummary.CityKanji : _policySummary.City
  }
}
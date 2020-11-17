package gw.cucumber.util.common

uses gw.api.database.Query

class RelatedToHelper {

  public static function getRelatedToDisplayName(value : String) : String {
    var relatedToType = value.split(":")[0]
    var relatedToID = value.split(":")[1]
    switch (relatedToType) {
      case "Claim":
        return Query.make(Claim).compare(Claim#ID, Equals,new gw.pl.persistence.core.Key(Claim, relatedToID.toLong())).select().single().DisplayName
      case "Exposure":
        return Query.make(Exposure).compare(Exposure#ID, Equals,new gw.pl.persistence.core.Key(Exposure, relatedToID.toLong())).select().single().DisplayName
      default:
        throw new IllegalArgumentException("Entity ${relatedToType} is not mapped")
    }
  }
}
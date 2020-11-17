package gw.util
uses gw.api.database.Query

/**
 * Utilities for finding common objects. Typically accessed via the Util property, for example Util.Find.claimByNumber("xxxx")
 */
@Export
class FindUtil {

  function userByUserName(userName : String) : User {
    var query = Query.make(User)
    query.join("Credential").compare("UserName", Equals, userName)
    return query.select().AtMostOneRow
  }
  
  function claimByNumber(claimNumber : String) : Claim {
    return Query.make(Claim).compare("ClaimNumber", Equals, claimNumber).select().AtMostOneRow
  }

  function groupByName(groupName : String) : Group {
    return Query.make(Group).compare("Name", Equals, groupName).select().AtMostOneRow
  }
  
  reified function entityByPublicId<T extends KeyableBean>(type : Type<T>, publicId : String) : T {
    var query = Query.make(type)
    query.withFindRetired(true)
    query.compare("PublicID", Equals, publicId)
    return query.select().AtMostOneRow
  }

}

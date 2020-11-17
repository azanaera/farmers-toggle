package gw.cucumber.transformer

uses gw.api.database.Query

class SpecialistServiceTransformer {

  function transform(value : String) : SpecialistService {
    var q = Query.make(SpecialistService)
    q.compareIgnoreCase(SpecialistService#Name, Equals, value)
    return q.select().single()
  }

}

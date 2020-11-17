package gw.cucumber.context.api.cp

uses gw.cucumber.context.api.common.ExposureContext

interface CPExposureContext extends ExposureContext {

  function addCoverage(coverageName : String)

}
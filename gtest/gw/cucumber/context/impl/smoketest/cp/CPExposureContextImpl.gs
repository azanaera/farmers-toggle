package gw.cucumber.context.impl.smoketest.cp

uses gw.cucumber.context.api.cp.CPExposureContext
uses gw.cucumber.context.impl.smoketest.common.ExposureContextImpl
uses gw.cucumber.transformer.TypelistTransformer

class CPExposureContextImpl extends ExposureContextImpl implements CPExposureContext {

  override function addCoverage(coverageName : String) {
    createExposureForCoverageType(new TypelistTransformer<CoverageType>().transform(coverageName).DisplayName)
  }

}
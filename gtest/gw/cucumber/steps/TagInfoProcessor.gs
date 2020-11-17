package gw.cucumber.steps

uses com.google.inject.Inject
uses cucumber.api.java.After
uses cucumber.api.java.Before
uses gw.api.system.CCConfigParameters
uses gw.api.system.PLConfigParameters
uses gw.cucumber.setup.ClaimMode
uses gw.cucumber.setup.PolicyDataSet
uses gw.cucumber.testdata.DataWrapper
uses com.guidewire.pl.system.server.config.manager.MutableSystemConfigurationImpl

@SuppressWarnings("Method2Property")
@Export
class TagInfoProcessor {

  @Inject
  var _policyDataSetWrapper : DataWrapper<PolicyDataSet>

  private static var _mutableConfig : MutableSystemConfigurationImpl

  // LOB tags

  @Before(:value = {"@personal_auto","@common"})
  function personalAuto() {
    setPolicyType(PolicyType.TC_PERSONALAUTO, ClaimMode.PersonalAuto)
  }

  @Before(:value = {"@common"})
  function common() {
    //As part of the framework the policy type needs to be set to some value.
    //For some customers PolicyType.TC_PERSONALAUTO could be retired but that shouldn't be a problem
    //there are steps that override this configuration (e.g. "Given a Homeowners policy", "Given a Homeowners claim")
    setPolicyType(PolicyType.TC_PERSONALAUTO, ClaimMode.PersonalAuto)
  }

  @Before(:value = {"@homeowners"})
  function homeowners() {
    setPolicyType(PolicyType.TC_HOPHOMEOWNERS, ClaimMode.HOPHomeowners)
  }

  @Before(:value = {"@commercial_property"})
  function commercialproperty() {
    setPolicyType(PolicyType.TC_COMMERCIALPROPERTY, ClaimMode.CommercialProperty)
  }

  @Before(:value = {"@workers_comp"})
  function workersComp() {
    setPolicyType(PolicyType.TC_WORKERSCOMP, ClaimMode.WorkersComp)
  }

  @Before(:value = {"@multicurrency"})
  function enableMulticurrency() {
    if (_mutableConfig == null) {
      _mutableConfig = MutableSystemConfigurationImpl.init()
    }

    _mutableConfig.setParameterValue(CCConfigParameters.EnableMulticurrencyReserving, "true")
    _mutableConfig.setParameterValue(PLConfigParameters.MulticurrencyDisplayMode, "MULTIPLE")
  }

  @After(:value = {"@multicurrency"})
  function disableMulticurrency() {
    _mutableConfig.setParameterValue(CCConfigParameters.EnableMulticurrencyReserving, CCConfigParameters.EnableMulticurrencyReserving.Default)
    _mutableConfig.setParameterValue(PLConfigParameters.MulticurrencyDisplayMode, PLConfigParameters.MulticurrencyDisplayMode.Default)
  }

  /**
   * Assigns the policy type to the policy data set. There is validation to avoid overriding this value if already specified,
   * for example if the feature file is double tagged as @personal_auto and @homeowners, an exception will be thrown.
   *
   * @param policyType
   */
  private function setPolicyType(policyType : PolicyType, claimMode : ClaimMode) {
    var policyDataSet = _policyDataSetWrapper.get() as PolicyDataSet
    if (policyDataSet == null) {
      _policyDataSetWrapper.set(new PolicyDataSet(policyType, claimMode))
    } else {
      if (policyDataSet.PolicyType != null) {
        throw new IllegalStateException("TagInfoProcessor: Cannot assign the PolicyDataSet.PolicyType to ${policyType} because it has already been assigned to ${policyDataSet.PolicyType}.")
      }
    }
  }

}
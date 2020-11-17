package gw.cucumber.context.impl

uses com.google.inject.Inject
uses gw.cucumber.context.api.ContextFactory
uses gw.cucumber.context.api.common.ActivityContext
uses gw.cucumber.context.api.common.AddressBookContext
uses gw.cucumber.context.api.common.AdminContext
uses gw.cucumber.context.api.common.AssignmentContext
uses gw.cucumber.context.api.common.ClaimContext
uses gw.cucumber.context.api.common.ExposureContext
uses gw.cucumber.context.api.common.FinancialsContext
uses gw.cucumber.context.api.common.NoteContext
uses gw.cucumber.context.api.common.PartiesInvolvedContext
uses gw.cucumber.context.api.common.RulesContext
uses gw.cucumber.context.api.common.ServiceRequestContext
uses gw.cucumber.setup.ClaimMode
uses gw.cucumber.setup.PolicyDataSet
uses gw.cucumber.testdata.DataWrapper

@SuppressWarnings("unused")
class ContextFactoryImpl implements ContextFactory {
  // Contexts
  @Inject var _claimContexts : Map<ClaimMode, ClaimContext>
  @Inject var _financialsContext : FinancialsContext
  @Inject var _exposureContexts : Map<PolicyType, ExposureContext>
  @Inject var _adminContext: AdminContext
  @Inject var _addressBookContext : AddressBookContext
  @Inject var _serviceRequestContext: ServiceRequestContext
  @Inject var _rulesContext: RulesContext
  @Inject var _partiesInvolvedContext: PartiesInvolvedContext
  @Inject var _noteContext: NoteContext
  @Inject var _activityContext: ActivityContext
  @Inject var _assignmentContext: AssignmentContext

  @Inject private var _policyDataSetWrapper : DataWrapper<PolicyDataSet>

  override reified function getClaimContext<T extends ClaimContext>() : T {
    var context = _claimContexts.get(ClaimMode)
    if (context typeis T) {
      return context
    }
    throw new IllegalStateException("Invalid ClaimContext for type: " + (typeof context))
  }

  function getFinancialsContext() : FinancialsContext {
    return _financialsContext
  }

  override reified function getExposureContext<T extends ExposureContext>() : T {
    var context = _exposureContexts.get(PolicyType)
    if (context typeis T) {
      return context
    }
    throw new IllegalStateException("Invalid ExposureContext for type: " + (typeof context))
  }

  override function getAdminContext(): AdminContext {
    return _adminContext
  }

  override function getAddressBookContext(): AddressBookContext {
    return _addressBookContext
  }

  override function getServiceRequestContext(): ServiceRequestContext {
    return _serviceRequestContext
  }

  override function getRulesContext() : RulesContext { return _rulesContext }

  override function getPartiesInvolvedContext(): PartiesInvolvedContext {
    return _partiesInvolvedContext
  }

  override function getNoteContext(): NoteContext {
    return _noteContext
  }

  override function getActivityContext(): ActivityContext {
    return _activityContext
  }

  override function getAssignmentContext(): AssignmentContext{
    return _assignmentContext
  }

  private property get PolicyType(): PolicyType {
    var policyDataSet = _policyDataSetWrapper.get()
    if (policyDataSet == null) {
      throw new IllegalStateException("ContextFactory error: The policy data set is null so the right ContextImpl class cannot be determined")
    }

    return policyDataSet.PolicyType
  }

  private property get ClaimMode(): ClaimMode {
    var policyDataSet = _policyDataSetWrapper.get()
    if (policyDataSet == null) {
      throw new IllegalStateException("ContextFactory error: The policy data set is null so the right ContextImpl class cannot be determined")
    }

    return policyDataSet.ClaimMode
  }

}
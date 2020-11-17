package gw.cucumber

uses com.google.inject.multibindings.MapBinder
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
uses gw.cucumber.context.api.cp.CPQuickClaimContext
uses gw.cucumber.context.impl.ContextFactoryImpl
uses gw.cucumber.context.impl.smoketest.common.ActivityContextImpl
uses gw.cucumber.context.impl.smoketest.common.AddressBookContextImpl
uses gw.cucumber.context.impl.smoketest.common.AdminContextImpl
uses gw.cucumber.context.impl.smoketest.common.AssignmentContextImpl
uses gw.cucumber.context.impl.smoketest.common.FinancialsContextImpl
uses gw.cucumber.context.impl.smoketest.common.NoteContextImpl
uses gw.cucumber.context.impl.smoketest.common.PartiesInvolvedContextImpl
uses gw.cucumber.context.impl.smoketest.common.RulesContextImpl
uses gw.cucumber.context.impl.smoketest.common.ServiceRequestContextImpl
uses gw.cucumber.context.impl.smoketest.cp.CPClaimContextImpl
uses gw.cucumber.context.impl.smoketest.cp.CPExposureContextImpl
uses gw.cucumber.context.impl.smoketest.cp.CPQuickClaimContextImpl
uses gw.cucumber.context.impl.smoketest.hop.HOPClaimContextImpl
uses gw.cucumber.context.impl.smoketest.hop.HOPExposureContextImpl
uses gw.cucumber.context.impl.smoketest.pa.PAClaimContextImpl
uses gw.cucumber.context.impl.smoketest.pa.PAExposureContextImpl
uses gw.cucumber.context.impl.smoketest.pa.PAFirstAndFinalClaimContextImpl
uses gw.cucumber.context.impl.smoketest.wc.WCClaimContextImpl
uses gw.cucumber.context.impl.smoketest.wc.WCExposureContextImpl
uses gw.cucumber.setup.ClaimMode

/**
 * Class defined to extend the platform behavior and add custom bindings. To make things simpler, each context can
 * have one or multiple binds, one for each line of business.
 * <p>
 * If the OOTB behavior needs to be extended for any of the Impl classes, the recommendation is to create a new class and
 * register it here. For example:
 * <p>
 * If there is a need to add custom methods to PAClaimContextImpl, a recommendation would be to create a new class
 * PAClaimContextImpl_Ext that extends from the OOTB PAClaimContextImpl. Then just modify modify the binding
 * configuration here to register the new class as follows:
 * <p>
 * - claimContextBinders.addBinding(ProductCode.PERSONAL_AUTO).to(PAClaimContextImpl_Ext)
 */

@Export
class CCRemoteSmokeTestHelperModule extends RemoteSmokeTestHelperModule {

  construct(appSpecificSmokeTestProxyType : Type<ICucumberSmokeTestProxy>) {
    super(appSpecificSmokeTestProxyType)
  }

  protected override function configure() {
    super.configure()

    // Claim Context binders
    var claimContextBinders = MapBinder.newMapBinder(binder(), ClaimMode, ClaimContext)
    claimContextBinders.addBinding(ClaimMode.PersonalAuto).to(PAClaimContextImpl)
    claimContextBinders.addBinding(ClaimMode.QuickClaimAutoFirstAndFinal).to(PAFirstAndFinalClaimContextImpl)
    claimContextBinders.addBinding(ClaimMode.HOPHomeowners).to(HOPClaimContextImpl)
    claimContextBinders.addBinding(ClaimMode.CommercialProperty).to(CPClaimContextImpl)
    claimContextBinders.addBinding(ClaimMode.QuickClaimPr).to(CPQuickClaimContextImpl)
    claimContextBinders.addBinding(ClaimMode.WorkersComp).to(WCClaimContextImpl)

    // Exposure Context binders
    var exposureBinders = MapBinder.newMapBinder(binder(), PolicyType, ExposureContext)
    exposureBinders.addBinding(PolicyType.TC_PERSONALAUTO).to(PAExposureContextImpl)
    exposureBinders.addBinding(PolicyType.TC_HOPHOMEOWNERS).to(HOPExposureContextImpl)
    exposureBinders.addBinding(PolicyType.TC_COMMERCIALPROPERTY).to(CPExposureContextImpl)
    exposureBinders.addBinding(PolicyType.TC_WORKERSCOMP).to(WCExposureContextImpl)

    // FinancialsContext binder
    bind(FinancialsContext).to(FinancialsContextImpl)

    // Service Request Context binder
    bind(ServiceRequestContext).to(ServiceRequestContextImpl)

    // Rules binder
    bind(RulesContext).to(RulesContextImpl)

    // Parties Involved Context binder
    bind(PartiesInvolvedContext).to(PartiesInvolvedContextImpl)

    // Note Context binder
    bind(NoteContext).to(NoteContextImpl)

    // Activity Context binder
    bind(ActivityContext).to(ActivityContextImpl)

    // Assignment Context binder
    bind(AssignmentContext).to(AssignmentContextImpl)

    // Admin binder
    bind(AdminContext).to(AdminContextImpl)

    // AddressBook binder
    bind(AddressBookContext).to(AddressBookContextImpl)

    // Context Factory binder
    bind(ContextFactory).to(ContextFactoryImpl)
  }
}
package gw.cucumber.context.api

uses gw.cucumber.context.api.common.*

/**
 * Factory class used to get the right context API implementation.
 * Some methods here use generics to allow the caller to specify a specific type if needed to. For example, the
 * getClaimContext() method can be called in two different ways:
 * <p>
 * {@code _contextFactory.getClaimContext() } - returns the context implementation casted to ClaimContext, which is useful when
 * processing steps that are line of business agnostic.
 * <p>
 * {@code _contextFactory.getLineContext<PAClaimContext>() } - returns the context implementation casted to PAContext, which is useful
 * when processing steps that are specific to a line of business.
 */
@SuppressWarnings("Method2Property")
interface ContextFactory {

  /**
   * Gets the implementation for the {@link gw.cucumber.context.api.common.ClaimContext} api. If {@link T} is specified it casts the implementation to
   * {@link T}. If not, it casts it to {@link gw.cucumber.context.api.common.ClaimContext}.
   *
   * @param <T> - Any specific subtype of {@link gw.cucumber.context.api.common.ClaimContext}.
   * @return - The concrete implementation of {@link gw.cucumber.context.api.common.ClaimContext} casted to {@link T}.
   */
  reified function getClaimContext<T extends ClaimContext>() : T

  /**
   * Returns the api implementation object casted to {@link gw.cucumber.context.api.common.FinancialsContext}.
   * This method should be used on contexts that are LOB agnostic.
   */
  function getFinancialsContext() : FinancialsContext

  /**
   * Gets the implementation for the {@link gw.cucumber.context.api.common.ExposureContext} api. If {@link T} is specified it casts the implementation to
   * {@link T}. If not, it casts it to {@link gw.cucumber.context.api.common.ExposureContext}.
   *
   * @param <T> - Any specific subtype of {@link gw.cucumber.context.api.common.ExposureContext}.
   * @return - The concrete implementation of {@link gw.cucumber.context.api.common.ExposureContext} casted to {@link T}.
   */
  reified function getExposureContext<T extends ExposureContext>() : T

  /**
   * Returns the api implementation object casted to {@link gw.cucumber.context.api.common.AdminContext}.
   * This method should be used on contexts that are LOB agnostic.
   */
  function getAdminContext() : AdminContext

  /**
   * Returns the api implementation object casted to {@link gw.cucumber.context.api.common.AddressBookContext}.
   * This method should be used on contexts that are LOB agnostic.
   */
  function getAddressBookContext() : AddressBookContext

  /**
   * Returns the api implementation object casted to {@link gw.cucumber.context.api.common.ServiceRequestContext}.
   * This method should be used on contexts that are LOB agnostic.
   */
  function getServiceRequestContext() : ServiceRequestContext

  /**
   * Returns the api implementation object casted to {@link gw.cucumber.context.api.common.RulesContext}.
   * This method should be used on contexts that are LOB agnostic.
   */
  function getRulesContext() : RulesContext

  /**
   * Returns the api implementation object casted to {@link gw.cucumber.context.api.common.PartiesInvolvedContext}.
   * This method should be used on contexts that are LOB agnostic.
   */
  function getPartiesInvolvedContext() : PartiesInvolvedContext

  /**
   * Returns the api implementation object casted to {@link gw.cucumber.context.api.common.NoteContext}.
   * This method should be used on contexts that are LOB agnostic.
   */
  function getNoteContext() : NoteContext

  /**
   * Returns the api implementation object casted to {@link gw.cucumber.context.api.common.ActivityContext}.
   * This method should be used on contexts that are LOB agnostic.
   */
  function getActivityContext() : ActivityContext

  /**
   * Returns the api implementation object casted to {@link gw.cucumber.context.api.common.AssignmentContext}.
   * This method should be used on contexts that are LOB agnostic.
   */
  function getAssignmentContext() : AssignmentContext
}
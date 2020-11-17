package gw.rest.testsupport.v1

uses com.guidewire.pl.modules.rest.framework.v1.operations.CreateElementResourceOperation
uses com.guidewire.pl.system.entity.DoesNotValidateOnCommit
uses com.guidewire.pl.system.internal.InternalMethods
uses gw.api.json.JsonObject
uses gw.api.modules.rest.framework.v1.exceptions.LocalizedExceptionUtil
uses gw.api.modules.rest.framework.v1.operations.OperationContext
uses gw.api.modules.rest.framework.v1.resources.RestCollectionResource
uses gw.api.rest.exceptions.RequestErrorDetails
uses gw.api.util.DisplayableException
uses gw.api.validation.EntityValidationException
uses gw.plugin.Plugins
uses gw.rest.testsupport.v1.plugin.policy.PolicyStorePlugin
uses gw.plugin.policy.search.IPolicySearchAdapter
uses gw.rest.testsupport.v1.policies.PolicyResource

@SuppressWarnings("HiddenPackageReference")
@Export
class CreateTestSupportResourceOperation extends CreateElementResourceOperation {

  construct(operationContext : OperationContext, childResourceName : String, resourceBuilder : block(OperationContext) : RestCollectionResource, body : JsonObject) {
    super(operationContext, childResourceName, resourceBuilder, body)
  }

  protected override function commit() {
    var issueDetails : List<RequestErrorDetails> = {}
    try {
      validate()
      addToPolicyPlugin()
    } catch (e : EntityValidationException) {
      // Catch validation exceptions from BundleBeanValidator
      for (issue in e.Results*.Issues.where(\elt -> elt.Type == ValidationIssueType.TC_ERROR)) {
        issueDetails.add(new RequestErrorDetails(issue.EntityValidation.EntityId.Type.RelativeName + ": " + issue.Reason))
      }
      throw LocalizedExceptionUtil.badInputWithDetails("Rest.Framework.V1.Resources.ValidationIssuesUserMessage",
          "Rest.Framework.V1.Resources.ValidationIssuesDevMessage", issueDetails)
    } catch (e : DisplayableException) {
      // Catch validation exceptions from CompositeBundleInvariantCallback
      issueDetails.add(new RequestErrorDetails(e.LocalizedMessage))
      throw LocalizedExceptionUtil.badInputWithDetails("Rest.Framework.V1.Resources.ValidationIssuesUserMessage",
          "Rest.Framework.V1.Resources.ValidationIssuesDevMessage", issueDetails)
    }
  }

  private function addToPolicyPlugin() {
    var policyPlugin = Plugins.get(IPolicySearchAdapter) as PolicyStorePlugin
    policyPlugin.addPolicy((ChildResource as PolicyResource).Policy)
  }

  private function validate() {
    var validatable = \elt : KeyableBean -> {
      var bean = elt as KeyableBean
      return InternalMethods.asKeyableBeanInternal((bean)).canPersistToDatabase()
          && InternalMethods.asBeanInternal(bean).visibleToRules()
          && (!(elt typeis DoesNotValidateOnCommit))
    }
    new com.guidewire.pl.system.bundle.validation.BundleBeanValidatorImpl()
        .validateBeanDataTypes(OperationContext.Bundle.InsertedBeans.toList().where(validatable))
  }
}
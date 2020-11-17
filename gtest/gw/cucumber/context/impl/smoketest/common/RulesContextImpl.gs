package gw.cucumber.context.impl.smoketest.common

uses com.google.inject.Inject
uses cucumber.api.DataTable
uses gw.api.locale.DisplayKey
uses gw.cucumber.CucumberStepBase
uses gw.cucumber.context.api.common.RulesContext
uses gw.cucumber.context.impl.smoketest.util.Navigation
uses gw.cucumber.testdata.DataWrapper
uses gw.cucumber.transformer.TypelistTransformer
uses pcftest.CreateExposureRulePage
uses pcftest.CreateReserveRulePage
uses pcftest.ExposureRuleDetail
uses pcftest.ExposureRules
uses pcftest.ReserveRuleDetail
uses pcftest.ReserveRules

class RulesContextImpl extends CucumberStepBase implements RulesContext {
  @Inject
  var _claimWrapper : DataWrapper<Claim>

  enum RuleType {Activity, Exposure, Reserve}

  private function createRule(type : RuleType, name : String, status : String, data : DataTable) {
    var switchUser = false
    var oldUsername : String

    if (not userHasBusinessRuleAdminPermissions()) {
      switchUser = true
      oldUsername = CurrentUser
      _proxy.logout()
      _proxy.loginAsUser(User.util.UnrestrictedUser.Credential.UserName)
    }

    switch (type) {
      case Activity:
        // do something
        break
      case Reserve:
        createNewReserveRule(name, status, data)
        break
      case Exposure:
        createNewExposureRule(name, status, data)
        break
    }

    if (switchUser) {
      _proxy.logout()
      loginAsUser(oldUsername)
    }
  }

  private function createNewReserveRule(name : String, status : String, data : DataTable) {
    var reserveRulesPage = new Navigation<ReserveRules>(_proxy).ensureOnPage(\tabBar ->
        tabBar.goToAdminMenuLinks().Admin_BusinessSettings.BusinessSettings_BusinessRules.BusinessRules_ReserveRules.click(), CurrentUser)

    for (row in data.asMaps(String, String)) {
      var popup = reserveRulesPage.CCRulesListScreen.CreateRuleToolbarButtonSet.Add.click() as CreateReserveRulePage
      var panelSet = popup.CCRuleCreationScreen.RuleDetailPanelSet_default
      panelSet.Name.setValue(name)
      panelSet.AvailableToRunInputSet.Value.setBoolValue(row.get("Enabled") == "Yes")
      panelSet.ApplicabilityCriteriaDV_ReserveRule.LossTypes.ApplicabilityCriteriaSingleSelectInputSet.InputWidget.getOptionByLabel(row.get(DisplayKey.get("Web.Admin.Workload.WorkloadClassification.LossType"))).click()

      if (row.containsKey(DisplayKey.get("Web.BizRules.Rule.ActionType")) and row.get(DisplayKey.get("Web.BizRules.Rule.ActionType")) == DisplayKey.get("Web.ExposureDetail.CreateReserve")) {
        panelSet.RuleCommandDefinitionsListDetailView.Add.click()
        var actionDetails = panelSet.RuleCommandDefinitionsListDetailView.CommandDefinitionDV.CommandDefinitionDV_createreserve
        actionDetails.CostType.setTypeKeyValue(new TypelistTransformer<CostType>().transform(row.get(DisplayKey.get("Web.ReserveRules.Action.CreateReserve.CostType"))))
        actionDetails.CostCategory.getOptionByLabel(row.get(DisplayKey.get("Web.ReserveRules.Action.CreateReserve.CostCategory"))).click()
        actionDetails.Amount.ValidatingCommandParameterInputSet.CommandParameterInputSet_formula.Expression.setValue(row.get(DisplayKey.get("Web.ReserveRules.Action.CreateReserve.Amount")))
      }

      popup.CCRuleCreationScreen.Update.click()
    }

    if (status != null and status.equalsIgnoreCase("staged")) {
      stageReserveRuleWithName(name)
    }
  }

  private function createNewExposureRule(name : String, status : String, data : DataTable) {
    var exposureRulesPage = new Navigation<ExposureRules>(_proxy).ensureOnPage(\tabBar ->
        tabBar.goToAdminMenuLinks().Admin_BusinessSettings.BusinessSettings_BusinessRules.BusinessRules_ExposureRules.click(), CurrentUser)

    for (row in data.asMaps(String, String)) {
      var popup = exposureRulesPage.CCRulesListScreen.CreateRuleToolbarButtonSet.Add.click() as CreateExposureRulePage
      var panelSet = popup.CCRuleCreationScreen.RuleDetailPanelSet_default
      panelSet.Name.setValue(name)
      panelSet.AvailableToRunInputSet.Value.setBoolValue(row.get("Enabled") == "Yes")
      panelSet.ApplicabilityCriteriaDV_ExposureRule.PolicyTypes.ApplicabilityCriteriaSingleSelectInputSet.InputWidget.getOptionByLabel(row.get(DisplayKey.get("Web.BizRules.Rule.ApplicabilityCriteria.PolicyType"))).click()
      panelSet.ApplicabilityCriteriaDV_ExposureRule.IncidentTypes.ApplicabilityCriteriaSingleSelectInputSet.InputWidget.getOptionByLabel(row.get(DisplayKey.get("Web.BizRules.Rule.ApplicabilityCriteria.IncidentType"))).click()

      if (row.containsKey(DisplayKey.get("Web.BizRules.Rule.ActionType")) and row.get(DisplayKey.get("Web.BizRules.Rule.ActionType")) == "Create Exposure") {
        panelSet.RuleCommandDefinitionsListDetailView.Add.click()
        var actionDetails = panelSet.RuleCommandDefinitionsListDetailView.CommandDefinitionDV.CommandDefinitionDV_createexposure
        actionDetails.CoverageType.getOptionByLabel(row.get(DisplayKey.get("Web.ExposureRules.Action.CreateExposure.CoverageType"))).click()
        actionDetails.CoverageSubtype.getOptionByLabel(row.get(DisplayKey.get("Web.ExposureRules.Action.CreateExposure.CoverageSubtype"))).click()
      }

      popup.CCRuleCreationScreen.Update.click()
    }

    if (status != null and status.equalsIgnoreCase("staged")) {
      stageExposureRuleWithName(name)
    }
  }

  override function createReserveRule(name : String, status : String, data : DataTable) {
    createRule(Reserve, name, status, data)
  }

  override function createExposureRule(name : String, status : String, data : DataTable) {
    createRule(Exposure, name, status, data)
  }

  override function stageReserveRuleWithName(name : String) {
    var reserveRulesPage = new Navigation<ReserveRules>(_proxy).ensureOnPage(\tabBar ->
        tabBar.goToAdminMenuLinks().Admin_BusinessSettings.BusinessSettings_BusinessRules.BusinessRules_ReserveRules.click(), CurrentUser)

    var popup = reserveRulesPage.CCRulesListScreen.RulesLV._Entries.firstWhere(\elt -> elt.Name.Value == name).Name.click() as ReserveRuleDetail
    popup.RuleDetailScreen.StatusTransitionToolbarButtonSet.PromoteToStaged.click()
  }

  override function stageExposureRuleWithName(name : String) {
    var exposureRulesPage = new Navigation<ExposureRules>(_proxy).ensureOnPage(\tabBar ->
        tabBar.goToAdminMenuLinks().Admin_BusinessSettings.BusinessSettings_BusinessRules.BusinessRules_ExposureRules.click(), CurrentUser)

    var popup = exposureRulesPage.CCRulesListScreen.RulesLV._Entries.firstWhere(\elt -> elt.Name.Value == name).Name.click() as ExposureRuleDetail
    if (popup.RuleDetailScreen.StatusTransitionToolbarButtonSet.PromoteToStaged.Enabled) {
      popup.RuleDetailScreen.StatusTransitionToolbarButtonSet.PromoteToStaged.click()
    }
  }

  override function verifyReserveRuleWithNameHasStatus(name : String, status : String) {
    var reserveRulesPage = new Navigation<ReserveRules>(_proxy).ensureOnPage(\tabBar ->
        tabBar.goToAdminMenuLinks().Admin_BusinessSettings.BusinessSettings_BusinessRules.BusinessRules_ReserveRules.click(), CurrentUser)
    var rows = reserveRulesPage.CCRulesListScreen.RulesLV._Entries
    assertThat(rows.firstWhere(\r -> r.Name.Value == name and r.Status.Value.equalsIgnoreCase(status))).as(
        "No reserve rule exists with the name \"${name}\" and status \"${status}\""
    ).isNotNull()
  }

  override function verifyExposureRuleWithNameHasStatus(name : String, status : String) {
    var exposureRulesPage = new Navigation<ExposureRules>(_proxy).ensureOnPage(\tabBar ->
        tabBar.goToAdminMenuLinks().Admin_BusinessSettings.BusinessSettings_BusinessRules.BusinessRules_ExposureRules.click(), CurrentUser)
    var rows = exposureRulesPage.CCRulesListScreen.RulesLV._Entries
    assertThat(rows.firstWhere(\r -> r.Name.Value == name and r.Status.Value.equalsIgnoreCase(status))).as(
        "No exposure rule exists with the name \"${name}\" and status \"${status}\""
    ).isNotNull()
  }

  private function userHasBusinessRuleAdminPermissions() : boolean {
    var user = getUserByUsername(CurrentUser)
    var ruleApprove = user.hasClaimBasedPermission(_claimWrapper.get(), SystemPermissionType.TC_RULEAPPROVE)
    var ruleDeploy = user.hasClaimBasedPermission(_claimWrapper.get(), SystemPermissionType.TC_RULEDEPLOY)
    var ruleEdit = user.hasClaimBasedPermission(_claimWrapper.get(), SystemPermissionType.TC_RULEEDIT)
    var ruleImport = user.hasClaimBasedPermission(_claimWrapper.get(), SystemPermissionType.TC_RULEIMPORT)
    var ruleView = user.hasClaimBasedPermission(_claimWrapper.get(), SystemPermissionType.TC_RULEVIEW)

    return ruleApprove and ruleDeploy and ruleEdit and ruleImport and ruleView
  }

}
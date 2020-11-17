package gw.cucumber.context.impl.smoketest.common

uses com.google.inject.Inject
uses cucumber.api.DataTable
uses gw.api.database.Query
uses gw.api.databuilder.ActivityBuilder
uses gw.api.locale.DisplayKey
uses gw.cucumber.context.api.common.ActivityContext
uses gw.cucumber.testdata.DataWrapper
uses gw.cucumber.context.impl.smoketest.util.Navigation
uses gw.cucumber.CucumberStepBase
uses gw.cucumber.transformer.TypelistTransformer
uses gw.cucumber.util.common.PCFReflectUtil
uses gw.cucumber.util.common.RelatedToHelper
uses gw.cucumber.util.common.UIHelper
uses pcftest.ActivityDetailWorksheet
uses pcftest.ClaimSummary
uses pcftest.ClaimWorkplan

@SuppressWarnings("unused")
class ActivityContextImpl extends CucumberStepBase implements ActivityContext {

  @Inject
  var _claimWrapper : DataWrapper<Claim>

  @Inject
  var _exposureWrapper : DataWrapper<Exposure>

  @Inject
  var _activityWrapper : DataWrapper<Activity>

  override function createOpenActivity() {
    var claim = _claimWrapper.get()
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      _activityWrapper.set(ActivityBuilder
          .uiReadyGeneral(claim)
          .withStatus(ActivityStatus.TC_OPEN)
          .assignedTo(CurrentUser)
          .create(bundle))
    }, CurrentUser)
    _claimWrapper.set(claim)
  }

  override function completeAllOpenActivities() {
    var claim = _claimWrapper.get()
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      claim = bundle.add(claim)
      claim.Activities.each(\activity -> {
        if (activity.Status == ActivityStatus.TC_OPEN)
          activity.complete()
      })
    }, User.util.UnrestrictedUser) // Using unrestricted user here to close activities that assigned to users other than the current user
    _claimWrapper.set(claim)
  }

  override function addActivitiesWithSubjects(table : DataTable) {
    var claimSummary = new Navigation<ClaimSummary>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()), CurrentUser)

    var categoryAndSubjectRow = table.asLists(String)
    for (categoryAndSubject in categoryAndSubjectRow) {
      var newActivity = claimSummary.ClaimMenuActions.goToNewActivityByName(categoryAndSubject.get(0), categoryAndSubject.get(1))
      var claimWorkplan = newActivity.update()
      UIHelper.assertNoMessages(claimWorkplan)
    }
  }

  override function createActivity(activityPatternSubject : String, table : DataTable) {
    var claim = _claimWrapper.get()
    var existingActivities = claim.Activities
    var activityPattern = Query.make(ActivityPattern).compare(ActivityPattern#Subject, Equals, activityPatternSubject).select().AtMostOneRow
    var activityMap = new HashMap<String, String>(table.asMap(String, String))
    transformDataTableMaps({activityMap})
    var claimSummary = new Navigation<ClaimSummary>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()), CurrentUser)
    var newActivity = claimSummary.ClaimMenuActions.goToNewActivity(activityPattern.Category, activityPattern.Subject)
    UIHelper.setFieldValues(newActivity, activityMap)
    newActivity.update()
    // Querying to refresh the entire claim entity graph
    claim = Query.make(Claim).compare(Claim#ID, Equals, claim.ID).select().single()
    _claimWrapper.set(claim)
    var latestActivity = claim.Activities.disjunction(existingActivities).single()
    _activityWrapper.set(latestActivity)
  }

  override function completeActivity() {
    completeActivity(_activityWrapper.get().Subject)
  }

  override function completeActivity(subject : String) {
    var claimWorkplan = new Navigation<ClaimWorkplan>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToWorkplan(), CurrentUser)
    claimWorkplan.ClaimWorkplanScreen.WorkplanLV._Entries.singleWhere(\e -> e.Subject.Text == subject).Subject.click()

    var activityWorksheet = (_proxy.CurrentWorksheet as ActivityDetailWorksheet)
    activityWorksheet.ActivityDetailScreen_editable.ActivityDetailScreen_CompleteButton.click()
  }

  override function verifyActivitiesSubjects(table : DataTable) {
    var claimWorkplan = new Navigation<ClaimWorkplan>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToWorkplan(), CurrentUser)
    var entries = claimWorkplan.ClaimWorkplanScreen.WorkplanLV._Entries

    var activitySubjects = table.asList(String)
    for (subject in activitySubjects) {
      assertThat(entries.countWhere(\e -> e.Subject.Text == subject)).isGreaterThanOrEqualTo(1)
    }
  }

  override function verifyActivity(table : DataTable) {
    var expectedFields = table.topCells()

    var expectedActivities = table.asMaps(String, String).map(\map -> new HashMap<String, String>(map))
    transformDataTableMaps(expectedActivities)
    var actualActivities = retrieveActivityDetails()
    transformActivity(expectedFields, actualActivities)

    table.toTable(expectedActivities, expectedFields.toTypedArray()).unorderedDiff(actualActivities)
  }

  private function transformDataTableMaps(activities : List<Map<String, String>>) {
    var relatedToLabel = DisplayKey.get("NVV.Activity.SubView.ActivityDetails.RelatedTo")
    var assignedToLabel = DisplayKey.get("NVV.Activity.SubView.ActivityOwner.Activity.InternalOwner")
    var claim = _claimWrapper.get()
    var exposureDisplayName = _exposureWrapper.get().DisplayName
    var assignedUserDisplayName = claim.AssignedUser.DisplayName

    for (activity in activities) {
      if (activity.containsKey(relatedToLabel)) {
        var relatedToType = activity.get(relatedToLabel).split(":")[0]
        switch (relatedToType) {
          case DisplayKey.get("entity.Claim"):
            activity.put(relatedToLabel, claim.DisplayName)
            break
          case DisplayKey.get("entity.Exposure"):
            activity.put(relatedToLabel, exposureDisplayName)
            break
        }
      }

      if (activity.containsKey(assignedToLabel)) {
        var assignedToType = activity.get(assignedToLabel)
        if (assignedToType.equalsIgnoreCase(DisplayKey.get("Web.ActivityRules.Action.GenerateActivity.Assignee.ClaimOwner"))) {
          activity.put(assignedToLabel, assignedUserDisplayName)
        }
      }
    }
  }

  private function retrieveActivityDetails() : List<Map<String, String>> {
    var claim = _claimWrapper.get()
    var claimWorkplan = new Navigation<ClaimWorkplan>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToWorkplan(), CurrentUser)
    var entries = claimWorkplan.ClaimWorkplanScreen.WorkplanLV._Entries

    var activities = new ArrayList<Map<String, String>>()
    for (entry in entries) {
      entry.Subject.click()
      if (_proxy.CurrentWorksheet typeis ActivityDetailWorksheet) {
        var activityDetailWorksheet = _proxy.CurrentWorksheet as ActivityDetailWorksheet
        activities.add(PCFReflectUtil.getFieldValues(activityDetailWorksheet))
      }
    }
    return activities
  }

  function transformActivity(filteredFields : List<String>, activities : List<Map<String, String>>) {
    var relatedToLabel = DisplayKey.get("NVV.Activity.SubView.ActivityDetails.RelatedTo")
    for (actualActivity in activities) {
      actualActivity.retainWhereKeys(\key -> filteredFields.contains(key))
      if (actualActivity.containsKey(relatedToLabel)) {
        actualActivity.put(relatedToLabel, RelatedToHelper.getRelatedToDisplayName(actualActivity.get(relatedToLabel)))
      }
    }
  }

  override function verifyActivityStatus(activityStatusText : String) {
    var activityStatus = new TypelistTransformer<ActivityStatus>().transform(activityStatusText)
    var claimWorkplan = new Navigation<ClaimWorkplan>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToWorkplan(), CurrentUser)
    claimWorkplan.ClaimWorkplanScreen.WorkplanLV.WorkplanFilter.getOptionByLabel(DisplayKey.get("Java.Workplan.AllActivities")).click()

    var activityEntry = claimWorkplan.ClaimWorkplanScreen.WorkplanLV._Entries.singleWhere(\e -> e.Subject.Text == _activityWrapper.get().Subject)
    assertThat(activityEntry.Status.Text).contains(activityStatus.DisplayName)
  }

  override function verifyAllActivitiesCompleted() {
    var claimWorkplan = new Navigation<ClaimWorkplan>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToWorkplan(), CurrentUser)
    claimWorkplan.ClaimWorkplanScreen.WorkplanLV.WorkplanFilter.getOptionByLabel(DisplayKey.get("Java.Workplan.AllActivities")).click()

    var entries = claimWorkplan.ClaimWorkplanScreen.WorkplanLV._Entries
    for (entry in entries) {
      assertThat(entry.Status.Text.contains(ActivityStatus.TC_COMPLETE.DisplayName))
    }
  }
}
package gw.cucumber.context.impl.smoketest.common

uses com.google.inject.Inject
uses gw.api.database.Query
uses gw.api.locale.DisplayKey
uses gw.cucumber.CucumberStepBase
uses gw.cucumber.context.api.common.AssignmentContext
uses gw.cucumber.context.impl.smoketest.util.Navigation
uses gw.cucumber.testdata.DataWrapper
uses pcftest.AssignExposuresPopup
uses pcftest.ClaimExposures
uses pcftest.ClaimStatus
uses pcftest.ClaimSummary
uses pcftest.ClaimWorkplan

@SuppressWarnings("unused")
class AssignmentContextImpl extends CucumberStepBase implements AssignmentContext {

  @Inject
  var _claimWrapper : DataWrapper<Claim>

  @Inject
  var _exposureWrapper : DataWrapper<Exposure>

  @Inject
  var _activityWrapper : DataWrapper<Activity>

  @Inject
  var _serviceRequestWrapper : DataWrapper<ServiceRequest>

  @Inject
  protected var _userWrapper : DataWrapper<User>

  function personalAutoAdjusterUser() {
    _userWrapper.set(getUserByDisplayName("Sean Sullivan")) //this is implementation-dependent and could change over time, should be specified in Gherkin
  }

  override function assignClaimToCurrentUser() {
    var user = getUserByUsername(CurrentUser)
    var group = user.RootGroup
    assignClaim(user, group)
  }

  override function setClaimAssignedGroupAndUser(groupName : String, userDisplayName : String) {
    var group = getGroupByName(groupName)
    var user = getUserByDisplayName(userDisplayName)

    assignClaim(user, group)
  }

  override function setExposureAssignedGroupAndUser(groupName : String, userDisplayName : String) {
    var claim = _claimWrapper.get()
    var exposure = _exposureWrapper.get() ?: claim.Exposures.single()

    var group = getGroupByName(groupName)
    var user = getUserByDisplayName(userDisplayName)

    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      exposure.assign(group, user)
      exposure.Bundle.commit()
    }, CurrentUser)
    _exposureWrapper.set(exposure)
  }

  override function setActivityAssignedGroupAndUser(groupName : String, userDisplayName : String) {
    var claim = _claimWrapper.get()
    var activity = _activityWrapper.get() ?: claim.Activities.single()

    var group = getGroupByName(groupName)
    var user = getUserByDisplayName(userDisplayName)

    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      activity = bundle.add(activity)
      activity.assign(group, user)
    }, CurrentUser)
    _activityWrapper.set(activity)
  }

  override function reassignClaimThroughAutomatedAssignment() {
    var claimSummary = new Navigation<ClaimSummary>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()), CurrentUser)
    var assignClaimsPopup = claimSummary.ClaimMenuActions.goToAssignClaim()
    assignClaimsPopup.AssignmentPopupScreen.AssignmentPopupDV.FromList_Choice.click()
    assignClaimsPopup.AssignmentPopupScreen.AssignmentPopupDV.SelectFromList.clickByLabelSubstr(DisplayKey.get("Java.Assign.AssignByRules"))
    assignClaimsPopup.AssignmentPopupScreen.AssignmentPopupDV.AssignmentPopupScreen_ButtonButton.click()
  }

  override function reassignExposureThroughAutomatedAssignment() {
    var claim = _claimWrapper.get()
    var exposure = _exposureWrapper.get() ?: claim.Exposures.single()

    var claimExposures = new Navigation<ClaimExposures>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(claim).goToExposures(), CurrentUser)
    claimExposures.ClaimExposuresScreen.ExposuresLV._Entries
        .singleWhere(\e -> e.Order.Text == exposure.ClaimOrder.toString())._Checkbox.BoolValue = true
    var assignPopup = claimExposures.ClaimExposuresScreen.ClaimExposures_Assign.click() as AssignExposuresPopup
    assignPopup.AssignmentPopupScreen.AssignmentPopupDV.FromList_Choice.click()
    assignPopup.AssignmentPopupScreen.AssignmentPopupDV.SelectFromList.clickByLabelSubstr(DisplayKey.get("Java.Assign.AssignByRules"))
    assignPopup.AssignmentPopupScreen.AssignmentPopupDV.AssignmentPopupScreen_ButtonButton.click()
  }

  override function reassignClaimToGroupAndUser(groupName : String, userDisplayName : String) {
    var claimSummary = new Navigation<ClaimSummary>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()), CurrentUser)
    var assignClaimsPopup = claimSummary.ClaimMenuActions.goToAssignClaim()
    var assignmentPopupScreen = assignClaimsPopup.AssignmentPopupScreen
    var searchDV = assignmentPopupScreen.AssignmentSearchDV

    assignmentPopupScreen.AssignmentPopupDV.FromSearch_Choice.click()

    searchDV.SearchFor.clickByLabelSubstr(AssignmentSearchType.TC_USER.DisplayName)
    searchDV.GlobalPersonNameInputSet_default.FirstName.Value = userDisplayName.split(" ").first()
    searchDV.GlobalPersonNameInputSet_default.LastName.Value = userDisplayName.split(" ").last()

    var groupSearchPopup = searchDV.Group.GroupSearchMenuIcon.click() as pcftest.GroupSearchPopup
    groupSearchPopup.GroupSearchPickerScreen.GroupSearchDV.GroupName.Value = groupName
    groupSearchPopup.GroupSearchPickerScreen.GroupSearchDV.SearchAndResetInputSet.SearchLinksInputSet.Search.click()
    groupSearchPopup.GroupSearchPickerScreen.GroupSearchPickerResultsLV._Entries.first()._Select.click()

    searchDV.SearchAndResetInputSet.SearchLinksInputSet.Search.click()
    assignmentPopupScreen.AssignmentUserLV._Entries.first()._Select.click()
  }

  override function reassignExposureToGroupAndUser(groupName : String, userDisplayName : String) {
    var claim = _claimWrapper.get()
    var exposure = _exposureWrapper.get() ?: claim.Exposures.single()

    var claimExposures = new Navigation<ClaimExposures>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(claim).goToExposures(), CurrentUser)
    claimExposures.ClaimExposuresScreen.ExposuresLV._Entries
        .singleWhere(\e -> e.Order.Text == exposure.ClaimOrder.toString())._Checkbox.BoolValue = true
    var assignPopup = claimExposures.ClaimExposuresScreen.ClaimExposures_Assign.click() as AssignExposuresPopup

    assignPopup.AssignmentPopupScreen.AssignmentPopupDV.FromSearch_Choice.click()
    assignPopup.AssignmentPopupScreen.assignBySearchingFor(AssignmentSearchType.TC_USER.DisplayName)
    assignPopup.AssignmentPopupScreen.pickGroupAndUser(groupName, userDisplayName)
  }

  override function reassignActivityToGroupAndUser(groupName : String, userDisplayName : String) {
    var claim = _claimWrapper.get()
    var activity = _activityWrapper.get() ?: claim.Activities.last()

    var claimWorkplan = new Navigation<ClaimWorkplan>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(claim).goToWorkplan(), CurrentUser)
    claimWorkplan.ClaimWorkplanScreen.WorkplanLV._Entries
        .singleWhere(\e -> e.Subject.Text == activity.Subject)._Checkbox.BoolValue = true
    var assignPopup = claimWorkplan.ClaimWorkplanScreen.ClaimWorkplan_AssignButton.click() as pcftest.AssignActivitiesPopup

    assignPopup.AssignmentPopupScreen.AssignmentPopupDV.FromSearch_Choice.click()
    assignPopup.AssignmentPopupScreen.assignBySearchingFor(AssignmentSearchType.TC_USER.DisplayName)
    assignPopup.AssignmentPopupScreen.pickGroupAndUser(groupName, userDisplayName)
  }

  override function verifyClaimAssignedToUserInGroup(groupName : String) {
    var claimStatus = new Navigation<ClaimStatus>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToClaimStatus(), CurrentUser)
    assertThat(claimStatus.PrimaryGroup.Text).isEqualToIgnoringCase(groupName)
    assertThat(claimStatus.PrimaryUser.Text).isNotEmpty()
  }

  override function verifyClaimAssignedGroup(groupName : String) {
    var claimStatus = new Navigation<ClaimStatus>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToClaimStatus(), CurrentUser)
    assertThat(claimStatus.PrimaryGroup.Text).isEqualToIgnoringCase(groupName)
  }

  override function verifyClaimAssignedUser(userDisplayName : String) {
    var claimStatus = new Navigation<ClaimStatus>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToClaimStatus(), CurrentUser)
    assertThat(claimStatus.PrimaryUser.Text).isEqualToIgnoringCase(userDisplayName)
  }

  override function verifyExposureAssignedGroup(groupName : String, coverageTypeText : String = null) {
    var claim = _claimWrapper.get()
    var exposure : Exposure
    if (coverageTypeText == null) {
      exposure = _exposureWrapper.get() ?: claim.Exposures.single()
    } else {
      exposure = (claim as Claim).Exposures.singleWhere(\exp -> exp.PrimaryCoverage.DisplayName.equalsIgnoreCase(coverageTypeText))
    }

    exposure = exposure.refresh() as Exposure
    assertThat(exposure.AssignedGroup.DisplayName).isEqualTo(groupName)
  }

  override function verifyExposureAssignedUser(userDisplayName : String, coverageTypeText : String = null) {
    var claim = _claimWrapper.get()
    var exposure : Exposure
    if (coverageTypeText == null) {
      exposure = _exposureWrapper.get() ?: claim.Exposures.single()
    } else {
      exposure = (claim as Claim).Exposures.singleWhere(\exp -> exp.PrimaryCoverage.DisplayName.equalsIgnoreCase(coverageTypeText))
    }

    var claimExposures = new Navigation<ClaimExposures>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(claim).goToExposures(), CurrentUser)
    var exposureEntry = claimExposures.ClaimExposuresScreen.ExposuresLV._Entries
        .singleWhere(\e -> e.Order.Text == exposure.ClaimOrder.toString())
    assertThat(exposureEntry.Assignee.Text).isEqualTo(userDisplayName)
  }

  override function verifyActivityAssignedGroup(groupName : String) {
    var claim = _claimWrapper.get()
    var activity = _activityWrapper.get() ?: claim.Activities.single()
    var claimWorkplan = new Navigation<ClaimWorkplan>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(claim).goToWorkplan(), CurrentUser)
    claimWorkplan.ClaimWorkplanScreen.WorkplanLV._Entries
        .singleWhere(\e -> e.Subject.Text == activity.Subject).Subject.click()
    var activityDetailWorksheet = _proxy.CurrentWorksheet as pcftest.ActivityDetailWorksheet
    assertThat(activityDetailWorksheet.ActivityDetailScreen_editable.ActivityDV_default.ActivityOwnerInputSet.AssignedGroup.Text)
        .isEqualToIgnoringCase(groupName)
  }

  override function verifyActivityAssignedUser(userDisplayName : String) {
    var claim = _claimWrapper.get()
    var activity = _activityWrapper.get() ?: claim.Activities.single()
    var claimWorkplan = new Navigation<ClaimWorkplan>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(claim).goToWorkplan(), CurrentUser)
    claimWorkplan.ClaimWorkplanScreen.WorkplanLV._Entries
        .singleWhere(\e -> e.Subject.Text == activity.Subject).Subject.click()
    var activityDetailWorksheet = _proxy.CurrentWorksheet as pcftest.ActivityDetailWorksheet
    assertThat(activityDetailWorksheet.ActivityDetailScreen_editable.ActivityDV_default.ActivityOwnerInputSet.InternalOwner.Text)
        .isEqualToIgnoringCase(userDisplayName)
  }

  override function verifyExposureAssignedToClaimOwner(coverageTypeText : String = null) {
    var claim = _claimWrapper.get()
    var exposure : Exposure
    if (coverageTypeText == null) {
      exposure = _exposureWrapper.get() ?: claim.Exposures.single()
    } else {
      exposure = (claim as Claim).Exposures.singleWhere(\exp -> exp.PrimaryCoverage.DisplayName.equalsIgnoreCase(coverageTypeText))
    }
    exposure = exposure.refresh() as Exposure
    assertThat(exposure.AssignedUser).isEqualTo(claim.AssignedUser)
    assertThat(exposure.AssignedGroup).isEqualTo(claim.AssignedGroup)
  }

  private function assignClaim(user : User, group : Group) {
    var claim = _claimWrapper.get()
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      claim = bundle.add(claim)
      claim.assign(group, user)
    }, CurrentUser)
    _claimWrapper.set(claim)
  }

  override function assignServiceRequest() {
    var serviceRequest = _serviceRequestWrapper.get()
    personalAutoAdjusterUser()
    var user = _userWrapper.get()
    var group = user.AllGroups.first() as Group

    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      serviceRequest = bundle.add(serviceRequest)
      serviceRequest.assign(group, user)
    }, CurrentUser)
    _serviceRequestWrapper.set(serviceRequest)
  }

  private function getGroupByName(groupName : String) : Group {
    return Query.make(Group).compare(Group#Name, Equals, groupName).select().AtMostOneRow
  }

  private function getUserByDisplayName(userDisplayName : String) : User {
    var contact = Query.make(entity.Person)
        .compare(Person#FirstName, Equals, userDisplayName.split(" ").first())
        .compare(Person#LastName, Equals, userDisplayName.split(" ").last())
        .select().FirstResult
    return Query.make(entity.User).compare(User#Contact, Equals, contact).select().AtMostOneRow
  }
}
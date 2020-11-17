package gw.enhancement.assignment

uses junit.framework.Assert
uses pcftest.GroupSearchPopup

enhancement AssignmentPopupScreenTestEnhancement : pcftest.AssignmentPopupScreen {

  /**
   * selects the first option from the list that contains (ignoring case) assigneeName; the list items
   * seem to normally have contacts' first and last names, separated by a space
   */
  function assignFromListByName(assigneeName : String) {
    this.AssignmentPopupDV.SelectFromList.clickByLabelSubstr( assigneeName )
    this.AssignmentPopupDV.AssignmentPopupScreen_ButtonButton.click()
  }

  function assignUsingAutomatedAssignment() {
    this.AssignmentPopupDV.FromList_Choice.click()
    this.AssignmentPopupDV.SelectFromList.clickByLabelSubstr( "Use automated assignment" )
    this.AssignmentPopupDV.AssignmentPopupScreen_ButtonButton.click()
  }

  function assignBySearchingFor(entityTypeName : String) {
    this.AssignmentPopupDV.FromSearch_Choice.click()
    var option = this.AssignmentSearchDV.SearchFor.getOptionByLabel(entityTypeName)
    Assert.assertNotNull("Could not find entry in search for list that matches " + entityTypeName, option)
    option.click()
  }

  function pickGroupAndUser(groupToPick : String, userDisplayNameToPick : String) {
    this.AssignmentSearchDV.GlobalPersonNameInputSet_default.FirstName.Value = userDisplayNameToPick.split(" ").first()
    this.AssignmentSearchDV.GlobalPersonNameInputSet_default.LastName.Value = userDisplayNameToPick.split(" ").last()

    var groupSearchPopup = this.AssignmentSearchDV.Group.GroupSearchMenuIcon.click() as GroupSearchPopup
    groupSearchPopup.GroupSearchPickerScreen.GroupSearchDV.GroupName.Value = groupToPick
    groupSearchPopup.GroupSearchPickerScreen.GroupSearchDV.SearchAndResetInputSet.SearchLinksInputSet.Search.click()
    groupSearchPopup.GroupSearchPickerScreen.GroupSearchPickerResultsLV._Entries.first()._Select.click()

    this.search()
    this.AssignmentUserLV._Entries.single()._Select.click()
  }

  function search() {
    this.AssignmentSearchDV.SearchAndResetInputSet.SearchLinksInputSet.Search.click()
  }
}
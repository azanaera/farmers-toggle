package gw.enhancement.assignment

uses gw.smoketest.platform.web.PCFLocation
uses gw.smoketest.platform.web.SelectElement
uses gw.smoketest.platform.web.ValueElement
uses junit.framework.Assert
uses pcftest.GroupSearchPopup

enhancement AssigneePickerPopupTestEnhancement : pcftest.AssigneePickerPopup {

  // list views

  property get AssignmentUserLV() : pcftest.AssignmentUserLV { return this.AssigneePickerScreen.AssignmentUserLV }
  property get AssignmentGroupLV() : pcftest.AssignmentGroupLV { return this.AssigneePickerScreen.AssignmentGroupLV }
  property get AssignmentQueueLV() : pcftest.AssignmentQueueLV { return this.AssigneePickerScreen.AssignmentQueueLV }
// buttons

// fields

  /**
   * Label: "Search For"<br>
   * Type: AssignmentSearchType<br>
   */
  property get SearchFor() : SelectElement { return this.AssigneePickerScreen.AssignmentSearchDV.SearchFor }

  /**
   * Label: "Last Name"<br>
   * Type: String<br>
   */
  property get LastName() : ValueElement { return this.AssigneePickerScreen.AssignmentSearchDV.GlobalPersonNameInputSet_default.LastName }

  /**
   * Label: "First Name"<br>
   * Type: String<br>
   */
  property get FirstName() : ValueElement { return this.AssigneePickerScreen.AssignmentSearchDV.GlobalPersonNameInputSet_default.FirstName }

  /**
   * Label: "User name"<br>
   * Type: String<br>
   */
  property get Username() : ValueElement { return this.AssigneePickerScreen.AssignmentSearchDV.Username }

  /**
   * Label: "Group Name"<br>
   * Type: Group<br>
   */
  property get Group() : pcftest.AssignmentSearchDV.Group { return this.AssigneePickerScreen.AssignmentSearchDV.Group }

  /**
   * Label: "Role"<br>
   * Type: Role<br>
   */
  property get UserRole() : SelectElement { return this.AssigneePickerScreen.AssignmentSearchDV.UserRole }

  /**
   * Label: "Attribute Name"<br>
   * Type: String<br>
   */
  property get AttributeName() : ValueElement { return this.AssigneePickerScreen.AssignmentSearchDV.AttributeName }

  /**
   * Label: "Attribute Value"<br>
   * Type: Integer<br>
   */
  property get AttributeValue() : ValueElement { return this.AssigneePickerScreen.AssignmentSearchDV.AttributeValue }

  /**
   * Label: "Attribute State"<br>
   * Type: State<br>
   */
  property get AttributeState() : pcftest.AssignmentSearchDV.AttributeState { return this.AssigneePickerScreen.AssignmentSearchDV.AttributeState }

  /**
   * Label: "Group Name"<br>
   * Type: String<br>
   */
  property get GroupCriteriaName() : ValueElement { return this.AssigneePickerScreen.AssignmentSearchDV.GroupCriteriaName }

  /**
   * Label: "Group Name"<br>
   * Type: String<br>
   */
  property get GroupName() : ValueElement { return this.AssigneePickerScreen.AssignmentSearchDV.GroupName }

  /**
   * Label: "Queue Name"<br>
   * Type: String<br>
   */
  property get QueueName() : ValueElement { return this.AssigneePickerScreen.AssignmentSearchDV.QueueName }

  /**
   * Label: "Location"<br>
   * Type: Address<br>
   */
  property get Address_Name_default() : SelectElement { return this.AssigneePickerScreen.AssignmentSearchDV.CCAddressBookSearchProximityAddressInputSet.globalAddressContainer.Address_Name }

  /**
   * Label: "Search Radius"<br>
   * Type: ProximitySearchParameters<br>
   */
  property get ProximitySearchType_default() : SelectElement { return this.AssigneePickerScreen.AssignmentSearchDV.CCAddressBookSearchProximityAddressInputSet.globalAddressContainer.ProximitySearchType }

  /**
   * Label: "Line 1"<br>
   * Type: String<br>
   */
  property get ProximityAddressLine1_default() : ValueElement { return this.AssigneePickerScreen.AssignmentSearchDV.CCAddressBookSearchProximityAddressInputSet.globalAddressContainer.proximityAddress.GlobalAddressInputSet_default.AddressLine1 }

  /**
   * Label: "Line 2"<br>
   * Type: String<br>
   */
  property get ProximityAddressLine2_default() : ValueElement { return this.AssigneePickerScreen.AssignmentSearchDV.CCAddressBookSearchProximityAddressInputSet.globalAddressContainer.proximityAddress.GlobalAddressInputSet_default.AddressLine2 }

  /**
   * Label: "City"<br>
   * Type: String<br>
   */
  property get ProximityCity_default() : ValueElement { return this.AssigneePickerScreen.AssignmentSearchDV.CCAddressBookSearchProximityAddressInputSet.globalAddressContainer.proximityAddress.GlobalAddressInputSet_default.City }

  /**
   * Label: "Unknown"<br>
   * Type: State<br>
   */
  property get ProximityState_default() : SelectElement { return this.AssigneePickerScreen.AssignmentSearchDV.CCAddressBookSearchProximityAddressInputSet.globalAddressContainer.proximityAddress.GlobalAddressInputSet_default.State }

  /**
   * Label: "Unknown"<br>
   * Type: String<br>
   */
  property get ProximityPostalCode_default() : ValueElement { return this.AssigneePickerScreen.AssignmentSearchDV.CCAddressBookSearchProximityAddressInputSet.globalAddressContainer.proximityAddress.GlobalAddressInputSet_default.PostalCode }

  /**
   * Label: "Country"<br>
   * Type: Country<br>
   */
  property get ProximityCountry_default() : pcftest.GlobalAddressInputSet_default.Country { return this.AssigneePickerScreen.AssignmentSearchDV.CCAddressBookSearchProximityAddressInputSet.globalAddressContainer.proximityAddress.GlobalAddressInputSet_default.Country }

  function pickGroupByName(groupToPick : String) {
    this.SearchFor.getOptionByLabel("Group").click()
    this.GroupCriteriaName.Value = groupToPick
    this.search()
    Assert.assertEquals(1, this.AssignmentGroupLV._Entries.Count)
    this.AssignmentGroupLV._Entries[0]._Select.click()
  }

  function pickUserByUserName(userNameToPick : String) {
    this.SearchFor.getOptionByLabel("User").click()
    this.Username.Value = userNameToPick
    this.search()
    Assert.assertEquals(1, this.AssignmentUserLV._Entries.Count)
    this.AssignmentUserLV._Entries[0]._Select.click()
  }

  function pickGroupAndUser(groupToPick : String, userDisplayNameToPick : String) {
    this.SearchFor.clickByLabelSubstr(AssignmentSearchType.TC_USER.DisplayName)
    this.FirstName.Value = userDisplayNameToPick.split(" ").first()
    this.LastName.Value = userDisplayNameToPick.split(" ").last()

    var groupSearchPopup = this.Group.GroupSearchMenuIcon.click() as GroupSearchPopup
    groupSearchPopup.GroupSearchPickerScreen.GroupSearchDV.GroupName.Value = groupToPick
    groupSearchPopup.GroupSearchPickerScreen.GroupSearchDV.SearchAndResetInputSet.SearchLinksInputSet.Search.click()
    groupSearchPopup.GroupSearchPickerScreen.GroupSearchPickerResultsLV._Entries.first()._Select.click()

    this.search()
    this.AssignmentUserLV._Entries.first()._Select.click()
  }

  function search() : PCFLocation {
    return this.AssigneePickerScreen.AssignmentSearchDV.SearchAndResetInputSet.SearchLinksInputSet.Search.click()
  }

  function reset() : PCFLocation  {
    return this.AssigneePickerScreen.AssignmentSearchDV.SearchAndResetInputSet.SearchLinksInputSet.Reset.click()
  }
}

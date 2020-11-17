package gw.enhancement.admin

uses gw.api.locale.DisplayKey
uses gw.i18n.ILocale
uses gw.testharness.v3.PLAssertions
uses junit.framework.Assert
uses pcftest.NewRecoverySet
uses pcftest.NewRecoveryReserveSet
uses pcftest.NewReserveSet
uses pcftest.NormalCreateCheckWizard

@Export
enhancement ClaimMenuActionsTestEnhancement : pcftest.ClaimMenuActions {

  function goToNewManualCheck() : pcftest.ManualCreateCheckWizard {
    this.click()
    return this.ClaimMenuActions_NewTransaction.ClaimMenuActions_NewOtherTrans.ClaimMenuActions_NewTransaction_Check.click() as pcftest.ManualCreateCheckWizard
  }

  function goToAssignClaim() : pcftest.AssignClaimsPopup {
    this.click()
    return this.ClaimFileMenuItemSet.ClaimMenuActions_ClaimActions.ClaimMenuActions_Assign.click() as pcftest.AssignClaimsPopup
  }

  function goToCloseClaim() : pcftest.CloseClaimPopup {
    this.click()
    return this.ClaimFileMenuItemSet.ClaimMenuActions_ClaimActions.ClaimMenuActions_CloseClaim.click()
  }

  function goToNewCheck() : NormalCreateCheckWizard {
    this.click()
    return this.ClaimMenuActions_NewTransaction.ClaimMenuActions_NewTransaction_CheckSet.click() as NormalCreateCheckWizard
  }

  function goToNewNote() : pcftest.NewNoteWorksheet {
    this.click()
    return this.ClaimNewOtherMenuItemSet.ClaimMenuActions_NewOther.ClaimMenuActions_NewNote.click()
  }

  property get ClaimMenuActions() : pcftest.ClaimMenuActions {
    return this.ClaimMenuActions
  }


  /**
   * Navigates the user to the New Reserve Set UI, if it is available.  If it is not available for some
   * reason (e.g., the claim is closed) then aborts and returns NULL
   *
   * @return A reference to the NewReserveSet instance if it can be reached, else NULL.
   */
  function goToNewReserveSet() : NewReserveSet {
    if (!this.ClaimMenuActions_NewTransaction.ClaimMenuActions_NewTransaction_ReserveSet.Visible) {
      this.click()
    }
    var newReserveSetOption = this.ClaimMenuActions_NewTransaction.ClaimMenuActions_NewTransaction_ReserveSet
    var newReserveSetPage = (null != newReserveSetOption and newReserveSetOption.Visible and newReserveSetOption.Enabled) ? newReserveSetOption.click() : null as NewReserveSet
    return newReserveSetPage
  }

  function goToNewRecoverySet() : NewRecoverySet {
    if (!this.ClaimMenuActions_NewTransaction.ClaimMenuActions_NewOtherTrans.ClaimMenuActions_NewTransaction_RecoverySet.Visible) {
      this.click()
    }

    return this.ClaimMenuActions_NewTransaction.ClaimMenuActions_NewOtherTrans.ClaimMenuActions_NewTransaction_RecoverySet.click()
  }

  function goToNewRecoveryReserveSet() : NewRecoveryReserveSet {
    if (!this.ClaimMenuActions_NewTransaction.ClaimMenuActions_NewOtherTrans.ClaimMenuActions_NewTransaction_RecoveryReserveSet.Visible) {
      this.click()
    }
    var newReserveSetOption = this.ClaimMenuActions_NewTransaction.ClaimMenuActions_NewOtherTrans.ClaimMenuActions_NewTransaction_RecoveryReserveSet
    var newReserveSetPage = (null != newReserveSetOption and newReserveSetOption.Visible and newReserveSetOption.Enabled) ? newReserveSetOption.click() : null as NewRecoveryReserveSet
    return newReserveSetPage
  }

  function goToNewExposureByCoverageSubtype(type : CoverageSubtype) : pcftest.NewExposure {
    this.click()
    var covTypeMenu = this.ClaimMenuActions_NewExposure.NewExposureMenuItemSet_both.NewExposureMenuItemSet_ByCoverageType
    covTypeMenu.openMenu()
    var newExp = findItemForCoverageSubtypeLevel0(covTypeMenu, type)
    PLAssertions.assertThat(newExp).as("Not Available On UI: New Exposure entry for CovSubType " + type.DisplayName).isNotNull()
    return newExp
  }

  function findItemForCoverageSubtypeLevel0(menuItem : pcftest.NewExposureMenuItemSet_both.NewExposureMenuItemSet_ByCoverageType, type : CoverageSubtype) : pcftest.NewExposure {
    var clickEntry = menuItem._Entries.firstWhere(\r -> r.item.Text == type.DisplayName and r.item._Entries.Empty)
    if (clickEntry != null) {
      return clickEntry.item.click()
    } else {
      for (nextItem in menuItem._Entries) {
        var newExp = findItemForCoverageSubtypeLevel1(nextItem.item, type)
        if (newExp != null) {
          return newExp
        }
      }
      return null
    }
  }

  function findItemForCoverageSubtypeLevel1(menuItem : pcftest.NewExposureMenuItemSet_both.NewExposureMenuItemSet_ByCoverageType.entry.item, type : CoverageSubtype) : pcftest.NewExposure {
    var clickEntry = menuItem._Entries.firstWhere(\r -> r.item.Text == type.DisplayName and r.item._Entries.Empty)
    if (clickEntry != null) {
      return clickEntry.item.click()
    } else {
      for (nextItem in menuItem._Entries) {
        var newExp = findItemForCoverageSubtypeLevel1(nextItem.item, type)
        if (newExp != null) {
          return newExp
        }
      }
      return null
    }
  }

  function goToNewActivity(category : ActivityCategory, subject : String, language : LanguageType = null) : pcftest.NewActivity {
    return goToNewActivityByName(getNewActivityCategoryName(category, language), subject)
  }

  function goToNewActivityByName(categoryName : String, subject : String) : pcftest.NewActivity {
    var subjectEntry = findNewActivitySubject(getNewActivityCategorySubMenuByName(categoryName), subject)
    Assert.assertNotNull("Could not create activity with subject '" + subject + "' - no menu item found", subjectEntry)
    return subjectEntry.item.click()
  }

  function verifyNewActivityLinkAvailableByName(categoryName : String, subject : String) {
    goToNewActivityByName(categoryName, subject).cancel()
  }

  function verifyNewActivityLinkAvailable(category : ActivityCategory, subject : String) {
    verifyNewActivityLinkAvailableByName(getNewActivityCategoryName(category), subject)
  }

  function verifyNewActivityLinkHidden(category : ActivityCategory, subject : String) {
    verifyNewActivityLinkHiddenByName(getNewActivityCategoryName(category), subject)
  }

  function verifyNewActivityLinkHiddenByName(categoryName : String, subject : String) {
    var categorySubMenu = findNewActivityCategorySubMenuByName(categoryName)
    if (categorySubMenu != null) {
      var subjectEntry = findNewActivitySubject(categorySubMenu, subject)
      Assert.assertNull("Found unexpected entry with category " + categoryName + " and subject: " + subject, subjectEntry)
    }
    // Close menu - actually goes to new note and then cancels immediately
    this.ClaimNewOtherMenuItemSet.ClaimMenuActions_NewOther.ClaimMenuActions_NewNote.click().cancel()
  }

  function findNewActivityCategorySubMenuByName(categoryName : String) : pcftest.NewActivityMenuItemSet.entry {
    this.click()
    return this.ClaimMenuActions_NewActivity.NewActivityMenuItemSet._Entries.firstWhere(\e -> e.NewActivityMenuItemSet_Category.Text.equalsIgnoreCase(categoryName))
  }

  function getNewActivityCategorySubMenuByName(categoryName : String) : pcftest.NewActivityMenuItemSet.entry {
    var result = findNewActivityCategorySubMenuByName(categoryName)
    Assert.assertNotNull("Could not find new activity sub menu with category " + categoryName, result)
    return result
  }

  function findNewActivitySubject(categoryEntry : pcftest.NewActivityMenuItemSet.entry, subject : String) : pcftest.NewActivityMenuItemSet.entry.NewActivityMenuItemSet_Category.entry2 {
    return categoryEntry.NewActivityMenuItemSet_Category._Entries.firstWhere(\e -> e.item.Text.equalsIgnoreCase(subject))
  }

  function getNewActivityCategoryName(category : ActivityCategory, language : LanguageType = null) : String {
    return category == null
        ? DisplayKey.get("Java.NewActivity.NoCategory")
        : language == null
        ? category.DisplayName
        : category.getDisplayName(ILocale.valueOf(language.Code))
  }

  function goToReopenClaim() : pcftest.ReopenClaimPopup {
    this.click()
    return this.ClaimFileMenuItemSet.ClaimMenuActions_ClaimActions.ClaimMenuActions_ReopenClaim.click() as pcftest.ReopenClaimPopup
  }
}

package gw.enhancement.financials

uses pcftest.ClaimFinancialsSummary
uses pcftest.QuickCreateCheckWizard

enhancement ClaimFinancialsSummaryTestEnhancement : ClaimFinancialsSummary {

  property get ExposureSummaryPanel() : pcftest.FinancialsSummaryPanelSet_Exposure {
    return this.ClaimFinancialsSummaryScreen.financialsPanel.FinancialsSummaryPanelSet_Exposure
  }

  public function getEntryFromExposureList(i : int) : pcftest.FinancialsSummaryLV.entry {
    return ExposureSummaryPanel.FinancialsSummaryLV.EntriesFlattened.get(i)
  }

  public function findFirstByNameFromExposureList(name : String) : pcftest.FinancialsSummaryLV.entry {
    return ExposureSummaryPanel.FinancialsSummaryLV.EntriesFlattened.firstWhere(\ f -> f.FinancialsSummaryLabel.Value == name)
  }

  public function findByClaimOrderFromExposureList(i : String) : pcftest.FinancialsSummaryLV.entry {
    return ExposureSummaryPanel.FinancialsSummaryLV.EntriesFlattened.firstWhere(\ f -> f.FinancialsSummaryLabel.Value.startsWith("("+i+")"))
  }

  public function findFirstByConditionFromExposureList(conditions : block(entry : pcftest.FinancialsSummaryLV.entry) : Boolean) : pcftest.FinancialsSummaryLV.entry{
    return ExposureSummaryPanel.FinancialsSummaryLV.EntriesFlattened.firstWhere(conditions)
  }

  function findEntryByCostAndCategory(costType: String, costCategory: String): pcftest.FinancialsSummaryLV.entry {
    var costTypeRow = findFirstByConditionFromExposureList(\entry -> entry.FinancialsSummaryLabel.Text == costType)
    return costTypeRow._Entries.firstWhere(\entry -> entry.FinancialsSummaryLabel.Text.contains(costCategory))
  }

  /**
   * @param i  the row (zero-indexed) in the LV containing the menu with the "Quick Check" and "Create Check" items
   */
  function createQuickCheckFromExposureEntry(i : int) : pcftest.QuickCreateCheckWizard {
    return getEntryFromExposureList( i ).ts.QuickMenu_QuickCheck.click() as pcftest.QuickCreateCheckWizard
  }

  /**
   * @param i  the row (zero-indexed) in the LV containing the menu with the "Quick Check" and "Create Check" items
   */
  function createCheckFromExposureEntry(i : int) : pcftest.NormalCreateCheckWizard {
    return getEntryFromExposureList( i ).ts.QuickMenu_CreateCheck.click() as pcftest.NormalCreateCheckWizard
  }

  /**
   * @param condition  the row specified by the condition in the LV containing the menu with the "Quick Check" and "Create Check" items
   */
  function createCheckFromExposureEntry(conditions : block(entry : pcftest.FinancialsSummaryLV.entry) : Boolean) : pcftest.NormalCreateCheckWizard {
    return findFirstByConditionFromExposureList( conditions ).ts.QuickMenu_CreateCheck.click() as pcftest.NormalCreateCheckWizard
  }

  /**
   * @param i  the row (zero-indexed) in the LV containing the menu with the "Edit Reserve" item
   */
  function editReserveFromExposureEntry(i : int) : pcftest.NewReserveSet {
    return getEntryFromExposureList( i ).ts.QuickMenu_EditReserve.click()
  }

  /**
   * @param condition  the row specified by the condition in the LV containing the menu with the "Quick Check" and "Create Check" items
   */
  function createQuickCheckFromExposureEntry( conditions : block(entry : pcftest.FinancialsSummaryLV.entry) : Boolean ) : pcftest.QuickCreateCheckWizard {
    return findFirstByConditionFromExposureList( conditions ).ts.QuickMenu_QuickCheck.click() as pcftest.QuickCreateCheckWizard
  }

  /**
   * @param condition  the row specified by the condition in the LV containing the menu with the "Quick Check" item
   */
  function menuItemQuickCheckExistsFromExposureEntry(conditions : block(entry : pcftest.FinancialsSummaryLV.entry) : Boolean) : Boolean {
    try {
      var wizard = findFirstByConditionFromExposureList( conditions ).ts.QuickMenu_QuickCheck.click() as pcftest.QuickCreateCheckWizard
      wizard.Cancel.click()
      this.SmokeTest.dismissAndGetConfirmation()
      var checksLV = this.SmokeTest.CurrentPage as pcftest.ClaimFinancialsChecks
      checksLV._parent.MenuLinks.ClaimFinancialsGroup_ClaimFinancialsSummary.click()
      return true
    } catch (e : Exception) {
      if( e.Message.matches("element \".*QuickMenu_QuickCheck\" not found") ) {
        return false
      } else {
        throw e
      }
    }
  }

  /**
   * @param condition  the row specified by the condition in the LV containing the menu with the "Create Check" item
   */
  function menuItemCreateCheckExistsFromExposureEntry(conditions : block(entry : pcftest.FinancialsSummaryLV.entry) : Boolean) : Boolean {
    try {
      var wizard = findFirstByConditionFromExposureList( conditions ).ts.QuickMenu_CreateCheck.click() as pcftest.NormalCreateCheckWizard
      var checksLV = wizard.cancelSuccessfully()
      checksLV._parent.MenuLinks.ClaimFinancialsGroup_ClaimFinancialsSummary.click()
      return true
    } catch (e : Exception) {
      if( e.Message.matches("element \".*QuickMenu_CreateCheck\" not found") ) {
        return false
      } else {
        throw e
      }
    }
  }

  function goToQuickCheckScreenForFirstCostCategoryMatch(costCategory : String) : QuickCreateCheckWizard {
    var costCategoryEntry = this.ExposureSummaryPanel.FinancialsSummaryLV.EntriesFlattened.firstWhere(\elt -> elt.FinancialsSummaryLabel.Value == costCategory)
    return costCategoryEntry.ts.QuickMenu_QuickCheck.click() as QuickCreateCheckWizard
  }
}

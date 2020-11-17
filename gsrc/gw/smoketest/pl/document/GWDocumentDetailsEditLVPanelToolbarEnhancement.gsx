package gw.smoketest.pl.document

/**
 * Convenience enhancement to return the popup worksheet for BulkEdit
 * when clicking Edit Details (the pcftest code generator does not recognize the checked row action 'push' properly)
 */
enhancement GWDocumentDetailsEditLVPanelToolbarEnhancement : pcftest.UploadDocumentScreen.DocumentDetailsEditLVPanelToolbar {
  public function EditDetails() : pcftest.BulkEditDocumentDetailsPopup {
    this.EditDocumentCreationInfo.click()
    return this.SmokeTest.CurrentWorksheet as pcftest.BulkEditDocumentDetailsPopup
  }
}

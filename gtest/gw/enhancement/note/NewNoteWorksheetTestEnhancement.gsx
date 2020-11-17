package gw.enhancement.note

enhancement NewNoteWorksheetTestEnhancement : pcftest.NewNoteWorksheet {

  function update() : gw.smoketest.platform.web.PCFLocation {
    return this.NewNoteScreen.Update.click()
  }

  function cancel() : gw.smoketest.platform.web.PCFLocation {
    return this.NewNoteScreen.Cancel.click()
  }
}

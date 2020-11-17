package gw.enhancement.activity

uses gw.smoketest.platform.web.BooleanValueElement
uses gw.smoketest.platform.web.DateElement
uses gw.smoketest.platform.web.SelectElement
uses gw.smoketest.platform.web.ValueElement

enhancement NewActivityTestEnhancement : pcftest.NewActivity {
  // list views
  property get ActivityDocumentsLV() : pcftest.ActivityDocumentsLV {
    return this.NewActivityScreen.NewActivityDV.ActivityDocumentInputSet.ActivityDocumentsLV
  }

  // buttons
  property get NewActivity_UpdateButtonButton() : pcftest.NewActivity.NewActivityScreen.NewActivity_UpdateButton {
    return this.NewActivityScreen.NewActivity_UpdateButton
  }

  property get NewActivity_CancelButtonButton() : pcftest.NewActivity.NewActivityScreen.NewActivity_CancelButton {
    return this.NewActivityScreen.NewActivity_CancelButton
  }

  property get NewActivity_AddDocumentButtonButton() : pcftest.NewActivity.NewActivityScreen.NewActivity_AddDocumentButton {
    return this.NewActivityScreen.NewActivity_AddDocumentButton
  }

  // fields
  property get Activity_Subject() : ValueElement {
    return this.NewActivityScreen.NewActivityDV.Activity_Subject
  }

  property get Activity_Description() : ValueElement {
    return this.NewActivityScreen.NewActivityDV.Activity_Description
  }

  property get Activity_RelatedTo() : SelectElement {
    return this.NewActivityScreen.NewActivityDV.Activity_RelatedTo
  }

  property get Activity_DueDate() : DateElement {
    return this.NewActivityScreen.NewActivityDV.Activity_DueDate
  }

  property get Activity_StartDate() : DateElement {
    return this.NewActivityScreen.NewActivityDV.Activity_StartDate
  }

  property get Activity_EndDate() : DateElement {
    return this.NewActivityScreen.NewActivityDV.Activity_EndDate
  }

  property get Activity_EscalationDate() : DateElement {
    return this.NewActivityScreen.NewActivityDV.Activity_EscalationDate
  }

  property get Activity_Priority() : pcftest.NewActivityDV.Activity_Priority {
    return this.NewActivityScreen.NewActivityDV.Activity_Priority
  }

  property get Activity_Mandatory() : BooleanValueElement {
    return this.NewActivityScreen.NewActivityDV.Activity_Mandatory
  }

  property get Activity_Importance() : pcftest.NewActivityDV.Activity_Importance {
    return this.NewActivityScreen.NewActivityDV.Activity_Importance
  }

  property get Activity_Recurring() : BooleanValueElement {
    return this.NewActivityScreen.NewActivityDV.Activity_Recurring
  }

  property get Activity_ExternallyOwned() : BooleanValueElement {
    return this.NewActivityScreen.NewActivityDV.Activity_ExternallyOwned
  }

  property get Activity_ExternalOwner() : pcftest.NewActivityDV.Activity_ExternalOwner {
    return this.NewActivityScreen.NewActivityDV.Activity_ExternalOwner
  }

  property get Activity_CreateDocument() : pcftest.NewActivityDV.Activity_CreateDocument {
    return this.NewActivityScreen.NewActivityDV.Activity_CreateDocument
  }

  property get EmailTemplate() : pcftest.NewActivityDV.EmailTemplate {
    return this.NewActivityScreen.NewActivityDV.EmailTemplate
  }

  property get Activity_AssignActivity() : pcftest.NewActivityDV.Activity_AssignActivity {
    return this.NewActivityScreen.NewActivityDV.Activity_AssignActivity
  }

  function update() : pcftest.ClaimWorkplan {
    var newPage = this.NewActivityScreen.NewActivity_UpdateButton.click()
    if (newPage typeis pcftest.ClaimWorkplan) {
      return newPage
    } else {
      throw new IllegalStateException("Could not save new activity, errors are: " + this.NewActivityScreen._msgs.Messages.join(", "))
    }
  }

  function cancel() : pcftest.ClaimWorkplan {
    return this.NewActivityScreen.NewActivity_CancelButton.click() as pcftest.ClaimWorkplan
  }
}

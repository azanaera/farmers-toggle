package gw.enhancement.financials

uses gw.smoketest.platform.web.OptionElement
uses gw.smoketest.platform.web.SelectElement
uses gw.smoketest.platform.web.ValueElement
uses pcftest.CheckWizard_CheckPayeesScreen
uses pcftest.NewCheckAdditionalPayeeDV
uses pcftest.NewCheckPayeeDV

enhancement CheckWizard_CheckPayeesScreenTestEnhancement : CheckWizard_CheckPayeesScreen {

  property get NewCheckPayeeDVPayeesLV() : NewCheckPayeeDV.NewCheckPayeeDVPayeesLV {
    return this.NewCheckPayeeDV.NewCheckPayeeDVPayeesLV
  }

  property get PrimaryPayee_Name() : NewCheckPayeeDV.PrimaryPayee_Name {
    return this.NewCheckPayeeDV.PrimaryPayee_Name
  }

  property get PrimaryPayee_Type() : SelectElement<OptionElement> {
    return this.NewCheckPayeeDV.PrimaryPayee_Type
  }

  property get PayTo() : ValueElement {
    return this.NewCheckPayeeDV.PayTo
  }

  property get MailToContact() : ValueElement {
    return this.NewCheckPayeeDV.MailToContact
  }

  property get DeductionType() : NewCheckAdditionalPayeeDV.DeductionType {
    return this.NewCheckAdditionalPayeeDV.DeductionType
  }

  property get PortionPercentage() : ValueElement {
    return this.NewCheckAdditionalPayeeDV.CheckPortion.PortionPercentage
  }

  property get PortionFixedAmount() : ValueElement {
    return this.NewCheckAdditionalPayeeDV.CheckPortion.PortionFixedAmount
  }

  function setRequiredFieldsIfNotPresent() {
    for (payee in this.NewCheckPayeesLV._Entries) {
      payee.viewDetail()

      selectFirstValidOptionIfNotSetAndVisible(this.PrimaryPayee_Name)
      selectFirstValidOptionIfNotSetAndVisible(this.PrimaryPayee_Type)

      for (jointPayee in this.NewCheckPayeeDVPayeesLV._Entries) {
        selectFirstValidOptionIfNotSetAndVisible(jointPayee.PayeeName)
        selectFirstValidOptionIfNotSetAndVisible(jointPayee.PayeeType)
      }

      setValueIfNotSetAndVisible(this.PayTo, this.PrimaryPayee_Name.Value)
      setValueIfNotSetAndVisible(this.MailToContact, this.PrimaryPayee_Name.Text)
      selectFirstValidOptionIfNotSetAndVisible(this.DeductionType)
      setValueIfNotSetAndVisible(this.PortionPercentage, Integer.toString(100 / this.NewCheckPayeesLV._Entries.Count))
      setValueIfNotSetAndVisible(this.PortionFixedAmount, Integer.toString(1))
    }
  }

  private function selectFirstValidOptionIfNotSetAndVisible(selectElement : SelectElement) {
    if (selectElement.Visible && selectElement.Enabled && selectElement.Value == null) {
      selectElement.selectFirstValidOption()
    }
  }

  private function setValueIfNotSetAndVisible(valueElement : ValueElement, value : String) {
    if (valueElement.Visible && valueElement.Enabled && valueElement.Value == null) {
      valueElement.Value = value
    }
  }

}

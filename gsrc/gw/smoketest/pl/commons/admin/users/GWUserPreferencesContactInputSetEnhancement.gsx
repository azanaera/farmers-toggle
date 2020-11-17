package gw.smoketest.pl.commons.admin.users

enhancement GWUserPreferencesContactInputSetEnhancement: pcftest.UserPreferencesContactInputSet {

  property set HomePhone(value : String){
    this.UserHomePhone.GlobalPhoneInputSet.NationalSubscriberNumber.Value = value
  }

  property get HomePhone() : String{
    return this.UserHomePhone.GlobalPhoneInputSet.NationalSubscriberNumber.Value
  }

  property set WorkPhone(value : String){
    this.UserHomePhone.GlobalPhoneInputSet.NationalSubscriberNumber.Value = value
  }

  property get WorkPhone() : String{
    return this.UserHomePhone.GlobalPhoneInputSet.NationalSubscriberNumber.Value
  }

  property set CellPhone(value : String){
    this.UserHomePhone.GlobalPhoneInputSet.NationalSubscriberNumber.Value = value
  }

  property get CellPhone() : String{
    return this.UserHomePhone.GlobalPhoneInputSet.NationalSubscriberNumber.Value
  }

  property set Fax(value : String){
    this.UserHomePhone.GlobalPhoneInputSet.NationalSubscriberNumber.Value = value
  }

  property get Fax() : String{
    return this.UserHomePhone.GlobalPhoneInputSet.NationalSubscriberNumber.Value
  }

}

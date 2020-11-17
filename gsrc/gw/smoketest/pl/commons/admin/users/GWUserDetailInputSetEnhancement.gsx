package gw.smoketest.pl.commons.admin.users

enhancement GWUserDetailInputSetEnhancement: pcftest.UserDetailInputSet {

  property get FirstName() : String{
    return this.Name.GlobalPersonNameInputSet_default.FirstName.Value
  }

  property set FirstName(val : String){
    this.Name.GlobalPersonNameInputSet_default.FirstName.setValue(val)
  }

  property get LastName() : String{
    return this.Name.GlobalPersonNameInputSet_default.LastName.Value
  }

  property set LastName(val : String){
    this.Name.GlobalPersonNameInputSet_default.LastName.setValue(val)
  }

  property get FirstNameKanji() : String{
    return this.Name.GlobalPersonNameInputSet_Japan.FirstNameKanji.Value
  }

  property set FirstNameKanji(val : String){
    this.Name.GlobalPersonNameInputSet_Japan.FirstNameKanji.setValue(val)
  }

  property get LastNameKanji() : String{
    return this.Name.GlobalPersonNameInputSet_Japan.LastNameKanji.Value
  }

  property set LastNameKanji(val : String){
    this.Name.GlobalPersonNameInputSet_Japan.LastNameKanji.setValue(val)
  }

}

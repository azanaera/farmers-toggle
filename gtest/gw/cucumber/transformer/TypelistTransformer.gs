package gw.cucumber.transformer

uses gw.api.util.LocaleUtil
uses gw.entity.ITypeList
uses gw.entity.TypeKey
uses gw.lang.reflect.TypeSystem
uses gw.pl.logging.LoggerCategory
uses gw.testharness.v3.PLAssertions

class TypelistTransformer<T extends TypeKey> {

  function transform(value : String) : T {
    return transform(value, false)
  }

  function transform(value : String, allowNull : boolean) : T {
    var typelist = TypeSystem.getByFullNameIfValid(T.Name) as ITypeList<T>
    var typekeys = typelist.getTypeKeys(false).where(\typekey ->
        typekey.DisplayName.equalsIgnoreCase(value) || typekey.getDisplayName(LocaleUtil.toLanguage(LanguageType.getTypeKey("en_US"))).equalsIgnoreCase(value)
    )
    var typekey : T
    if (!allowNull) {
      PLAssertions.assertThat(typekeys).as("Expected a single typekey for ${value}, but found ${typekeys.HasElements ? typekeys.join(", ") : "none"} in the ${typelist.Name} typelist.").hasSize(1)
      typekey = typekeys.single()
    } else {
      typekey = typekeys.first()
    }
    LoggerCategory.TEST.debug("Found ${value} in the ${typelist.Name} TypeList.")
    return typekey
  }

  function transform(value : String, category : TypeKey) : T {
    return transform(value, category, false)
  }

  function transform(value : String, category : TypeKey, allowNull : boolean) : T {
    var typelist = TypeSystem.getByFullNameIfValid(T.Name) as ITypeList<T>
    var typekeys = typelist.getTypeKeys(false).where(\typekey ->
        typekey.DisplayName.equalsIgnoreCase(value) || typekey.getDisplayName(LocaleUtil.toLanguage(LanguageType.getTypeKey("en_US"))).equalsIgnoreCase(value)
    )
    var typekey : T
    if (!allowNull) {
      typekey = typekeys.singleWhere(\elt -> elt.hasCategory(category))
    } else {
      typekey = typekeys.first()
    }
    LoggerCategory.TEST.debug("Found ${value} in the ${typelist.Name} TypeList.")
    return typekey
  }
}

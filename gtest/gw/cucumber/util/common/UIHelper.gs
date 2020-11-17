package gw.cucumber.util.common

uses gw.lang.reflect.IType
uses gw.smoketest.platform.web.MessagesElement
uses gw.smoketest.platform.web.PCFElement
uses gw.smoketest.platform.web.PCFLocation
uses gw.testharness.v3.PLAssertions

class UIHelper {

  /**
   * Set several fields with the value provided in a Map on a list of given root elements
   * @param rootElements the list of root elements for these fields to be set on
   * @param fieldMap the Map containing the fields and values to be set
   */
  static function setFieldValues(rootElement : PCFElement, fieldMap : Map<String, String>){
    setFieldValues(rootElement, new UIFieldsProviderBase(fieldMap) {
      override property get RequiredFields() : Set<String> {
        return {}
      }
      override property get DefaultFields() : Map<String, String> {
        return {}
      }
    })
  }

  /**
   * Set several fields with the value provided in a {@link UIFieldsProvider} on a given root element
   * Verify that all of the {@link UIFieldsProvider#getRequiredFields} are supplied by {@link UIFieldsProvider#getCombinedFields}
   * Fields in {@link UIFieldsProvider#getPreprocessFields} will be filled up before others
   * @param rootElement the root element for these fields to be set on
   * @param fieldsProvider the {@link UIFieldsProvider}
   */
  static function setFieldValues(rootElement : PCFElement, fieldsProvider : UIFieldsProvider) {
    setFieldValues({rootElement}, fieldsProvider)
  }

  /**
   * Set several fields with the value provided in a {@link UIFieldsProvider} on a list of given root elements
   * Verify that all of the {@link UIFieldsProvider#getRequiredFields} are supplied by {@link UIFieldsProvider#getCombinedFields}
   * Fields in {@link UIFieldsProvider#getPreprocessFields} will be filled up before others
   * @param rootElement the root element for these fields to be set on
   * @param fieldsProvider the {@link UIFieldsProvider}
   */
  static function setFieldValues(rootElement : List<PCFElement>, fieldsProvider : UIFieldsProvider){
    var combinedFields = fieldsProvider.CombinedFields
    assertRequiredFields(fieldsProvider.RequiredFields, combinedFields.Keys)

    for(var fields in fieldsProvider.PreprocessFields) {
      var fieldsMap = new HashMap<String, String> ()
      for (var field in fields) {
        fieldsMap.put(field, combinedFields.remove(field))
      }
      PCFReflectUtil.setFieldValues(fieldsMap, rootElement)
    }
    PCFReflectUtil.setFieldValues(combinedFields, rootElement)
  }

  /**
   * Return the value of a list of fields on a list of given root elements
   *
   * @param rootElements the list of Root elements to search for these fields' value
   * @return a Map of String Key is the field, Value is its value if successfully found
   */
  static function getFieldValues(elements : List<PCFElement>) : Map<String, String>  {
    return PCFReflectUtil.getFieldValues(elements)
  }

  /**
   * Verify that the given fieldMap of fields and values are present and matching for the given root-level PCFElements.
   * Assertion will fail if an expected field is missing or if a field which is present has a value that does not match.
   * @param elements the Root element to search for these fields' value
   * @param fieldMap the Map containing the fields expected to be found and the values expected to match what is found
   */
  static function assertFieldValues(element : PCFElement, fieldMap : Map<String, String>) {
    assertFieldValues({element}, fieldMap)
  }

  /**
   * Verify that the given fieldMap of fields and values are present and matching for the given root-level PCFElements.
   * Assertion will fail if an expected field is missing or if a field which is present has a value that does not match.
   * @param elements the list of Root elements to search for these fields' value
   * @param fieldMap the Map containing the fields expected to be found and the values expected to match what is found
   */
  static function assertFieldValues(elements : List<PCFElement>, fieldMap : Map<String, String>) {
    // Filter the value map down to just the fields we are interested in
    var valueMap = getFieldValues(elements)
        .filterByKeys(\label -> fieldMap.containsKey(label))

    PLAssertions.assertThat(valueMap.Keys)
        .as("Missing expected fields")
        .containsOnly(fieldMap.Keys.toArray())
    fieldMap.eachKeyAndValue(\label, expectedValue ->
        PLAssertions.assertThat(valueMap.get(label))
            .as("Value of property \"${label}\" should match")
            .isEqualToIgnoringCase(expectedValue))
  }

  /**
   * Verify that the given set of {@code fields} contains the given {@code requiredFields}.
   * Assertion will fail if a required field is missing.
   * @param requiredFields the set of expected fields
   * @param fields the set of actual fields
   */
  static function assertRequiredFields (requiredFields : Set<String>, fields : Set<String>) {
    PLAssertions.assertThat(fields)
        .as("Missing required fields")
        .contains(requiredFields.toArray())
  }

  public static function assertNoMessages(location : PCFLocation) {
    var messages = checkForMessages(location).flatMap(\messagesElements -> messagesElements.AllMessages)
    messages.removeWhere(\elt -> elt.contains("NOTICE"))
    PLAssertions.assertThat(messages).isEmpty()
  }

  public static function checkForMessages(location : PCFLocation) : List<MessagesElement> {
    var messagesElements = new ArrayList<MessagesElement>()
    PCFReflectUtil.addPCFElementsRecursively<MessagesElement>(location, messagesElements)
    return messagesElements.where(\messagesElement -> !messagesElement.isEmpty())
  }

  internal static function isPCFElement(type : IType) : boolean {
    return gw.api.util.TypeUtil.isNominallyOrStructurallyAssignable(PCFElement, type)
  }

  internal static function isArrayOfPCFElements(type : IType) : boolean {
    return type.Array && isPCFElement(type.ComponentType)
  }

  internal static function isIterableOfPCFElements(type : IType) : boolean {
    if (gw.api.util.TypeUtil.isNominallyOrStructurallyAssignable(Iterable, type)) {
      // We need the raw Iterable type so we can access its (single) type parameter, E
      var rawIterableType = type.AllTypesInHierarchy.singleWhere(\t ->
          t.TypeParameters.length == 1 && areTypesEqual(t.GenericType, Iterable)
      )
      var componentType = rawIterableType.TypeParameters.single()
      return isPCFElement(componentType)
    } else {
      return false
    }
  }

  private static function areTypesEqual(type1 : IType, type2 : IType) : boolean {
    return gw.api.util.TypeUtil.isNominallyOrStructurallyAssignable(type1, type2) &&
        gw.api.util.TypeUtil.isNominallyOrStructurallyAssignable(type2, type1)
  }
}

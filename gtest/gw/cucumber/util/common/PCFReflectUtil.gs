package gw.cucumber.util.common

uses gw.api.system.CCLoggerCategory
uses gw.api.util.TypeUtil
uses gw.lang.reflect.IType
uses gw.smoketest.platform.web.ClickableActionElement
uses gw.smoketest.platform.web.PCFElement
uses gw.smoketest.platform.web.ValueElement

/**
 * Utility class that provides helper methods to handle PCF related functionalities - create/remove/update/remove
 * for UI fields and their assertions/
 *
 */
@Export
class PCFReflectUtil {

  /**
   * Set one field with the value provided on the given root element
   *
   * @param field the field to set
   * @param value the value for this field
   * @param rootElement Root element for this field to be set on
   * @return true if the field is successfully found on the element and value is set, false otherwise
   */
  static function setFieldValue(field : String, value : String, rootElement : PCFElement) : boolean{
    var values : Map<String, String> = {field->value}
    setFieldValues(values, rootElement)
    return values.Empty
  }

  /**
   * Set several fields with the value provided in a Map on the given root element
   *
   * @param values the Map containing the fields and values to be set
   * @param rootElement Root element for these fields to be set on
   */
  static function setFieldValues(values : Map<String, String>, rootElement : PCFElement) {
    setFieldValues(values, {rootElement})
  }

  /**
   * Set several fields with the value provided in a Map on a list of given root elements
   *
   * @param values the Map containing the fields and values to be set
   * @param rootElements the list of root elements for these fields to be set on
   */
  static function setFieldValues(values : Map<String, String>, rootElements : List<PCFElement>) {
    rootElements.each(\root -> {
      // If the element is clickable, i.e. a button or card, click it first
      if (root typeis ClickableActionElement) {
        root = root.click()
      }

      var valueElements = getValueElements(root)

      var theIterator = values.keySet().iterator()
      while (theIterator.hasNext()) {
        var label = theIterator.next()
        var value = values.get(label)

        var valueElement = valueElements.get(label)
        if (valueElement != null) {
          try {
            valueElement.setValue(value)
          }
          catch (e : Exception) {
            CCLoggerCategory.TEST.warn(label + " with " + value + " can't be set.", e)
          }
          finally {
            theIterator.remove()
          }
        }
      }
    })
  }

  /**
   * get the value of a list of fields on the given root element
   *
   * @param rootElement Root element to search for these fields' value
   * @return a Map of String Key is the field, Value is its value if successfully found
   */
  static function getFieldValues(rootElement : PCFElement) : Map<String, String> {
    return getFieldValues({rootElement})
  }

  /**
   * get the value of a list of fields on a list of given root elements
   *
   * @param rootElements the list of Root elements to search for these fields' value
   * @return a Map of String Key is the field, Value is its value if successfully found
   */
  static function getFieldValues(rootElements : List<PCFElement>) : Map<String, String> {
    var values : Map<String, String> = {}
    rootElements.each(\root -> {
      // If the element is clickable, i.e. a button or card, click it first
      if (root typeis ClickableActionElement) {
        root = root.click()
      }

      var valueElements = getValueElements(root)
      valueElements.eachKeyAndValue(\ label, element -> values.put(label, element.Value))
    })
    return values
  }

  // ==============================

  /**
   * Constructs and returns a map (from label to element) of all value elements reachable from the given {@code root}
   * element. Traverses regular, array, and iterable properties of each element in the pcf hierarchy.
   *
   * @param root Root element to search for value elements
   * @return A map, from label to element, of all value elements reachable from the {@code root}
   */
  internal static function getValueElements(root : PCFElement) : Map<String, ValueElement> {
    var valueElements : Map<String, ValueElement> = {}
    addValueElementsRecursively(root, valueElements)
    return valueElements
  }

  private static function addValueElementsRecursively(element : PCFElement, valueElements : Map<String, ValueElement>) {
    var valueElementList = new ArrayList<ValueElement>()
    addPCFElementsRecursively(element, valueElementList)
    valueElementList.each(\ valueElement -> {
      try {
        if (!valueElements.containsKey(valueElement.getLabel())) {
          valueElements.put(valueElement.getLabel(), valueElement)
        } else {
          CCLoggerCategory.TEST.info("Another element exists for ${valueElement.Label}. New: ${valueElement.Id}, Existing: ${valueElements.get(valueElement.Label).Id}")
        }
      } catch (e) {
        // We just skip the property if we can't successfully resolve it.
      }
    })
  }

  static reified function addPCFElementsRecursively<T extends PCFElement>(element : PCFElement, pcfElements : List<T>) {
    addPCFElementsRecursively(element, pcfElements, element)
  }

  private static reified function addPCFElementsRecursively<T extends PCFElement>(element : PCFElement, pcfElements : List<T>, priorElement : PCFElement) {
    var elementID = element.NewId.OldStyleId
    var parentID = element.NewId.Parent.OldStyleId
    var priorElementID = priorElement.NewId.OldStyleId
    var priorParentID = priorElement.NewId.Parent.OldStyleId
    var isChildElement = elementID?.startsWithIgnoreCase(priorElementID)
    var isPeerElement = parentID?.equalsIgnoreCase(priorParentID)
    if (!(isChildElement || isPeerElement)) {
      CCLoggerCategory.TEST.debug("Element ${element.NewId.OldStyleId} not child or peer element of ${priorElement.NewId.OldStyleId}")
      return
    }

    // Base case: add if specified element
    if (element typeis T) {
      try {
        pcfElements.add(element)
      } catch (e) {
        // We just skip the property if we can't successfully resolve it.
      }
    }

    // Traverse down the pcf element hierarchy to find additional PCFElements
    try {
      var elementType = typeof element
      for (prop in elementType.TypeInfo.Properties) {
        var propType = prop.FeatureType
        if (prop.Name.equalsIgnoreCase("_parent") || prop.Name.equalsIgnoreCase("ParentPage") || prop.Name.equalsIgnoreCase("ParentWorksheet") ||
            prop.Name.equalsIgnoreCase("SmokeTest")) {
          //Skip traversing parent elements
        } else if (isPCFElement(propType)) {
          try {
            // The property returns a pcf element; traverse the element itself
            var childElement = prop.Accessor.getValue(element) as PCFElement
            addPCFElementsRecursively(childElement, pcfElements, element)
          } catch (e) {
//            CCLoggerCategory.TEST.warn("Failed to resolve property " + prop + " element " + element)
          }
        } else if (isArrayOfPCFElements(propType)) {
          try {
            // The property returns an array of pcf elements; traverse each element in the array
            var array = prop.Accessor.getValue(element) as PCFElement[]
            array.each(\childElement ->
                addPCFElementsRecursively(childElement, pcfElements, element)
            )
          } catch (e) {
//            CCLoggerCategory.TEST.warn("Failed to resolve property " + prop + " element " + element)
          }
        } else if (isIterableOfPCFElements(propType)) {
          try {
            // The property returns an iterable of pcf elements; traverse each element in the iterable
            var iterable = prop.Accessor.getValue(element) as Iterable<PCFElement>
            iterable.each(\childElement ->
                addPCFElementsRecursively(childElement, pcfElements, element)
            )
          } catch (e) {
//            CCLoggerCategory.TEST.warn("Failed to resolve property " + prop + " element " + element)
          }
        }
      }
    } catch (e) {
      // We just skip the property if we can't successfully resolve it.
    }
  }

  internal static function isPCFElement(type : IType) : boolean {
    return TypeUtil.isNominallyOrStructurallyAssignable(PCFElement.Type, type)
  }

  internal static function isArrayOfPCFElements(type : IType) : boolean {
    return type.Array && isPCFElement(type.ComponentType)
  }

  internal static function isIterableOfPCFElements(type : IType) : boolean {
    if (!TypeUtil.isNominallyOrStructurallyAssignable(Iterable.Type, type)) {
      return false;
    }
    // We need the raw Iterable type so we can access its (single) type parameter, E
    var rawIterableType = type.AllTypesInHierarchy.singleWhere(\t ->
        t.TypeParameters.length == 1 && areTypesEqual(t.GenericType, Iterable)
    )
    var componentType = rawIterableType.TypeParameters.single()
    return isPCFElement(componentType)
  }

  private static function areTypesEqual(type1 : IType, type2 : IType) : boolean {
    return TypeUtil.isNominallyOrStructurallyAssignable(type1, type2)
        && TypeUtil.isNominallyOrStructurallyAssignable(type2, type1)
  }
}
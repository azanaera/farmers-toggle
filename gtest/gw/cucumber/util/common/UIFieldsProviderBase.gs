package gw.cucumber.util.common

@Export
abstract class UIFieldsProviderBase implements  UIFieldsProvider {
  private var _fields : Map<String, String>

  /**
   * @param fields User provided fields, normally defined in the gherkins. When calling {@link #getCombinedFields}, these
   * fields will be used to override the fields in {@link #getDefaultFields}.
   */
  construct(fields : Map<String, String>) {
    _fields = fields
  }


  override property get CombinedFields() : Map<String, String> {
    var combinedFields = DefaultFields.copy()
    combinedFields.putAll(_fields)
    return combinedFields
  }

  // default to return an empty list since normally no special handling is required.
  override property get PreprocessFields() : List<List<String>> {
    return {}
  }
}
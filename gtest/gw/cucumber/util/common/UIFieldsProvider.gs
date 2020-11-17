package gw.cucumber.util.common

uses gw.smoketest.platform.web.PCFElement

/**
 * This interface should only be used together with {@link UIHelper#setFieldValues(PCFElement, UIFieldsProvider)}
 */
@Export
interface UIFieldsProvider {

  /**
   * This method should return all the required fields based on the UI or your business needs. If the
   * {@link #getCombinedFields} does not contain all the required fields, an expection would be thrown
   * when you call {@link UIHelper#setFieldValues(PCFElement, UIFieldsProvider)}
   *
   * @return a set of all the required fields that must be supplied by {@link #getCombinedFields}
   */
  property get RequiredFields() : Set<String>

  /**
   * @return a default fields map used to fill up the fields in the UI
   */
  property get DefaultFields() : Map<String, String>

  /**
   * @return the fields map that is a combination of the {@link #getDefaultFields} and the fields provided by the caller
   */
  property get CombinedFields() : Map<String, String>

  /**
   * This method should return a nested list of strings in the order of their editability / availability.
   *
   * e.g. - Given fields 'A', 'B', 'C', 'D', 'E', if field 'C' won't be editable / available until 'A' and 'B' have been
   * filled (mostly due to post-on-change actions on 'A' and 'B'), and 'D' won't be editable / available until 'C' has
   * been filled, then the return list should be {{A, B}, {C}} - you don't need to add D and E into the list since the
   * rest of the fields will be filled up afterall.
   *
   * @return a nested list of strings containing the fields to be set in the UI
   */
  property get PreprocessFields() : List<List<String>>
}
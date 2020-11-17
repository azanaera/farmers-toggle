package ext.integration.rest.properties

uses gw.api.properties.RuntimePropertyRetriever

class SurePASProperties extends RuntimePropertyRetriever {

  construct() {
    super(RuntimePropertyGroup.TC_SUREPAS)
  }

  /**
   * Get the path for Sure PAS Api.
   *
   * @return the path for Sure PAS Api.
   */
  public property get SurePASPath() : String {
    return this.getRequiredStringProperty("SurePASPath")
  }

  /**
   * Get the X-Space for Sure PAS Api.
   *
   * @return the X-Space for Sure PAS Api.
   */
  public property get SurePASXSpace() : String {
    return this.getRequiredStringProperty("SurePASXSpace")
  }

  /**
   * Get the Auth Token for Sure PAS Api.
   *
   * @return Auth Token for Sure PAS Api.
   */
  public property get SurePASToken() : String {
    return this.getRequiredStringProperty("SurePASToken")
  }
}
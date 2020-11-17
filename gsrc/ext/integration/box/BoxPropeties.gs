package ext.integration.box

uses gw.api.properties.RuntimePropertyRetriever

class BoxPropeties extends RuntimePropertyRetriever {

  construct() {
    super(RuntimePropertyGroup.TC_BOXPROP_EXT)
  }

  /**
   * Get the Home Folder ID from Box
   * @return the Home Folder ID from Box
   */
  public property get BoxHomeFolderId() : String{
    return this.getRequiredStringProperty("BoxHomeFolderId")
  }

  /**
   * Get the Scope from Box
   * @return the Scope from Box
   */
  public property get BoxScope() : String{
    return this.getRequiredStringProperty("BoxScope")
  }

  /**
   * Get the Home Enterprise ID from Box
   * @return Enterprise ID from Box
   */
  public property get BoxEnterpriseId() : String{
    return this.getRequiredStringProperty("EnterpriseId")
  }

  /**
   * Get the Metadata TemplateKey from Box
   * @return the Metadata TemplateKey from Box
   */
  public property get BoxTemplateKey() : String{
    return this.getRequiredStringProperty("TemplateKey")
  }

}
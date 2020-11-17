package gw.enhancement.claim.servicerequests

uses gw.smoketest.platform.web.IteratorEntries

enhancement SelectServicesPopupTestEnhancement : pcftest.SelectServicesPopup {

  function setService(service : SpecialistService) {
    getServiceNode(service)?._Checkbox.setBoolValue(true)
    this.UpdateServiceRequestServices.click()
  }

  //here we have to tolerate ambiguity, since we don't have the full ancestry and multiple leafs in the tree may have
  //the same name
  function setServiceByName(serviceName : String) {
    getServiceNode({serviceName}, true)?._Checkbox.setBoolValue(true)
    this.UpdateServiceRequestServices.click()
  }

  function getServiceNode(service : SpecialistService): pcftest.SelectServicesPopup.SpecialistServiceTreeLV.entry {
    return getServiceNode(service.Ancestry.map( \ anc -> anc.Name), false)
  }

  function getServiceNode(serviceAncestry : List<String>, ignoreAncestry : boolean) : pcftest.SelectServicesPopup.SpecialistServiceTreeLV.entry {
    return doGetServiceNode(this.SpecialistServiceTreeLV._Entries, {}, serviceAncestry, ignoreAncestry)
  }

  function doGetServiceNode(roots : Iterable<pcftest.SelectServicesPopup.SpecialistServiceTreeLV.entry>,
                            path : Iterable<String>,
                            serviceAncestry : Iterable<String>,
                            ignoreAncestry : boolean) : pcftest.SelectServicesPopup.SpecialistServiceTreeLV.entry {
    for (node in roots) {
      var nodeText = node.ServiceLeaf.Text
      var newPath = path

      if (node._Checkbox != null) {
        if (ignoreAncestry and serviceAncestry.last() == nodeText) {
          return node
        } else {
          newPath = path.concat({nodeText})
          if (newPath.equals(serviceAncestry)) {
            return node
          }
        }
      }

      if (node._Entries.HasElements) {
        var result = doGetServiceNode(node._Entries, newPath, serviceAncestry, ignoreAncestry)
        if (result != null) {
          return result
        }
      }
    }
    return null
  }

  function getServicesCategories() : IteratorEntries <pcftest.SelectServicesPopup.SpecialistServiceTreeLV.entry> {
    return this.SpecialistServiceTreeLV._Entries
  }
}

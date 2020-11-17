package gw.enhancement.admin

enhancement AdminMenuLinksTestEnhancement : pcftest.Admin.MenuLinks {

  function goToExposureRules() : pcftest.ExposureRules {
    this.Admin_BusinessSettings.click()
    return this.Admin_BusinessSettings.BusinessSettings_BusinessRules.BusinessRules_ExposureRules.click()
  }
}

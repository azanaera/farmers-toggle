package gw.enhancement.exposure

enhancement NewClaimPropertyDamageDVTestEnhancement : pcftest.NewClaimPropertyDamageDV {

  property get Dwelling_Incident() : pcftest.NewClaimIncidentInputSet_Dwelling.Dwelling_Incident {
    return this.NewClaimIncidentInputSet_Dwelling.Dwelling_Incident
  }
}
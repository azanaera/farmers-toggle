package gw.enhancement.exposure

enhancement ExposureDetailTestEnhancement : pcftest.ExposureDetail {

  property get BodilyInjuryDamage() : pcftest.ExposureDetailDV_Bodilyinjurydamage {
    return this.ExposureDetailScreen.ExposureDetailDV_Bodilyinjurydamage
  }

  property get MedPay() : pcftest.ExposureDetailDV_Medpay {
    return this.ExposureDetailScreen.ExposureDetailDV_Medpay
  }
  
  property get VehicleDamage() : pcftest.ExposureDetailDV_Vehicledamage {
    return this.ExposureDetailScreen.ExposureDetailDV_Vehicledamage
  }
  
  property get Dwelling() : pcftest.ExposureDetailDV_Propertydamage {
    return this.ExposureDetailScreen.ExposureDetailDV_Dwelling
  }
  
  property get PIPDamages() : pcftest.ExposureDetailDV_Pipdamages {
    return this.ExposureDetailScreen.ExposureDetailDV_Pipdamages
  }

  property get TripCancellationDelay() : pcftest.ExposureDetailDV_TripCancellationDelay {
    return this.ExposureDetailScreen.ExposureDetailDV_TripCancellationDelay
  }

  property get Baggage() : pcftest.ExposureDetailDV_Baggage {
    return this.ExposureDetailScreen.ExposureDetailDV_Baggage
  }

  property get PersonalPropertyDamage() : pcftest.ExposureDetailDV_Personalpropertydamage {
    return this.ExposureDetailScreen.ExposureDetailDV_Personalpropertydamage
  }

  property get PropertyDamage() : pcftest.ExposureDetailDV_Propertydamage  {
    return this.ExposureDetailScreen.ExposureDetailDV_Propertydamage
  }

  property get Content() : pcftest.ExposureDetailDV_Content {
    return this.ExposureDetailScreen.ExposureDetailDV_Content
  }

  property get EmployerLiability() : pcftest.ExposureDetailDV_Employerliability {
    return this.ExposureDetailScreen.ExposureDetailDV_Employerliability
  }

  property get GeneralDamage() : pcftest.ExposureDetailDV_Generaldamage {
    return this.ExposureDetailScreen.ExposureDetailDV_Generaldamage
  }

  property get LivingExpenses() : pcftest.ExposureDetailDV_LivingExpenses {
    return this.ExposureDetailScreen.ExposureDetailDV_LivingExpenses
  }

  property get LossOfUseDamage() : pcftest.ExposureDetailDV_Lossofusedamage {
    return this.ExposureDetailScreen.ExposureDetailDV_Lossofusedamage
  }

  property get LostWages() : pcftest.ExposureDetailDV_Lostwages {
    return this.ExposureDetailScreen.ExposureDetailDV_Lostwages
  }

  property get OtherStructure() : pcftest.ExposureDetailDV_OtherStructure {
    return this.ExposureDetailScreen.ExposureDetailDV_OtherStructure
  }

  property get TowOnly() : pcftest.ExposureDetailDV_Towonly {
    return this.ExposureDetailScreen.ExposureDetailDV_Towonly
  }

  property get WCInjuryDamage() : pcftest.ExposureDetailDV_Wcinjurydamage {
    return this.ExposureDetailScreen.ExposureDetailDV_Wcinjurydamage
  }

}

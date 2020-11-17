package gw.entity

uses gw.config.LOBAbstraction

@Export
enhancement GWPolicyCoveragesEnhancement : entity.Policy {

  /**
   * Returns the appropriate Rental coverage type for this type of policy.
   */
  property get RentalCoverageType() : CoverageType {
    if (LOBAbstraction.ForPolicy.isCommercialAutoPolicy(this)) {
      return CoverageType.TC_BARENTALCOV
    } else if (LOBAbstraction.ForPolicy.isPersonalAutoPolicy(this)) {
      return CoverageType.TC_TMP_RID_COV_PA_EXT
    }
    
    return null
  }
  
  /**
   * Returns the appropriate Auto Bodily Injury coverage type for this type of policy.
   */
  property get AutoBodilyInjuryCoverageType() : CoverageType {
    if (LOBAbstraction.ForPolicy.isCommercialAutoPolicy(this)) {
      return CoverageType.TC_BAOWNEDLIABILITYCOV
    } else if (LOBAbstraction.ForPolicy.isPersonalAutoPolicy(this)) {
      return CoverageType.TC_BOD_INJ_PA_EXT
    }  

    return null
  }

  /**
   * Returns the appropriate Auto Partial Disability coverage type for this type of policy.
   */
//  property get AutoPartialDisabilityCoverageType() : CoverageType {
//    if (LOBAbstraction.ForPolicy.isCommercialAutoPolicy(this)) {
//      return CoverageType.TC_BAOWNEDLIABILITYCOV
//    } else if (LOBAbstraction.ForPolicy.isPersonalAutoPolicy(this)) {
//      return CoverageType.TC_PALIABILITYCOV
//    }
//
//    return null
//  }
  
  /**
   * Returns the appropriate Death coverage type for this type of policy.
   */
//  property get DeathCoverageType() : CoverageType {
//    if (LOBAbstraction.ForPolicy.isCommercialAutoPolicy(this)) {
//      return CoverageType.TC_CADEATHDISABILITYCOV
//    } else if (LOBAbstraction.ForPolicy.isPersonalAutoPolicy(this)) {
//      return CoverageType.TC_PADEATHDISABILITYCOV
//    }
//
//    return null
//  }

  /**
   * Returns the appropriate Property Protection coverage type for this type of policy.
   */
//  property get PropertyProtectionCoverageType() : CoverageType {
//    if (LOBAbstraction.ForPolicy.isCommercialAutoPolicy(this)) {
//      return CoverageType.TC_BAPROPPROTECTIONCOV
//    } else if (LOBAbstraction.ForPolicy.isPersonalAutoPolicy(this)) {
//      return CoverageType.TC_PAPROPPROTECTIONCOV
//    }
//
//    return null
//  }
  
  /**
   * Returns the appropriate Collision coverage type for this type of policy.
   */
  property get CollisionCoverageType() : CoverageType {
    if (LOBAbstraction.ForPolicy.isCommercialAutoPolicy(this)) {
      return CoverageType.TC_BACOLLISIONCOV    
    } else if (LOBAbstraction.ForPolicy.isPersonalAutoPolicy(this)) {
      return CoverageType.TC_COL_PA_EXT
    }
    
    return null
  }
  
  /**
   * Returns the appropriate Underinsured Motorist Injury coverage type for this type of policy.
   */
  property get UnderinsuredMotoristBodilyInjuryCoverageType() : CoverageType {
    if (LOBAbstraction.ForPolicy.isCommercialAutoPolicy(this)) {
      return CoverageType.TC_BAOWNEDUIMBICOV
    } else if (LOBAbstraction.ForPolicy.isPersonalAutoPolicy(this)) {
      return CoverageType.TC_UND_MOT_PA_EXT
    }
    
    return null  
  }
  
  /**
   * Returns the appropriate Uninsured Motorist Injury coverage type for this type of policy.
   */
  property get UninsuredMotoristBodilyInjuryCoverageType() : CoverageType {
    if (LOBAbstraction.ForPolicy.isCommercialAutoPolicy(this)) {
      return CoverageType.TC_BAOWNEDUIMPDCOV
    } else if (LOBAbstraction.ForPolicy.isPersonalAutoPolicy(this)) {
      return CoverageType.TC_UNI_MOT_PA_EXT
    }
    
    return null  
  }
  
  /**
   * Returns the appropriate Comprehensive coverage type for this type of policy.
   */
  property get ComprehensiveCoverageType() : CoverageType {
    if (LOBAbstraction.ForPolicy.isCommercialAutoPolicy(this)) {
      return CoverageType.TC_BACOMPREHENSIVECOV
    } else if (LOBAbstraction.ForPolicy.isPersonalAutoPolicy(this)) {
      return CoverageType.TC_COM_PA_EXT
    }
    
    return null
  }
  
  /**
   * Returns the appropriate Towing coverage type for this type of policy.
   */
  property get TowingCoverageType() : CoverageType {
    if (LOBAbstraction.ForPolicy.isCommercialAutoPolicy(this)) {
      return CoverageType.TC_BATOWINGLABORCOV
    } else if (LOBAbstraction.ForPolicy.isPersonalAutoPolicy(this)) {
      return CoverageType.TC_TOW_AND_ROA_SER_PA_EXT
    }
    
    return null  
  }
  
  /**
   * Returns the appropriate Loss of Use coverage type for this type of policy.
   */
  property get LossOfUseCoverage() : CoverageType {
    if (LOBAbstraction.ForPolicy.isCommercialAutoPolicy(this)) {
      return CoverageType.TC_BALOSSOFUSECOV
    } else if (LOBAbstraction.ForPolicy.isPersonalAutoPolicy(this)) {
      return CoverageType.TC_SD_HUS_BUS_INC_PA_EXT
    }
    
    return null        
  }
  
}

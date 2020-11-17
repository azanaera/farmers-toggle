package gw.entity
uses gw.api.address.ClaimAddressOwner
uses gw.api.address.CCAddressOwner
uses ext.config.api.address.ToggleClaimAddressOwner_Ext
uses gw.api.address.WorkCompClaimAddressOwner

/**
 * Address owner utilities, allowing the claim's loss location to be modified
 * by the generic AddressInputSet PCF file.
 */
@Export
enhancement GWClaimAddressOwnerEnhancement : Claim {

  /** The address owner object required by the AddressInputSet */
  property get AddressOwner() : CCAddressOwner {
    return new ClaimAddressOwner(this)
  }

  /** The address owner object required by the AddressInputSet for WC claims */
  property get WCAddressOwner() : CCAddressOwner {
    return new WorkCompClaimAddressOwner(this)
  }

  /** The address owner object required by the AddressInputSet
   * using Toggle specific required fields */
  property get ToggleAddressOwner_Ext() : CCAddressOwner {
    return new ToggleClaimAddressOwner_Ext(this)
  }

}

package ext.config.api.address

uses gw.api.address.AddressOwnerFieldId
uses gw.api.address.CCAddressOwnerFieldId
uses gw.api.address.ClaimAddressOwner

class ToggleClaimAddressOwner_Ext extends ClaimAddressOwner {

  construct(inClaim : Claim) {
    super(inClaim)
  }

  override property get RequiredFields() : Set<AddressOwnerFieldId> {
    return CCAddressOwnerFieldId.STATE_REQUIRED_Ext
  }
}
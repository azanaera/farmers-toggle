package gw.rest.testsupport.v1.plugin.policy.util

uses gw.entity.IEntityType

/**
 * Utility class for Policy search.
 */
@Export
class PolicySearchUtil {

  private construct() {}

  static function getPolicyInsured(policy : Policy) : Contact {
    return policy.getContactByRole(TC_INSURED)
  }

  private static property get PropertiesOnAddressEntity() : Set<String> {
    var result = new HashSet<String>()
    for (prop in (Address.Type as IEntityType).EntityProperties) {
      result.add(prop.Name)
    }
    return result
  }

  /**
   * Utility method for converting a Policy to a PolicySummary.
   */
  static function convertPolicyToSummary(policy : Policy) : PolicySummary {
    var summary = new PolicySummary()
    var addressProps = PropertiesOnAddressEntity

    if (getPolicyInsured(policy) != null) {
      summary.InsuredName = getPolicyInsured(policy).DisplayName

      var primaryAddress = getPolicyInsured(policy).PrimaryAddress
      if (primaryAddress != null) {
        summary.Address = primaryAddress.AddressLine1
        summary.AddressLine1 = primaryAddress.AddressLine1
        summary.AddressLine2 = primaryAddress.AddressLine2
        summary.City = primaryAddress.City
        summary.State = primaryAddress.State
        summary.PostalCode = primaryAddress.PostalCode

        // Some configurations may remove these properties, so only copy the ones that exist
        if (addressProps.contains("AddressLine1Kanji")) {
          summary.AddressLine1Kanji = primaryAddress["AddressLine1Kanji"] as String
        }
        if (addressProps.contains("AddressLine2Kanji")) {
          summary.AddressLine2Kanji = primaryAddress["AddressLine2Kanji"] as String
        }
        if (addressProps.contains("CityKanji")) {
          summary.CityKanji = primaryAddress["CityKanji"] as String
        }
      }
    }

    summary.EffectiveDate = policy.EffectiveDate
    summary.ExpirationDate = policy.ExpirationDate
    summary.PolicyNumber = policy.PolicyNumber

    summary.PolicyType = policy.PolicyType
    summary.Status = policy.Status
    summary.ProducerCode = policy.ProducerCode

    for (var vehicleRU in policy.Vehicles) {
      var psVehicle = new PolicySummaryVehicle()
      var vehicle = vehicleRU.Vehicle
      psVehicle.PolicySystemId = vehicleRU.PolicySystemId
      psVehicle.Color = vehicle.Color
      psVehicle.LicensePlate = vehicle.LicensePlate
      psVehicle.Make = vehicle.Make
      psVehicle.Model = vehicle.Model
      psVehicle.SerialNumber = vehicle.SerialNumber
      psVehicle.State = vehicle.State
      psVehicle.VehicleNumber = vehicleRU.RUNumber
      psVehicle.Vin = vehicle.Vin
      psVehicle.Selected = false
      summary.addToVehicles(psVehicle)
    }

    for (var locationBasedRU in policy.Properties) {
      var location = locationBasedRU.PolicyLocation
      var building = locationBasedRU.Building
      var address = location.Address

      var psProperty = new PolicySummaryProperty()
      psProperty.PolicySystemId = locationBasedRU.PolicySystemId
      psProperty.PropertyNumber = locationBasedRU.RUNumber
      psProperty.Location = location.LocationNumber

      if (building != null) {
        psProperty.BuildingNumber = building.BuildingNumber
      }

      if (address != null) {
        psProperty.Address = address.AddressLine1
        psProperty.AddressLine1 = address.AddressLine1
        psProperty.AddressLine2 = address.AddressLine2
        psProperty.City = address.City

        // Some configurations may remove these properties, so only copy the ones that exist
        if (addressProps.contains("AddressLine1Kanji")) {
          psProperty.AddressLine1Kanji = address["AddressLine1Kanji"] as String
        }
        if (addressProps.contains("AddressLine2Kanji")) {
          psProperty.AddressLine2Kanji = address["AddressLine2Kanji"] as String
        }
        if (addressProps.contains("CityKanji")) {
          psProperty.CityKanji = address["CityKanji"] as String
        }
      }
      
      psProperty.Selected = false
      summary.addToProperties(psProperty)
    }
    return summary
  }
}

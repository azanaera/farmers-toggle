package gw.cucumber.context.api.common

/**
 * Methods related to assignments
 */
interface AssignmentContext {

  /**
   * Assign claim to the current user
   */
  function assignClaimToCurrentUser()

  /**
   * Assign claim to the given group and user
   *
   * @param groupName The name of the group to assign the claim
   * @param userDisplayName The display name of a user on the given group
   */
  function setClaimAssignedGroupAndUser(groupName : String, userDisplayName : String)

  /**
   * Assign exposure to the given group and user
   *
   * @param groupName The name of the group to assign the exposure
   * @param userDisplayName The display name of a user on the given group
   */
  function setExposureAssignedGroupAndUser(groupName : String, userDisplayName : String)

  /**
   * Assign activity to the given group and user
   *
   * @param groupName The name of the group to assign the activity
   * @param userDisplayName The display name of a user on the given group
   */
  function setActivityAssignedGroupAndUser(groupName : String, userDisplayName : String)

  /**
   * Reassign claim using automated assignment rules
   */
  function reassignClaimThroughAutomatedAssignment()

  /**
   * Reassign exposure using automated assignment rules
   */
  function reassignExposureThroughAutomatedAssignment()

  /**
   * Reassign claim to the given group and user
   *
   * @param groupName The name of the group to reassign the claim
   * @param userDisplayName The display name of a user on the given group
   */
  function reassignClaimToGroupAndUser(groupName : String, userDisplayName : String)

  /**
   * Reassign exposure to the given group and user
   *
   * @param groupName The name of the group to reassign the exposure
   * @param userDisplayName The display name of a user on the given group
   */
  function reassignExposureToGroupAndUser(groupName : String, userDisplayName : String)

  /**
   * Reassign activity to the given group and user
   *
   * @param groupName The name of the group to reassign the activity
   * @param userDisplayName The display name of a user on the given group
   */
  function reassignActivityToGroupAndUser(groupName : String, userDisplayName : String)

  /**
   * Verify claim is assisgned to a user in the given group
   *
   * @param groupName The name of the expected group
   */
  function verifyClaimAssignedToUserInGroup(groupName : String)

  /**
   * Verify claim is assigned to the given group
   *
   * @param groupName The name of the expected group
   */
  function verifyClaimAssignedGroup(groupName : String)

  /**
   * Verify claim is assigned to the given user
   *
   * @param userDisplayName The display name of the expected user
   */
  function verifyClaimAssignedUser(userDisplayName : String)


  /**
   * Verify exposure is assigned to the give group
   *
   * @param groupName The name of the expected group
   * @param coverageTypeText Exposure's coverage type
   */
  function verifyExposureAssignedGroup(groupName : String, coverageTypeText : String = null)

  /**
   * Verify exposure is assigned to the given user
   *
   * @param userDisplayName The display name of the expected user
   * @param coverageTypeText Exposure's coverage type
   */
  function verifyExposureAssignedUser(userDisplayName : String, coverageTypeText : String = null)

  /**
   * Verify activity is assigned to the given group
   *
   * @param groupName The name of the expected group
   */
  function verifyActivityAssignedGroup(groupName : String)

  /**
   * Verify activity is assigned to the given user
   *
   * @param userDisplayName The display name of the expected user
   */
  function verifyActivityAssignedUser(userDisplayName : String)

  /**
   * Verify exposure is assigned to the same group and user with its claim
   *
   * @param coverageTypeText Exposure's coverage type
   */
  function verifyExposureAssignedToClaimOwner(coverageTypeText : String = null)

  /**
   * Assign the Service Request
   */
  function assignServiceRequest()
}
package gw.rest.core.pl.util.v1

uses entity.Activity

@SuppressWarnings("unused")
@Export
class ActivityInternalPermissionUtil {
  static function canApprove(activity : Activity) : boolean {
    // Cannot directly use perm.Activity.approve(activity) because it throws unless ActivityType is Approval
    return activity.AssignmentStatus == TC_ASSIGNED && activity.AssignedUser == User.util.CurrentUser
        || perm.Activity.approveany
  }

  static function canAssign(activity : Activity) : boolean {
    // Cannot directly use perm.Activity.assignfromqueue because it checks AssignmentQueuesEnabled config param
    return (activity.AssignedQueue == null || perm.System.actown && perm.System.actqueueassign)
        && perm.Activity.assign(activity)
  }
}
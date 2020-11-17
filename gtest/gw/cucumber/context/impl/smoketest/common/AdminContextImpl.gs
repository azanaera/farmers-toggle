package gw.cucumber.context.impl.smoketest.common

uses cucumber.api.DataTable
uses gw.api.admin.PublicRoleFinder
uses gw.api.database.Query
uses gw.api.database.Relop
uses gw.api.databuilder.AuthorityLimitBuilder
uses gw.api.databuilder.AuthorityLimitProfileBuilder
uses gw.api.databuilder.CCRolePrivilegeBuilder
uses gw.api.databuilder.GroupBuilder
uses gw.api.databuilder.RolePrivilegeBuilder
uses gw.api.databuilder.UserBuilder
uses gw.cucumber.CucumberStepBase
uses gw.cucumber.context.api.common.AdminContext
uses gw.cucumber.transformer.CurrencyAmountTransformer
uses gw.cucumber.transformer.TypelistTransformer
uses gw.pl.logging.LoggerCategory
uses entity.UserRole
uses gw.plugin.util.CurrentUserUtil

@SuppressWarnings("unused")
class AdminContextImpl extends CucumberStepBase implements AdminContext {
  override function createAndSetUserWithRole(roleString : String) {
    if (testSampleDataNeedsToBeLoaded()) {
      loadTestSampleData()
    }
    var rootGroup = gw.api.database.Query.make(entity.Group).compare(Group#PublicID, Equals, "systemTables:1").select().AtMostOneRow

    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      var role = new PublicRoleFinder().allOrderedByName().firstWhere(\role -> role.Name.equalsIgnoreCase(roleString))
      if (role == null) {
        throw new IllegalArgumentException("Could not find the role with name: ${roleString}")
      }

      // generate the user name based on the given role. For example, for Adjuster the username would be user_adjuster
      var username = ("user_" + roleString.toLowerCase().split(" ").join("_")).safeSubstring(0, 29)

      if (!userExists(username)) {
        new UserBuilder()
            .withName("User", roleString.safeSubstring(0, 29))
            .withRole(role)
            .withCredential(username)
            .withGroup(rootGroup)
            .create(bundle)
      }
      CurrentUser = username
    }, User.util.UnrestrictedUser)

    loginAsUser(CurrentUser)
  }

  /**
   * When test sample data is loaded it executes SampleSeczonesRegions.testSampleData() creating many SecurityZones.
   * When the test sample data has not been loaded the number of SecurityZones is 1.
   * We will leave a <= 1 in the comparison just for the unlikely case of not having any SecurityZone at all, in wich case we still need to load the sample data
   * @return true if the test sample data needs to be loaded, false otherwise
   */
  private function testSampleDataNeedsToBeLoaded() : boolean {
    var numberOfSecurityZones = Query.make(SecurityZone).select().Count
    return numberOfSecurityZones <= 1;
  }

  public function ensureUserHasRole(roleString : String) {
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      var role = new PublicRoleFinder().allOrderedByName().firstWhere(\role -> role.Name.equalsIgnoreCase(roleString))
      if (role == null) {
        throw new IllegalArgumentException("Could not find the role with name: ${roleString}")
      }
      bundle.add(role)
      var user = getUserByUsername(CurrentUser)
      bundle.add(user)
      if (!user.hasRole(role)) {
        var userRole = new UserRole(bundle)
        userRole.setRole(role)
        user.addToRoles(userRole)
      }
    }, User.util.UnrestrictedUser)
  }

  override function setAuthorityLimits(table : DataTable) {
    var authorityLimitMaps = table.asMaps(String, String)

    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      var profile = AuthorityLimitProfileBuilder.uiReadyProfile()
          .withUniqueName()

      for (map in authorityLimitMaps) {
        var limitType = new TypelistTransformer<AuthorityLimitType>().transform(map.get(DK_LIMIT_TYPE))
        var currencyAmount = new CurrencyAmountTransformer().transform(map.get(DK_LIMIT_AMOUNT))
        profile.withLimit(limitType, currencyAmount)
      }

      var user = bundle.add(getUserByUsername(CurrentUser))
      user.setAuthorityProfile(profile.createAndCommit())
    }, User.util.UnrestrictedUser)
  }

  override function grantAuthorityProfileToCurrentUser(profileString : String) {
    var profile = Query.make(AuthorityLimitProfile)
        .compareIgnoreCase(AuthorityLimitProfile#Name, Equals, profileString)
        .select().AtMostOneRow

    if (profile == null) {
      throw new IllegalArgumentException("Could not find the authority limit profile with name: ${profileString}")
    }

    var user = getUserByUsername(CurrentUser)

    if (user == null) {
      throw new IllegalArgumentException("Could not find the user with username: ${CurrentUser}")
    }

    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      user = bundle.add(user)
      user.AuthorityProfile = profile
    }, User.util.UnrestrictedUser)
  }

  override function addToGroupWithSecurityZone(securityZone : String) {
    var user = getUserByUsername(CurrentUser)
    var groupsInSecurityZone = user.GroupUsers*.Group.where(\group -> group.SecurityZone.Name.containsIgnoreCase(securityZone))
    if (groupsInSecurityZone.HasElements) {
      LoggerCategory.TEST.info("${CurrentUser} is already part of a group (${groupsInSecurityZone.join(", ")}) in the Security Zone, ${securityZone}")
    } else {
      gw.transaction.Transaction.runWithNewBundle(\bundle -> {
        var groupUser : GroupUser
        var groupQuery = Query.make(GroupUser).join("Group").join("SecurityZone").compare("Name", Relop.Equals, securityZone).select().first()
        bundle.add(user)

        if (groupQuery != null) {
          bundle.add(groupQuery)
          groupUser = groupQuery
        } else {
          groupUser = new GroupUser(bundle)
          groupUser.setGroup(new GroupBuilder().withName("Group${securityZone}".toLowerCase().split(" ").join("_"))
              .withSecurityZone(Query.make(SecurityZone).compare("Name", Relop.Equals, securityZone).select().AtMostOneRow)
              .create(bundle))
          LoggerCategory.TEST.info("Created GroupUser: ${groupUser.Group.Name}")
        }
        user.addToGroupUsers(groupUser)
      }, User.util.UnrestrictedUser)
    }
  }

  override function setPermission(perm : String) {
    var user = getUserByUsername(CurrentUser)
    var priv = new TypelistTransformer<SystemPermissionType>().transform(perm)
    if (not user.Roles.first().Role.Privileges.hasMatch(\elt -> elt.Permission == priv)) {
      gw.transaction.Transaction.runWithNewBundle(\bundle -> {
        user.Roles.first().Role.addToPrivileges(new CCRolePrivilegeBuilder()
            .withPermission(priv)
            .create(bundle)
        )
      }, User.util.UnrestrictedUser)
    }
  }

  private function userExists(username : String) : boolean {
    return Query.make(Credential)
        .compare(Credential#UserName, Equals, username)
        .select()
        .HasElements
  }

  override function setCurrentTime(date : String) {
    setCurrentSystemTime(date)
  }

  override function noLoadfactorOnGroupUsers(groupName : String) {
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      var group = Query.make(Group)
          .compare(Group#Name, Equals, groupName)
          .select()
          .AtMostOneRow

      group = bundle.add(group)
      for (user in group.Users) {
        user.setLoadFactor(null)
      }
    }, User.util.UnrestrictedUser)
  }

}
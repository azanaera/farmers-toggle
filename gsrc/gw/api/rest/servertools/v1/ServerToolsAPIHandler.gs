package gw.api.rest.servertools.v1

uses com.guidewire.pl.system.database.upgrade.rolling.UpgradeStateMachine
uses com.guidewire.pl.system.dependency.PLDependencies
uses com.guidewire.pl.system.server.InitTab
uses com.guidewire.pl.system.server.RunlevelAdapter
uses gw.api.rest.Response
uses gw.api.rest.RequestContext
uses gw.api.tools.ClusterMembersData
uses gw.api.tools.UpgradeInfoPageHelper
uses gw.api.webservice.systemTools.SystemRunlevel

@Export
class ServerToolsAPIHandler {

  private var rollingUpdateHelper : UpgradeInfoPageHelper
  private var clusterHelper : ClusterMembersData

  construct() {
    rollingUpdateHelper = new UpgradeInfoPageHelper()
    clusterHelper = new ClusterMembersData()
  }

  function startRollingUpdate() : Response {
    UpgradeStateMachine.startRollingUpgrade()
    return getRollingUpdateStatus()
  }

  function stopRollingUpdate() : Response {
    if (!rollingUpdateHelper.DatabaseWorkInProgress and !rollingUpdateHelper.BackOutInProgress) {
      if (rollingUpdateHelper.DatabaseWorkDone) {
        rollingUpdateHelper.rollingUpgradeComplete()
      } else if (rollingUpdateHelper.UpgradeJustStarted) {
        rollingUpdateHelper.cancelRollingUpgrade()
      } else {
        rollingUpdateHelper.startProcessToCompleteRollingUpgradeBackOut()
      }
    }
    return getRollingUpdateStatus()
  }

  function getRollingUpdateStatus() : Response {
    var result = com.guidewire.pl.system.database.upgrade.rolling.UpgradeStateMachine.isRollingUpgradeProcessInProgress();
    return Response
        .status(200)
        .entity("Rolling update status: " + result)
        .build()
  }

  /*function isAlive(ctx: RequestContext) : Response {
    var contextPath = ctx.RawRequest.getContextPath()
    return Response.status(301).header("location", "${contextPath}/rest/system/v1/server/health/live").build()
  }*/

  function isAlive() : Response {
    var runLevel = InitTab.getInstance().getRunLevelNoLock()
    var runLevelCode = RunlevelAdapter.itoe(runLevel)
    var isRunning = runLevelCode == SystemRunlevel.MAINTENANCE.Code
            or runLevelCode == SystemRunlevel.DAEMONS.Code
            or runLevelCode == SystemRunlevel.MULTIUSER.Code
    var isReadyForShutdown = PLDependencies.getPlannedShutdownManager().isReadyForShutdown()
    var isAlive = isRunning and not isReadyForShutdown
    return Response
        .status(isAlive ? 200 : 503)
        .build()
  }

  function stopLocalhost(minutes: Integer, killBatch: Boolean) : Response {

    var ServerId = clusterHelper.ServerId
    var ShutdownMessageDisplayKey = "Web.TabBar.SystemAlertBar.PlannedShutdown.ScaleInMessage"
    var ShutdownMessage = "Rolling Update is starting..."
    var ShutdownTime = gw.api.util.DateUtil.addMinutes(gw.api.util.DateUtil.currentDate(), minutes)

    new gw.api.tools.ClusterMembersData().schedulePlannedShutdown(ServerId, new gw.api.system.server.ShutdownOptions(ShutdownMessageDisplayKey, ShutdownMessage, ShutdownTime, false, killBatch))

    return Response
        .status(200)
        .entity("Shutdown server id: " + ServerId)
        .build()
  }
}

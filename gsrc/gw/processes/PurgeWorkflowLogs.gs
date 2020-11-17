/**
 * This is a batch process that clears out completed workflow logs that are <N> days old.
 *
 * @param WorkflowLogPurgeDaysOld The number of days old to use for purging older WorkflowLogs
 * @param WorkflowLogPurgeRowLimit The number of rows to limit an individual database Delete statement
 *
 * This new version uses streaming DELETE statements to delete the old WorkflowLogs.  The rowLimit parameter
 * limits the number of logs to delete in a single database request.  Note that if the value is set to zero
 * the code will always process all available WorkflowLogs in a single streaming DELETE statement.
 */
package gw.processes

uses com.guidewire.pl.system.database.DatabaseDependencies
uses com.guidewire.pl.system.database.ChunkingProcessor
uses com.guidewire.pl.system.database.impl.QueryImpl
uses com.guidewire.pl.system.database.metadata.TableMetadata
uses com.guidewire.pl.system.database.query.DefaultPreparedUpdateStatementHandler
uses com.guidewire.pl.system.database.query.DeleteBuilder
uses com.guidewire.pl.system.database.query.impl.QueryExpressions
uses com.guidewire.pl.system.database.query.impl.QueryExpressionToSQLData
uses com.guidewire.pl.system.transaction.ConnectionHandlerFactory
uses gw.api.database.IQueryBeanResult
uses gw.api.database.InOperation
uses gw.api.database.Queries
uses gw.api.database.Query
uses gw.api.database.Relop
uses gw.api.system.PLConfigParameters
uses gw.api.upgrade.Coercions
uses gw.api.util.DateUtil

@Export
class PurgeWorkflowLogs extends BatchProcessBase
{
  var _daysOld = PLConfigParameters.WorkflowLogPurgeDaysOld.Value
  var _rowLimit = PLConfigParameters.WorkflowLogPurgeRowLimit.Value

  construct() {
    this(null)
  }

  construct(daysOld : int, rowLimit : int) {
    this({daysOld, rowLimit})
  }
  
  private construct(arguments : Object[]) {
    super(TC_PURGEWORKFLOWLOGS)
    if (arguments != null) {
      _daysOld = arguments[0] != null ? (Coercions.makeIntFrom(arguments[0])) : _daysOld
      _rowLimit = arguments[1] != null ? (Coercions.makeIntFrom(arguments[1])) : _rowLimit
    }
  }

  private function buildRestrictionToRetrieveOldEntries (query : Query, daysOld : int) {
    query.and(\r -> {
      r.subselect("Workflow", InOperation.CompareIn, Query.make(Workflow), "ID").compare(Workflow.STATE_PROP.get(), Relop.Equals, WorkflowState.TC_COMPLETED)
      r.compare(WorkflowLogEntry.LOGDATE_PROP.get(), Relop.LessThan, DateUtil.currentDate().addDays(-daysOld))
    })
  }

  // Legacy: used in Policy Center
  function getQueryToRetrieveOldEntries( daysOld : int ) : IQueryBeanResult<KeyableBean> {
    var query = Query.make(WorkflowLogEntry)
    buildRestrictionToRetrieveOldEntries (query, _daysOld)
    return query.select()
  }

  override function doWork() : void {
    final var querySupport = DatabaseDependencies.getDatabase().getDBSupport().getQuerySupport()

    // Build simple query with restriction
    var query = Queries.createQuery(WorkflowLogEntry)
    buildRestrictionToRetrieveOldEntries(query, _daysOld)

    // Construct select statement from query restriction
    var queryImpl : QueryImpl = query.getRawQuery().deepClone();
    final var queryTableName = TableMetadata.getTableName(query.getEntityType())
    queryImpl.setRootName(queryTableName);
    var selectStatement = QueryExpressionToSQLData.getSQLData(QueryExpressions.createQueryExpression(queryImpl, false,
                              Collections.emptyList(), Collections.emptyList(), 0, ChunkingProcessor.NO_CHUNKING))

    // If rowLimit is set to a positive value attempt to breakup DELETE into multiple smaller updates
    if (_rowLimit > 0 && querySupport.canApplyRowNumLimit(query.getRawQuery(), selectStatement.getSqlText().toString())) {
      // TODO : this should be moved into DeleteBuilder() for other batch processes like FormTextDataDelete, PurgeMessageHistory, etc...
      // TODO : limit total number of operations per-execution to a configurable limit, not just Expected...this for Cloud providers like AWS
      try {
        ConnectionHandlerFactory.reserve()
        var connection = ConnectionHandlerFactory.getActiveConnection()

        // Add the row limit to the select statement, note that the getSelectLimitedByRowCount() handles each DB type
        var selectLimitedByRowCountSql = querySupport.getSelectLimitedByRowCount(selectStatement.getSqlText().toString(), _rowLimit)

        // Convert select statement to delete with subselect, we need to add the linking column between the delete and subselect here
        // {SQLSERVER} DELETE /* pc:PurgeWorkflowLogs; */ FROM pc_workflowlog WHERE pc_workflowlog.ID IN (SELECT TOP(1024) pc_workflowlog.ID FROM pc_workflowlog ...);
        var deleteFromSelectSql = "DELETE /* pc:PurgeWorkflowLogs; */ FROM " + queryTableName + " WHERE " + queryTableName + ".ID IN (" +
              selectLimitedByRowCountSql.replaceFirst("FROM", queryTableName + ".ID FROM").replaceFirst("/\\* pc:PurgeWorkflowLogs; \\*/ ", "") +
            ")"

        var completed = 0
        var rowCount = new int[1]
        var preparedUpdateStatementHandler = new DefaultPreparedUpdateStatementHandler(deleteFromSelectSql, selectStatement.getValues(), false)
        do {
          rowCount[0] = connection.executeUpdate(preparedUpdateStatementHandler)
          if (rowCount[0] <= 0) {
            break
          }
          connection.executeUpdate("commit")
          completed += rowCount[0]
        } while (rowCount[0] > 0)
        setOperationsCompleted(completed);
      } finally {
        ConnectionHandlerFactory.release()
      }
    } else {
      // Simple streaming DeleteBuilder...
      setOperationsCompleted(new DeleteBuilder(query).execute())
    }
  }
}

package ext.config.api.financials

uses gw.api.database.IQueryBeanResult
uses gw.api.database.Query
uses gw.api.database.Relop
uses gw.api.filters.StandardQueryFilter
uses gw.processes.WorkQueueBase
uses entity.Transaction

class ReserveAndRecoveryReservesEscalationWorkQueue extends WorkQueueBase<Transaction, StandardWorkItem> {

  construct() {
    super(BatchProcessType.TC_TOGGLE_RESERVEANDRECOVERYRESERVEESCALATION_EXT, StandardWorkItem, Transaction)
  }

  /**
   * Finds any reserves or recovery reserves with a submittion status and adds them to the work queue
   * @return
   */
  override function findTargets() : Iterator<Transaction> {
    return getReservesAndRecoveryReserves().iterator()
  }

  /**
   * Takes a reserve or recovery reserve from the work queue and changes the status from submitting to submitted.
   * @param item
   */
  override function processWorkItem(item : StandardWorkItem) {
    gw.transaction.Transaction.runWithNewBundle( \ bundle -> {
      var transaction = extractTarget(item) as Transaction
      transaction = bundle.add(transaction)
      transaction.acknowledgeSubmission()
    })
  }

  /**
   * Will return any reserve or recovery reserve with a submitting status
   * @return
   */
  private function getReservesAndRecoveryReserves(): IQueryBeanResult<Transaction> {
    var results =  Query.make(Transaction).compare(Transaction#Status,Relop.Equals,TransactionStatus.TC_SUBMITTING).select()
    var queryFilterReserveOrRecoveryReserve = new StandardQueryFilter("Reserve Or RecoveryReserve",
        \ query -> {query.or( \ orCriteria -> {
          orCriteria.compare(Transaction#Subtype, Equals, typekey.Transaction.TC_RESERVE)
          orCriteria.compare(Transaction#Subtype, Equals, typekey.Transaction.TC_RECOVERYRESERVE)
        })
        })
    results.addFilter(queryFilterReserveOrRecoveryReserve)
    return results
  }
}
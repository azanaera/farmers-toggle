package ext.config.api.financials

uses gw.api.database.IQueryBeanResult
uses gw.api.database.Query
uses gw.api.database.Relop
uses gw.processes.WorkQueueBase

class RecoveryEscalationWorkQueue extends WorkQueueBase<Recovery, StandardWorkItem> {

  private final var recoveryStatusesRequiringProcessing = {TransactionStatus.TC_PENDINGVOID,
      TransactionStatus.TC_PENDINGRECODE,TransactionStatus.TC_PENDINGTRANSFER,TransactionStatus.TC_SUBMITTING}

  construct() {
    super(BatchProcessType.TC_TOGGLE_RECOVERYESCALATION_EXT, StandardWorkItem, Recovery)
  }

  /**
   * Finds any recovery with a status of PendingRecode, PendingVoid or PendingTransfer and adds it to the work queue
   * for processing
   * @return
   */
  override function findTargets() : Iterator<Recovery> {
    return Query.make(Recovery).compareIn(Recovery#Status, recoveryStatusesRequiringProcessing.toTypedArray()).select().iterator()
  }

  /**
   * Takes a Recovery from the work queue and changes the status of the recovery in the following way:
   * PendingRecode -> Recoded
   * PendingVoid -> Voided
   * PendingTransfer -> Transfered
   * @param item
   */
  override function processWorkItem(item : StandardWorkItem) {
    gw.transaction.Transaction.runWithNewBundle( \ bundle -> {
      var recovery = extractTarget(item) as Recovery
      recovery = bundle.add(recovery)
      switch(recovery.Status){
        case TransactionStatus.TC_SUBMITTING:
          if(not recovery.isOffsetRecovery()){
            recovery.acknowledgeSubmission()
          }
          break
        case TransactionStatus.TC_PENDINGRECODE:
          recovery.acknowledgeRecode()
          break
        case TransactionStatus.TC_PENDINGVOID:
          recovery.acknowledgeVoid()
          break
        case TransactionStatus.TC_PENDINGTRANSFER:
          recovery.acknowledgeTransfer()
          break
      }
    })
  }
}
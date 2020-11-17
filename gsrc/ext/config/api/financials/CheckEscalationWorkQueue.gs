package ext.config.api.financials

uses gw.api.database.IQueryBeanResult
uses gw.api.database.Query
uses gw.processes.WorkQueueBase


class CheckEscalationWorkQueue extends WorkQueueBase<Check, StandardWorkItem> {

  private final var checkStatusesRequiringProcessing = {TransactionStatus.TC_PENDINGVOID,TransactionStatus.TC_PENDINGSTOP
      ,TransactionStatus.TC_PENDINGTRANSFER,TransactionStatus.TC_NOTIFYING}

  construct() {
    super(BatchProcessType.TC_TOGGLE_CHECKESCALATION_EXT, StandardWorkItem, Check)
  }

  /**
   * Takes a Check from the work queue and advances the status of the check and its payments
   * @param item
   */
  override function processWorkItem(item : StandardWorkItem) {
    gw.transaction.Transaction.runWithNewBundle( \ bundle -> {
      var check = extractTarget(item) as Check
      check = bundle.add(check)
      processCheck(check)
    })
  }

  /**
   * Finds checks that require processing and adds them to the work queue
   * @return
   */
  override function findTargets() : Iterator<Check> {
    return getChecks().iterator()
  }

  /**
   * returns all checks with a status of PendingVoid, PendingStop, PendingTranser or Notifying for processing.
   * @return
   */
  private function getChecks(): IQueryBeanResult<Check> {
    return Query.make(Check).compareIn(Check#Status, checkStatusesRequiringProcessing.toTypedArray()).select()
  }

  /**
   * Changes the status of a check and its payments in the following ways:
   * PendingVoid -> Voided
   * PendingStop -> Stopped
   * PendingTransfer -> Transfered
   * Notifying -> Issued
   * @param check
   */
  private function processCheck(check: Check) {
    switch (check.Status){
      case TransactionStatus.TC_PENDINGVOID:
        check.updateCheckStatus(null, null, TransactionStatus.TC_VOIDED)
        for(payment in check.Payments.where(\elt -> elt.Status == TransactionStatus.TC_SUBMITTING)) {
          payment.acknowledgeSubmission()
        }
        break
      case TransactionStatus.TC_PENDINGSTOP:
        check.updateCheckStatus(null,null,TransactionStatus.TC_STOPPED)
        for(payment in check.Payments.where(\elt -> elt.Status == TransactionStatus.TC_SUBMITTING)){
          payment.acknowledgeSubmission()
        }
        break
      case TransactionStatus.TC_PENDINGTRANSFER:
        check.acknowledgeTransfer()
        break
      case TransactionStatus.TC_NOTIFYING:
        check.acknowledgeSubmission()
        break
    }
  }


}
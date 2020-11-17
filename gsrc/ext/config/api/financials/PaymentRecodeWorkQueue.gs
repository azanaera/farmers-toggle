package ext.config.api.financials

uses gw.api.database.IQueryBeanResult
uses gw.api.database.Query
uses gw.api.database.Relop
uses gw.processes.WorkQueueBase

class PaymentRecodeWorkQueue extends WorkQueueBase<Payment, StandardWorkItem> {

  construct() {
    super(BatchProcessType.TC_TOGGLE_PAYMENTRECODE_EXT, StandardWorkItem, Payment)
  }

  /**
   * finds any payments with a status of pending recode and adds them to the work queue
   * @return
   */
  override function findTargets() : Iterator<Payment> {
    return getPayments().iterator()
  }

  /**
   * processes payments from the work queue and changes the status from pending recode to recoded.
   * @param item
   */
  override function processWorkItem(item : StandardWorkItem) {
    gw.transaction.Transaction.runWithNewBundle( \ bundle -> {
      var payment = extractTarget(item) as Payment
      payment = bundle.add(payment)
      payment.acknowledgeRecode()
    })
  }

  /**
   * returns all payments with a status of pending recode for processing.
   * @return
   */
  private function getPayments(): IQueryBeanResult<Payment> {
    return Query.make(Payment).compare(Payment#Status, Relop.Equals,TransactionStatus.TC_PENDINGRECODE).select()
  }
}
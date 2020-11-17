package gw.cucumber.context.api.common

uses cucumber.api.DataTable
uses gw.api.locale.DisplayKey

/**
 * Methods related to financials
 */
interface FinancialsContext {

  final static var DK_AMOUNT : String = DisplayKey.get("LV.Financials.EditableRecoveryLineItems.RecoveryLineItem.Amount")
  final static var DK_APPROVE : String = DisplayKey.get("Web.DesktopActivities.Approve")
  final static var DK_APPROVE_PAYMENT : String = DisplayKey.get("AdminData.ActivityPattern.Subject.Approve_Payment")
  final static var DK_APPROVE_RESERVE_CHANGE : String = DisplayKey.get("AdminData.ActivityPattern.Subject.Approve_Reserve_Change")
  final static var DK_CHECK_AMOUNT : String = DisplayKey.get("LV.Claim.ServiceRequest.Invoice.CheckAmount")
  final static var DK_CLAIM : String = DisplayKey.get("Claim")
  final static var DK_CLAIM_LEVEL : String = DisplayKey.get("Web.Financials.Exposure.ClaimLevel")
  final static var DK_COST_CATEGORY : String = DisplayKey.get("Web.Financials.ReserveLineInputSet.CostCategory")
  final static var DK_COST_TYPE : String = DisplayKey.get("Web.Financials.ReserveLineInputSet.CostType")
  final static var DK_COVERAGE : String = DisplayKey.get("LV.Financials.Payments.CoverageType")
  final static var DK_ERODING : String = DisplayKey.get("NVV.Financials.SubView.PaymentBasics.Payment.Eroding")
  final static var DK_EXPECTED_RECOVERY : String = DisplayKey.get("LV.Claim.Subro.AdversePartyList.ExpectedRecoveryAmount")
  final static var DK_EXPOSURE : String = DisplayKey.get("LV.Financials.Payments.Exposure")
  final static var DK_EXPOSURE_CLAIM_LEVEL : String = DisplayKey.get("Web.Financials.Exposure.ClaimLevel")
  final static var DK_LIABILITY : String = DisplayKey.get("NVV.Claim.Subro.AdverseParty.PartyDetails.Liability")
  final static var DK_NEW : String = DisplayKey.get("Web.Financials.ReserveLineInputSet.ReserveLine.New")
  final static var DK_NEW_OPEN_RECOVERY_RESERVES : String = DisplayKey.get("LV.Financials.RecoveryReserveSet.NewOpenRecoveryReserves")
  final static var DK_NONE : String = DisplayKey.get("LV.Financials.Check.Invoices.InvoiceReferenceNumberMissing")
  final static var DK_PAYMENTS : String = DisplayKey.get("Financials.Transaction.ViewPayments")
  final static var DK_PAYMENT_TYPE : String = DisplayKey.get("NVV.Financials.NewPaymentDetail.Payment.PaymentType")
  final static var DK_RECOVERY_CATEGORY : String = DisplayKey.get("Web.Financials.Summary.RecoveryCategory")
  final static var DK_RECOVERY_RESERVES : String = DisplayKey.get("Financials.Transaction.ViewRecoveryReserves")
  final static var DK_RESERVING_CURRENCY : String = DisplayKey.get("Web.Financials.ReserveLineInputSet.ReservingCurrency")
  final static var DK_RESPONSIBLE_PARTY : String = DisplayKey.get("LV.Claim.Subro.AdversePartyList.Contact")
  final static var KEY_CHECK_STATUS : String = "Check Status"
  final static var KEY_LEVEL : String = "Level"
  final static var KEY_LINE_ITEM_CATEGORY : String = "Line Item Category"
  final static var KEY_PAYMENT_STATUS : String = "Payment Status"
  final static var KEY_RESERVE_AMOUNT : String = "Reserve Amount"
  final static var MSG_ERROR_RECOVERY_RESERVE_EXPOSURE : String = "The exposure of recovery reserve"

  /**
   * Create an reserve on the exposure using builders
   *
   * @param amountString       reserve's available amount and currency
   * @param costTypeString     reserve's cost type
   * @param costCategoryString reserve's cost category
   */
  function createExistingReserves(amountString : String, costTypeString : String, costCategoryString : String)

  /**
   * Create reserves on the exposure using builders
   *
   * @param table - Cost Type       -   String   -   The cost type of the reserve
   *              - Cost Category   -   String   -   The cost category of the reserve
   *              - Amount          -   String   -   The amount to be reserved
   *              e.g
   *              | Cost Type  | Cost Category | Amount   |
   *              | Claim Cost | Auto body     | 2500 USD |
   */
  function createExistingReserves(table : DataTable)

  /**
   * Create a payment on the exposure using builders
   *
   * @param amountString      payment's amount and currency
   * @param paymentTypeString payment's type
   */
  function createExistingPayment(amountString : String, paymentTypeString : String)

  /**
   * Make an exposure level payment in UI
   *
   * @param amountString      payment's amount and currency
   * @param paymentTypeString payment's type
   */
  function createPayment(amountString : String, paymentTypeString : String)

  /**
   * Make an exposure level payment and on the given reserve line in UI
   *
   * @param amountString       payment's amount and currency
   * @param paymentTypeString  payment's type
   * @param costTypeString     reserve line cost type
   * @param costCategoryString reserve line cost category
   */
  function createPaymentOnAReserveLine(amountString : String, paymentTypeString : String, costTypeString : String, costCategoryString : String)

  /**
   * Create a recovery on the claim
   *
   * @param table - Reserve Line         - String                        - The name of the reserve line (can be "New")
   *              - Level                - String (YesNo)                - Level of the reserve line (Claim/Exposure)
   *              - Cost Type            - String (WitnessPosition)      - The cost type of the reserve line
   *              - Cost Category        - String                        - The cost category of the reserve line
   *              - Recovery Category    - String                        - The recovery category of the reserve line
   *              - Line Item Category   - String                        - The line item category of the reserve line
   *              - Amount               - String                        - The amount to be reserved for recovery
   *              e.g
   *              | Reserve Line | Level | Cost Type  | Cost Category | Recovery Category | Line Item Category    | Amount |
   *              | New          | Claim | Claim Cost | Auto body     | Salvage           | Mileage reimbursement | 800    |
   */
  function createRecovery(table : DataTable)

  /**
   * Create a recovery reserve on the claim
   *
   * @param table - Level                      - String                        - Level of the recovery reserve (Claim/Exposure)
   *              - Cost Type                  - String (CostType)             - The cost type of the recovery reserve
   *              - Cost Category              - String (CostCategory)         - The cost category of the recovery reserve
   *              - Recovery Category          - String (RecoveryCategory)     - The recovery category of the recovery reserve
   *              - New Open Recovery Reserves - Number                        - The amount to be recovered
   *              e.g
   *              | Level | Cost Type  | Cost Category | Recovery Category | New Open Recovery Reserves |
   *              | Claim | Claim Cost | Auto body     | Salvage           | 800 USD                    |
   */
  function createRecoveryReserve(table : DataTable)

  /**
   * Verifies the claim has no payments or checks
   */
  function verifyClaimHasNoPaymentsOrChecks()

  /**
   * Edit the payment amount to the given value
   *
   * @param amountString new payment amount and currency
   */
  function editPayment(amountString : String)

  /**
   * Set available reserve amount and currency to the given value
   *
   * @param amountString       reserve's amount and currency
   * @param costTypeString     reserve's cost type
   * @param costCategoryString reserve's cost category
   */
  function setAvailableReserves(amountString : String, costTypeString : String, costCategoryString : String)

  /**
   * Start the Normal Create Check Wizard
   */
  function startCheckWizard()

  /**
   * Add a payment for the claim through the Normal Create Check Wizard
   *
   * @param table
   */
  function createClaimPayment(table : DataTable)

  /**
   * Add a payment for the exposure through the Normal Create Check Wizard
   *
   * @param table - Cost Type           - String (CostType)       - The cost type of the reserve
   *              - Cost Category       - String (CostCategory)   - The cost category of the reserve
   *              - Reserving Currency  - String                  - The currency of the (single) payment on the created check
   *              - Payment Type        - String (PaymentType)    - The type of the payment (partial or final) on the created check
   *              - Eroding             - String (YesNo)          - Whether or not the payment erodes the reserve
   *              e.g
   *              | Cost Type  | Cost Category             | Reserving Currency | Payment Type | Eroding |
   *              | Claim Cost | Unspecified Cost Category | USD                | Final        | Yes     |
   */
  function createExposurePayment(table : DataTable)

  /**
   * Add a payment line item through the Normal Create Check Wizard
   *
   * @param table - Category    - String (CostCategory)   - The cost category of the line item
   *              - Amount      - Number                  - The amount on the line item (in default currency)
   *              e.g
   *              | Category              | Amount |
   *              | Mileage reimbursement | 300    |
   */
  function createLineItems(table : DataTable)

  /**
   * Finish the Normal Create Check Wizard
   */
  function finishCheckWizard()

  /**
   * Recodes the reserve line for a payment
   *
   * @param costTypeString     reserve line's cost type
   * @param costCategoryString reserve line's cost category
   */
  function recodePayment(costTypeString : String, costCategoryString : String)

  /**
   * Verify the financial transaction appears on the summary/transaction screen and the data matches
   *
   * @param table - Reserve Line         - String                        - The name of the reserve line (can be "New")
   *              - Level                - String (YesNo)                - Level of the reserve line (Claim/Exposure)
   *              - Cost Type            - String (WitnessPosition)      - The cost type of the reserve line
   *              - Cost Category        - String                        - The cost category of the reserve line
   *              - Recovery Category    - String                        - The recovery category of the reserve line
   *              - Line Item Category   - String                        - The line item category of the reserve line
   *              - Amount               - String                        - The amount that should be reserved
   *              e.g
   *              | Reserve Line | Level | Cost Type  | Cost Category | Recovery Category | Line Item Category    | Amount |
   *              | New          | Claim | Claim Cost | Auto body     | Salvage           | Mileage reimbursement | 800    |
   */
  function verifyFinancialTransactionExists(table : DataTable)

  /**
   * Verify the recovery reserve appears on the Financials Summary screen and the data matches
   *
   * @param table - Level                      - String                        - Level of the recovery reserve (Claim/Exposure)
   *              - Cost Type                  - String (CostType)             - The cost type of the recovery reserve
   *              - Cost Category              - String (CostCategory)         - The cost category of the recovery reserve
   *              - Recovery Category          - String (RecoveryCategory)     - The recovery category of the recovery reserve
   *              - New Open Recovery Reserves - Number                        - The amount to be recovered
   *              e.g
   *              | Level | Cost Type  | Cost Category | Recovery Category | New Open Recovery Reserves |
   *              | Claim | Claim Cost | Auto body     | Salvage           | 800 USD                    |
   */
  function verifyRecoveryReserveExists(table : DataTable)

  /**
   * Verify transaction exists on financial exposure screen
   *
   * @param view  - The selected View on the Financials Summary screen
   * @param table - Exposure         - String                     - The exposure on the reserve line
   *              - Reserve Amount   - Number                     - The amount on the reserve line
   *              - Cost Type        - String (CostType)          - The cost type of the reserve line
   *              - Cost Category    - String (CostCategory)      - The cost category of the reserve line
   *              - Check Amount     - Number                     - The amount on the check
   *              - Payment Type     - String (PaymentType)       - The payment type of the check against the reserve line
   *              e.g
   *              | Exposure  | Reserve Amount | Cost Type  | Cost Category             | Check Amount | Payment Type |
   *              | Collision | 1000           | Claim Cost | Unspecified Cost Category | 500          | Partial      |
   */
  function verifyTransactionExistsOnFinancialsExposureScreen(view : String, table : DataTable)

  /**
   * Verify multicurrency transactions exist
   *
   * @param table - Exposure         - String                     - The exposure on the reserve line
   *              - Reserve Amount   - Number                     - The amount on the reserve line
   *              - Cost Type        - String (CostType)          - The cost type of the reserve line
   *              - Cost Category    - String (CostCategory)      - The cost category of the reserve line
   *              - Check Amount     - Number                     - The amount on the check
   *              - Payment Type     - String (PaymentType)       - The payment type of the check against the reserve line
   *              e.g
   *              | Exposure  | Reserve Amount | Cost Type             | Cost Category             | Check Amount | Payment Type |
   *              | Collision | 1000 USD       | Unspecified Cost Type | Unspecified Cost Category | 200 USD      | Partial      |
   *              | Collision | 900 EUR        | Claim Cost            | Auto parts                | 300 EUR      | Partial      |
   */
  function verifyMultiCurrencyTransactions(table : DataTable)

  /**
   * Create a recovery reserve
   *
   * @param table - Level              - String                         - Is the reserve line on the claim or an exposure (Claim/Exposure)
   *              - Cost Type          - String (CostType)              - The cost type of the reserve
   *              - Cost Category      - String (CostCategory)          - The cost category of the reserve
   *              - Recovery Category  - String (RecoveryCategory)      - The recovery category of the reserve
   *              - Amount             - Number                         - The amount to be reserved for recovery
   *              e.g
   *              | Level    | Cost Type             | Cost Category      | Recovery Category | Amount |
   *              | Claim    | Claim Cost            | Vehicle inspection | Credit to expense | 200    |
   *              | Exposure | Unspecified Cost Type | Other              | Deductible        | 400    |
   */
  function createRecoveryReserves(table : DataTable)

  /**
   * Create a check (using builders) on the exposure which creates an approval activity
   *
   * @param amount the check amount
   */
  function createCheckThatRequiresApproval(amount : String)

  /**
   * Create a reserve on the exposure which creates an approval activity
   *
   * @param amount the reserved amount
   */
  function createReserveOnExposureThatRequiresApproval(amount : String)

  /**
   * Create a check on the exposure
   *
   * @param amount the check amount
   * @param table  - Payment Type    - String (PaymentType)    - The check payment type (final / partial)
   *               - Eroding?        - String (YesNo)          - Should this check payment decrease the available reserves on the underlying reserve line?
   *               e.g
   *               | Payment Type | Eroding? |
   *               | Partial      | Yes      |
   */
  function createCheckOnExposure(amount : String, table : DataTable)

  /**
   * Performs an action (Approve / Reject) on the reserve change approval activity
   *
   * @param action the action to perform (Approve / Reject)
   */
  function actionReserveTransaction(action : String)

  /**
   * Performs an action (Approve / Reject) on the payment approval activity
   *
   * @param action the action to perform (Approve / Reject)
   */
  function actionPayment(action : String)

  /**
   * Verify the reserve approval status
   *
   * @param status the status the reserve should have
   */
  function verifyReserveTransactionApprovalStatus(status : String)

  /**
   * Verify the check approval status
   *
   * @param status the status the check should have
   */
  function verifyCheckApprovalStatus(status : String)

  /**
   * Verify the payment approval status
   *
   * @param status the status the reserve should have
   */
  function verifyPaymentApprovalStatus(status : String)

  /**
   * Verify if there is no open recoveries for reserve lines
   *
   * @param table - Level              - String                         - Is the reserve line on the claim or an exposure (Claim/Exposure)
   *              - Cost Type          - String (CostType)              - The cost type of the reserve
   *              - Cost Category      - String (CostCategory)          - The cost category of the reserve
   *              - Recovery Category  - String (RecoveryCategory)      - The recovery category of the reserve
   *              e.g
   *              | Level | Cost Type  | Cost Category | Recovery Category |
   *              | Claim | Claim Cost | Auto body     | Salvage           |
   */
  function verifyThereIsNoOpenRecoveriesforReserveLines(table : DataTable)

  /**
   * Verify if there is no open recovery reserves for reserve lines
   *
   * @param table - Level              - String                         - Is the reserve line on the claim or an exposure (Claim/Exposure)
   *              - Cost Type          - String (CostType)              - The cost type of the reserve
   *              - Cost Category      - String (CostCategory)          - The cost category of the reserve
   *              - Recovery Category  - String (RecoveryCategory)      - The recovery category of the reserve
   *              e.g
   *              | Level | Cost Type  | Cost Category | Recovery Category |
   *              | Claim | Claim Cost | Auto body     | Salvage           |
   */
  function verifyThereIsNoOpenRecoveryReservesforReserveLines(table : DataTable)

  /**
   * Change recovery reserve amount
   *
   * @param table - Level              - String                         - Is the reserve line on the claim or an exposure (Claim/Exposure)
   *              - Cost Type          - String (CostType)              - The cost type of the reserve
   *              - Cost Category      - String (CostCategory)          - The cost category of the reserve
   *              - Recovery Category  - String (RecoveryCategory)      - The recovery category of the reserve
   *              - Amount             - Number                         - The amount that is reserved for recovery
   *              - New Amount         - Number                         - The new amount to be reserved for this recovery reserve
   *              e.g
   *              | Level    | Cost Type             | Cost Category | Recovery Category | Amount | New Amount |
   *              | Claim    | Claim Cost            | Glass         | Credit to expense | 400    | 1200       |
   */
  function changeRecoveryReserveAmount(table : DataTable)

  /**
   * Verify transaction exists for changing recovery reserve amount
   *
   * @param table - Level              - String                         - Is the reserve line on the claim or an exposure (Claim/Exposure)
   *              - Cost Type          - String (CostType)              - The cost type of the reserve
   *              - Cost Category      - String (CostCategory)          - The cost category of the reserve
   *              - Recovery Category  - String (RecoveryCategory)      - The recovery category of the reserve
   *              - Amount             - Number                         - The amount that is reserved for recovery
   *              - New Amount         - Number                         - The new amount to be reserved for this recovery reserve
   *              e.g
   *              | Level    | Cost Type             | Cost Category | Recovery Category | Amount | New Amount |
   *              | Claim    | Claim Cost            | Glass         | Credit to expense | 400    | 1200       |
   */
  function verifyRecoveryReserveChange(table : DataTable)

  /**
   * Verify recovery reserves exist
   *
   * @param table - Level              - String                         - Is the reserve line on the claim or an exposure (Claim/Exposure)
   *              - Cost Type          - String (CostType)              - The cost type of the reserve
   *              - Cost Category      - String (CostCategory)          - The cost category of the reserve
   *              - Recovery Category  - String (RecoveryCategory)      - The recovery category of the reserve
   *              - Amount             - Number                         - The amount to be reserved for recovery
   *              e.g
   *              | Level    | Cost Type             | Cost Category      | Recovery Category | Amount |
   *              | Claim    | Claim Cost            | Vehicle inspection | Credit to expense | 200    |
   *              | Exposure | Unspecified Cost Type | Other              | Deductible        | 400    |
   */
  function verifyRecoveryReserves(table : DataTable)

  /**
   * Verify an reserve with the following attributes exist on claim
   *
   * @param table - Cost Type          - String (CostType)          - The cost type of the reserve
   *              - Cost Category      - String (CostCategory)      - The cost category of the reserve
   *              - Amount             - Number                     - The amount that should be reserved for recovery
   *              e.g
   *              | Cost Type  | Cost Category | Amount |
   *              | Claim Cost | Auto body     | 300    |
   */
  function verifyReserves(table : DataTable)

  /**
   * Verify a payment with the given currency amount and type exist on claim
   *
   * @param amountString      payment's amount and currency
   * @param paymentTypeString payment's type
   */
  function verifyPayment(amountString : String, paymentTypeString : String)

  /**
   * Verify a check to the given payee with a payment of the given currency amount exist on claim
   *
   * @param checkAmount payment's amount and currency on the check
   * @param payeeName   check payee
   */
  function verifyCheck(checkAmount : String, payeeName : String)

  /**
   * Verifies going to the instructions step returns a message
   *
   * @param message
   */
  function verifyCannotFinishCheckWizard(message : String)

  /**
   * Verifies the reserve, check and new transaction claim menu action links are disabled
   */
  function verifyPaymentOptionsUnavailable()

  /**
   * Verify the claim has a reserve matching the supplied data
   *
   * @param table - Cost Type      - String (CostType)          - The cost type of the reserve
   *              - Cost Category  - String (CostCategory)      - The cost category of the reserve
   *              - Amount         - Number                     - The amount to be reserved
   *              e.g
   *              | Cost Type  | Cost Category | Amount |
   *              | Claim Cost | Auto body     | 500    |
   */
  function verifyClaimHasReserve(table : DataTable)

  /**
   * Verify the claim does not have a reserve matching the supplied data
   *
   * @param table - Cost Type      - String (CostType)          - The cost type of the reserve
   *              - Cost Category  - String (CostCategory)      - The cost category of the reserve
   *              - Amount         - Number                     - The amount to be reserved
   *              e.g
   *              | Cost Type  | Cost Category | Amount |
   *              | Claim Cost | Auto body     | 500    |
   */
  function verifyClaimDoesNotHaveReserve(table : DataTable)

  /**
   * Creates a check payment on the reserve line
   *
   * @param table - Cost Type          - String (CostType)           - The cost type of the reserve
   *              - Cost Category      - String (CostCategory)       - The cost category of the reserve
   *              - Amount             - Number                      - The amount of the (single) payment on the created check
   *              - Reserving Currency - String                      - The currency of the (single) payment on the created check
   *              - Payment Type       - String (PaymentType)        - The type of the payment (partial or final) on the created check
   *              - Eroding            - String (YesNo)              - Whether or not the payment erodes the reserve
   *              - Check Status       - String (TransactionStatus)  - The status of the created check
   *              - Payment Status     - String (TransactionStatus)  - The status of the (single) payment on the created check
   *              <p>
   *              e.g
   *              | Cost Type  | Cost Category | Amount | Reserving Currency | Payment Type | Eroding | Check Status        | Payment Status      |
   *              | Claim Cost | Auto body     | 500    | USD                | Partial      | Yes     | Awaiting submission | Awaiting submission |
   */
  function createCheckPaymentOnTheReserveLine(table : DataTable)

  /**
   * Verifies the status of the check
   *
   * @param statusStr expected status of the check
   */
  function verifyCheckStatus(statusStr : String)

  /**
   * Voids the check if it is voidable
   */
  function voidTheCheck()

  /**
   * Stops the check if it is stopable
   */
  function stopTheCheck()

  /**
   * Deletes the check
   */
  function deleteTheCheck()

  /**
   * Verifies the check has been deleted
   */
  function verifyCheckIsDeleted()

  /**
   * Transfers the check to the first claim, if it is transferable
   */
  function transferTheCheckToFirstClaim()

  /**
   * Reissues the check if it is reissueable
   */
  function reissueTheCheck()

  /**
   * Creates a check on the reserveline associated with a check group
   *
   * @param table - Cost Type          - String (CostType)              - The cost type of the reserve
   *              - Cost Category      - String (CostCategory)          - The cost category of the reserve
   *              - Amount             - Number                         - The amount of the (single) payment on the created check
   *              - Reserving Currency - String                         - The currency of the (single) payment on the created check
   *              - Payment Type       - String (PaymentType)           - The payment type of the check
   *              - Eroding            - String                         - Whether or not the payment erodes the reserve
   *              - Check Status       - String (TransactionStatus)     - The status of the created check
   *              - Payment Status     - String (TransactionStatus)     - The status of the (single) payment on the created check
   *              <p>
   *              e.g
   *              | Cost Type  | Cost Category | Amount  | Reserving Currency | Payment Type | Eroding | Check Status | Payment Status |
   *              | Claim Cost | Auto body     | 300 USD | USD                | Partial      | Yes     | Issued       | Submitted      |
   */
  function createCheckPaymentOnTheReserveLineWithinACheckGroup(table : DataTable)

  /**
   * Creates a clone of this check in a new CheckSet
   */
  function cloneCheck()

  /**
   * Creates a manual check on an existing claim
   *
   * @param amountString      - The amount of the check (e.g. "400 USD")
   * @param paymentTypeString - The payment type of the check (PaymentType)
   */
  function createManualCheck(amountString : String, paymentTypeString : String)

  /**
   * Creates a quick check on an existing claim
   *
   * @param table A table containing the quick check specification
   *              - Cost Type          - String (CostType)              - The cost type of the reserve
   *              - Payee              - String                         - The recipient of the check
   *              - Amount             - Number                         - The amount of the (single) payment on the created check
   *              - Currency           - String                         - The currency of the (single) payment on the created check
   *              - Payment Type       - String (PaymentType)           - The payment type of the check
   *              - Eroding            - String                         - Whether or not the payment erodes the reserve
   *              | Cost Type     | Payee                 | Amount  | Currency | Payment Type | Eroding |
   *              | Auto body USD | Quick Check Recipient | 300 USD | USD      | Partial      | Yes     |
   */
  function createQuickCheck(table : DataTable)


  /**
   * Checks whether or not there's subrogation
   */
  function verifySubrogationExists()

  /**
   * Verifies a recovery exists in the subrogation
   *
   * @param table A table containing the expected recoveries for the responsible parties
   *              - Responsible Party    - String                     - The name of the responsible party
   *              - Liability %          - Number                     - The expected liability percentage
   *              - Expected Recovery    - Number                     - The amount expected recovery
   *              | Responsible Party | Liability % | Expected Recovery |
   *              | Responsible 1     | 60          | 60.00 USD         |
   *              | Responsible 2     | 40          | 40.00 USD         |
   */
  function verifyRecoveriesInSubrogation(table : DataTable)

  /**
   * Refers the subrogation to the exposure level
   */
  function referSubrogationToExposureLevel()

  /**
   * Checks if the subrogation is assigned
   */
  function verifyExposureHasSubrogationOwner()

  /**
   * Creates a payment on the claim
   *
   * @param table A table containing the payment specification
   *              - Cost Type          - String (CostType)              - The cost type of the reserve
   *              - Cost Category      - String (CostCategory)          - The cost category of the reserve
   *              - Amount             - Number                         - The amount of the (single) payment on the created check
   *              - Payment Type       - String (PaymentType)           - The payment type of the check
   *              - Eroding            - String (YesNo)                 - Whether or not the payment erodes the reserve
   *              | Cost Type  | Cost Category             | Amount  | Payment Type | Eroding |
   *              | Claim Cost | Unspecified Cost Category | 100 USD | Final        | Yes     |
   */
  function theClaimHasAPayment(table : DataTable)

  /**
   * Start the normal create check wizard for a specifi vendor
   *
   * @param contactSubTypeName
   * @param orgName            name of the Organization if its a company
   * @param fname              First name of the contact person
   * @param lname              Last name of the contact person
   */
  function startCheckWizardForSpecificVendor(contactSubTypeName : String, orgName : String = null, fname : String = null, lname : String = null)

  /**
   * Set the payment details on payment wizard
   *
   * @param paymentInfo A table containing the payment specification
   *                    - Cost Type          - String (CostType)              - The cost type of the reserve
   *                    - Cost Category      - String (CostCategory)          - The cost category of the reserve
   *                    - Amount             - Number                         - The amount of the (single) payment on the created check
   *                    - Payment Type       - String (PaymentType)           - The payment type of the check
   *                    <p>
   *                    | Cost Type     | Claim Cost                |
   *                    | Cost Category | Unspecified Cost Category |
   *                    | Payment Type  | Partial                   |
   *                    | Amount        | 5000 USD                  |
   */
  function createPaymentOnReserveline(paymentInfo : Map<String, String>)

  /**
   * Navigates to Check Deductions from the Instructions wizard
   */
  function navigateToCheckDeductions()

  /**
   * Verifies that the state withholding is deducted according to state
   *
   * @param amount the amount of State Withholding
   */
  function verifyStateWithholdingAmountIsDeducted(amount : String)
}
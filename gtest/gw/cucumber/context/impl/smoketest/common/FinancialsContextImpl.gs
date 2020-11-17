package gw.cucumber.context.impl.smoketest.common

uses com.google.inject.Inject
uses cucumber.api.DataTable
uses entity.Transaction
uses gw.api.database.Query
uses gw.api.databuilder.AuthorityLimitProfileBuilder
uses gw.api.databuilder.CheckBuilder
uses gw.api.databuilder.CheckGroupBuilder
uses gw.api.databuilder.PaymentBuilder
uses gw.api.databuilder.ReserveBuilder
uses gw.api.databuilder.ReserveSetBuilder
uses gw.api.databuilder.UserBuilder
uses gw.api.financials.CheckPayeeInfo
uses gw.api.financials.CurrencyAmount
uses gw.api.locale.DisplayKey
uses gw.api.util.CurrencyUtil
uses gw.api.util.DateUtil
uses gw.cucumber.CucumberStepBase
uses gw.cucumber.context.api.common.FinancialsContext
uses gw.cucumber.context.impl.smoketest.util.Navigation
uses gw.cucumber.testdata.DataWrapper
uses gw.cucumber.transformer.CurrencyAmountTransformer
uses gw.cucumber.transformer.TypelistTransformer
uses gw.cucumber.util.common.UIHelper
uses pcftest.AddressBookSearchLV
uses pcftest.ApprovalDetailWorksheet
uses pcftest.CheckWizard_CheckPaymentsScreen
uses pcftest.CheckWizard_PaymentDeductionsPagePopup
uses pcftest.ClaimFinancialsChecks
uses pcftest.ClaimFinancialsSummary
uses pcftest.ClaimFinancialsTransactions
uses pcftest.ClaimFinancialsTransactionsDetail
uses pcftest.ClaimSummary
uses pcftest.ClaimWorkplan
uses pcftest.EditableRecoveryReservesLV
uses pcftest.FinancialsSummaryLV
uses pcftest.ManualCreateCheckWizard
uses pcftest.NewCheckWizardAddressBookPickerPopup
uses pcftest.NewRecoveryReserveSet
uses pcftest.NewRecoverySet
uses pcftest.NewReserveSet
uses pcftest.NormalCreateCheckWizard
uses pcftest.QuickCreateCheckWizard
uses pcftest.SubrogationGeneral
uses pcftest.VoidStopCheck

@SuppressWarnings("unused")
class FinancialsContextImpl extends CucumberStepBase implements FinancialsContext {
  @Inject
  var _claimWrapper : DataWrapper<Claim>

  @Inject
  var _claimsWrapper : DataWrapper<List<Claim>>

  @Inject
  var _exposureWrapper : DataWrapper<Exposure>

  @Inject
  var _reserveWrapper : DataWrapper<Reserve>

  @Inject
  var _costTypeWrapper : DataWrapper<CostType>

  @Inject
  var _costCategoryWrapper : DataWrapper<CostCategory>

  @Inject
  var _checkWrapper : DataWrapper<Check>

  @Inject
  var _checkGroupWrapper : DataWrapper<CheckGroup>

  final var _costTypeTypelistTransformer = new TypelistTransformer<CostType>()

  final var _costCategoryTypelistTransformer = new TypelistTransformer<CostCategory>()

  final var _transactionStatusTypelistTransformer = new TypelistTransformer<TransactionStatus>()

  final var _paymentTypeTypelistTransformer = new TypelistTransformer<PaymentType>()

  final var _recoveryCategoryTypelistTransformer = new TypelistTransformer<RecoveryCategory>()

  override function createExistingReserves(amountString : String, costTypeString : String, costCategoryString : String) {
    var exposure = _exposureWrapper.get() ?: _claimWrapper.get().Exposures.single()
    var costType = _costTypeTypelistTransformer.transform(costTypeString)
    var costCategory = _costCategoryTypelistTransformer.transform(costCategoryString)
    _costTypeWrapper.set(costType)
    _costCategoryWrapper.set(costCategory)
    var reserve : Reserve
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      reserve = ReserveBuilder.uiReadyReserve(exposure, _currencyAmountTransformer.transform(amountString))
          .onClaim(_claimWrapper.get())
          .withCostType(costType)
          .withCurrency(_currencyAmountTransformer.transform(amountString).Currency)
          .withReservingCurrency(_currencyAmountTransformer.transform(amountString).Currency)
          .withCostCategory(costCategory)
          .create(bundle)
    }, CurrentUser)
    _reserveWrapper.set(reserve)
  }

  override function createExistingReserves(table : DataTable) {
    var reservesMap = table.asMaps(String, String)
    for (row in reservesMap) {
      var costType = row.get(DK_COST_TYPE)
      var costCategory = row.get(DK_COST_CATEGORY)
      var amount = row.get(DK_AMOUNT)
      createExistingReserves(amount, costType, costCategory)
    }
  }

  override function createExistingPayment(amountString : String, paymentTypeString : String) {
    var paymentType = _paymentTypeTypelistTransformer.transform(paymentTypeString)
    var currencyAmount = _currencyAmountTransformer.transform(amountString)
    var currency = currencyAmount.Currency == null ? CurrencyUtil.DefaultCurrency : currencyAmount.Currency
    var exposure = _exposureWrapper.get()

    if (currency != CurrencyUtil.DefaultCurrency) {
      gw.transaction.Transaction.runWithNewBundle(\bundle -> {
        var rates = new ExchangeRate[]{
            CurrencyUtil.createExchangeRate(currency, CurrencyUtil.DefaultCurrency, 1.1)
        }
        var eSet = CurrencyUtil.createMarketExchangeRateSet("Exchange set", "Exchange set", DateUtil.currentDate().addDays(-1), DateUtil.currentDate().addYears(10), rates.toList())
        var exchangeRateEntity = eSet.getExchangeRateEntity(currency, CurrencyUtil.DefaultCurrency)
        var check = createCheckBuilder(exposure, currencyAmount, paymentType)
            .withPayment(new PaymentBuilder()
                .withPaymentType(PaymentType.TC_PARTIAL)
                .erodesReserves()
                .onClaim(_claimWrapper.get())
                .withTransToClaimExchangeRate(exchangeRateEntity)
                .withClaimToReportingExchangeRate(exchangeRateEntity)
                .withTransToReservingExchangeRate(exchangeRateEntity)
            )
            .withTransToClaimExchangeRate(exchangeRateEntity)
            .withClaimToReportingExchangeRate(exchangeRateEntity)
            .withTransToReservingExchangeRate(exchangeRateEntity)
            .create(bundle)
      }, CurrentUser)
    } else {
      gw.transaction.Transaction.runWithNewBundle(\bundle -> {
        exposure = bundle.add(exposure)
        createCheckBuilder(exposure, currencyAmount, paymentType).create(bundle)
      }, CurrentUser)
    }
    _exposureWrapper.set(exposure)
  }

  private function createCheckBuilder(exposure : Exposure, currencyAmount : CurrencyAmount, paymentType : PaymentType) : CheckBuilder {
    var currency = currencyAmount.Currency == null ? CurrencyUtil.DefaultCurrency : currencyAmount.Currency
    return CheckBuilder.uiReadySinglePaymentCheck(
        exposure.ReserveLines.firstWhere(\elt -> elt.ReservingCurrency == currency),
        currencyAmount,
        currency,
        TransactionStatus.TC_AWAITINGSUBMISSION,
        TransactionStatus.TC_AWAITINGSUBMISSION,
        paymentType,
        true
    )
  }

  override function createPayment(amountString : String, paymentTypeString : String) {
    var paymentType = _paymentTypeTypelistTransformer.transform(paymentTypeString)
    var wizard = new Navigation<NormalCreateCheckWizard>(_proxy).ensureOnPage(\tabBar ->
        tabBar.goToClaim(_claimWrapper.get()).goToNewCheck(), CurrentUser)
    wizard.setPayeeInfo()
    wizard.next()
    var newPaymentDV = wizard.NewCheckPayments.CheckWizard_CheckPaymentsScreen.NewCheckPaymentPanelSet_Single.NewPaymentDetailDV_default
    newPaymentDV.ReserveLineInputSet.ReserveLine
        .clickFirstOptionWithMatchingLabel(\text -> text.contains(_exposureWrapper.get().DisplayName)
            && text.contains(_costTypeWrapper.get().DisplayName)
            && text.contains(_costCategoryWrapper.get().DisplayName))
    newPaymentDV.Payment_PaymentType.TypeKeyValue = paymentType
    if (newPaymentDV.Payment_Currency.Visible) {
      newPaymentDV.Payment_Currency.setTypeKeyValue(_currencyAmountTransformer.transform(amountString).Currency)
    }

    newPaymentDV.EditablePaymentLineItemsLV_default._Entries.first().Amount.Value = _currencyAmountTransformer.transform(amountString).Amount.toString()
    wizard.next()
    wizard.finish()
  }

  override function createPaymentOnAReserveLine(amountString : String, paymentTypeString : String, costTypeString : String, costCategoryString : String) {
    var paymentType = _paymentTypeTypelistTransformer.transform(paymentTypeString)
    var wizard = new Navigation<NormalCreateCheckWizard>(_proxy).ensureOnPage(\tabBar ->
        tabBar.goToClaim(_claimWrapper.get()).goToNewCheck(), CurrentUser)

    wizard.NewCheckPayees.CheckWizard_CheckPayeesScreen.NewCheckPayeeDV.PrimaryPayee_Name.getOptionByLabel((_claimWrapper.get() as Claim).Insured.DisplayName).click()
    wizard.next()
    var newPaymentDV = wizard.NewCheckPayments.CheckWizard_CheckPaymentsScreen.NewCheckPaymentPanelSet_Single.NewPaymentDetailDV_default
    newPaymentDV.ReserveLineInputSet.ReserveLine
        .clickFirstOptionWithMatchingLabel(\text -> text.contains(_exposureWrapper.get().DisplayName)
            && text.contains(costTypeString)
            && text.contains(costCategoryString))
    newPaymentDV.Payment_PaymentType.TypeKeyValue = paymentType
    newPaymentDV.EditablePaymentLineItemsLV_default._Entries.first().Amount.Value = _currencyAmountTransformer.transform(amountString).Amount.toString()
    wizard.next()
    wizard.finish()
  }

  override function createRecovery(table : DataTable) {
    var claim = _claimWrapper.get()
    var recoveryMaps = table.asMaps(String, String)

    for (dataTable in recoveryMaps) {
      var createRecoveryScreen = new Navigation<NewRecoverySet>(_proxy).ensureOnPage(\tabBar ->
          tabBar.goToClaim(_claimWrapper.get()).ClaimMenuActions.goToNewRecoverySet(), CurrentUser)

      var dv = createRecoveryScreen.NewRecoveryScreen.RecoveryDetailDV
      dv.Payer.selectFirstValidOption()

      var reserveLineInputSet = dv.ReserveLineInputSet
      reserveLineInputSet.ReserveLine.getOptionByLabel(DK_NEW).click()
      reserveLineInputSet.Exposure.clickFirstOptionWithMatchingLabel(\text -> text.containsIgnoreCase(dataTable.get(KEY_LEVEL)))
      reserveLineInputSet.CostType.clickFirstOptionWithMatchingLabel(\text -> text.contains(dataTable.get(DK_COST_TYPE)))
      reserveLineInputSet.CostCategory.clickFirstOptionWithMatchingLabel(\text -> text.contains(dataTable.get(DK_COST_CATEGORY)))
      dv.RecoveryCategory.clickFirstOptionWithMatchingLabel(\text -> text.contains(dataTable.get(DK_RECOVERY_CATEGORY)))

      var lineItem = dv.EditableRecoveryLineItemsLV._Entries.first()
      lineItem.LineCategory.clickFirstOptionWithMatchingLabel(\text -> text.contains(dataTable.get(KEY_LINE_ITEM_CATEGORY)))
      var amount = _currencyAmountTransformer.transform(dataTable.get(DK_AMOUNT)).Amount.toString()
      lineItem.Amount.setValue(amount)

      createRecoveryScreen.NewRecoveryScreen.Update.click()
      UIHelper.assertNoMessages(createRecoveryScreen)
    }
    _claimWrapper.set(Query.make(Claim).compare(Claim#ID, Equals, claim.ID).select().AtMostOneRow)
  }

  override function verifyTransactionExistsOnFinancialsExposureScreen(view : String, table : DataTable) {
    var dataTable = table.asMaps(String, String)

    for (row in dataTable) {
      var match = false
      var summaryTable = expandSummaryTable(view, "Claim Total")
      match = summaryTable._Entries.hasMatch(\tx ->
          validateTable(tx, row, view)
      )
      assertThat(match).as("A financial transaction matching this data was not found on the summary screen: ${row.Values.join(",")}").isNotNull()
    }
  }

  private function expandSummaryTable(view : String, headerLabel : String) : FinancialsSummaryLV.entry {
    var screen = new Navigation<ClaimFinancialsSummary>(_proxy).ensureOnPage(\tabBar ->
        tabBar.goToClaim(_claimWrapper.get()).goToClaimFinancials(), CurrentUser)

    var transactionList = screen.ClaimFinancialsSummaryScreen.financialsPanel.FinancialsSummaryPanelSet_Exposure.FinancialsSummaryLV

    screen.ClaimFinancialsSummaryScreen.financialsPanel.FinancialsSummaryPanelSet_tb.FinancialsSummaryRangeInput
        .clickFirstOptionWithMatchingLabel(\text -> text.equalsIgnoreCase(view))
    var summaryTable = screen.ExposureSummaryPanel.FinancialsSummaryLV.EntriesFlattened.firstWhere(\text -> text.FinancialsSummaryLabel.Value.contains(headerLabel))
    if (summaryTable._Entries.Empty) summaryTable.expandCollapse.click()
    return summaryTable
  }

  private function validateTable(summaryTable : FinancialsSummaryLV.entry, row : Map<String, String>, view : String) : boolean {
    return summaryTable.FinancialsSummaryLabel.Value.contains(row.get(DK_EXPOSURE)) and
        summaryTable._Entries.hasMatch(\tx1 -> checkThirdExpandedEntry(tx1, row, view))
  }

  private function checkThirdExpandedEntry(entryHeader : FinancialsSummaryLV.entry, row : Map<String, String>, view : String) : boolean {
    if (view == "Exposure Only") {
      return entryHeader._Entries.hasMatch(\tx1 ->
          tx1.FinancialsSummaryLabel.Value.contains(row.get(DK_COST_TYPE)) and
              tx1.FinancialsSummaryLabel.Value.contains(row.get(DK_COST_CATEGORY)) and
              tx1.TotalIncurredNet.Value.substring(1).toDouble() == row.get(KEY_RESERVE_AMOUNT).toDouble() and
              tx1.TotalPayments.Value.substring(1).toDouble() == row.get(DK_CHECK_AMOUNT).toDouble() and
              checkRemainingReserves(tx1.RemainingReserves.Value, row))
    } else if (view == DK_COVERAGE) {
      return entryHeader._Entries.hasMatch(\tx1 ->
          checkFourthExpandedEntry(tx1, row, view)
      )
    } else
      return entryHeader._Entries.hasMatch(\tx1 ->
          tx1.FinancialsSummaryLabel.Value.contains(row.get(DK_COST_TYPE)) and // works for everything except claimant and coverage
              checkFourthExpandedEntry(tx1, row, view)
      )
  }

  private function checkFourthExpandedEntry(entryHeader : FinancialsSummaryLV.entry, row : Map<String, String>, view : String) : boolean {
    return entryHeader._Entries.hasMatch(\tx2 ->
        tx2.FinancialsSummaryLabel.Value.contains(row.get(DK_COST_CATEGORY)) and
            (view == DK_COVERAGE ? tx2.FinancialsSummaryLabel.Value.contains(row.get(DK_COST_TYPE)) : true) and
            tx2.TotalIncurredNet.Value.substring(1).toDouble() == row.get(KEY_RESERVE_AMOUNT).toDouble() and
            tx2.TotalPayments.Value.substring(1).toDouble() == row.get(DK_CHECK_AMOUNT).toDouble() and
            checkRemainingReserves(tx2.RemainingReserves.Value, row)
    )
  }

  private function checkRemainingReserves(reminaingReserves : String, row : Map<String, String>) : boolean {
    if (row.get(DK_PAYMENT_TYPE) == PaymentType.TC_PARTIAL.DisplayName) {
      return reminaingReserves.substring(1).toDouble() == row.get(KEY_RESERVE_AMOUNT).toDouble() - row.get(DK_CHECK_AMOUNT).toDouble()
    } else {
      return reminaingReserves == "-" // not ideal
    }
  }

  override function createRecoveryReserve(table : DataTable) {
    var recoveryReserveMaps = table.asMaps(String, String)
    var createRecoveryReserveScreen = new Navigation<NewRecoveryReserveSet>(_proxy).ensureOnPage(\tabBar ->
        tabBar.goToClaim(_claimWrapper.get()).ClaimMenuActions.goToNewRecoveryReserveSet(), CurrentUser)
    var newReserveSetScreen = createRecoveryReserveScreen.NewReserveSetScreen

    for (dataTable in recoveryReserveMaps) {
      newReserveSetScreen.Add.click()
      var recoveryReserve = newReserveSetScreen.RecoveryReservesSummaryDV.EditableRecoveryReservesLV._Entries.last()
      recoveryReserve.Exposure.clickFirstOptionWithMatchingLabel(\text -> text.containsIgnoreCase(dataTable.get(KEY_LEVEL)))
      recoveryReserve.CostType.clickFirstOptionWithMatchingLabel(\option -> option == dataTable.get(DK_COST_TYPE))
      recoveryReserve.CostCategory.clickFirstOptionWithMatchingLabel(\option -> option == dataTable.get(DK_COST_CATEGORY))
      recoveryReserve.RecoveryCategory.clickFirstOptionWithMatchingLabel(\option -> option == dataTable.get(DK_RECOVERY_CATEGORY))
      recoveryReserve.NewOpenRecoveryReserves.Value = _currencyAmountTransformer.transform(dataTable.get(DK_NEW_OPEN_RECOVERY_RESERVES)).Amount.toString()
    }
    newReserveSetScreen.Update.click()

    _claimWrapper.set(Query.make(Claim).compare(Claim#ID, Equals, _claimWrapper.get().ID).select().AtMostOneRow)
  }

  override function verifyMultiCurrencyTransactions(table : DataTable) {
    var data = table.asMaps(String, String)
    for (row in data) {
      var amount = _currencyAmountTransformer.transform(row.get(DK_CHECK_AMOUNT))
      var summaryTable = expandSummaryTable(DK_RESERVING_CURRENCY, amount.Currency.DisplayName)
      var match = summaryTable._Entries.hasMatch(\tx ->
          tx.FinancialsSummaryLabel.Value.contains(row.get(DK_EXPOSURE)) and
              summaryTable._Entries.hasMatch(\tx1 ->
                  tx1.FinancialsSummaryLabel.Value.contains(row.get(DK_COST_TYPE)) and
                      tx1._Entries.hasMatch(\tx2 ->
                          tx2.FinancialsSummaryLabel.Value.contains(row.get(DK_COST_CATEGORY)) and
                              tx2.TotalIncurredNet.Value.substring(1).toDouble() == row.get(KEY_RESERVE_AMOUNT).toDouble() and
                              tx2.TotalPayments.Value.substring(1).AsBigDecimal == amount.Amount and
                              tx2.RemainingReserves.Value.substring(1).AsBigDecimal == row.get(KEY_RESERVE_AMOUNT).AsBigDecimal - amount.Amount
                      )
              )
      )
      assertThat(match).as(
          "A financial transaction was not found on the summary screen with values: ${row.Values.join(",")}"
      ).isNotNull()
    }
  }

  override function verifyClaimHasNoPaymentsOrChecks() {
    assertThat(Query.make(Payment).compare(Payment#Claim, Equals, _claimWrapper.get()).select().toList())
        .as("Expected no claim payments, but found one").isNullOrEmpty()
    assertThat(Query.make(Check).compare(Check#Claim, Equals, _claimWrapper.get()).select().toList())
        .as("Expected no claim Checks, but found one").isNullOrEmpty()
  }

  override function editPayment(amountString : String) {
    var transactions = new Navigation<ClaimFinancialsTransactions>(_proxy).ensureOnPage(\tabBar ->
        tabBar.goToClaim(_claimWrapper.get()).MenuLinks.goToClaimTransactions(), CurrentUser)
    transactions.ClaimFinancialsTransactionsScreen.TransactionsLVRangeInput.clickByLabelSubstr(DK_PAYMENTS)
    var lastPayment = transactions.ClaimFinancialsTransactionsScreen.TransactionsLV_payment._Entries.last()
    var transactionsDetail = lastPayment.TransactionAmountViewDetail.click() as ClaimFinancialsTransactionsDetail

    var wizard = transactionsDetail.ClaimFinancialsTransactionsDetailScreen.TransactionDetailToolbarButtonSet_payment.TransactionDetailToolbarButtonSet_EditButton.click()
    wizard.Next.click()
    var newPaymentDetailDV_default = wizard.NewCheckPayments.CheckWizard_CheckPaymentsScreen.NewCheckPaymentPanelSet_Single.NewPaymentDetailDV_default
    newPaymentDetailDV_default.EditablePaymentLineItemsLV_default._Entries.single().Amount.Value = _currencyAmountTransformer.transform(amountString).Amount.toString()
    wizard.Next.click()
    wizard.Finish.click()
  }

  override function setAvailableReserves(amountString : String, costTypeString : String, costCategoryString : String) {
    var costType = _costTypeTypelistTransformer.transform(costTypeString)
    var costCategory = _costCategoryTypelistTransformer.transform(costCategoryString)
    _costTypeWrapper.set(costType)
    _costCategoryWrapper.set(costCategory)

    var exposure = _exposureWrapper.get() ?: _claimWrapper.get().Exposures.single()
    assertThat(exposure).isNotNull()

    var newReserve = new Navigation<NewReserveSet>(_proxy).ensureOnPage(\tabBar ->
        tabBar.goToClaim(_claimWrapper.get()).goToNewReserveSet(), CurrentUser)
    var entry = newReserve.NewReserveSetScreen.ReservesSummaryDV.EditableReservesLV._Entries
        .firstWhere(\entry -> entry.Exposure_Readonly.Text == exposure.DisplayName
            && entry.CostType.Text == costTypeString
            && entry.CostCategory.Text == costCategoryString)
    var lastEntry = newReserve.NewReserveSetScreen.ReservesSummaryDV.EditableReservesLV._Entries.last()
    if (entry == null) {
      entry = lastEntry
      assertThat(entry.Exposure.OptionLabels).contains({exposure.DisplayName})
      entry.Exposure.clickByLabelSubstr(exposure.DisplayName)
      assertThat(entry.CostType.OptionLabels).contains({costTypeString})
      entry.CostType.clickByLabelSubstr(costTypeString)
      assertThat(entry.CostCategory.OptionLabels).contains({costCategoryString})
      entry.CostCategory.clickByLabelSubstr(costCategoryString)
    } else {
      lastEntry._Checkbox.click()
      newReserve.NewReserveSetScreen.Remove.click()
    }
    entry.NewAmount.Value = _currencyAmountTransformer.transform(amountString).Amount.toString()
    var location = newReserve.NewReserveSetScreen.Update.click()
    UIHelper.assertNoMessages(location)
  }

  override function startCheckWizard() {
    var claim = _claimWrapper.get()
    var normalCreateCheckWizard = new Navigation<NormalCreateCheckWizard>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(claim).goToNewCheck(), CurrentUser)
    normalCreateCheckWizard.NewCheckPayees.CheckWizard_CheckPayeesScreen.NewCheckPayeeDV.PrimaryPayee_Name.clickByLabelSubstr(claim.Insured.DisplayName)
  }

  override function createClaimPayment(table : DataTable) {
    createPayment(true, table)
  }

  override function createExposurePayment(table : DataTable) {
    createPayment(false, table)
  }

  private function createPayment(claimLevel : boolean, table : DataTable) {
    var paymentMaps = table.asMaps(String, String)
    var claim = _claimWrapper.get()
    var normalCreateCheckWizard = _proxy.CurrentPage as NormalCreateCheckWizard
    var payments = normalCreateCheckWizard.gotoPayments()

    for (paymentMap in paymentMaps) {
      normalCreateCheckWizard.NewCheckPayments.click().createNewPayment()
      setReserveLine(payments, true, paymentMap)
      UIHelper.setFieldValues(payments, paymentMap)
      payments.setRequiredFieldsIfNotPresent()
    }
  }

  private function setReserveLine(payments : CheckWizard_CheckPaymentsScreen, claimLevel : boolean, paymentMap : Map<String, String>) {
    var reserveOptions = payments.NewPaymentDetailDV.ReserveLineInputSet.ReserveLine.OptionLabels

    if (claimLevel) {
      reserveOptions = reserveOptions.where(\reserve -> reserve.containsIgnoreCase(DK_NONE))
    } else {
      reserveOptions = reserveOptions.where(\reserve -> reserve.startsWithIgnoreCase("(${_exposureWrapper.get().ClaimOrder})"))
    }
    if (paymentMap.containsKey(DK_COST_TYPE)) {
      reserveOptions = reserveOptions.where(\reserve -> reserve.containsIgnoreCase(DK_COST_TYPE))
    }
    if (paymentMap.containsKey(DK_COST_CATEGORY)) {
      reserveOptions = reserveOptions.where(\reserve -> reserve.containsIgnoreCase(DK_COST_CATEGORY))
    }
    if (paymentMap.containsKey(DK_RESERVING_CURRENCY)) {
      reserveOptions = reserveOptions.where(\reserve -> reserve.containsIgnoreCase(DK_RESERVING_CURRENCY))
    }
  }

  override function createLineItems(table : DataTable) {
    var lineItemMaps = table.asMaps(String, String)
    var normalCreateCheckWizard = _proxy.CurrentPage as NormalCreateCheckWizard
    var payments = normalCreateCheckWizard.NewCheckPayments.CheckWizard_CheckPaymentsScreen
    for (lineItemMap in lineItemMaps) {
      var lineItem = payments.createNewLineItem()
      UIHelper.setFieldValues(lineItem, lineItemMap)
    }
  }

  override function finishCheckWizard() {
    var normalCreateCheckWizard = _proxy.CurrentPage as NormalCreateCheckWizard
    var instructions = normalCreateCheckWizard.gotoInstructions()
    instructions.setRequiredFieldsIfNotPresent()
  }

  override function verifyFinancialTransactionExists(table : DataTable) {
    var expectedReserveTxns = table.asMaps(String, String)

    var financialsSummary = new Navigation<ClaimFinancialsSummary>(_proxy).ensureOnPage(\tabBar ->
        tabBar.goToClaim(_claimWrapper.get()).goToClaimFinancials(), CurrentUser)

    for (txn in expectedReserveTxns) {
      var costType = txn.get(DK_COST_TYPE)
      var costCategory = txn.get(DK_COST_CATEGORY)
      var amount = txn.get(DK_AMOUNT)
      var recoveryCategory = txn.get(DK_RECOVERY_CATEGORY)

      var expectedEntry = financialsSummary.findEntryByCostAndCategory(costType, costCategory)
      var expectedAmount = _currencyAmountTransformer.transform(amount)
      assertThat(expectedEntry.TotalRecoveries).hasCurrencyAmount(expectedAmount)

      // click the recovery amount on the summary page. click 'View details' on the transaction
      var details = ((expectedEntry.TotalRecoveries.click() as ClaimFinancialsTransactions)
          .ClaimFinancialsTransactionsScreen.TransactionsLV_recovery._Entries.first().TransactionAmountViewDetail.click() as ClaimFinancialsTransactionsDetail)
          .ClaimFinancialsTransactionsDetailScreen.TransactionDetailPanelSet_recovery.TransactionRecoveryDV.RecoveryBasicsInputSet

      if (txn.get(KEY_LEVEL) == DK_CLAIM) {
        assertThat(details.Exposure.Text).isEqualTo(DK_CLAIM_LEVEL)
      } else {
        assertThat(details.Exposure.Text).isNotEqualTo(DK_CLAIM_LEVEL)
      }
      assertThat(details.Amount.Text).isEqualTo(expectedAmount.DisplayValue)
      assertThat(details.CostType.Text).isEqualTo(costType)
      assertThat(details.CostCategory.Text).isEqualTo(costCategory)
      assertThat(details.RecoveryCategory.Text).isEqualTo(recoveryCategory)

      var lineItem = details.getTransactionLineItemsLV()._Entries.first()
      assertThat(lineItem.LineCategory.TypeKeyValue.DisplayName).isEqualTo(txn.get(KEY_LINE_ITEM_CATEGORY))
    }
  }

  override function verifyRecoveryReserveExists(table : DataTable) {
    var expectedRecoveryReserves = table.asMaps(String, String)
    final var claim = Query.make(Claim).compare(Claim#ID, Equals, _claimWrapper.get().ID).select().AtMostOneRow
    var recoveryReserveList = claim.getRecoveryReservesIterator(false).toList()

    for (recoveryReserve in expectedRecoveryReserves) {
      var costType = _costTypeTypelistTransformer.transform(recoveryReserve.get(DK_COST_TYPE))
      var costCategory = _costCategoryTypelistTransformer.transform(recoveryReserve.get(DK_COST_CATEGORY))
      var recoveryCategory = _recoveryCategoryTypelistTransformer.transform(recoveryReserve.get(DK_RECOVERY_CATEGORY))
      var amount = recoveryReserve.get(DK_NEW_OPEN_RECOVERY_RESERVES)
      var expectedRecoveryReserve = recoveryReserveList.firstWhere(\rr -> rr.CostType == costType and rr.CostCategory == costCategory and rr.RecoveryCategory == recoveryCategory)

      if (recoveryReserve.get(KEY_LEVEL) == DK_CLAIM) {
        assertThat(expectedRecoveryReserve.Exposure).as(MSG_ERROR_RECOVERY_RESERVE_EXPOSURE).isEqualTo(null)
      } else {
        assertThat(expectedRecoveryReserve.Exposure.DisplayName).as(MSG_ERROR_RECOVERY_RESERVE_EXPOSURE).isNotEqualTo(DK_EXPOSURE_CLAIM_LEVEL)
      }
      assertThat(new CurrencyAmount(expectedRecoveryReserve.Amount.toBigInteger(), expectedRecoveryReserve.getCurrency()))
          .as("New Open Recovery Reserves").isEqualTo(_currencyAmountTransformer.transform(amount))
    }
  }

  override function createRecoveryReserves(table : DataTable) {
    var expectedReserves = table.asMaps(String, String)

    for (reserveData in expectedReserves) {
      var editRecoveryReservePage = new Navigation<NewRecoveryReserveSet>(_proxy).ensureOnPage(\tabBar ->
          tabBar.goToClaim(_claimWrapper.get()).goToNewRecoveryReserveSet(), CurrentUser)

      var listView = editRecoveryReservePage.NewReserveSetScreen.RecoveryReservesSummaryDV.EditableRecoveryReservesLV
      if (getRecoveryReserve(reserveData, listView) == null) {
        editRecoveryReservePage.NewReserveSetScreen.Add.click()
        var newEntry = listView._Entries.first()

        newEntry.Exposure.getOptionByLabel(reserveData.get(KEY_LEVEL) == DK_CLAIM ? newEntry.Exposure.getOption(0).Text : newEntry.Exposure.getOption(1).Text).click()
        newEntry.CostType.getOptionByLabel(reserveData.get(DK_COST_TYPE)).click()
        newEntry.CostCategory.getOptionByLabel(reserveData.get(DK_COST_CATEGORY)).click()
        newEntry.RecoveryCategory.getOptionByLabel(reserveData.get(DK_RECOVERY_CATEGORY)).click()
        newEntry.NewOpenRecoveryReserves.setValue(_currencyAmountTransformer.transform(reserveData.get(DK_AMOUNT)).Amount.toString())
        editRecoveryReservePage.NewReserveSetScreen.Update.click()
        UIHelper.assertNoMessages(editRecoveryReservePage)
      }
    }
  }

  override function createCheckThatRequiresApproval(amount : String) {
    var currencyAmount = new CurrencyAmountTransformer().transform("${amount} ${CurrencyUtil.DefaultCurrency.DisplayName}")
    var tempUser = createUserWithAuthorityLimits({
        AuthorityLimitType.TC_CPTD -> new CurrencyAmount(1)
    })
    var check : Check
    var claim = _claimWrapper.get()

    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      claim.refresh()
      claim = bundle.add(claim)
      var cc = claim.newCheckCreator()
          .withPrimaryPayee(new CheckPayeeInfo()
              .withPayee(claim.Contacts.first().Contact)
              .withPayeeRole(ContactRole.TC_CHECKPAYEE)
          )
          .withCostType(CostType.TC_CLAIMCOST)
          .withCostCategory(CostCategory.TC_CLAIM_LEVEL_EXP_EXT) // not taking the value from the gherkin?
          .withPaymentMethod(PaymentMethod.TC_CHECK)
          .withPaymentType(PaymentType.TC_FINAL)
          .withCheckAmount(currencyAmount)
          .withCheckCurrency(CurrencyUtil.DefaultCurrency)
          .withReservingCurrency(CurrencyUtil.DefaultCurrency)
          .withRequestingUser(tempUser)
          .withScheduledSendDate(Date.Today)
      check = cc.createCheck()
      cc.prepareForCommit()
    }, User.util.UnrestrictedUser)

    _claimWrapper.set(claim)
    _checkWrapper.set(check)
  }

  override function createCheckOnExposure(amount : String, table : DataTable) {
    var maps = table.asMaps(String, String)
    var currencyAmount = new CurrencyAmountTransformer().transform(amount)

    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      var claim = bundle.add(_claimWrapper.get())
      claim.setValidationLevel(ValidationLevel.TC_PAYMENT)
    }, User.util.UnrestrictedUser)

    for (var row in maps) {
      var paymentType = new TypelistTransformer<PaymentType>().transform(row.get(DK_PAYMENT_TYPE))
      var eroding = new TypelistTransformer<YesNo>().transform(row.get(DK_ERODING)) == YesNo.TC_YES
      createCheck(currencyAmount, paymentType, eroding)
    }
  }

  private function createCheck(currencyAmount : CurrencyAmount, paymentType : PaymentType, eroding : boolean) {
    var wizard = new Navigation<NormalCreateCheckWizard>(_proxy).ensureOnPage(\tabBar ->
        tabBar.goToClaim(_claimWrapper.get()).goToNewCheck(), CurrentUser)
    wizard.setPayeeInfo()
    wizard.next()
    var newPaymentDV = wizard.NewCheckPayments.CheckWizard_CheckPaymentsScreen.NewCheckPaymentPanelSet_Single.NewPaymentDetailDV_default
    newPaymentDV.ReserveLineInputSet.ReserveLine.clickFirstOptionWithMatchingLabel(\txt -> txt.contains(_exposureWrapper.get().DisplayName))
    newPaymentDV.Payment_PaymentType.getOptionByLabel(paymentType.DisplayName).click()
    newPaymentDV.Payment_Eroding.setBoolValue(eroding)
    newPaymentDV.EditablePaymentLineItemsLV_default._Entries.first().Amount.Value = currencyAmount.Amount.toString()
    wizard.next()
    wizard.finish()
    UIHelper.assertNoMessages(wizard)

    _checkWrapper.set(Query.make(Payment)
        .compare(Payment#Claim, Equals, _claimWrapper.get())
        .compare(Payment#PaymentType, Equals, paymentType)
        .compare(Payment#DoesNotErodeReserves, Equals, not eroding)
        .join(Payment#Check)
        .compare(Check#ReportableAmount, Equals, currencyAmount)
        .select().AtMostOneRow.Check
    )
  }

  override function createReserveOnExposureThatRequiresApproval(amount : String) {
    var currencyAmount = new CurrencyAmountTransformer().transform(amount)
    var exposure = _exposureWrapper.get()
    var tempUser = createUserWithAuthorityLimits({
        AuthorityLimitType.TC_RCS -> new CurrencyAmount(1),
        AuthorityLimitType.TC_CTR -> new CurrencyAmount(1)
    })

    var reserve : Reserve
    var set : ReserveSet
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      set = ReserveSetBuilder.uiReadyReserveSet()
          .withRequestingUser(tempUser)
          .onClaim(_claimWrapper.get())
          .withApprovalStatus(ApprovalStatus.TC_UNAPPROVED).create(bundle)
      reserve = ReserveBuilder.uiReadyReserve(_exposureWrapper.get(), new CurrencyAmountTransformer().transform(amount))
          .withStatus(TransactionStatus.TC_PENDINGAPPROVAL)
          .onClaim(_claimWrapper.get())
          .onTransactionSet(set)
          .create(bundle)
      set.prepareForCommit()
    }, getUserByUsername(CurrentUser))

    _reserveWrapper.set(reserve)
  }

  private function createUserWithAuthorityLimits(limits : Map<AuthorityLimitType, CurrencyAmount>) : User {
    var tempUser : User
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      var profile = AuthorityLimitProfileBuilder.uiReadyProfile()
          .withUniqueName()

      for (var k in limits.Keys) {
        profile.withLimit(k, limits.get(k))
      }

      tempUser = UserBuilder.uiReadyUser()
          .withAuthorityLimitProfile(profile)
          .withAdjusterRole()
          .createAndCommit()
    }, User.util.UnrestrictedUser)
    return tempUser
  }

  override function actionReserveTransaction(action : String) {
    actionActivity(action, DK_APPROVE_RESERVE_CHANGE)
  }

  override function actionPayment(action : String) {
    actionActivity(action, DK_APPROVE_PAYMENT)
    _checkWrapper.set(Query.make(Check).compare(Check#ID, Equals, _checkWrapper.get().ID).select().AtMostOneRow)
  }

  private function actionActivity(action : String, activitySubject : String) {
    var workplan = new Navigation<ClaimWorkplan>(_proxy).ensureOnPage(\tabBar ->
        tabBar.goToClaim(_claimWrapper.get()).goToWorkplan(), CurrentUser)

    var activity = workplan.ClaimWorkplanScreen.WorkplanLV._Entries.firstWhere(\act ->
        act.Subject.Text == activitySubject and
            act.Status.Text == ActivityStatus.TC_OPEN.DisplayName
    )

    activity.Subject.click()
    var worksheet = _proxy.CurrentWorksheet as ApprovalDetailWorksheet
    if (action == DK_APPROVE) {
      worksheet.ApprovalDetailScreen.ApprovalDetailWorksheet_ApproveButton.click()
    } else {
      worksheet.ApprovalDetailScreen.ApprovalDetailWorksheet_RejectButton.click()
    }
  }

  override function verifyReserveTransactionApprovalStatus(status : String) {
    assertThat(Query.make(Reserve).compare(Reserve#ID, Equals, _reserveWrapper.get().ID).select().AtMostOneRow.Status)
        .isEqualTo(new TypelistTransformer<TransactionStatus>().transform(status))
  }

  override function verifyCheckApprovalStatus(status : String) {
    assertThat(_checkWrapper.get().Status).isEqualTo(new TypelistTransformer<TransactionStatus>().transform(status))
  }

  override function verifyPaymentApprovalStatus(status : String) {
    assertThat(_checkWrapper.get().SinglePayment.Status).isEqualTo(new TypelistTransformer<TransactionStatus>().transform(status))
  }

  override function verifyThereIsNoOpenRecoveriesforReserveLines(table : DataTable) {
    var recoveries = table.asMaps(String, String)
    var recoveryList = _claimWrapper.get().getRecoveriesIterator(false).toList()

    for (recovery in recoveries) {
      var costType = _costTypeTypelistTransformer.transform(recovery.get(DK_COST_TYPE))
      var costCategory = _costCategoryTypelistTransformer.transform(recovery.get(DK_COST_CATEGORY))
      var recoveryCategory = _recoveryCategoryTypelistTransformer.transform(recovery.get(DK_RECOVERY_CATEGORY))

      assertThat(recoveryList.where(\r -> filterTransactionLevel(recovery.get(KEY_LEVEL), r)
          and r.CostType == costType and r.CostCategory == costCategory and r.RecoveryCategory == recoveryCategory)).isEmpty()
    }
  }

  override function verifyThereIsNoOpenRecoveryReservesforReserveLines(table : DataTable) {
    var recoveryReserves = table.asMaps(String, String)
    var recoveryReserveList = _claimWrapper.get().getRecoveryReservesIterator(false).toList()

    for (recoveryReserve in recoveryReserves) {
      var costType = _costTypeTypelistTransformer.transform(recoveryReserve.get(DK_COST_TYPE))
      var costCategory = _costCategoryTypelistTransformer.transform(recoveryReserve.get(DK_COST_CATEGORY))
      var recoveryCategory = _recoveryCategoryTypelistTransformer.transform(recoveryReserve.get(DK_RECOVERY_CATEGORY))

      assertThat(recoveryReserveList.where(\rr -> filterTransactionLevel(recoveryReserve.get(KEY_LEVEL), rr)
          and rr.CostType == costType and rr.CostCategory == costCategory and rr.RecoveryCategory == recoveryCategory)).isEmpty()
    }
  }

  private function filterTransactionLevel(level : String, transaction : Transaction) : boolean {
    return (level == DK_CLAIM and transaction.Exposure == null) or (level != DK_CLAIM and transaction.Exposure != null)
  }

  private function getRecoveryReserve(reserveData : Map<String, String>, listView : EditableRecoveryReservesLV) : EditableRecoveryReservesLV.entry {
    return listView._Entries.firstWhere(\reserve ->
        hasMatchingReserveExposureLevel(reserveData.get(KEY_LEVEL), reserve) and
            reserve.CostType.Text == reserveData.get(DK_COST_TYPE) and
            reserve.CostCategory.Text == reserveData.get(DK_COST_CATEGORY) and
            reserve.RecoveryCategory.Text == reserveData.get(DK_RECOVERY_CATEGORY) and
            Double.compare(Double.parseDouble(reserve.NewOpenRecoveryReserves.Text), Double.parseDouble(reserveData.get(DK_AMOUNT))) == 0
    )
  }

  private function hasMatchingReserveExposureLevel(level : String, reserve : EditableRecoveryReservesLV.entry) : boolean {
    if (level == DK_CLAIM or reserve.Exposure.NumOptions == 1) {
      return reserve.Exposure_Readonly.Value == DK_CLAIM_LEVEL
    } else return reserve.Exposure_Readonly.Value != DK_CLAIM_LEVEL
  }

  function changeRecoveryReserveAmount(table : DataTable) {
    var newRecoveryReserveSet = new Navigation<NewRecoveryReserveSet>(_proxy).ensureOnPage(\tabBar ->
        tabBar.goToClaim(_claimWrapper.get()).goToNewRecoveryReserveSet(), CurrentUser)
    var listView = newRecoveryReserveSet.NewReserveSetScreen.RecoveryReservesSummaryDV.EditableRecoveryReservesLV

    var data = table.asMaps(String, String)
    for (var row in data) {
      var recoveryReserve = getRecoveryReserve(row, listView)
      recoveryReserve.NewOpenRecoveryReserves.setValue(row.get("New Amount"))
    }

    UIHelper.assertNoMessages(newRecoveryReserveSet)
    newRecoveryReserveSet.NewReserveSetScreen.Update.click()
  }

  function verifyRecoveryReserveChange(table : DataTable) {
    var transactionsPage = new Navigation<ClaimFinancialsTransactions>(_proxy).ensureOnPage(\tabBar ->
        tabBar.goToClaim(_claimWrapper.get()).goToClaimTransactions(), CurrentUser)
    transactionsPage.ClaimFinancialsTransactionsScreen.TransactionsLVRangeInput.getOptionByLabel(DK_RECOVERY_RESERVES).click()

    var data = table.asMaps(String, String)
    for (var row in data) {
      var changedAmount = new CurrencyAmount(row.get("New Amount")).subtract(new CurrencyAmount(row.get(DK_AMOUNT)))
      assertThat(transactionsPage.ClaimFinancialsTransactionsScreen.TransactionsLV_recoveryreserve._Entries.firstWhere(\entry ->
          entry.Amount.Value.AsBigDecimal == changedAmount.Amount and
              entry.RecoveryCategory.Value == _recoveryCategoryTypelistTransformer.transform(row.get(DK_RECOVERY_CATEGORY)).Code and
              entry.CostType.Value == _costTypeTypelistTransformer.transform(row.get(DK_COST_TYPE)).Code and
              entry.CostCategory.Value == _costCategoryTypelistTransformer.transform(row.get(DK_COST_CATEGORY)).Code and
              (row.get(KEY_LEVEL) == DK_CLAIM ? entry.Exposure.Text == "Claim-level" : true)
      )).as("No recovery reserve exists with values: ${row.Values.join(",")}").isNotNull()
    }
  }

  override function verifyRecoveryReserves(table : DataTable) {
    var reserves = table.asMaps(String, String)
    for (var reserve in reserves) {
      var editRecoveryReservePage = new Navigation<NewRecoveryReserveSet>(_proxy).ensureOnPage(\tabBar ->
          tabBar.goToClaim(_claimWrapper.get()).goToNewRecoveryReserveSet(), CurrentUser)
      var listView = editRecoveryReservePage.NewReserveSetScreen.RecoveryReservesSummaryDV.EditableRecoveryReservesLV
      var newEntry = getRecoveryReserve(reserve, listView)
      assertThat(newEntry).as("No recovery reserve exists with values: ${reserve.Values.join(",")}").isNotNull()
    }
  }

  override function recodePayment(costTypeString : String, costCategoryString : String) {
    var costType = _costTypeTypelistTransformer.transform(costTypeString)
    var costCategory = _costCategoryTypelistTransformer.transform(costCategoryString)
    var originalPayment = _checkGroupWrapper.get().Checks.first().Payments.first()
    var reserveLine = _claimWrapper.get().ReserveLines.singleWhere(\reserveLine -> reserveLine.CostType == costType and reserveLine.CostCategory == costCategory)

    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      originalPayment = bundle.add(originalPayment)
      if (originalPayment.hasDeductibleLineItem()) {
        originalPayment.unlinkDeductible()
      }
      originalPayment.linkDeductible()

      var onsetPayment = originalPayment.getOnset() ?: originalPayment.createOnsetPayment(true, true)
      onsetPayment.ReserveLine = reserveLine
      originalPayment.recodePayment(new java.util.ArrayList<Payment>(){onsetPayment}.toTypedArray())
    }, CurrentUser)
  }

  override function verifyReserves(table : DataTable) {
    var expectedReserveTxns = table.asMaps(String, String)

    var financialsSummary = new Navigation<ClaimFinancialsSummary>(_proxy).ensureOnPage(\tabBar ->
        tabBar.goToClaim(_claimWrapper.get()).goToClaimFinancials(), CurrentUser)

    for (txn in expectedReserveTxns) {
      var costType = txn.get(DK_COST_TYPE)
      var costCategory = txn.get(DK_COST_CATEGORY)
      var amount = txn.get(DK_AMOUNT)

      var expectedEntry = financialsSummary.findEntryByCostAndCategory(costType, costCategory)
      var expectedAmount = _currencyAmountTransformer.transform(amount)
      assertThat(expectedEntry.RemainingReserves).hasCurrencyAmount(expectedAmount)
    }
  }

  override function verifyPayment(amountString : String, paymentTypeString : String) {
    var paymentType = _paymentTypeTypelistTransformer.transform(paymentTypeString)

    var transactions = new Navigation<ClaimFinancialsTransactions>(_proxy).ensureOnPage(\tabBar ->
        tabBar.goToClaim(_claimWrapper.get()).MenuLinks.goToClaimTransactions(), CurrentUser)
    transactions.ClaimFinancialsTransactionsScreen.TransactionsLVRangeInput.clickByLabelSubstr(DK_PAYMENTS)
    var lastPayment = transactions.ClaimFinancialsTransactionsScreen.TransactionsLV_payment._Entries.last()
    var transactionsDetail = lastPayment.TransactionAmountViewDetail.click() as ClaimFinancialsTransactionsDetail

    var paymentDetail = transactionsDetail.ClaimFinancialsTransactionsDetailScreen.TransactionDetailPanelSet_payment
    assertThat(paymentDetail.TransactionPaymentDV.PaymentBasicsInputSet.Amount).hasCurrencyAmount(_currencyAmountTransformer.transform(amountString))
    assertThat(paymentDetail.TransactionPaymentDV.PaymentBasicsInputSet.PaymentType.TypeKeyValue).isEqualTo(paymentType)
  }

  override function verifyCheck(checkAmount : String, payeeName : String) {
    var currencyAmount = _currencyAmountTransformer.transform(checkAmount)

    var financialsChecks = new Navigation<ClaimFinancialsChecks>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).MenuLinks.goToClaimChecks(), CurrentUser)
    var lastCheck = financialsChecks.ClaimFinancialsChecksScreen.ChecksLV._Entries.last()
    assertThat(lastCheck.GrossAmount).hasCurrencyAmount(currencyAmount)
    assertThat(lastCheck.PayTo.Text).isEqualToIgnoringCase(payeeName)
  }

  override function verifyCannotFinishCheckWizard(message : String) {
    var normalCreateCheckWizard = _proxy.CurrentPage as NormalCreateCheckWizard
    normalCreateCheckWizard.gotoInstructions()
    var messages = UIHelper.checkForMessages(normalCreateCheckWizard).flatMap(\messages -> messages.AllMessages)
  }

  override function verifyPaymentOptionsUnavailable() {
    var claimSummary = new Navigation<ClaimSummary>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()), CurrentUser)
    var claimMenuActions_newTransaction = claimSummary.ClaimMenuActions.ClaimMenuActions_NewTransaction
    assertThat(claimMenuActions_newTransaction.ClaimMenuActions_NewTransaction_ReserveSet.Enabled).as("Expected reserve menu link to be disabled").isFalse()
    assertThat(claimMenuActions_newTransaction.ClaimMenuActions_NewTransaction_CheckSet.Enabled).as("Expected check menu link to be disabled").isFalse()
    assertThat(claimMenuActions_newTransaction.ClaimMenuActions_NewOtherTrans.ClaimMenuActions_NewTransaction_Check.Enabled).as("Expected manual check menu link to be disabled").isFalse()
  }

  override function verifyClaimHasReserve(table : DataTable) {
    var claim = _claimWrapper.get()
    var reserves = claim.getReservesIterator(false).toList()

    for (row in table.asMaps(String, String)) {
      var costType = _costTypeTypelistTransformer.transform(row.get(DK_COST_TYPE))
      var costCategory = _costCategoryTypelistTransformer.transform(row.get(DK_COST_CATEGORY))
      var reservingAmount = _currencyAmountTransformer.transform(row.get(DK_AMOUNT))

      assertThat(
          reserves.firstWhere(\res -> res.CostType == costType and res.CostCategory == costCategory and res.ReservingAmount == reservingAmount)
      ).as(
          "No reserve exists on the claim for ${row.Values.join(",")}. Reserve should exist"
      ).isNotNull()
    }
  }

  override function verifyClaimDoesNotHaveReserve(table : DataTable) {
    var claim = _claimWrapper.get()
    for (row in table.asMaps(String, String)) {
      var costType = row.get(DK_COST_TYPE)
      var costCategory = row.get(DK_COST_CATEGORY)
      var reservingAmount = row.get(DK_AMOUNT)
      assertThat(
          claim.getReservesIterator(false).toList().firstWhere(\res ->
              res.CostType == _costTypeTypelistTransformer.transform(costType) and
                  res.CostCategory == _costCategoryTypelistTransformer.transform(costCategory) and
                  res.ReservingAmount == _currencyAmountTransformer.transform(reservingAmount)
          )
      ).as(
          "Reserve exists on the claim for ${row.Values.join(",")}. Reserve should not exist"
      ).isNull()
    }
  }

  override function createCheckPaymentOnTheReserveLine(table : DataTable) {
    var paymentMaps = table.asMaps(String, String)
    var claim = _claimWrapper.get()

    for (paymentMap in paymentMaps) {
      var costType = _costTypeTypelistTransformer.transform(paymentMap.get(DK_COST_TYPE))
      var costCategory = _costCategoryTypelistTransformer.transform(paymentMap.get(DK_COST_CATEGORY))
      var amount = _currencyAmountTransformer.transform(paymentMap.get(DK_AMOUNT))
      var paymentType = _paymentTypeTypelistTransformer.transform(paymentMap.get(DK_PAYMENT_TYPE))
      var eroding = paymentMap.get("Eroding") == "Yes"
      var checkStatus = _transactionStatusTypelistTransformer.transform(paymentMap.get(KEY_CHECK_STATUS))
      var paymentStatus = _transactionStatusTypelistTransformer.transform(paymentMap.get(KEY_PAYMENT_STATUS))

      gw.transaction.Transaction.runWithNewBundle(\bundle -> {
        claim = bundle.add(claim)
        var reserveLine = claim.ReserveLines.firstWhere(\rl -> rl.CostType == costType and rl.CostCategory == costCategory)
        CheckBuilder.uiReadySinglePaymentCheck(reserveLine, amount, amount.Currency,
            checkStatus, paymentStatus, paymentType, eroding)
            .create(bundle)
      }, CurrentUser)
    }
    _claimWrapper.set(claim)
  }

  override function createCheckPaymentOnTheReserveLineWithinACheckGroup(table : DataTable) {
    var paymentMaps = table.asMaps(String, String)
    var claim = _claimWrapper.get()
    var checkGroup : CheckGroup = null

    for (paymentMap in paymentMaps) {
      var costType = _costTypeTypelistTransformer.transform(paymentMap.get(DK_COST_TYPE))
      var costCategory = _costCategoryTypelistTransformer.transform(paymentMap.get(DK_COST_CATEGORY))
      var amount = _currencyAmountTransformer.transform(paymentMap.get(DK_AMOUNT))
      var checkStatus = _transactionStatusTypelistTransformer.transform(paymentMap.get(KEY_CHECK_STATUS))
      var paymentStatus = _transactionStatusTypelistTransformer.transform(paymentMap.get(KEY_PAYMENT_STATUS))

      gw.transaction.Transaction.runWithNewBundle(\bundle -> {
        claim = bundle.add(claim)
        var reserveLine = claim.ReserveLines.firstWhere(\rl -> rl.CostType == costType and rl.CostCategory == costCategory)
        checkGroup = CheckGroupBuilder.uiReadySinglePaymentTwoCheckCheckGroup(reserveLine, amount, checkStatus, paymentStatus)
            .create(bundle)
      }, CurrentUser)
    }

    if (paymentMaps.Count == 1) {
      _checkGroupWrapper.set(checkGroup)
    }
  }

  override function voidTheCheck() {
    var voidStopCheck = voidStopTheCheck()
    if (voidStopCheck != null) {
      voidStopCheck.VoidStopCheckScreen.VoidStopCheck_VoidButton.click()
    }
  }

  override function stopTheCheck() {
    var voidStopCheck = voidStopTheCheck()
    if (voidStopCheck != null) {
      voidStopCheck.VoidStopCheckScreen.VoidStopCheck_StopButton.click()
    }
  }

  override function deleteTheCheck() {
    var financialsChecks = new Navigation<ClaimFinancialsChecks>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).MenuLinks.goToClaimChecks(), CurrentUser)
    var checkDetails = financialsChecks.ClaimFinancialsChecksScreen.ChecksLV._Entries.first().GrossAmount.click()
    var deleteButton = checkDetails.ClaimFinancialsChecksDetailScreen.ClaimFinancialsChecksDetail_DeleteButton
    if (deleteButton.Enabled) {
      deleteButton.click()
    }
  }

  override function verifyCheckStatus(statusStr : String) {
    var financialsChecks = new Navigation<ClaimFinancialsChecks>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).MenuLinks.goToClaimChecks(), CurrentUser)
    assertThat(financialsChecks.ClaimFinancialsChecksScreen.ChecksLV._Entries.first().Status).hasText(statusStr)
  }

  override function verifyCheckIsDeleted() {
    var claim = Query.make(Claim).compare(Claim#ClaimNumber, Equals, _claimWrapper.get().ClaimNumber).select().AtMostOneRow
    assertThat(claim.getChecksIterator(false).hasNext()).isFalse()
  }

  override function transferTheCheckToFirstClaim() {
    var financialsChecks = new Navigation<ClaimFinancialsChecks>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).MenuLinks.goToClaimChecks(), CurrentUser)
    var checkDetails = financialsChecks.ClaimFinancialsChecksScreen.ChecksLV._Entries.first().GrossAmount.click()
    var transferButton = checkDetails.ClaimFinancialsChecksDetailScreen.ClaimFinancialsChecksDetail_TransferButton
    if (transferButton.Enabled) {
      var checkTransfer = transferButton.click()
      //checkTransfer.CheckTransferScreen.CheckTransferDV.Claim.Value = _claimsWrapper.get().first().ClaimNumber
      var claimSearch = checkTransfer.CheckTransferScreen.CheckTransferDV.Claim.SelectClaim.click()
      var claimSearchScreen = claimSearch.ClaimSearchScreen
      var claimSearchDV = claimSearchScreen.ClaimSearchDV
      claimSearchDV.ClaimSearchRequiredInputSet.ClaimNumber.Value = _claimsWrapper.get().first().ClaimNumber
      claimSearchDV.ClaimSearchAndResetInputSet.Search.click()
      claimSearchScreen.ClaimSearchResultsLV_active._Entries.first().select()

      checkTransfer.CheckTransferScreen.CheckTransfer_TransferButton.click()
    }
  }

  override function reissueTheCheck() {
    var financialsChecks = new Navigation<ClaimFinancialsChecks>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).MenuLinks.goToClaimChecks(), CurrentUser)
    var checkDetails = financialsChecks.ClaimFinancialsChecksScreen.ChecksLV._Entries.first().GrossAmount.click()
    var reissueButton = checkDetails.ClaimFinancialsChecksDetailScreen.ClaimFinancialsChecksDetail_ReissueButton
    if (reissueButton.Enabled) {
      var reissueCheck = reissueButton.click()
      reissueCheck.ReissueCheckScreen.ReissueCheckDV.Check_Comments.setValue("reissueTheCheck")
      reissueCheck.ReissueCheckScreen.ReissueCheck_VoidAndReissueButton.click()
    }
  }

  private function voidStopTheCheck() : VoidStopCheck {
    var financialsChecks = new Navigation<ClaimFinancialsChecks>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).MenuLinks.goToClaimChecks(), CurrentUser)
    var checkDetails = financialsChecks.ClaimFinancialsChecksScreen.ChecksLV._Entries.first().GrossAmount.click()
    var voidStopCheck = checkDetails.ClaimFinancialsChecksDetailScreen.ClaimFinancialsChecksDetail_VoidStopButton.click()
    if (voidStopCheck.VoidStopCheckScreen.VoidStopCheckDV.Comments.Enabled) {
      voidStopCheck.VoidStopCheckScreen.VoidStopCheckDV.Comments.selectFirstValidOption()
    }
    return voidStopCheck
  }

  override function cloneCheck() {
    var financialsChecks = new Navigation<ClaimFinancialsChecks>(_proxy).ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).MenuLinks.goToClaimChecks(), CurrentUser)
    var lastCheck = financialsChecks.ClaimFinancialsChecksScreen.ChecksLV._Entries.last()
    var checkDetail = lastCheck.GrossAmount.click()
    var cloneCheckWizard = checkDetail.ClaimFinancialsChecksDetailScreen.ClaimFinancialsChecksDetail_CloneButton.click()
    var addressContainer = cloneCheckWizard.NewCheckPayees.CheckWizard_CheckPayeesScreen.NewCheckPayeeDV.MailingAddressInputSet.CCAddressInputSet.globalAddressContainer
    if (addressContainer.globalAddress.GlobalAddressInputSet_default.PostalCode.Value.length == 0) {
      addressContainer.globalAddress.GlobalAddressInputSet_default.PostalCode.Value = "55555"
    }
    cloneCheckWizard.Next.click()
    cloneCheckWizard.Next.click()
    cloneCheckWizard.Finish.click()
  }

  override function createManualCheck(amountString : String, paymentTypeString : String) {
    var paymentType = new TypelistTransformer<PaymentType>().transform(paymentTypeString)
    var wizard = new Navigation<ManualCreateCheckWizard>(_proxy).ensureOnPage(\tabBar ->
        tabBar.goToClaim(_claimWrapper.get()).goToNewManualCheck(), CurrentUser)
    wizard.setPayeeInfo()
    wizard.goNext()
    var newPaymentDV = wizard.NewCheckPayments.ManualCheckWizard_CheckPaymentsScreen.NewCheckPaymentPanelSet_Single.NewPaymentDetailDV_default
    newPaymentDV.ReserveLineInputSet.ReserveLine
        .clickFirstOptionWithMatchingLabel(\text -> text.contains(_exposureWrapper.get().DisplayName)
            && text.contains(_costTypeWrapper.get().DisplayName)
            && text.contains(_costCategoryWrapper.get().DisplayName))
    newPaymentDV.Payment_PaymentType.TypeKeyValue = paymentType
    newPaymentDV.EditablePaymentLineItemsLV_default._Entries.first().Amount.Value = _currencyAmountTransformer.transform(amountString).Amount.toString()
    wizard.goNext()
    wizard.finishCreatingTheCheck()
  }

  override function createQuickCheck(table : DataTable) {
    var chekcsDetails = table.asMaps(String, String)

    for (checkDetails in chekcsDetails) {
      var costCategory = checkDetails.get(DisplayKey.get("Web.Financials.BulkPay.InvoiceItem.CostCategory"))
      var quickCheckWizard = new Navigation<QuickCreateCheckWizard>(_proxy).ensureOnPage(\tabBar ->
          tabBar.goToClaim(_claimWrapper.get()).goToClaimFinancials().goToQuickCheckScreenForFirstCostCategoryMatch(costCategory), CurrentUser)

      var payee = checkDetails.get(DisplayKey.get("LV.Financials.CheckPayees.CheckPayee.Payee"))
      var paymentType = checkDetails.get(DisplayKey.get("NVV.Financials.NewPaymentDetail.Payment.PaymentType"))
      var eroding = checkDetails.get(DisplayKey.get("Web.NewCheckWizard.NewPaymentDetail.Eroding"))
      var currency = checkDetails.get(DisplayKey.get("Wizard.QuickCheckWizard.QuickCheckBasics.QuickCheckBasicsDV.Currency"))
      var amount = checkDetails.get(DisplayKey.get("LV.Financials.EditablePaymentLineItems.PaymentLineItem.Amount"))
      var currencyAmount = new CurrencyAmount(amount)

      quickCheckWizard.createCheck(payee, paymentType, eroding, currency, currencyAmount.Amount.toString())
    }
  }

  override function verifySubrogationExists() {
    assertThat(_claimWrapper.get().SubrogationStatus)
        .as("Expected to have a subrogation oportunity on the claim but the subrogation status is ${_claimWrapper.get().SubrogationStatus}")
        .isNotNull()
  }

  override function verifyRecoveriesInSubrogation(table : DataTable) {
    var claim = _claimWrapper.get()
    var summary = claim.SubrogationSummary

    var actualResponsibleParties = summary.SubroAdverseParties
    assertThat(summary.SubroAdverseParties)
        .as("Expected to have responsible parties (${table})")
        .isNotEmpty()

    var expectedResponsibleParties = table.asMaps(String, String)
    for (responsibleParty in expectedResponsibleParties) {
      var aParty = actualResponsibleParties.firstWhere(\actual -> actual.AdverseParty.DisplayName == responsibleParty.get(DK_RESPONSIBLE_PARTY))
      assertThat(aParty.AdverseParty.DisplayName == responsibleParty.get(DK_RESPONSIBLE_PARTY))
          .as("Responsible party not found (${responsibleParty})")
          .isTrue()
      assertThat(aParty.Fault == new java.math.BigDecimal(responsibleParty.get(DK_LIABILITY)))
          .as("Expected Fault incorrect (${aParty.Fault})")
          .isTrue()
//      assertThat(aParty.ExpectedRecoveryAmount == _currencyAmountTransformer.transform(responsibleParty.get(DK_EXPECTED_RECOVERY)))
//          .as("Expected Recover Amount Incorrect (${aParty.ExpectedRecoveryAmount})")
//          .isTrue()
    }
  }

  override function referSubrogationToExposureLevel() {
    var subrogationGeneral = new Navigation<SubrogationGeneral>(_proxy)
        .ensureOnPage(\tabBar -> tabBar.goToClaim(_claimWrapper.get()).goToSubrogationGeneral(), CurrentUser)
    subrogationGeneral.ClaimSubroSummaryScreen.SubrogationMainPanelSet.Edit.click()

    subrogationGeneral.ClaimSubroSummaryScreen.SubrogationMainPanelSet.SubrogateIndividualExposures.setValue("true")
    subrogationGeneral.ClaimSubroSummaryScreen.SubrogationMainPanelSet.Update.click()
  }

  override function verifyExposureHasSubrogationOwner() {
    var claim = Query.make(Claim).compare(Claim#ClaimNumber, Equals, _claimWrapper.get().ClaimNumber).select().AtMostOneRow
    _claimWrapper.set(claim)
    for (subrogation in claim.SubrogationSummary.Subrogations) {
      var assignedTo = subrogation.AssignedUser ?: subrogation.AssignedGroup ?: subrogation.AssignedQueue
      assertThat(assignedTo).as("Subrogation: ${subrogation.DisplayName} is not assigned").isNotNull()
    }
  }

  override function theClaimHasAPayment(table : DataTable) {
    var claim = Query.make(Claim).compare(Claim#ClaimNumber, Equals, _claimWrapper.get().ClaimNumber).select().AtMostOneRow
    var paymentMaps = table.asMaps(String, String)

    for (paymentMap in paymentMaps) {
      var costType = new TypelistTransformer<CostType>().transform(paymentMap.get(DK_COST_TYPE))
      var currencyAmount = _currencyAmountTransformer.transform(paymentMap.get(DK_AMOUNT))
      var costCategory = new TypelistTransformer<CostCategory>().transform(paymentMap.get(DK_COST_CATEGORY))
      var paymentType = new TypelistTransformer<PaymentType>().transform(paymentMap.get(DK_PAYMENT_TYPE))
      var eroding = new TypelistTransformer<YesNo>().transform(paymentMap.get(DK_ERODING)) == YesNo.TC_YES

      gw.transaction.Transaction.runWithNewBundle(\bundle -> {
        claim = bundle.add(claim)
        var payee = claim.Contacts.first().Contact
        claim.newCheckCreator()
            .withCostType(costType)
            .withCheckAmount(currencyAmount)
            .withCostCategory(costCategory)
            .withPaymentType(paymentType)
            .withErodesReserves(eroding)
            .withPrimaryPayee(new CheckPayeeInfo().withPayee(payee)
                .withRecipient(payee).withPayTo(payee.DisplayName).withPayeeRole(TC_OTHER).withMailingAddress(payee.PrimaryAddress))
            .createAndPrepareForCommit()
      }, CurrentUser)
      _claimWrapper.set(Query.make(Claim).compare(Claim#ClaimNumber, Equals, _claimWrapper.get().ClaimNumber).select().AtMostOneRow)
    }
  }

  override function startCheckWizardForSpecificVendor(contactSubTypeName : String,
                                                      orgName : String = null,
                                                      fname : String = null,
                                                      lname : String = null) {
    var claim = _claimWrapper.get()
    var normalCreateCheckWizard = new Navigation<NormalCreateCheckWizard>(_proxy)
        .ensureOnPage(\tabBar -> tabBar.goToClaim(claim)
            .goToNewCheck(), CurrentUser)
    var addressbookPopup = normalCreateCheckWizard.NewCheckPayees
        .CheckWizard_CheckPayeesScreen
        .NewCheckPayeeDV
        .PrimaryPayee_Name
        .MenuItem_Search
        .click()

    searchAddressBook(contactSubTypeName, orgName, fname, lname).select()
  }

  override function createPaymentOnReserveline(paymentInfo : Map<String, String>) {
    var claim = _claimWrapper.get()
    var normalCreateCheckWizard = _proxy.CurrentPage as NormalCreateCheckWizard
    var payments = normalCreateCheckWizard.gotoPayments()

    payments.NewPaymentDetailDV.ReserveLineInputSet.ReserveLine
        .clickFirstOptionWithMatchingLabel(\text -> text.contains(_exposureWrapper.get().DisplayName)
            && text.contains(paymentInfo.get("Cost Type"))
            && text.contains(paymentInfo.get("Cost Category")))
    payments.NewPaymentDetailDV.Payment_PaymentType
        .clickFirstOptionWithMatchingLabel(\text -> text.containsIgnoreCase(paymentInfo.get("Payment Type")))
    payments.NewPaymentDetailDV
        .EditablePaymentLineItemsLV_default
        ._Entries
        .first()
        .Amount
        .setValue(new CurrencyAmountTransformer().transform(paymentInfo.get("Amount")).Amount.toString())
  }

  override function navigateToCheckDeductions() {
    var claim = _claimWrapper.get()
    var normalCreateCheckWizard = _proxy.CurrentPage as NormalCreateCheckWizard
    var instructions = normalCreateCheckWizard.gotoInstructions()

    instructions.NewPaymentInstructionsDV_default.CheckWizardCheckSummaryInputSet.Check_Deductions.click()
  }

  override function verifyStateWithholdingAmountIsDeducted(amount : String) {
    var checkDeductionsPopup = _proxy.CurrentPage as CheckWizard_PaymentDeductionsPagePopup
    var stateWithholdingEntry = checkDeductionsPopup.CheckWizard_AddPayeeScreen.PaymentDeductionsDV.PaymentDeductionsLV._Entries
        .singleWhere(\elt -> elt.DeductionType.TypeKeyValue == DeductionType.TC_STATE_WITHHOLDING_EXT)

    assertThat(stateWithholdingEntry.Amount.Text.remove("$").remove(".00")).isEqualTo(amount)
  }

  private function searchAddressBook(contactSubTypeName : String,
                                     orgName : String = null,
                                     fname : String = null,
                                     lname : String = null) : AddressBookSearchLV.entry {
    var addressbookPopup = _proxy.CurrentPage as NewCheckWizardAddressBookPickerPopup
    var searchCriteria = addressbookPopup.NewCheckWizardAddressBookSearchScreen.AddressBookSearchDV
    var abSearchLV : AddressBookSearchLV.entry

    searchCriteria.ContactSubtype.clickFirstOptionWithMatchingLabel(\label -> label.containsIgnoreCase(contactSubTypeName))

    if (orgName == null) {
      searchCriteria.NameInputSet_Person.GlobalPersonNameInputSet_default.FirstName.setValue(fname)
      searchCriteria.NameInputSet_Person.GlobalPersonNameInputSet_default.LastName.setValue(lname)
    } else {
      searchCriteria.NameInputSet_Contact.GlobalContactNameInputSet_default.Name.setValue(orgName)
    }

    searchCriteria.SearchAndResetInputSet.SearchLinksInputSet.Search.click()

    abSearchLV = addressbookPopup.NewCheckWizardAddressBookSearchScreen.AddressBookSearchLV._Entries.first()

    if (abSearchLV == null) {
      throw ("Could not find contact")
    }

    return abSearchLV
  }
}

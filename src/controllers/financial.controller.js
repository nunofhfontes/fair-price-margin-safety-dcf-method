const financialService = require('../services/financial.service');
const CashFlowService = require('../services/cashFlow.service');

const financialStatementService = require('../services/financialStatement.service');
const balanceSheetStatementService = require('../services/balanceSheet.service');

class FinancialStatementController {

  // getting tickers for the Searchbox on the frontend
  async getTickers(req, res, next) {

    console.log('ROUTER: getting tickers');

    // call the service layer to get ticker data
    let tickers = await financialService.getTickers();

    console.log('ROUTER: checking tickers.size', tickers.size);

    // Convert the map to a JavaScript object
    const tickersMappedToObject = Object.fromEntries(tickers);
    res.status(200).json(tickersMappedToObject);
  }

  // This method gets the full analysis
  // income, balance and fcf
  // margins
  // return of capital
  async getFullAnalysisForTicker(req, res, next) {

    let cik = await financialService.getCikForTicker(req.params.companyId);
    let factsRaw = await financialService.getFactsForTicker(cik, req.params.companyId);

    //store facts raw data on Cache (and DB ?? parsed dta??) --->>> maybe store the analysis result on the DB and discard the rawData

    //field name in the json -> SalesRevenueNet
    //TODO --->>> ADD THIS FIELD  "RevenueFromContractWithCustomerExcludingAssessedTax": {
    //   "label": "Revenue from Contract with Customer, Excluding Assessed Tax",
    //   "description": "Amount, excluding tax collected from customer, of revenue from satisfaction of performance obligation by transferring promised good or service to customer. Tax collected from customer is tax assessed by governmental authority that is both imposed on and concurrent with specific revenue-producing transaction, including, but not limited to, sales, use, value added and excise.",
    let revenues3y = await financialStatementService.getRevenueForYears(factsRaw, 2023, 2020);
    let costOfRevenues = await financialStatementService.getCostOfRevenues(factsRaw);
    let grossProfit = await financialStatementService.getGrossProfit(factsRaw);
    let sellingGeneralAndAdministrativeExpense = await financialStatementService.getSellingGeneralAndAdministrativeExpense(factsRaw);
    let depreciationAndAmortization = await financialStatementService.getDepreciationAndAmortization(factsRaw);
    let totalOperatingExpenses = await financialStatementService.getTotalOperatingExpenses(factsRaw);
    let operatingIncomeLoss = await financialStatementService.getOperatingIncomeLoss(factsRaw);
    let interestExpense = await financialStatementService.getInterestExpense(factsRaw);
    let investmentIncomeInterestAndDividend = await financialStatementService.getInvestmentIncomeInterestAndDividends(factsRaw);
    let nonOperatingIncomeExpense = await financialStatementService.getNonOperatingIncomeExpenses(factsRaw);
    let otherNonoperatingIncomeExpense = await financialStatementService.getOtherNonOperatingIncomeExpenses(factsRaw);
    let ebtIncludingUnsualItems = await financialStatementService.getEBTIncludingUnsualItems(factsRaw);
    let incomeTaxExpense = await financialStatementService.getIncomeTaxExpenseBenefit(factsRaw);
    let earningsFromContinuingOperations = await financialStatementService.getEarningsFromContinuingOperations(factsRaw);
    let netIncome = await financialStatementService.getNetIncome(factsRaw);
    let weightAvgNrOfDilutSharesOutst = await financialStatementService.getWeightedAverageNumberOfDilutedSharesOutstanding(factsRaw);
    //TODO - NF - CommonStockDividendsPerShareDeclared
    let commonStockDividendsPerShareCashPaid = await financialStatementService.getCommonStockDividendsPerShareCashPaid(factsRaw);
    //TODO - NF - EffectiveIncomeTaxRateContinuingOperations --> check if this is the correct field??
    const effectiveTaxRate = await financialStatementService.getEffectiveTaxRate(factsRaw);


    //BalanceSheet fields
    let cashAndCashEquivalents = await balanceSheetStatementService.getCashAndCashEquivalents(factsRaw);
    //TODO - NF - Is this field the Total of Cash & ST Investments?
    let cashAndCashEquivalentsRestricted = await balanceSheetStatementService.getCashAndCashEquivalentsRestricted(factsRaw);
    let accountsReceivables = await balanceSheetStatementService.getAccountsReceivables(factsRaw);
    let inventory = await balanceSheetStatementService.getInventory(factsRaw);
    let otherCurrentAssets = await balanceSheetStatementService.getOtherCurrentAssets(factsRaw);
    let totalCurrentAssets = await balanceSheetStatementService.getTotalCurrentAssets(factsRaw);
    let netPropertyPlantEquipment = await balanceSheetStatementService.getNetPropertyPlantEquipment(factsRaw);
    let accumulatedDepreciation = await balanceSheetStatementService.getAccumulatedDepreciation(factsRaw);
    let grossPropertyPlantAndEquipment = await balanceSheetStatementService.getGrossPropertyPlantAndEquipment(factsRaw);
    
    // let long term investments
    let goodwill = await balanceSheetStatementService.getGoodwill(factsRaw);
    
    let totalAssets = await balanceSheetStatementService.getTotalAssets(factsRaw);
    let accountsPayableCurrent = await balanceSheetStatementService.getAccountsPayableCurrent(factsRaw);
    let accruedIncomeTaxesCurrent = await balanceSheetStatementService.getAccruedIncomeTaxesCurrent(factsRaw);


    // Total current Liabilities
    // LiabilitiesCurrent




    // Accrued Expenses = AccruedLiabilitiesCurrent
    //              + AccruedCompensationCurrent
    //              + AccruedInterestPayableCurrent
    //              + AccruedIncomeTaxesCurrent
    //              + OtherAccruedLiabilitiesCurrent


    
    // let totalLongTermDebt = await balanceSheetStatementService.getTotalLongTermDebt(factsRaw);
    // let totalShareholderEquity = await balanceSheetStatementService.getTotalShareholderEquity(factsRaw);


    // let fcf = await financialService.fetchFreeCashFlowForTicker(cik, req.params.companyId);
    // let fcfCagr = await CashFlowService.calculateFcfCagr(req.params.companyId, fcf);
    // let dcf = await CashFlowService.calculateDCF(req.params.companyId, cik, fcf, fcfCagr);

    //console.log(revenues3y);

    // Convert the map to a JavaScript object
    //const fcfMappedToObject = Object.fromEntries(revenues3y);
    //res.status(200).json(revenues3y);


    // TO RETURN A MAP
    // Convert the map to a JavaScript object
    const revenuesMappedToObject = Object.fromEntries(revenues3y);
    const costOfRevenuesMappedToObject = Object.fromEntries(costOfRevenues);
    const grossProfitMappedToObject = Object.fromEntries(grossProfit);
    const sellingGeneralAndAdministrativeExpenseMappedToObject = Object.fromEntries(sellingGeneralAndAdministrativeExpense);
    const depreciationAndAmortizationMappedToObject = Object.fromEntries(depreciationAndAmortization);
    const totalOperatingExpensesMappedToObject = Object.fromEntries(totalOperatingExpenses);
    const operatingIncomeLossMappedToObject = Object.fromEntries(operatingIncomeLoss);
    const interestExpenseMappedToObject = Object.fromEntries(interestExpense);
    const investmentIncomeInterestAndDividendMappedToObject = Object.fromEntries(investmentIncomeInterestAndDividend);
    const nonoperatingIncomeExpenseMappedToObject = Object.fromEntries(nonOperatingIncomeExpense);
    const otherNonoperatingIncomeExpenseMappedToObject = Object.fromEntries(otherNonoperatingIncomeExpense);
    const ebtIncludingUnsualItemsMappedToObject = Object.fromEntries(ebtIncludingUnsualItems);
    const incomeTaxExpenseMappedToObject = Object.fromEntries(incomeTaxExpense);
    const earningsFromContinuingOperationsMappedToObject = Object.fromEntries(earningsFromContinuingOperations);
    const netIncomeMappedToObject = Object.fromEntries(netIncome);
    const weightAvgNrOfDilutSharesOutstMappedToObject = Object.fromEntries(weightAvgNrOfDilutSharesOutst);
    const commonStockDividendsPerShareCashPaidMappedToObject = Object.fromEntries(commonStockDividendsPerShareCashPaid);
    const effectiveTaxRateMappedToObject = Object.fromEntries(effectiveTaxRate);
  
    //balanceSheet fields
    const cashAndCashEquivalentsMappedToObject = Object.fromEntries(cashAndCashEquivalents);
    const cashAndCashEquivalentsRestrictedMappedToObject = Object.fromEntries(cashAndCashEquivalentsRestricted);
    const accountsReceivablesMappedToObject = Object.fromEntries(accountsReceivables);
    const inventoryMappedToObject = Object.fromEntries(inventory);
    const otherCurrentAssetsMappedToObject = Object.fromEntries(otherCurrentAssets);
    const totalCurrentAssetsMappedToObject = Object.fromEntries(totalCurrentAssets);
    const netPropertyPlantAndEquipmentMappedToObject = Object.fromEntries(netPropertyPlantEquipment);
    const accumulatedDepreciationMappedToObject = Object.fromEntries(accumulatedDepreciation);
    const grossPropertyPlantAndEquipmentMappedToObject = Object.fromEntries(grossPropertyPlantAndEquipment);
    const goodwillMappedToObject = Object.fromEntries(goodwill);
    const totalAssetsMappedToObject = Object.fromEntries(totalAssets);
    const accountsPayableCurrentMappedToObject = Object.fromEntries(accountsPayableCurrent);
    const accruedIncomeTaxesCurrentMappedToObject = Object.fromEntries(accruedIncomeTaxesCurrent);


    


    // AccruedIncomeTaxesCurrent


// "LongTermInvestments": {
//         "label": "Long-term Investments",
//         "description": "The total amount of investments that are intended to be held for an extended period of time (longer than one operating cycle).",
//         "units": {

    // console.log(fcfMappedToObject);
    res.status(200).json({
      incomeStatement: {
        revenues: {
          revenues: revenuesMappedToObject,
          costOfRevenues: costOfRevenuesMappedToObject,
          grossProfit: grossProfitMappedToObject,
        },
        operatingExpensesAndIncome: {
          sellingGeneralAndAdministrativeExpense: sellingGeneralAndAdministrativeExpenseMappedToObject,
          depreciationAndAmortization: depreciationAndAmortizationMappedToObject,
          totalOperatingExpenses: totalOperatingExpensesMappedToObject,
          operatingIncomeLoss: operatingIncomeLossMappedToObject,
        },
        earningsFromContinuingOperations: {
          interestExpense: interestExpenseMappedToObject,
          interestAndInvestmentIncome: investmentIncomeInterestAndDividendMappedToObject,
          netInterestExpenses: nonoperatingIncomeExpenseMappedToObject,
          otherNonoperatingIncomeExpense: otherNonoperatingIncomeExpenseMappedToObject,
          ebtIncludingUnsualItems: ebtIncludingUnsualItemsMappedToObject,
          incomeTaxExpense: incomeTaxExpenseMappedToObject,
          earningsFromContinuingOperations: earningsFromContinuingOperationsMappedToObject,
        },
        netIncome: {
          netIncomeToCompany: {},
          netIncome: {
            netIncome: netIncomeMappedToObject
          },
          netIncToCommonExclExtraItems: {},
        },
        supplementalItems: {
          weightAvgNrOfDilutSharesOutst: weightAvgNrOfDilutSharesOutstMappedToObject,
          commonStockDividendsPerShareCashPaid: commonStockDividendsPerShareCashPaidMappedToObject,
          effectiveTaxRate: effectiveTaxRateMappedToObject,
        }
      },
      balanceSheetStatement: {
        cashAndShortTermInvestments: {
          cashAndCashEquivalents: cashAndCashEquivalentsMappedToObject,
          cashAndCashEquivalentsRestricted: cashAndCashEquivalentsRestrictedMappedToObject,
        },
        receivables: {
          totalAccountsReceivables: accountsReceivablesMappedToObject,
        },
        currentAssets: {
          inventory: inventoryMappedToObject,
          otherCurrentAssets: otherCurrentAssetsMappedToObject,
          totalCurrentAssets: totalCurrentAssetsMappedToObject,
        },
        longTermAssets: {
          grossPropertyPlantAndEquipment: grossPropertyPlantAndEquipmentMappedToObject,
          accumulatedDepreciation: accumulatedDepreciationMappedToObject,
          netPropertyPlantAndEquipment: netPropertyPlantAndEquipmentMappedToObject,
          longTermInvestments: {},
          goodwill: goodwillMappedToObject,
          totalAssets: totalAssetsMappedToObject,
        },
        currentLiabilities: {
          accountsPayableCurrent: accountsPayableCurrentMappedToObject,
          accruedExpenses: accruedIncomeTaxesCurrentMappedToObject,
        },
        longTermLiabilities: {},
        commonEquity: {},
      },
      cashFlowStatement: {

      }
    });
  }

  async getCashFlowsForTicker(req, res, next) {

    console.log("getting Cash Flows for Ticker from SEC -> ", req.params.companyId);

    let cik = await financialService.getCikForTicker(req.params.companyId);
    let fcf = await financialService.fetchFreeCashFlowForTicker(cik, req.params.companyId);
    let fcfCagr = await CashFlowService.calculateFcfCagr(req.params.companyId, fcf);
    let dcf = await CashFlowService.calculateDCF(req.params.companyId, cik, fcf, fcfCagr);

    // Convert the map to a JavaScript object
    const fcfMappedToObject = Object.fromEntries(fcf);
    res.status(200).json(fcfMappedToObject);
  }

  async getFinancialStatementsForTicker(req, res, next) {

    console.log("getting FinancialStatements for ticker");

    res.status(200).json(
      { 
        data: "data",
      });
  }

  //FIXME - NF - duplicatecd ??
  // async getFullAnalysisForTicker(req, res, next) {

  //   // get json raw data

  //   // get account 


  // }
  
  // serves as examples for now
  async getRevenue(req, res, next) {
    try {
      const companyId = req.params.companyId;
      const financialData = await financialService.fetchFinancialData(companyId);
      const revenue = financialService.calculateRevenue(financialData);
      res.json({ revenue });
    } catch (error) {
      next(error);
    }
  }

  // serves as examples for now
  async getProfit(req, res, next) {
    try {
      const companyId = req.params.companyId;
      const financialData = await financialService.fetchFinancialData(companyId);
      const profit = financialService.calculateProfit(financialData);
      res.json({ profit });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new FinancialStatementController();

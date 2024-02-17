const financialService = require('../services/financial.service');
const CashFlowService = require('../services/cashFlow.service');

const financialStatementService = require('../services/financialStatement.service');

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

    console.log("getting Full Analysis for Ticker from SEC -> ", req.params.companyId);

    let cik = await financialService.getCikForTicker(req.params.companyId);

    console.log("financial controller | ticker -> ",req.params.companyId); 
    let factsRaw = await financialService.getFactsForTicker(cik, req.params.companyId);

    //store facts raw data on Cache (and DB ?? parsed dta??) --->>> maybe store the analysis result on the DB and discard the rawData

    //field name in the json -> SalesRevenueNet
    console.log("financial controller  GETTING REVENUE | ticker -> ",req.params.companyId); 
    console.log("checking FACTS, entityName: ", factsRaw['entityName']);
    let revenues3y = financialStatementService.getRevenueForYears(factsRaw, 2023, 2020);


    
    // let fcf = await financialService.fetchFreeCashFlowForTicker(cik, req.params.companyId);
    // let fcfCagr = await CashFlowService.calculateFcfCagr(req.params.companyId, fcf);
    // let dcf = await CashFlowService.calculateDCF(req.params.companyId, cik, fcf, fcfCagr);

    // Convert the map to a JavaScript object
    const fcfMappedToObject = Object.fromEntries(null);
    res.status(200).json(fcfMappedToObject);
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

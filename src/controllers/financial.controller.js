// src/controllers/FinancialStatementController.js

//const FinancialStatementService = require('../services/FinancialStatementService');
const financialStatementService = require('../services/financial.service');

class FinancialStatementController {

  // EXAMPLES - to fetch data on the urls below
  
  // for APLE
  // https://data.sec.gov/api/xbrl/companyfacts/CIK0001418121.json

  // for HD
  // https://data.sec.gov/api/xbrl/companyfacts/CIK0000354950.json

  // getting tickers for the Searchbox on the frontend
  async getTickers(req, res, next) {

    console.log('ROUTER: getting tickers');

    // call the service layer to get ticker data
    let tickers = await financialStatementService.getTickers();

    console.log('ROUTER: checking tickers.size', tickers.size);

    // Convert the map to a JavaScript object
    const tickersMappedToObject = Object.fromEntries(tickers);
    res.status(200).json(tickersMappedToObject);
  }

  async getCashFlowsForTicker(req, res, next) {

    console.log("getting Cash Flows for Ticker from SEC -> ", req.params.companyId);

    let cik = await financialStatementService.getCikForTicker(req.params.companyId);
    let fcf = await financialStatementService.fetchFreeCashFlowForTicker(cik, req.params.companyId);

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
  
  // serves as examples for now
  async getRevenue(req, res, next) {
    try {
      const companyId = req.params.companyId;
      const financialData = await financialStatementService.fetchFinancialData(companyId);
      const revenue = financialStatementService.calculateRevenue(financialData);
      res.json({ revenue });
    } catch (error) {
      next(error);
    }
  }

  // serves as examples for now
  async getProfit(req, res, next) {
    try {
      const companyId = req.params.companyId;
      const financialData = await financialStatementService.fetchFinancialData(companyId);
      const profit = financialStatementService.calculateProfit(financialData);
      res.json({ profit });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new FinancialStatementController();

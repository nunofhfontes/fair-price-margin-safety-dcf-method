// src/controllers/FinancialStatementController.js

//const FinancialStatementService = require('../services/FinancialStatementService');
const financialStatementService = require('../services/financial.service');

class FinancialStatementController {

  // EXAMPLES - to fetch data on the urls below
  
  // for APLE
  // https://data.sec.gov/api/xbrl/companyfacts/CIK0001418121.json

  // for HD
  // https://data.sec.gov/api/xbrl/companyfacts/CIK0000354950.json


  async getCashFlowsForTicker(req, res, next) {

    console.log("getting Cash Flows for Ticker from SEC");

    let cashFromOperations = await financialStatementService.fetchFreeCashFlowForTicker();

    console.log("cashFromOperations Map on controller: ", cashFromOperations);

    // Convert the map to a JavaScript object
    const mapToObject = Object.fromEntries(cashFromOperations);
    res.status(200).json(mapToObject);

    // res.status(200).json(
    //   { 
    //     cashFromOperations: cashFromOperations,
    //   });

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

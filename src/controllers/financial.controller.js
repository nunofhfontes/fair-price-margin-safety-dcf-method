// src/controllers/FinancialStatementController.js

const FinancialStatementService = require('../services/FinancialStatementService');

class FinancialStatementController {
  async getRevenue(req, res, next) {
    try {
      const companyId = req.params.companyId;
      const financialData = await FinancialStatementService.fetchFinancialData(companyId);
      const revenue = FinancialStatementService.calculateRevenue(financialData);
      res.json({ revenue });
    } catch (error) {
      next(error);
    }
  }

  async getProfit(req, res, next) {
    try {
      const companyId = req.params.companyId;
      const financialData = await FinancialStatementService.fetchFinancialData(companyId);
      const profit = FinancialStatementService.calculateProfit(financialData);
      res.json({ profit });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new FinancialStatementController();

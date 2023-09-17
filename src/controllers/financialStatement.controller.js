// FinancialStatementController.js

const express = require('express');
const router = express.Router();

const FinancialStatementService = require('./FinancialStatementService');

// Example route to fetch financial data for a specific company
router.get('/company/:companyId', async (req, res) => {
  const companyId = req.params.companyId;

  try {
    const financialData = await FinancialStatementService.fetchFinancialData(companyId);
    res.json(financialData);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching financial data.' });
  }
});

// Example route to calculate revenue for a specific company
router.get('/company/:companyId/revenue', async (req, res) => {
  const companyId = req.params.companyId;

  try {
    const financialData = await FinancialStatementService.fetchFinancialData(companyId);
    const revenue = FinancialStatementService.calculateRevenue(financialData);
    res.json({ revenue });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while calculating revenue.' });
  }
});

// Example route to calculate profit for a specific company
router.get('/company/:companyId/profit', async (req, res) => {
  const companyId = req.params.companyId;

  try {
    const financialData = await FinancialStatementService.fetchFinancialData(companyId);
    const profit = FinancialStatementService.calculateProfit(financialData);
    res.json({ profit });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while calculating profit.' });
  }
});

module.exports = router;

// src/routes/financialRoutes.js

const express = require('express');
//const FinancialStatementController = require('../controllers/FinancialStatementController');
const financialStatementController = require('../controllers/financial.controller');

const router = express.Router();

// segregate code to specific controllers
router.get('/tickers', financialStatementController.getTickers);

router.get('/company/:companyId/fcf', financialStatementController.getCashFlowsForTicker);
router.get('/company/:companyId/revenue', financialStatementController.getRevenue);
router.get('/company/:companyId/profit', financialStatementController.getProfit);

router.get('/analysis/:companyId/full', financialStatementController.getFullAnalysisForTicker);

module.exports = router;

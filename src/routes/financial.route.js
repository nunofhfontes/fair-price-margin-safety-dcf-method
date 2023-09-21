// src/routes/financialRoutes.js

const express = require('express');
//const FinancialStatementController = require('../controllers/FinancialStatementController');
const financialStatementController = require('../controllers/financial.controller');

const router = express.Router();

// segregate code to specific controllers
router.get('/company/:companyId/financialstatements', financialStatementController.getFinancialStatementsForTicker);
router.get('/company/:companyId/revenue', financialStatementController.getRevenue);
router.get('/company/:companyId/profit', financialStatementController.getProfit);


module.exports = router;

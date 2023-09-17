// src/routes/financialRoutes.js

const express = require('express');
const FinancialStatementController = require('../controllers/FinancialStatementController');

const router = express.Router();

router.get('/company/:companyId/revenue', FinancialStatementController.getRevenue);
router.get('/company/:companyId/profit', FinancialStatementController.getProfit);

module.exports = router;

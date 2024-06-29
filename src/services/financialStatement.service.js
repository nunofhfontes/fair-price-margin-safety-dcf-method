// FinancialStatementService.js

const financialService = require('../services/financial.service');


// Simulating some database or external service interactions
const fetchFinancialData = async (companyId) => {
    // Implement logic to fetch financial data from a database or external API
    // Return the fetched data
};

const getRevenueForYears = async (financialRawData, startYear, endYear) => {
    // Implement logic to get revenue from the financial data for the year interval
    // Return the calculated revenue

    console.log("getRevenueForYears METHOD ");

    //SEC's field for revenues -> SalesRevenueNet
    let salesRevenueNetRawJson = financialService.extractAccountsFinancialDataFromRawDataJson(financialRawData, "SalesRevenueNet");
    //also SEC's field for revenues, from 2017 on -> RevenueFromContractWithCustomerExcludingAssessedTax
    let revenueFromContractWithCustomerExcludingAssessedTaxRawJson = financialService.extractAccountsFinancialDataFromRawDataJson(financialRawData, "RevenueFromContractWithCustomerExcludingAssessedTax");

    const revenuesFilteredMap = new Map();

    // Parsing the Raw Data and getting the right 10-K values
    if(salesRevenueNetRawJson) {
        salesRevenueNetRawJson["units"]["USD"].forEach(rawCurrentItem => {
            financialService.extractAnualResultsFromRawData(rawCurrentItem, revenuesFilteredMap);
        });
    }
    if(revenueFromContractWithCustomerExcludingAssessedTaxRawJson) {
        console.log("Inside RevenueFromContractWithCustomerExcludingAssessedTaxRawJson");
        revenueFromContractWithCustomerExcludingAssessedTaxRawJson["units"]["USD"].forEach(rawCurrentItem => {
            financialService.extractAnualResultsFromRawData(rawCurrentItem, revenuesFilteredMap);
        });
    }

    //financialService.extractAnualResultsFromRawData(reveneuesRawJson, revenuesFilteredMap);

    // revenuesFilteredMap.forEach((value, key) => {
    //     //console.log(`${key} = ${value}`);
    //     console.log("=============================");
    //     console.log(key);
    //     console.log(value);
    //     console.log("=============================");
    // });

    // // Convert the map to an array of objects
    const dataArray = Array.from(revenuesFilteredMap, ([year, data]) => ({ Year: year, ...data }));
    // // Print the table to the console
    console.table("Printing the Table");
    console.table(dataArray);

    return revenuesFilteredMap;
};

const getRevenueCagrForYears = (financialData, startYear, endYear) => {
    // Implement logic to get revenue CAGR from the financial data for the year interval
    // Return the calculated revenue
};

const calculateRevenue = (financialData) => {
    // Implement logic to calculate revenue from the financial data
    // Return the calculated revenue
};


const calculateProfit = (financialData) => {
    // Implement logic to calculate profit from the financial data
    // Return the calculated profit
};

module.exports = {
    getRevenueForYears,
    fetchFinancialData,
    calculateRevenue,
    calculateProfit
};
  
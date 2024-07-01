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

    let revenuesFilteredMap = new Map();

    // Parsing the Raw Data and getting the right 10-K values
    if(salesRevenueNetRawJson) {
        salesRevenueNetRawJson["units"]["USD"].forEach(rawCurrentItem => {
            financialService.extractAndFilterAnualResultsFromRawData(rawCurrentItem, revenuesFilteredMap);
        });
    }
    if(revenueFromContractWithCustomerExcludingAssessedTaxRawJson) {
        console.log("Inside RevenueFromContractWithCustomerExcludingAssessedTaxRawJson");
        revenueFromContractWithCustomerExcludingAssessedTaxRawJson["units"]["USD"].forEach(rawCurrentItem => {
            financialService.extractAndFilterAnualResultsFromRawData(rawCurrentItem, revenuesFilteredMap);
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

    //we need to fix the keys (year) on the map, because the year should be given by the endDate and not the fy property
    revenuesFilteredMap = fixMapKeys(revenuesFilteredMap);

    // // Convert the map to an array of objects
    const dataArray = Array.from(revenuesFilteredMap, ([year, data]) => ({ Year: year, ...data }));
    // // Print the table to the console
    console.table("Printing the Table - Revenues");
    console.table(dataArray);

    return revenuesFilteredMap;
};

const getCostOfRevenues = (financialRawData, startYear, endYear) => {

    //SEC's field for cost of revenue -> CostOfRevenue
    //get CostOfRevenue out of the entire rawJson
    let costOfRevenueNetRawJson = financialService.extractAccountsFinancialDataFromRawDataJson(financialRawData, "CostOfRevenue");
    
    let costOfRevenuesFilteredMap = new Map();

    // Parsing the Raw Data and getting the right 10-K values
    if(costOfRevenueNetRawJson) {
        costOfRevenueNetRawJson["units"]["USD"].forEach(rawCurrentItem => {
            financialService.extractAndFilterAnualResultsFromRawData(rawCurrentItem, costOfRevenuesFilteredMap);
        });
    }

    costOfRevenuesFilteredMap = fixMapKeys(costOfRevenuesFilteredMap);

    // // Convert the map to an array of objects
    const dataArray = Array.from(costOfRevenuesFilteredMap, ([year, data]) => ({ Year: year, ...data }));
    // // Print the table to the console
    console.table("Printing the Table - Cost of Revenues");
    console.table(dataArray);

    return costOfRevenuesFilteredMap;
}

// Function to create a new map with corrected keys
const fixMapKeys = (map) => {
    const fixedMap = new Map();

    map.forEach((value, key) => {
      const yearFromEnd = new Date(value.end).getFullYear();
      fixedMap.set(yearFromEnd, value);
    });

    return fixedMap;
  }

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
    getCostOfRevenues,
    fetchFinancialData,
    calculateRevenue,
    calculateProfit
};
  
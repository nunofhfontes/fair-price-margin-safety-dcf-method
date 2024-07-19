// balanceSheet.service.js

const financialService = require('../services/financial.service');

const getCashAndCashEquivalents = (financialRawData, startYear, endYear) => {
    //SEC's field for cost of revenue -> CashAndCashEquivalentsAtCarryingValue
    //get CashAndCashEquivalentsAtCarryingValue out of the entire rawJson
    let cashAndCashEquivalentsRawJson = financialService.extractAccountsFinancialDataFromRawDataJson(financialRawData, "CashAndCashEquivalentsAtCarryingValue");
    let cashAndCashEquivalentsFilteredMap = new Map();
    // Parsing the Raw Data and getting the right 10-K values
    if(cashAndCashEquivalentsRawJson) {
        cashAndCashEquivalentsRawJson["units"]["USD"].forEach(rawCurrentItem => {
            financialService.extractAndFilterAnualResultsFromRawData(rawCurrentItem, cashAndCashEquivalentsFilteredMap);
        });
    }
    cashAndCashEquivalentsFilteredMap = financialService.fixMapKeysWithUpdatedForwardedYear(cashAndCashEquivalentsFilteredMap);
    // // Convert the map to an array of objects
    const dataArray = Array.from(cashAndCashEquivalentsFilteredMap, ([year, data]) => ({ Year: year, ...data }));
    // // Print the table to the console
    console.table("Printing the Table - CashAndCashEquivalents");
    console.table(dataArray);
    return cashAndCashEquivalentsFilteredMap;
};

const getCashAndCashEquivalentsRestricted = (financialRawData, startYear, endYear) => {
    //SEC's field for cost of revenue -> CashCashEquivalentsRestrictedCashAndRestrictedCashEquivalents
    //get CashCashEquivalentsRestrictedCashAndRestrictedCashEquivalents out of the entire rawJson
    let cashAndCashEquivalentsRestrictedRawJson = financialService.extractAccountsFinancialDataFromRawDataJson(financialRawData, "CashCashEquivalentsRestrictedCashAndRestrictedCashEquivalents");
    let cashAndCashEquivalentsRestrictedFilteredMap = new Map();
    // Parsing the Raw Data and getting the right 10-K values
    if(cashAndCashEquivalentsRestrictedRawJson) {
        cashAndCashEquivalentsRestrictedRawJson["units"]["USD"].forEach(rawCurrentItem => {
            financialService.extractAndFilterAnualResultsFromRawData(rawCurrentItem, cashAndCashEquivalentsRestrictedFilteredMap);
        });
    }
    cashAndCashEquivalentsRestrictedFilteredMap = financialService.fixMapKeysWithUpdatedForwardedYear(cashAndCashEquivalentsRestrictedFilteredMap);
    // // Convert the map to an array of objects
    const dataArray = Array.from(cashAndCashEquivalentsRestrictedFilteredMap, ([year, data]) => ({ Year: year, ...data }));
    // // Print the table to the console
    console.table("Printing the Table - CashCashEquivalentsRestrictedCashAndRestrictedCashEquivalents");
    console.table(dataArray);
    return cashAndCashEquivalentsRestrictedFilteredMap;
};


module.exports = {
    getCashAndCashEquivalents,
    getCashAndCashEquivalentsRestricted,
    
};
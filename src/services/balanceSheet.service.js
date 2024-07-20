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

const getAccountsReceivables = (financialRawData, startYear, endYear) => {
    //SEC's field for cost of revenue -> AccountsReceivables
    //get AccountsReceivables out of the entire rawJson
    let accountsReceivablesRawJson = financialService.extractAccountsFinancialDataFromRawDataJson(financialRawData, "AccountsReceivableNetCurrent");
    let accountsReceivablesFilteredMap = new Map();
    // Parsing the Raw Data and getting the right 10-K values
    if(accountsReceivablesRawJson) {
        accountsReceivablesRawJson["units"]["USD"].forEach(rawCurrentItem => {
            financialService.extractAndFilterAnualResultsFromRawData(rawCurrentItem, accountsReceivablesFilteredMap);
        });
    }
    accountsReceivablesFilteredMap = financialService.fixMapKeysWithUpdatedForwardedYear(accountsReceivablesFilteredMap);
    // // Convert the map to an array of objects
    const dataArray = Array.from(accountsReceivablesFilteredMap, ([year, data]) => ({ Year: year, ...data }));  
    // // Print the table to the console
    console.table("Printing the Table - AccountsReceivables");
    console.table(dataArray);
    return accountsReceivablesFilteredMap;
};

module.exports = {
    getCashAndCashEquivalents,
    getCashAndCashEquivalentsRestricted,
    getAccountsReceivables,
};
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


module.exports = {
    getCashAndCashEquivalents,
};
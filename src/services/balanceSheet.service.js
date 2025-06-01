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
    //console.table(dataArray);
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
    // console.table(dataArray);
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
    // console.table(dataArray);
    return accountsReceivablesFilteredMap;
};

const getInventory = (financialRawData, startYear, endYear) => {
    //SEC's field for cost of revenue -> Inventory
    //get Inventory out of the entire rawJson
    let inventoryRawJson = financialService.extractAccountsFinancialDataFromRawDataJson(financialRawData, "InventoryNet");
    let inventoryFilteredMap = new Map();
    // Parsing the Raw Data and getting the right 10-K values
    if(inventoryRawJson) {
        inventoryRawJson["units"]["USD"].forEach(rawCurrentItem => {
            financialService.extractAndFilterAnualResultsFromRawData(rawCurrentItem, inventoryFilteredMap);
        });
    }
    inventoryFilteredMap = financialService.fixMapKeysWithUpdatedForwardedYear(inventoryFilteredMap);
    // // Convert the map to an array of objects
    const dataArray = Array.from(inventoryFilteredMap, ([year, data]) => ({ Year: year, ...data }));  
    // // Print the table to the console
    console.table("Printing the Table - Inventory");
    // console.table(dataArray);
    return inventoryFilteredMap;
};

const getOtherCurrentAssets = (financialRawData, startYear, endYear) => {
    //SEC's field for cost of revenue -> OtherCurrentAssets
    //get OtherCurrentAssets out of the entire rawJson
    let otherCurrentAssetsRawJson = financialService.extractAccountsFinancialDataFromRawDataJson(financialRawData, "OtherAssetsCurrent");
    let otherCurrentAssetsFilteredMap = new Map();
    // Parsing the Raw Data and getting the right 10-K values
    if(otherCurrentAssetsRawJson) {
        otherCurrentAssetsRawJson["units"]["USD"].forEach(rawCurrentItem => {
            financialService.extractAndFilterAnualResultsFromRawData(rawCurrentItem, otherCurrentAssetsFilteredMap);
        });
    }
    otherCurrentAssetsFilteredMap = financialService.fixMapKeysWithUpdatedForwardedYear(otherCurrentAssetsFilteredMap);
    // // Convert the map to an array of objects
    const dataArray = Array.from(otherCurrentAssetsFilteredMap, ([year, data]) => ({ Year: year, ...data }));  
    // // Print the table to the console
    console.table("Printing the Table - OtherCurrentAssets");
    // console.table(dataArray);
    return otherCurrentAssetsFilteredMap;
};

const getTotalCurrentAssets = (financialRawData, startYear, endYear) => {
    //SEC's field for cost of revenue -> TotalCurrentAssets
    //get TotalCurrentAssets out of the entire rawJson
    let totalCurrentAssetsRawJson = financialService.extractAccountsFinancialDataFromRawDataJson(financialRawData, "AssetsCurrent");
    let totalCurrentAssetsFilteredMap = new Map();
    // Parsing the Raw Data and getting the right 10-K values
    if(totalCurrentAssetsRawJson) {
        totalCurrentAssetsRawJson["units"]["USD"].forEach(rawCurrentItem => {
            financialService.extractAndFilterAnualResultsFromRawData(rawCurrentItem, totalCurrentAssetsFilteredMap);
        });
    }
    totalCurrentAssetsFilteredMap = financialService.fixMapKeysWithUpdatedForwardedYear(totalCurrentAssetsFilteredMap);
    // // Convert the map to an array of objects
    const dataArray = Array.from(totalCurrentAssetsFilteredMap, ([year, data]) => ({ Year: year, ...data }));  
    // // Print the table to the console
    console.table("Printing the Table - TotalCurrentAssets");
    // console.table(dataArray);
    return totalCurrentAssetsFilteredMap;
};

const getNetPropertyPlantEquipment = (financialRawData, startYear, endYear) => {
    //SEC's field for cost of revenue -> NetPropertyPlantEquipment
    //get NetPropertyPlantEquipment out of the entire rawJson
    let netPropertyPlantEquipmentRawJson = financialService.extractAccountsFinancialDataFromRawDataJson(financialRawData, "PropertyPlantAndEquipmentNet");
    let operatingLeaseRightOfUseAssetsRawJson = financialService.extractAccountsFinancialDataFromRawDataJson(financialRawData, "OperatingLeaseRightOfUseAsset");
    let netPropertyPlantEquipmentFilteredMap = new Map();
    let operatingLeaseRightOfUseAssetsFilteredMap = new Map();
    // Parsing the Raw Data and getting the right 10-K values
    if(netPropertyPlantEquipmentRawJson) {
        netPropertyPlantEquipmentRawJson["units"]["USD"].forEach(rawCurrentItem => {
            financialService.extractAndFilterAnualResultsFromRawData(rawCurrentItem, netPropertyPlantEquipmentFilteredMap);
        });
    }
    if(operatingLeaseRightOfUseAssetsRawJson) {
        operatingLeaseRightOfUseAssetsRawJson["units"]["USD"].forEach(rawCurrentItem => {
            financialService.extractAndFilterAnualResultsFromRawData(rawCurrentItem, operatingLeaseRightOfUseAssetsFilteredMap);
        });
    }
    netPropertyPlantEquipmentFilteredMap = financialService.fixMapKeysWithUpdatedForwardedYear(netPropertyPlantEquipmentFilteredMap);
    operatingLeaseRightOfUseAssetsFilteredMap = financialService.fixMapKeysWithUpdatedForwardedYear(operatingLeaseRightOfUseAssetsFilteredMap);

    // console.table("NetProP");
    // console.table(Array.from(netPropertyPlantEquipmentFilteredMap, ([year, data]) => ({ Year: year, ...data })));
    // console.table("OpLeRouA");
    // console.table(Array.from(operatingLeaseRightOfUseAssetsFilteredMap, ([year, data]) => ({ Year: year, ...data })));

    // sum the two maps, the netPropertyPlantEquipmentFilteredMap and operatingLeaseRightOfUseAssetsFilteredMap
    netPropertyPlantEquipmentFilteredMap = financialService.sumTwoMaps(netPropertyPlantEquipmentFilteredMap, operatingLeaseRightOfUseAssetsFilteredMap);

    // netPropertyPlantEquipmentFilteredMap = financialService.fixMapKeysWithUpdatedForwardedYear(netPropertyPlantEquipmentFilteredMap);
    // // Convert the map to an array of objects
    const dataArray = Array.from(netPropertyPlantEquipmentFilteredMap, ([year, data]) => ({ Year: year, ...data }));  
    // // Print the table to the console
    console.table("Printing the Table - NetPropertyPlantEquipment");
    // console.table(dataArray);
    return netPropertyPlantEquipmentFilteredMap;
};

const getAccumulatedDepreciation = (financialRawData, startYear, endYear) => {
    //SEC's field for cost of revenue -> AccumulatedDepreciation
    //get AccumulatedDepreciation out of the entire rawJson
    let propPlantEquipFinLeaseRightOfUseAssetAccDeprAmortRawJson = financialService.extractAccountsFinancialDataFromRawDataJson(financialRawData, "PropertyPlantAndEquipmentAndFinanceLeaseRightOfUseAssetAccumulatedDepreciationAndAmortization");
    let accDeprDeplAndAmortPropPlantAndEquipRawJson = financialService.extractAccountsFinancialDataFromRawDataJson(financialRawData, "AccumulatedDepreciationDepletionAndAmortizationPropertyPlantAndEquipment");
    
    let accumulatedDepreciationFilteredMap = new Map();
    let propPlantEquipFinLeaseRightOfUseAssetAccDeprAmortFilteredMap = new Map();
    let accDeprDeplAndAmortPropPlantAndEquipFilteredMap = new Map();
    
    
    // Parsing the Raw Data and getting the right 10-K values
    if(propPlantEquipFinLeaseRightOfUseAssetAccDeprAmortRawJson) {
        propPlantEquipFinLeaseRightOfUseAssetAccDeprAmortRawJson["units"]["USD"].forEach(rawCurrentItem => {
            financialService.extractAndFilterAnualResultsFromRawData(rawCurrentItem, accumulatedDepreciationFilteredMap);
        });
    }

    // Parsing the Raw Data and getting the right 10-K values
    if(accDeprDeplAndAmortPropPlantAndEquipRawJson) {
        accDeprDeplAndAmortPropPlantAndEquipRawJson["units"]["USD"].forEach(rawCurrentItem => {
            financialService.extractAndFilterAnualResultsFromRawData(rawCurrentItem, accumulatedDepreciationFilteredMap);
        });
    }

    accumulatedDepreciationFilteredMap = financialService.fixMapKeysWithUpdatedForwardedYear(accumulatedDepreciationFilteredMap);

    // // Convert the map to an array of objects
    const dataArray = Array.from(accumulatedDepreciationFilteredMap, ([year, data]) => ({ Year: year, ...data }));  
    // // Print the table to the console
    console.table("Printing the Table - AccumulatedDepreciation");
    console.table(dataArray);
    return accumulatedDepreciationFilteredMap;
};

const getGrossPropertyPlantAndEquipment = (financialRawData, startYear, endYear) => {
    //SEC's field for cost of revenue -> GrossPropertyPlantEquipment
    //get GrossPropertyPlantEquipment out of the entire rawJson
    let grossPropertyPlantEquipmentRawJson = financialService.extractAccountsFinancialDataFromRawDataJson(financialRawData, "PropertyPlantAndEquipmentGross");
    let grossPropertyPlantEquipmentFilteredMap = new Map();
    // Parsing the Raw Data and getting the right 10-K values
    if(grossPropertyPlantEquipmentRawJson) {
        grossPropertyPlantEquipmentRawJson["units"]["USD"].forEach(rawCurrentItem => {
            financialService.extractAndFilterAnualResultsFromRawData(rawCurrentItem, grossPropertyPlantEquipmentFilteredMap);
        });
    }
    grossPropertyPlantEquipmentFilteredMap = financialService.fixMapKeysWithUpdatedForwardedYear(grossPropertyPlantEquipmentFilteredMap);
    // // Convert the map to an array of objects
    const dataArray = Array.from(grossPropertyPlantEquipmentFilteredMap, ([year, data]) => ({ Year: year, ...data }));  
    // // Print the table to the console
    console.table("Printing the Table - GrossPropertyPlantEquipment");
    console.table(dataArray);
    return grossPropertyPlantEquipmentFilteredMap;
};

const getGoodwill = (financialRawData, startYear, endYear) => {
    //SEC's field for cost of revenue -> Goodwill
    //get Goodwill out of the entire rawJson
    let goodwillRawJson = financialService.extractAccountsFinancialDataFromRawDataJson(financialRawData, "Goodwill");
    let goodwillFilteredMap = new Map();
    // Parsing the Raw Data and getting the right 10-K values
    if(goodwillRawJson) {
        goodwillRawJson["units"]["USD"].forEach(rawCurrentItem => {
            financialService.extractAndFilterAnualResultsFromRawData(rawCurrentItem, goodwillFilteredMap);
        });
    }
    goodwillFilteredMap = financialService.fixMapKeysWithUpdatedForwardedYear(goodwillFilteredMap);
    // // Convert the map to an array of objects
    const dataArray = Array.from(goodwillFilteredMap, ([year, data]) => ({ Year: year, ...data }));  
    // // Print the table to the console
    console.table("Printing the Table - Goodwill");
    console.table(dataArray);
    return goodwillFilteredMap;
};

const getTotalAssets = (financialRawData, startYear, endYear) => {

    let totalCurrentAssetsRawJson = financialService.extractAccountsFinancialDataFromRawDataJson(financialRawData, "Assets");
    let totalCurrentAssetsFilteredMap = new Map();
    // Parsing the Raw Data and getting the right 10-K values
    if(totalCurrentAssetsRawJson) {
        totalCurrentAssetsRawJson["units"]["USD"].forEach(rawCurrentItem => {
            financialService.extractAndFilterAnualResultsFromRawData(rawCurrentItem, totalCurrentAssetsFilteredMap);
        });
    }
    totalCurrentAssetsFilteredMap = financialService.fixMapKeysWithUpdatedForwardedYear(totalCurrentAssetsFilteredMap);
    // // Convert the map to an array of objects
    const dataArray = Array.from(totalCurrentAssetsFilteredMap, ([year, data]) => ({ Year: year, ...data }));  
    // // Print the table to the console
    console.table("Printing the Table - TotalCurrentAssets");
    console.table(dataArray);
    return totalCurrentAssetsFilteredMap;
}

const getAccountsPayableCurrent = (financialRawData, startYear, endYear) => {
    //SEC's field for cost of revenue -> AccountsPayable
    //get AccountsPayable out of the entire rawJson
    let accountsPayableRawJson = financialService.extractAccountsFinancialDataFromRawDataJson(financialRawData, "AccountsPayableCurrent");
    let accountsPayableFilteredMap = new Map();
    // Parsing the Raw Data and getting the right 10-K values
    if(accountsPayableRawJson) {
        accountsPayableRawJson["units"]["USD"].forEach(rawCurrentItem => {
            financialService.extractAndFilterAnualResultsFromRawData(rawCurrentItem, accountsPayableFilteredMap);
        });
    }
    accountsPayableFilteredMap = financialService.fixMapKeysWithUpdatedForwardedYear(accountsPayableFilteredMap);
    // // Convert the map to an array of objects
    const dataArray = Array.from(accountsPayableFilteredMap, ([year, data]) => ({ Year: year, ...data }));  
    // // Print the table to the console
    console.table("Printing the Table - AccountsPayable");
    console.table(dataArray);
    return accountsPayableFilteredMap;
}

const getAccruedIncomeTaxesCurrent = (financialRawData, startYear, endYear) => {
    //SEC's field for cost of revenue -> AccountsPayable
    //get AccountsPayable out of the entire rawJson
    let accruedIncomeTaxesRawJson = financialService.extractAccountsFinancialDataFromRawDataJson(financialRawData, "AccruedIncomeTaxesCurrent");
    let accruedIncomeTaxesFilteredMap = new Map();
    // Parsing the Raw Data and getting the right 10-K values
    if(accruedIncomeTaxesRawJson) {
        accruedIncomeTaxesRawJson["units"]["USD"].forEach(rawCurrentItem => {
            financialService.extractAndFilterAnualResultsFromRawData(rawCurrentItem, accruedIncomeTaxesFilteredMap);
        });
    }
    accruedIncomeTaxesFilteredMap = financialService.fixMapKeysWithUpdatedForwardedYear(accruedIncomeTaxesFilteredMap);
    // // Convert the map to an array of objects
    const dataArray = Array.from(accruedIncomeTaxesFilteredMap, ([year, data]) => ({ Year: year, ...data }));  
    // // Print the table to the console
    console.table("Printing the Table - Accred Expenses");
    console.table(dataArray);
    return accruedIncomeTaxesFilteredMap;
}

module.exports = {
    getCashAndCashEquivalents,
    getCashAndCashEquivalentsRestricted,
    getAccountsReceivables,
    getInventory,
    getOtherCurrentAssets,
    getTotalCurrentAssets,
    getNetPropertyPlantEquipment,
    getAccumulatedDepreciation,
    getGrossPropertyPlantAndEquipment,
    getGoodwill,
    getTotalAssets,
    getAccountsPayableCurrent,
    getAccruedIncomeTaxesCurrent,
};
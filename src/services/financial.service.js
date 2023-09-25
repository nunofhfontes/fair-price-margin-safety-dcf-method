// src/services/FinancialStatementService.js
const axios = require('axios');

class FinancialStatementService {

    async fetchFinancialStatementForTicker(companyId) {
      // Implement logic to fetch financial data from SEC EDGAR
      // Return the fetched data
    }

    async fetchFreeCashFlowForTicker(ticker) {

      // NetCashProvidedByUsedInOperatingActivities -> Cash From Operations
      // PaymentsToAcquireProductiveAssets          -> CAPEX

      let cashFromOperations;
      let capex;

      // Create a map to store filtered data
      const filteredDataMap = new Map();
      
      const accounts = new Map();
      accounts.set("cashFromOperations", {
        secKey: 'NetCashProvidedByUsedInOperatingActivities',
        annualData: '',
      });
      accounts.set("capex", {
        secKey: 'PaymentsToAcquireProductiveAssets',
        annualData: '',
      });
      accounts.set("freeCashFlow", {});

      accounts.forEach((value, key) => {
        console.log(`Key: ${key}, Value: ${value}`);

      });
      
      // Implement logic to fetch Cash Flows data from SEC EDGAR
      const url = 'https://data.sec.gov/api/xbrl/companyfacts/CIK0000354950.json';

      try {
        const response = await axios.get(url);

        // Check if the request was successful (status code 200)
        if (response.status === 200) {
          const data = response.data;
          // Process and use the 'data' as needed
          //console.log(data.facts.us-gaap.);

          cashFromOperations = data["facts"]["us-gaap"]["NetCashProvidedByUsedInOperatingActivities"]["units"]["USD"];
          capex = data["facts"]["us-gaap"]["PaymentsToAcquireProductiveAssets"]["units"]["USD"];

          //console.log("Cash From Operations: ", cashFromOperations);
          console.log("CAPEX: ", capex);

          // Filter the array based on "form" field and store in the map
          cashFromOperations.forEach(rawCurrentItem => {
            this.extractAnualResultsFromRawData(rawCurrentItem, filteredDataMap)
            // if (item.form === "10-K") {
            //   const year = item.fy;
            //   const endDate = item.end;
            //   if (!filteredDataMap.has(year) || endDate > filteredDataMap.get(year).end) {
            //     filteredDataMap.set(year, item);
            //     this.checkIfHasFrameFieldAndUpdate(filteredDataMap, item);
            //   }
            // }
          });

        } else {
          console.error('HTTP request failed with status:', response.status);
        }
      } catch (error) {
        console.error('Error fetching data:', error.message);
        console.log('ERROR!!!!!!!!!!!');
      }

      // Calculate Cash FLow trend/growth
      
      // Return the fetched data
      return filteredDataMap;
    }

    extractAnualResultsFromRawData(rawCurrentItem, filteredDataMap) {
      if (rawCurrentItem.form === "10-K") {
        const year = rawCurrentItem.fy;
        const endDate = rawCurrentItem.end;
        if (!filteredDataMap.has(year) || endDate > filteredDataMap.get(year).end) {
          filteredDataMap.set(year, rawCurrentItem);
          this.checkIfHasFrameFieldAndUpdate(filteredDataMap, rawCurrentItem);
        }
      }
    }

    checkIfHasFrameFieldAndUpdate(filteredDataMap, item) {
      if(item.hasOwnProperty("frame")) {
        if (item.frame.length >= 4) {
          const year = item.frame.slice(-4);
          filteredDataMap.set(year, item);
        }
      }
    }

    async translateTickerToCik(ticker) {

      // call SEC EDGAR's endpoint to translate the ticker to CIK

    }

    async checkIfTickerIsListedOnUsExchange(ticker) {

      // we need to check if the inserte ticker is listed on some US exchange and available
      // we must differentiate tickers for countries and their exchanges
      // we'll start with just american available tickers 

    }

    async fetchFinancialData(companyId) {
      // Implement logic to fetch financial data from a database or external API
      // Return the fetched data
    }
  
    calculateRevenue(financialData) {
      // Implement logic to calculate revenue from the financial data
      // Return the calculated revenue
    }
  
    calculateProfit(financialData) {
      // Implement logic to calculate profit from the financial data
      // Return the calculated profit
    }
  }
  
  module.exports = new FinancialStatementService();
  
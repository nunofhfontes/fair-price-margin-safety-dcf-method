// src/services/FinancialStatementService.js
const axios = require('axios');

class FinancialStatementService {

    async fetchFinancialStatementForTicker(companyId) {
      // Implement logic to fetch financial data from SEC EDGAR
      // Return the fetched data
    }

    async fetchFreeCashFlowForTicker(ticker) {

      let cashFromOperations;
      let capex;

      // Initialize an empty map
      const resultMap = new Map();
      
      // NetCashProvidedByUsedInOperatingActivities -> Cash From Operations
      // PaymentsToAcquireProductiveAssets          -> CAPEX

      // Implement logic to fetch Cash Flows data from SEC EDGAR
      const url = 'https://data.sec.gov/api/xbrl/companyfacts/CIK0000354950.json';

      try {
        const response = await axios.get(url);

        // Check if the request was successful (status code 200)
        if (response.status === 200) {
          const data = response.data;
          // Process and use the 'data' as needed
          //console.log(data.facts.us-gaap.);

          cashFromOperations = data["facts"]["us-gaap"]["PaymentsToAcquireProductiveAssets"]["units"]["USD"]; //data.facts.us-gaap.PaymentsToAcquireProductiveAssets.units.USD;

          console.log("Cash From Operations: ", cashFromOperations);

          // Filter the array based on "form" field and store in the map
          cashFromOperations.forEach(item => {
            if (item.form === "10-K") {
              // Check if the year is already in the map
              if (resultMap.has(item.fy)) {

                // TODO: distinguish the proper 10-K value amonsgt the multiple possibilities

                // If it exists, append "10-K" to the existing value (a string)
                resultMap.set(item.fy, resultMap.get(item.fy) + ", 10-K");
              } else {
                // If it doesn't exist, create a new entry
                resultMap.set(item.fy, "10-K");
              }
            }
          });

          // Convert the map to an object (if needed)
          const resultObject = Object.fromEntries(resultMap);

          console.log("result Map: ", resultObject);
          
        } else {
          console.error('HTTP request failed with status:', response.status);
        }
      } catch (error) {
        console.error('Error fetching data:', error.message);
        console.log('ERROR!!!!!!!!!!!');
      }

      // Calculate Cash FLow trend/growth
      
      // Return the fetched data
      //return cashFromOperations;
      return resultMap;
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
  
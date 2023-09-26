// src/services/FinancialStatementService.js
const axios = require('axios');
const fs = require('fs').promises;

class FinancialStatementService {

    async fetchFinancialStatementForTicker(companyId) {
      // Implement logic to fetch financial data from SEC EDGAR
      // Return the fetched data
    }

    async getCikForTicker(tickerToSearch) {

      // TODO - store the tocker - cik list into a cache

      let cikNumber = 0;

      const ticker2CikUrl = 'https://www.sec.gov/include/ticker.txt';
      try {
        // Fetch the text file from the URL using Axios
        const response = await axios.get(ticker2CikUrl);

        // Read the response data as a string
        const text = response.data;

        // Parse the text to map tickers to CIK numbers
        const tickerMap = new Map();
        const lines = text.split('\n');
        for (const line of lines) {
          const [ticker, cik] = line.split('\t');
          tickerMap.set(ticker, cik);
        }

        // Get the CIK number for the specified ticker
        cikNumber = tickerMap.get(tickerToSearch.toLowerCase());

        // Convert the number to a string
        const cikString = cikNumber.toString();

        // Calculate the number of zeros needed to make the total length 10
        const zerosNeeded = 10 - cikString.length;

        // Create the final string with the desired number and zeros
        cikNumber = '0'.repeat(zerosNeeded) + cikString;

        if (cikNumber) {
          console.log(`CIK number for ${tickerToSearch}: ${cikNumber}`);
        } else {
          console.log(`Ticker ${tickerToSearch} not found in the mapping.`);
        }
      } catch (error) {
        console.error('Error:', error);
      } 

      return cikNumber;
    }

    async fetchFreeCashFlowForTicker(cikNumber) {

      // NetCashProvidedByUsedInOperatingActivities -> Cash From Operations
      // PaymentsToAcquireProductiveAssets          -> CAPEX
      // PaymentsToAcquirePropertyPlantAndEquipment  ???
      // "PaymentsToAcquirePropertyPlantAndEquipment": {
      //   "label": "Payments to Acquire Property, Plant, and Equipment",
      //   "description": "The cash outflow associated with the acquisition of long-lived, physical assets that are used in the normal conduct of business to produce goods and services and not intended for resale; includes cash outflows to pay for construction of self-constructed assets.",


      let cashFromOperationsRawData;
      let capexRawData;

      // Create a map to store filtered data
      const cashFromOpsFilteredDataMap = new Map();
      const capexFilteredDataMap = new Map();
      const fcfFilteredDataMap = new Map();
      
      // const accounts = new Map();
      // accounts.set("cashFromOperations", {
      //   secKey: 'NetCashProvidedByUsedInOperatingActivities',
      //   annualData: '',
      // });
      // accounts.set("capex", {
      //   secKey: 'PaymentsToAcquireProductiveAssets',
      //   annualData: '',
      // });
      // accounts.set("freeCashFlow", {});

      // accounts.forEach((value, key) => {
      //   console.log(`Key: ${key}, Value: ${value}`);

      // });
      
      // Implement logic to fetch Cash Flows data from SEC EDGAR
      //const url = 'https://data.sec.gov/api/xbrl/companyfacts/CIK0000354950.json';

      //FIXME - the total CIK must have a certain length
      const url = `https://data.sec.gov/api/xbrl/companyfacts/CIK${cikNumber}.json`;

      // TODO - instead of getting all the facts, we could just get the ones needed
      // https://data.sec.gov/api/xbrl/companyconcept/CIK##########/us-gaap/AccountsPayableCurrent.json

      console.log("url -> ", url);

      try {
        const response = await axios.get(url);

        // Check if the request was successful (status code 200)
        if (response.status === 200) {
          const data = response.data;

          //console.log("check units: ", data["facts"]["us-gaap"]["NetCashProvidedByUsedInOperatingActivities"]["units"]);
          console.log("check capex units: ", data["facts"]["us-gaap"]["PaymentsToAcquireProductiveAssets"]);
          
          
          
          // Process and use the 'data' as needed
          cashFromOperationsRawData = data["facts"]["us-gaap"]["NetCashProvidedByUsedInOperatingActivities"]["units"]["USD"];
          capexRawData = data["facts"]["us-gaap"]["PaymentsToAcquireProductiveAssets"]["units"]["USD"];



          // Filter the array based on "form" field and store in the map
          cashFromOperationsRawData.forEach(rawCurrentItem => {
            this.extractAnualResultsFromRawData(rawCurrentItem, cashFromOpsFilteredDataMap)
          });

          capexRawData.forEach(rawCurrentItem => {
            this.extractAnualResultsFromRawData(rawCurrentItem, capexFilteredDataMap)
          });

          // computing FCF = CashFromOperatins - CAPEX
          cashFromOpsFilteredDataMap.forEach((value, key) => {
            if(cashFromOpsFilteredDataMap.has(key) && capexFilteredDataMap.has(key)) {
              fcfFilteredDataMap.set(key, value.val - capexFilteredDataMap.get(key).val);
            }
          });
        } else {
          console.error('HTTP request failed with status:', response.status);
        }
      } catch (error) {
        console.error('Error fetching data:', error.message);
        console.log('ERROR!!!!!!!!!!!');
      }

      // Calculate Cash FLow trend/growth
      
      // Return the computed
      return fcfFilteredDataMap;
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
  
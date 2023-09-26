// src/services/FinancialStatementService.js
const axios = require('axios');
const fs = require('fs').promises;
const cacheService = require('../services/node.cache.service');

class FinancialStatementService {

    async fetchFinancialStatementForTicker(companyId) {
      // Implement logic to fetch financial data from SEC EDGAR
      // Return the fetched data
    }

    async getCikForTicker(tickerToSearch) {

      // Try to get the CIK number from the cache
      let cikFromCache = await cacheService.getCikFromCache(tickerToSearch.toLowerCase());
      if(cikFromCache) {
        console.log(`Gotten the CIK nr -> ${cikFromCache} from the cache`);
        return cikFromCache;
      }

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
          console.log('Parsed ticker-cik file parsed');
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


      let netCashProvidedByUsedInOperatingActivitiesContinuingOperationsRawData;
      let cashFromOperationsRawData;
      let paymentsToAcquireProductiveAssetsRawData;
      let paymentsToAcquirePropertyPlantAndEquipmentRawData;

      // Create a map to store filtered data
      const netCashProvidedByUsedInOperatingActivitiesContinuingOperationsFilteredMap = new Map();
      const cashFromOpsFilteredDataMap = new Map();
      const paymentsToAcquireProductiveAssetsFilteredMap = new Map();
      const paymentsToAcquirePropertyPlantAndEquipmentFilteredMap = new Map();
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

      // // Process and use the 'data' as needed
      // cashFromOperationsRawData = data["facts"]["us-gaap"]["NetCashProvidedByUsedInOperatingActivities"]["units"]["USD"];
      // capexRawData = data["facts"]["us-gaap"]["PaymentsToAcquireProductiveAssets"]["units"]["USD"];

      
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

          // Process and use the 'data' as needed
          netCashProvidedByUsedInOperatingActivitiesContinuingOperationsRawData = data["facts"]["us-gaap"]["NetCashProvidedByUsedInOperatingActivitiesContinuingOperations"];
          cashFromOperationsRawData = data["facts"]["us-gaap"]["NetCashProvidedByUsedInOperatingActivities"];
          paymentsToAcquireProductiveAssetsRawData = data["facts"]["us-gaap"]["PaymentsToAcquireProductiveAssets"];
          paymentsToAcquirePropertyPlantAndEquipmentRawData = data["facts"]["us-gaap"]["paymentsToAcquirePropertyPlantAndEquipmentRawData"];

          if(netCashProvidedByUsedInOperatingActivitiesContinuingOperationsRawData) {
            netCashProvidedByUsedInOperatingActivitiesContinuingOperationsRawData["units"]["USD"].forEach(rawCurrentItem => {
              this.extractAnualResultsFromRawData(rawCurrentItem, netCashProvidedByUsedInOperatingActivitiesContinuingOperationsFilteredMap);
            });
          }

          if(cashFromOperationsRawData) {
            cashFromOperationsRawData["units"]["USD"].forEach(rawCurrentItem => {
              this.extractAnualResultsFromRawData(rawCurrentItem, cashFromOpsFilteredDataMap)
            });
          }

          if(paymentsToAcquireProductiveAssetsRawData) {
            paymentsToAcquireProductiveAssetsRawData["units"]["USD"].forEach(rawCurrentItem => {
              this.extractAnualResultsFromRawData(rawCurrentItem, paymentsToAcquireProductiveAssetsFilteredMap)
            });
          }

          if(paymentsToAcquirePropertyPlantAndEquipmentRawData) {
            paymentsToAcquirePropertyPlantAndEquipmentRawData["units"]["USD"].forEach(rawCurrentItem => {
              this.extractAnualResultsFromRawData(rawCurrentItem, paymentsToAcquirePropertyPlantAndEquipmentFilteredMap);
            });
          }

          const maps = [netCashProvidedByUsedInOperatingActivitiesContinuingOperationsFilteredMap,
            cashFromOpsFilteredDataMap,
            paymentsToAcquireProductiveAssetsFilteredMap,
            paymentsToAcquirePropertyPlantAndEquipmentFilteredMap];

          // Initialize minimum and maximum years
          let minimumYear = Infinity;
          let maximumYear = -Infinity;

          maps.forEach((map) => {
            const years = [...map.keys()];
            const minYearInMap = Math.min(...years);
            const maxYearInMap = Math.max(...years);

            if (minYearInMap < minimumYear) {
              minimumYear = minYearInMap;
            }

            if (maxYearInMap > maximumYear) {
              maximumYear = maxYearInMap;
            }
          });

          console.log('Minimum year among all maps:', minimumYear);
          console.log('Maximum year among all maps:', maximumYear);

          for (let i = minimumYear; i <= maximumYear; i++) {
            let accFcf = 0;
            // computing FCF = CashFromOperatins - CAPEX
            if(netCashProvidedByUsedInOperatingActivitiesContinuingOperationsFilteredMap.has(i)) {
              accFcf = accFcf + netCashProvidedByUsedInOperatingActivitiesContinuingOperationsFilteredMap.get(i).val;
            }
            if(cashFromOpsFilteredDataMap.has(i)) {
              accFcf = accFcf + cashFromOpsFilteredDataMap.get(i).val;
            }
            if(paymentsToAcquireProductiveAssetsFilteredMap.has(i)) {
              accFcf = accFcf - paymentsToAcquireProductiveAssetsFilteredMap.get(i).val;
            }
            if(paymentsToAcquirePropertyPlantAndEquipmentFilteredMap.has(i)) {
              accFcf = accFcf - paymentsToAcquirePropertyPlantAndEquipmentFilteredMap.get(i).val;
            }
            fcfFilteredDataMap.set(i, accFcf);
          }
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

    // if(cashFromOpsFilteredDataMap.has(key) && paymentsToAcquireProductiveAssetsFilteredMap.has(key) && paymentsToAcquirePropertyPlantAndEquipmentFilteredMap.has(key)) {
            //   console("Capex with 2 element");
            //   fcfFilteredDataMap.set(key, value.val - paymentsToAcquireProductiveAssetsFilteredMap.get(key).val - paymentsToAcquirePropertyPlantAndEquipmentFilteredMap.get(key).val);
            // } else if(cashFromOpsFilteredDataMap.has(key) && paymentsToAcquireProductiveAssetsFilteredMap.has(key)) {
            //   console("Capex with just 1 element");
            //   fcfFilteredDataMap.set(key, value.val - paymentsToAcquireProductiveAssetsFilteredMap.get(key).val);
            // //} else if() {
            
            // } else {
            //   console.log("Capex with 0 elements");
            //   fcfFilteredDataMap.set(key, value.val);
            // }

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
  
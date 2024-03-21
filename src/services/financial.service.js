// src/services/FinancialStatementService.js
const axios = require('axios');
const fs = require('fs').promises;
const cacheService = require('../services/node.cache.service');

class FinancialStatementService {

    async getTickers() {

      console.log('CONTROLLER: getting tickers');

      // first get ticker data from cache (it was stored on cache when the server started running)
      let tickerCachedData = await cacheService.getTickersFromCache();

      if(!tickerCachedData) {
        // if there's no cached data for tickers, extend the cache's TTL
        console.warn('WARNING - No cached for tickers!');
      }

      console.log('CONTROLLER: checking tickers size', tickerCachedData.size);

      return tickerCachedData;
    }

    // method to extract an account from a SEC's raw data json
    extractAccountsFinancialDataFromRawDataJson(financialRawDataJson, targetAccount, country) {
      //NOTE: for now, this is just for US markets, so we'll harcode the country and use the SEC's format only
      country = "US";

      if (country == "US") {
        //return data["facts"]["us-gaap"][targetAccount];

        //console.log('targetAccount: ', targetAccount);
        //console.log('!!!! account json: ', financialRawDataJson);

        return financialRawDataJson["facts"]["us-gaap"][targetAccount];
      }
    } 

    async fetchFinancialStatementForTicker(companyId) {
      // Implement logic to fetch financial data from SEC EDGAR
      // Return the fetched data
    }

    async getCikForTicker(tickerToSearch) {

      // Try to get the CIK number from the cache
      let cikFromCache = await cacheService.getCikFromCache(tickerToSearch.toLowerCase());
      console.log("CHECK CIK FROM CACHE: ", cikFromCache);
      
      if(cikFromCache) {
        // fill with the necessary zeros
        cikFromCache = this.formatCikNumber(cikFromCache);
        console.log(`Gotten the CIK nr -> ${cikFromCache} from the cache`);
        return cikFromCache;
      }

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

        // fill with the necessary zeros
        this.formatCikNumber(cikNumber);

        // // Convert the number to a string
        // const cikString = cikNumber.toString();

        // // Calculate the number of zeros needed to make the total length 10
        // const zerosNeeded = 10 - cikString.length;

        // // Create the final string with the desired number and zeros
        // cikNumber = '0'.repeat(zerosNeeded) + cikString;

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

    formatCikNumber(cikNumber) {
      // Convert the number to a string
      let cikString = cikNumber.toString();

      // Calculate the number of zeros needed to make the total length 10
      const zerosNeeded = 10 - cikString.length;

      // Create the final string with the desired number and zeros
      cikString = '0'.repeat(zerosNeeded) + cikString;

      return cikString;
    }

    // generic function to get the facts for tickers
    // then returns the facts
    async getFactsForTicker(cikNumber, ticker) {
      
      console.log("getFactsForTicker function | ticker -> ", ticker);

      // Check if there's cached Data for this ticker

      //FIXME - is this needed ?????????!!!!!!!!
      // let cachedData = cacheService.getFcfFromCache(ticker);
      // if(cachedData && cachedData.fcf){
      //   console.log(`INFO: Found FCF cached data for ticker: ${ticker}`);
      //   return cachedData;
      // }

      // The total CIK must have a certain length, 10
      const url = `https://data.sec.gov/api/xbrl/companyfacts/CIK${cikNumber}.json`;

      // Request interceptor
      axios.interceptors.request.use((config) => {
        // Log the request URL and any other relevant information
        // console.log('Request URL:', config.url);
        // console.log('Request Method:', config.method);
        // console.log('Request Headers:', config.headers);
        // console.log('Request Data:', config.data);

        // You can also modify the request configuration if needed
        // For example, you can add an API key to headers

        return config;
      }, (error) => {
        // Handle request errors
        return Promise.reject(error);
      });

      try {
        // In theory this should be included, but it doesn't work with it
        // 'Host': 'www.sec.gov',
        const headers = {
          'User-Agent': 'traderfactory nunnofontes@traderfactory.com',
          'Accept-Encoding': 'gzip, deflate',
        };

        const response = await axios.get(url, {
          headers: headers,
        });

        //console.log("RESPONSE STATUS: ", response.status);

        // Check if the request was successful (status code 200)
        if (response.status === 200) {
          const data = response.data;

          //successfull reqest and response, return the data
          return data;
        } else {
          console.error('HTTP request failed with status:', response.status);
        }
      } catch (error) {

        if (error.response) {
          const { status, data } = error.response;
          console.error(`HTTP status code: ${status} , creating error.html.`);
          //console.error('Response data:', data);
    
          // You can also create an error HTML file with the error details
          const errorHtmlContent = `${JSON.stringify(data, null, 2)}`;
    
          fs.writeFile('error.html', errorHtmlContent, (err) => {
            if (err) {
              console.error('Error writing error HTML file:', err);
            } else {
              console.log('Error HTML file "error.html" created successfully.');
            }
          });
        } else {
          console.error('Request failed:', error.message);
        }

      }

    }

    async fetchFreeCashFlowForTicker(cikNumber, ticker) {

      // Some COntext about the needed sec fields to calculate the FCF
      // NetCashProvidedByUsedInOperatingActivitiesContinuingOperations -> Cash From Operations
      // NetCashProvidedByUsedInOperatingActivities                     -> Cash From Operations
      // PaymentsToAcquireProductiveAssets                              -> CAPEX
      // PaymentsToAcquirePropertyPlantAndEquipment                     -> CAPEX

      // Check if there's cached Data for this ticker
      let cachedData = cacheService.getFcfFromCache(ticker);
      if(cachedData && cachedData.fcf){
        console.log(`INFO: Found FCF cached data for ticker: ${ticker}`);
        return cachedData;
      }

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
      
      // The total CIK must have a certain length, 10
      const url = `https://data.sec.gov/api/xbrl/companyfacts/CIK${cikNumber}.json`;

      // TODO - instead of getting all the facts, we could just get the ones needed
      // https://data.sec.gov/api/xbrl/companyconcept/CIK##########/us-gaap/AccountsPayableCurrent.json

      console.log("Facts url -> ", url);

      // Request interceptor
      axios.interceptors.request.use((config) => {
        // Log the request URL and any other relevant information
        console.log('Request URL:', config.url);
        console.log('Request Method:', config.method);
        console.log('Request Headers:', config.headers);
        console.log('Request Data:', config.data);

        // You can also modify the request configuration if needed
        // For example, you can add an API key to headers

        return config;
      }, (error) => {
        // Handle request errors
        return Promise.reject(error);
      });

      try {
        // In theory this should be included, but it doesn't work with it
        // 'Host': 'www.sec.gov',
        const headers = {
          'User-Agent': 'traderfactory nunnofontes@traderfactory.com',
          'Accept-Encoding': 'gzip, deflate',
        };

        const response = await axios.get(url, {
          headers: headers,
        });

        console.log("RESPONSE STATUS: ", response.status);

        // Check if the request was successful (status code 200)
        if (response.status === 200) {
          const data = response.data;

          // Process and use the 'data' as needed
          netCashProvidedByUsedInOperatingActivitiesContinuingOperationsRawData = data["facts"]["us-gaap"]["NetCashProvidedByUsedInOperatingActivitiesContinuingOperations"];
          cashFromOperationsRawData = data["facts"]["us-gaap"]["NetCashProvidedByUsedInOperatingActivities"];
          paymentsToAcquireProductiveAssetsRawData = data["facts"]["us-gaap"]["PaymentsToAcquireProductiveAssets"];
          paymentsToAcquirePropertyPlantAndEquipmentRawData = data["facts"]["us-gaap"]["paymentsToAcquirePropertyPlantAndEquipmentRawData"];

          // Parsing the Raw Data and getting the right 10-K values
          if(netCashProvidedByUsedInOperatingActivitiesContinuingOperationsRawData) {
            netCashProvidedByUsedInOperatingActivitiesContinuingOperationsRawData["units"]["USD"].forEach(rawCurrentItem => {
              this.extractAnualResultsFromRawData(rawCurrentItem, netCashProvidedByUsedInOperatingActivitiesContinuingOperationsFilteredMap);
            });
          }
          // Parsing the Raw Data and getting the right 10-K values
          if(cashFromOperationsRawData) {
            cashFromOperationsRawData["units"]["USD"].forEach(rawCurrentItem => {
              this.extractAnualResultsFromRawData(rawCurrentItem, cashFromOpsFilteredDataMap)
            });
          }
          // Parsing the Raw Data and getting the right 10-K values
          if(paymentsToAcquireProductiveAssetsRawData) {
            paymentsToAcquireProductiveAssetsRawData["units"]["USD"].forEach(rawCurrentItem => {
              this.extractAnualResultsFromRawData(rawCurrentItem, paymentsToAcquireProductiveAssetsFilteredMap)
            });
          }
          // Parsing the Raw Data and getting the right 10-K values
          if(paymentsToAcquirePropertyPlantAndEquipmentRawData) {
            paymentsToAcquirePropertyPlantAndEquipmentRawData["units"]["USD"].forEach(rawCurrentItem => {
              this.extractAnualResultsFromRawData(rawCurrentItem, paymentsToAcquirePropertyPlantAndEquipmentFilteredMap);
            });
          }

          // This is to get the financial report's year span, the maximum and minimum years
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

          // For each year, get the accumulated FCF and store it on the Map (year - FCF)
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
        // console.error('FCF calc => Error fetching data:', error.message);
        // console.log('ERROR!!!!!!!!!!!');

        // if (error.response) {
        //   const { status, data } = error.response;
        //   console.error(`HTTP status code: ${status}`);
        //   console.error("Response data:", data);
        // } else {
        //   console.error("Request failed:", error.message);
        // }

        if (error.response) {
          const { status, data } = error.response;
          console.error(`HTTP status code: ${status} , creating error.html.`);
          //console.error('Response data:', data);
    
          // You can also create an error HTML file with the error details
          const errorHtmlContent = `${JSON.stringify(data, null, 2)}`;
    
          fs.writeFile('error.html', errorHtmlContent, (err) => {
            if (err) {
              console.error('Error writing error HTML file:', err);
            } else {
              console.log('Error HTML file "error.html" created successfully.');
            }
          });
        } else {
          console.error('Request failed:', error.message);
        }

      }

      //TODO
      // Calculate Cash FLow trend/growth
      
      // setting info on cache
      cacheService.setFcfOnCache(ticker, fcfFilteredDataMap);

      // Return the computed
      return fcfFilteredDataMap;
    }

    //TODO - NF - document this method
    // in the future I might not remember why this is done
    extractAnualResultsFromRawData(rawCurrentItem, filteredDataMap) {


      //TODO - Add exception for SalesRevenueNet ?????
      // because every field has form = 10-K instead of some having 10-Q
      // We must distinguish them by the frame, which can have the format CY2013 or CY2014Q1

      if (rawCurrentItem.form === "10-K") {

        // console.log("form -> ", rawCurrentItem.form);
        // console.log("fy -> ", rawCurrentItem.fy);
        // console.log("end -> ", rawCurrentItem.end);
        // console.log("-----------------------------");

        const year = rawCurrentItem.fy;
        const endDate = rawCurrentItem.end;

        if (!filteredDataMap.has(year) || endDate > filteredDataMap.get(year).end) {
          filteredDataMap.set(year, rawCurrentItem);
          console.log("++++++++++++++");
          console.log("year -> ", year);
          console.log("rawCurrentItem -> ", rawCurrentItem);
          console.log("++++++++++++++");
          this.checkIfHasFrameFieldAndUpdate(filteredDataMap, rawCurrentItem);
        }
      }
    }

    //TODO - NF - document this method
    // in the future I might not remember why this is done
    checkIfHasFrameFieldAndUpdate(filteredDataMap, item) {
      if(item.hasOwnProperty("frame")) {
        if (item.frame.length >= 4) {
          const year = item.frame.slice(-4);
          filteredDataMap.set(year, item);
        }
      }
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
  
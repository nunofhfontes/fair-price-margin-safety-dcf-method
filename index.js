//const fetch = require('node-fetch');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
//import fetch from 'node-fetch';

const fs = require('fs').promises;
require('dotenv').config();

const API_KEY = process.env.API_KEY;
const API_URL = 'https://financialmodelingprep.com/api/v3/discounted-cash-flow/';

async function fetchStockData(ticker) {
  try {
    const response = await fetch(`${API_URL}${ticker}?apikey=${API_KEY}`);
    const data = await response.json();
    return data[0]; // Assuming API response is an array with a single object
  } catch (error) {
    console.error(`Error fetching data for ${ticker}:`, error);
    return null;
  }
}

async function calculateMarginOfSafety(data) {
  if (!data || !data['dcf'] || !data['Stock Price']) {
    return null;
  }

  const dcf = data['dcf'];
  const stockPrice = data['Stock Price'];
  const marginOfSafety = (1 - (dcf / stockPrice)) * 100;
  return marginOfSafety.toFixed(2);
}

async function fetchTickersFromURL(url) {
  try {
    const response = await fetch(url);
    const text = await response.text();
    return text.split('\n').map((ticker) => ticker.trim());
  } catch (error) {
    console.error('Error fetching tickers:', error);
    return [];
  }
}

async function processTickers() {
  try {
    const tickersURL =
      'https://raw.githubusercontent.com/nunofhfontes/fair-price-margin-safety-dcf-method/master/tickers.txt';
    const tickers = await fetchTickersFromURL(tickersURL);

    const allStocksTable = [];
    const highMarginTable = [];

    for (const ticker of tickers) {
      const stockData = await fetchStockData(ticker);
      const marginOfSafety = await calculateMarginOfSafety(stockData);

      if (marginOfSafety !== null) {
        allStocksTable.push({
          Ticker: ticker,
          DCF: stockData['dcf'],
          'Stock Price': stockData['Stock Price'],
          'Margin of Safety': marginOfSafety,
        });

        if (parseFloat(marginOfSafety) > 10) {
          highMarginTable.push({
            Ticker: ticker,
            DCF: stockData['dcf'],
            'Stock Price': stockData['Stock Price'],
            'Margin of Safety': marginOfSafety,
          });
        }
      }
    }

    console.table(allStocksTable);
    console.log('\nHigh Margin of Safety Stocks:');
    console.table(highMarginTable);
  } catch (error) {
    console.error('Error:', error);
  }
}

processTickers();
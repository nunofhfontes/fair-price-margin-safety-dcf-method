const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const fs = require('fs').promises;
const nodemailer = require('nodemailer');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const API_KEY = process.env.API_KEY;
const API_URL = 'https://financialmodelingprep.com/api/v3/discounted-cash-flow/';

// Initialize Telegram bot with your bot token
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });

// ... Existing code ...

// Function to send email with results
async function sendEmail(results) {
  // ... Your existing email sending code ...
}

// Function to send Telegram message with results
async function sendTelegramMessage(results) {
  try {
    const chatIds = process.env.TELEGRAM_CHAT_IDS.split(',');

    const message = `All Stocks Table:\n${formatResults(results.allStocks)}
High Margin of Safety Stocks:\n${formatResults(results.highMargin)}`;

    for (const chatId of chatIds) {
      await bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
      console.log('Telegram message sent to chat ID:', chatId);
    }
  } catch (error) {
    console.error('Error sending Telegram message:', error);
  }
}

// ... Remaining functions ...
function formatResults(data) {
// Same function as in the previous response
// ...
}

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
    //const marginOfSafety = (1 - (dcf / stockPrice)) * 100;
    const marginOfSafety = ((dcf - stockPrice)/dcf) * 100;
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

// Process tickers, send email and Telegram message
async function processTickersAndNotify() {
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

    const results = {
      allStocks: allStocksTable,
      highMargin: highMarginTable,
    };

    //sendEmail(results);
    sendTelegramMessage(results);
  } catch (error) {
    console.error('Error:', error);
  }
}

processTickersAndNotify();

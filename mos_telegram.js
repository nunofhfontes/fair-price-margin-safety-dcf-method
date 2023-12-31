const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const fs = require('fs').promises;
const nodemailer = require('nodemailer');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const API_KEY = process.env.API_KEY;
const API_URL = 'https://financialmodelingprep.com/api/v3/discounted-cash-flow/';

// Initialize Telegram bot with your bot token
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });

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
  const marginOfSafety = ((dcf - stockPrice) / dcf) * 100;
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

async function sendEmail(results) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'your-email-service', // e.g., 'Gmail' or 'Outlook'
      auth: {
        user: 'your-email@example.com',
        pass: 'your-email-password',
      },
    });

    const mailOptions = {
      from: 'your-email@example.com',
      to: 'recipient@example.com',
      subject: 'Stock Analysis Results',
      html: `<h2>All Stocks Table</h2>${formatResults(results.allStocks)}
            <h2>High Margin of Safety Stocks</h2>${formatResults(results.highMargin)}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
/*
async function sendTelegramMessage(results) {
  try {
    const chatIds = process.env.TELEGRAM_CHAT_IDS.split(',');

    // uses "special" that are allowed on telegram, since not all html is allowed
    const message = `Results Summary:\n\n${formatResultsForTelegram(results.allStocks)}
    High Margin of Safety Stocks:\n\n${formatResultsForTelegram(results.highMargin)}`;

    for (const chatId of chatIds) {
      console.log("chatId => ", chatId);
      await bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
      console.log('Telegram message sent to chat ID:', chatId);
    }
  } catch (error) {
    console.error('Error sending Telegram message:', error);
  }
}
*/

async function sendTelegramMessage(results) {
  try {
    const chatIds = process.env.TELEGRAM_CHAT_IDS.split(',');

    // uses "special" tags that are allowed on telegram, since not all html is allowed
    const allStocksTable = formatResultsForTelegram(results.allStocks);
    const highMarginTable = formatResultsForTelegram(results.highMargin);

    // Split allStocksTable into two messages
    const allStocksTablePart1 = allStocksTable.substring(0, allStocksTable.length / 2);
    const allStocksTablePart2 = allStocksTable.substring(allStocksTable.length / 2);

    for (const chatId of chatIds) {
      console.log("chatId => ", chatId);
      await bot.sendMessage(chatId, `Results Summary (Part 1):\n\n${allStocksTablePart1}`, { parse_mode: 'HTML' });
      await bot.sendMessage(chatId, `Results Summary (Part 2):\n\n${allStocksTablePart2}`, { parse_mode: 'HTML' });
      await bot.sendMessage(chatId, `High Margin of Safety Stocks:\n\n${highMarginTable}`, { parse_mode: 'HTML' });
      await bot.sendMessage(chatId, '===================\n\nAnd thats it for today!!!\n\n===================');

      console.log('Telegram messages sent to chat ID:', chatId);
    }
  } catch (error) {
    console.error('Error sending Telegram messages:', error);
  }
}


function formatResultsForTelegram(data) {
  let formattedText = 'All Stocks Table:\n\n';
  data.forEach((row) => {
    formattedText += `Ticker: ${row.Ticker}\n`;
    formattedText += `DCF: ${row.DCF}\n`;
    formattedText += `Stock Price: ${row['Stock Price']}\n`;
    formattedText += `Margin of Safety: ${row['Margin of Safety']}%\n\n`;
  });
  return formattedText;
}

function formatResults(data) {
  let tableHTML = '<table>';
  tableHTML += '<tr>';
  for (const key in data[0]) {
    tableHTML += `<th>${key}</th>`;
  }
  tableHTML += '</tr>';
  
  data.forEach((row) => {
    tableHTML += '<tr>';
    for (const key in row) {
      tableHTML += `<td>${row[key]}</td>`;
    }
    tableHTML += '</tr>';
  });
  
  tableHTML += '</table>';
  return tableHTML;
}

async function processTickersAndNotify() {
    console.log("Runnin MoS program.");
  try {
    const tickersURL =
      'https://raw.githubusercontent.com/nunofhfontes/fair-price-margin-safety-dcf-method/master/tickers.txt';
    const tickers = await fetchTickersFromURL(tickersURL);

    const allStocksTable = [];
    const highMarginTable = [];

    console.log("going to loop tickers.");
    for (const ticker of tickers) {
    console.log("ticker -> ", ticker);
      const stockData = await fetchStockData(ticker);
      const marginOfSafety = await calculateMarginOfSafety(stockData);

      if (marginOfSafety !== null) {
        const stockEntry = {
          Ticker: ticker,
          DCF: stockData['dcf'],
          'Stock Price': stockData['Stock Price'],
          'Margin of Safety': marginOfSafety,
        };
        allStocksTable.push(stockEntry);

        if (parseFloat(marginOfSafety) > 10) {
          highMarginTable.push(stockEntry);
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

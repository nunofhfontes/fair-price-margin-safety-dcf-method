const Redis = require('ioredis');
const axios = require('axios');

// Initialize Redis connection
const redis = new Redis(); // By default, it connects to a Redis server running locally

const apiUrl = 'https://www.sec.gov/include/ticker.txt'; // Replace with your API URL

const startCache = () => {
    console.log("starting Cache");

    const tickerData = fetchTickerMapping();

    // if (tickerData) {
    //     // Access ticker data from Redis cache
    //     const cikNumber = tickerData.get('AAPL'); // Replace 'AAPL' with your desired ticker
    //     console.log('CIK number for AAPL:', cikNumber);
    // }
}


async function fetchTickerMapping() {
    try {
      // Check if the data is already in Redis cache
      const cachedData = await redis.get('tickerData');
  
      if (cachedData) {
        const tickerMap = new Map(JSON.parse(cachedData));
        console.log('Data retrieved from Redis cache:');
        console.log(tickerMap);
        return tickerMap;
      }
  
      // Fetch the text file from the API
      const response = await axios.get(apiUrl);
      if (!response.data) {
        throw new Error('No data received from the API.');
      }
  
      // Parse the text data and create a map
      const textData = response.data;
      const tickerMap = new Map();
  
      const lines = textData.split('\n');
      for (const line of lines) {
        const [ticker, cik] = line.split('\t');
        tickerMap.set(ticker, cik);
      }
  
      // Store the map in Redis cache
      await redis.set('tickerData', JSON.stringify([...tickerMap.entries()]));
  
      console.log('Data retrieved from API and stored in Redis cache:');
      console.log(tickerMap);
  
      return tickerMap;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }

module.exports = {
    startCache,
    fetchTickerMapping
};
const NodeCache = require('node-cache');
const axios = require('axios');

// Initialize the cache with a 5-minute expiration time (adjust as needed)
const cache = new NodeCache({ stdTTL: 1300 });

const apiUrl = 'https://www.sec.gov/include/ticker.txt'; // Replace with your API URL

async function fetchTickerMapping() {
  try {
    // Check if the data is already in the cache
    const cachedData = cache.get('tickerData');

    if (cachedData) {
      console.log('Data (size of) retrieved from cache: ', cachedData.size);
      return cachedData;
    }

    const headers = {
      'User-Agent': 'traderfactory nunnofontes@traderfactory.com',
      'Accept-Encoding': 'gzip, deflate',
    };

    // Fetch the text file from the API
    const response = await axios.get(apiUrl, {
      headers: headers,
    });
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

    // Store the map in the cache with a key 'tickerData'
    cache.set('tickerData', tickerMap);

    console.log(`-----------------------------------\nInit Cache - Data (size of) retrieved from API and cached: ${tickerMap.size}`);
    console.log("Example: ", tickerMap.get('aapl'));

    return tickerMap;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

getTickersFromCache = async () => {
  // Check if the data is already in the cache
  const cachedData = cache.get('tickerData');

  if (cachedData) {
    console.log('Data (size of) retrieved from cache: ', cachedData.size);
    return cachedData;
  }
}

// Init
startCache = async () => {

  //FIXME - NF - temporarily disabled for debug purposes
  const tickerData = await fetchTickerMapping();

  if (tickerData) {
    // Access ticker data from the cache
    const cikNumber = tickerData.get('aapl'); // Replace 'AAPL' with your desired ticker
    console.log(`Init Cache Testing - CIK number for AAPL: ${cikNumber} \n-----------------------------------`);
  }
  // console.log("Starting Mock Cache.");

}

getCikFromCache = async (ticker) => {
    const tickerData = await fetchTickerMapping();
  
    if (tickerData) {
      // Access ticker data from the cache
      const cikNumber = tickerData.get(ticker); // Replace 'AAPL' with your desired ticker
      console.log(`Retrieved CIK- > ${cikNumber} from the cache for the ticker -> ${ticker}`);
      
      // return cik number
      return tickerData.get(ticker); 
    }
}

setFcfOnCache = (ticker, fcfData) => {
  
  //TODO: should merge objects instead of smashing

  console.log(`INFO: setting FCF information on cache for ticker: ${ticker}`);
  
  cache.set(ticker, {
    fcf: fcfData,
  });
}

getFcfFromCache = (ticker) => {
  
  //TODO: should merge objects instead of smashing

  console.log(`INFO: getting FCF information on cache for ticker: ${ticker}`);
  
  // ????
  // let fcfData = cache.set(ticker);
  let fcfData = cache.get(ticker);

  if(!fcfData) {
    console.log(`WARN: no Cache FCF information found for ticker: ${ticker}`);
    return;
  }
  
  return fcfData;
}

module.exports = {
    startCache,
    getTickersFromCache,
    getCikFromCache,
    setFcfOnCache,
    getFcfFromCache,
};

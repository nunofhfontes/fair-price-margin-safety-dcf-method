

// components/SearchBox.js
import React, { useState, useEffect } from 'react';

const SearchBox = () => {
  const knownTickers = ['AAPL', 'GOOGL', 'TSLA', 'AMZN', 'MSFT', 'TGT']; // Sample list of known tickers
  const [inputValue, setInputValue] = useState('');
  const [tickerArray, setTickerArray] = useState([]);
  const [suggestion, setSuggestion] = useState(null);
  const [isInputFocused, setInputFocused] = useState(false);

  useEffect(() => {
    

    const fetchTickers = async () => {
      // Fetch knownTickers from the API when the component mounts
      // Check if tickers are stored in localStorage
      const storedTickers = localStorage.getItem('tickers');
      if (storedTickers) {
        setTickerArray(JSON.parse(storedTickers));
      } else {
        try {
          const response = await fetch('http://localhost:3000/financial/tickers');
          const data = await response.json();
          if(!data) {
            setTickerArray(knownTickers); 
          } else {
            setTickerArray(Object.keys(data));
            localStorage.setItem('tickers', JSON.stringify(Object.keys(data))); // setItem(keyName, keyValue)
          }
          console.log('tickerArray: ', tickerArray);
        } catch (error) {
          // here we set the known tickers as a fallback, at least will have some suggestions
          setTickerArray(knownTickers);
          console.error('Error fetching tickers:', error);
        }
      }
    };
    
    fetchTickers();
  }, []); // The empty array [] ensures this effect runs once when the component mounts


  const handleInputFocus = () => {
    setInputFocused(true);
  };

  const handleInputBlur = () => {
    console.log('on Blur event');
    // Use setTimeout to delay clearing the suggestion
    setTimeout(() => {
        setInputFocused(false);
        setSuggestion(null);
    }, 100);
  };

  const handleSuggestionClick = async (suggestion) => {
    console.log('on handle suggestion: ', suggestion);
    setInputValue(suggestion);

    // You can also clear the suggestion list here if needed
    setSuggestion(null);

    // get data for that ticker
    console.log(`fetching data for ticker -> ${suggestion}`);

    
    const tickerData = await getDataForTicker(suggestion);
    

    // change page to "stock's data page"
  };

  const getDataForTicker = async (ticker) => {

    try {
      const response = await fetch(`http://localhost:3000/financial/company/${ticker}/fcf`);
      const data = await response.json();
      if(!data) {
      } else {
        // TODO - temp, log data
        console.log(`fcf data: ${data}`);

        // store data on local storage
        //localStorage.setItem('tickers', JSON.stringify(Object.keys(data))); // setItem(keyName, keyValue)
      }
    } catch (error) {
      console.error('Error fetching tickers:', error);
    }

  }

  const handleInputChange = (e) => {

    console.log("input changes detector: ", e.target.value);

    const value = e.target.value;
    setInputValue(value);

    // Check if the input value matches any known tickers
    // console.log('knownTickers: ', knownTickers);
    // const matchedTickers = knownTickers.find((ticker) =>
    console.log('tickerArray: ', tickerArray);
    const matchedTickers = tickerArray.find((ticker) =>
      ticker.toLowerCase().startsWith(value.toLowerCase())
    );
    console.log("matchedTickers: ", matchedTickers);

    // Update the suggestions based on matched tickers
    // setSuggestions(matchedTickers);
    setSuggestion(matchedTickers);
  };

  return (
    
    <div className="">
        <div className="inline-flex flex-col justify-center relative text-gray-500">
            <div className="relative">
                <input type="text" className="w-full p-2 pl-8 rounded border border-gray-200 bg-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent" 
                    placeholder="search..." 
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                />
                <svg className="w-4 h-4 absolute left-2.5 top-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                {isInputFocused && suggestion && (
                <div 
                    className='z-10 absolute hover:bg-gray-300 rounded-b border border-gray-20 bg-white w-full cursor-pointer'
                    onClick={() => handleSuggestionClick(suggestion)}>
                        {suggestion}
                    </div>
                )}
            </div>
            
        </div>
    </div>
  );
};

export default SearchBox;

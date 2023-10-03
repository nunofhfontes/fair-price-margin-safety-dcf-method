

// components/SearchBox.js
import React, { useState } from 'react';

const SearchBox = () => {
  const [inputValue, setInputValue] = useState('');
  const knownTickers = ['AAPL', 'GOOGL', 'TSLA', 'AMZN', 'MSFT']; // Sample list of known tickers
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    // Check if the input value matches any known tickers
    // const matchedTickers = knownTickers.filter((ticker) =>
    //   ticker.toLowerCase().includes(value.toLowerCase())
    // );
    const matchedTickers = knownTickers.filter((ticker) =>
      ticker.toLowerCase().startsWith(value.toLowerCase())
    );

    // Update the suggestions based on matched tickers
    setSuggestions(matchedTickers);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter ticker"
        value={inputValue}
        onChange={handleInputChange}
      />
      {suggestions.length > 0 && (
        <ul>
          {suggestions.map((ticker) => (
            <li key={ticker}>{ticker}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBox;


{/* <div className="relative">
    <span className="absolute inset-y-0 left-0 flex items-center py-4">
        <button
            type="submit"
            className="p-2 focus:outline-none focus:ring"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
            </svg>
        </button>
    </span>
    <input
        type="search"
        name="Search"
        placeholder="Search..."
        className="w-full py-2 pl-10 text-sm rounded-md focus:outline-none"
    />
</div> */}


// components/SearchBox.js
import React, { useState } from 'react';

const SearchBox = () => {
  const [inputValue, setInputValue] = useState('');
  const knownTickers = ['AAPL', 'GOOGL', 'TSLA', 'AMZN', 'MSFT', 'TGT']; // Sample list of known tickers
//   const [suggestions, setSuggestions] = useState([]);
  const [suggestion, setSuggestion] = useState(null);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [isInputFocused, setInputFocused] = useState(false);

  const handleInputFocus = () => {
    setInputFocused(true);
  };

  const handleInputBlur = () => {
    console.log('on Blur event');
    setInputFocused(false);
  };

  const handleSuggestionClick = (suggestion) => {
    console.log('on handle suggestion: ', suggestion);
    setInputValue(suggestion);
    // You can also clear the suggestion list here if needed
    setSuggestion(null);
  };

  const handleInputChange = (e) => {

    console.log("input changes detector: ", e.target.value);

    const value = e.target.value;
    setInputValue(value);

    // Check if the input value matches any known tickers
    // const matchedTickers = knownTickers.filter((ticker) =>
    //   ticker.toLowerCase().includes(value.toLowerCase())
    // );
    // if(!value) {
    //     // if there's no inserted value, prevent the search
    //     return;
    // }
    console.log('knownTickers: ', knownTickers);
    const matchedTickers = knownTickers.find((ticker) =>
      ticker.toLowerCase().startsWith(value.toLowerCase())
    );
    console.log("matchedTickers: ", matchedTickers);

    // if(suggestion)

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
                //onBlur={handleInputBlur}
            />
            <svg className="w-4 h-4 absolute left-2.5 top-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            {/* {suggestion ? (
                <div className='z-10 absolute rounded border border-gray-20 bg-gray-200 w-full'>{suggestion}</div>
            ): (<></>) } */}
            {isInputFocused && suggestion && (
               <div 
                className='z-10 absolute rounded-b border border-gray-20 bg-white w-full cursor-pointer'
                onClick={() => handleSuggestionClick(suggestion)}>
                    {suggestion}
                </div>
            )}
        </div>
        
    </div>
</div>

    // <div className="relative">
    //     <span className="absolute inset-y-0 left-0 flex items-center py-4">
    //         <button
    //             type="submit"
    //             className="p-2 focus:outline-none focus:ring"
    //         >
    //             <svg
    //                 xmlns="http://www.w3.org/2000/svg"
    //                 className="w-6 h-6"
    //                 fill="none"
    //                 viewBox="0 0 24 24"
    //                 stroke="currentColor"
    //                 strokeWidth={2}
    //             >
    //                 <path
    //                     strokeLinecap="round"
    //                     strokeLinejoin="round"
    //                     d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    //                 />
    //             </svg>
    //         </button>
    //     </span>
    //     <input
    //         type="search"
    //         name="Search"
    //         placeholder="Search..."
    //         className="w-full py-2 pl-10 text-sm rounded-md focus:outline-none"
    //         value={inputValue}
    //         onChange={handleInputChange}
    //     />

    //     {/* {suggestion ? (
    //         <div className='z-50'>Suggestion: {suggestion}</div>
    //         ): (<></>) } */}
    // </div>
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


// <div>
    //   <input
    //     type="text"
    //     placeholder="Enter ticker"
    //     value={inputValue}
    //     onChange={handleInputChange}
    //   />
      {/* {suggestion ? (
        <p>Suggestion: {suggestion}</p>
      ): (<></>) } */}
      {/* {suggestion && (
        <p>Suggestion: {suggestion}</p>
      )} */}
      {/* {suggestions.length > 0 && (
        <ul>
          {suggestions.map((ticker) => (
            <li key={ticker}>{ticker}</li>
          ))}
        </ul>
      )} */}

    {/* </div> */}
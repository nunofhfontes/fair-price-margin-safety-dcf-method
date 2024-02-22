# fair-price-margin-safety-dcf-method
Get fair prices using the DCF method and calculate the Margin of Safety for a list of stocks

To run the application on localhost:

First, run the server. 

1 - go to (...)/fair-price-margin-safety-dcf-method

2 - run the following statement: node app-invest-ratios.js

3 - the server will be available at localhost:3000, and will be serving two endpoits:
    localhost:3000/financial/tickers
    localhost:3000/financial/[SOME_TICKER]/fcf

3.1 - endpoints are now availabe (just for development at https://financial-analysis-api.onrender.com/financial/company/HD/fcf 
    for example), available endpoints:
    https://financial-analysis-api.onrender.com/financial/company/[SOME_TICKER]/fcf
    https://financial-analysis-api.onrender.com/financial/analysis/[SOME_TICKER]/full

    
Second, run the frontend.

1 - go to (...)/fair-price-margin-safety-dcf-method/fair_price_next_fe

2 - run the following statement: npm run dev

3 - the frontend will be available on localhost:8080
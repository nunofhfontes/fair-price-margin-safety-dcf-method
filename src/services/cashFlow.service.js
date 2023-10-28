

class CashFlowService {

    async calculateFcfCagr(ticker, fcfMap) {

        const cagrWithoutZeros = this.calculateCAGRWithoutZeros(fcfMap);
        console.log(ticker + ' => CAGR without considering zeros:', cagrWithoutZeros);
    }

    // CAGR without considering the years (the starting ones) with 0 free cash flow
    calculateCAGRWithoutZeros(data) {

        const nonZeroYears = Array.from(data.keys()).filter((year) => data.get(year) !== 0);

        if (nonZeroYears.length < 2) {
            console.warn("CAGR computing without zeros - Not enough data to calculate CAGR");
            return null; // Not enough data to calculate CAGR
        }
        
        const firstYear = nonZeroYears[0];
        const lastYear = nonZeroYears[nonZeroYears.length - 1];
        const initialValue = data.get(firstYear);
        const finalValue = data.get(lastYear);
        
        const years = lastYear - firstYear + 1;
        const cagr = ((finalValue / initialValue) ** (1 / years) - 1) * 100;
        return cagr;
    }

    calculateDCF(ticker, cik, fcf, fcfCagr) {

        // Required rate of return (discount rate)
        const discountRate = 0.1; // 10%

        // Estimated future cash flows (in millions)
        const cashFlows = [
            100,  // Year 1
            120,  // Year 2
            140,  // Year 3
            160,  // Year 4
            180,  // Year 5
        ];
        // TODO - change to expected FCF that will be a projection from past FCFs

        // Total number of shares outstanding (in millions)
        const sharesOutstanding = 20; // Example number

        // Calculate the present value of each cash flow
        const presentValues = cashFlows.map((cashFlow, index) => {
            return cashFlow / Math.pow(1 + discountRate, index + 1);
        });

        // Calculate the fair value by summing up the present values
        const fairValue = presentValues.reduce((acc, value) => acc + value, 0);

        // Calculate the fair price per share
        const fairPricePerShare = fairValue / sharesOutstanding;

        console.log('Fair Value:', fairValue.toFixed(2));
        console.log('Fair Price Per Share:', fairPricePerShare.toFixed(2));

        // Computing the Terminal Value using the Perpetuity Growth Model
        // Parameters
        const finalYearCashFlow = 180; // Cash flow in the last forecasted year (Year 5 in the previous example)
        const growthRate = 0.05; // 5% growth rate

        // Calculate the Terminal Value
        const terminalValue = finalYearCashFlow * (1 + growthRate) / (discountRate - growthRate);

        console.log('Terminal Value:', terminalValue.toFixed(2));


    }

    getOutstandingShares(ticker, cik) {

    }

}


  

module.exports = new CashFlowService();


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
}


  

module.exports = new CashFlowService();


class CashFlowService {

    async calculateFcfCagr(ticker, fcfMap) {

        const cagrWithoutZeros = this.calculateCAGRWithoutZeros(fcfMap);
        const cagrWithZeros = this.calculateCAGRWithZeros(fcfMap);
    
        console.log('CAGR without considering zeros:', cagrWithoutZeros);
        console.log('CAGR considering all years:', cagrWithZeros);

    }

    // CAGR without considering the years with 0 free cash flow
    calculateCAGRWithoutZeros(data) {

        console.log('data: ', data);
        console.log("keys: ", Object.keys(data));
        console.log("data.keys(): ", data.keys());

        //const nonZeroYears = Object.keys(data).filter((year) => data[year] !== 0);
        
        const nonZeroYears = data.keys().filter((year) => data[year] !== 0);

        //const nonZeroYears = data;

        //console.log("keys: ", data.keys);
        console.log("nonZeroYears: ", nonZeroYears);

        if (nonZeroYears.length < 2) {
            console.warn("CAGR computing without zeros - Not enough data to calculate CAGR");
            return null; // Not enough data to calculate CAGR
        }
        
        const firstYear = nonZeroYears[0];
        const lastYear = nonZeroYears[nonZeroYears.length - 1];
        const initialValue = data[firstYear];
        const finalValue = data[lastYear];
        
        const years = lastYear - firstYear + 1;
        const cagr = ((finalValue / initialValue) ** (1 / years) - 1) * 100;
        return cagr;
    }
    
    // CAGR considering all years
    calculateCAGRWithZeros(data) {
        const years = Object.keys(data);
        const firstYear = years[0];
        const lastYear = years[years.length - 1];
        const initialValue = data[firstYear];
        const finalValue = data[lastYear];
        
        const yearsRange = lastYear - firstYear + 1;
        const cagr = ((finalValue / initialValue) ** (1 / yearsRange) - 1) * 100;
        return cagr;
    }
    
}


  

module.exports = new CashFlowService();
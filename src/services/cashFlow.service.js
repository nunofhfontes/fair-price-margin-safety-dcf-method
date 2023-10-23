

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
        
        const nonZeroYears = Array.from(data.keys()).filter((year) => data.get(year) !== 0);

        //const nonZeroYears = data;

        //console.log("keys: ", data.keys);
        console.log("===>>> nonZeroYears: ", nonZeroYears);

        if (nonZeroYears.length < 2) {
            console.warn("CAGR computing without zeros - Not enough data to calculate CAGR");
            return null; // Not enough data to calculate CAGR
        }
        
        const firstYear = nonZeroYears[0];
        console.log(' firstYear', firstYear);
        console.log('typeof firstYear', typeof firstYear);
        const lastYear = nonZeroYears[nonZeroYears.length - 1];
        console.log('typeof lastYear', typeof lastYear);
        console.log('data[firstYear] = ', data.get(firstYear));
        const initialValue = data.get(firstYear);
        console.log(' initialValue', initialValue);
        const finalValue = data.get(lastYear);
        console.log(' finalValue', finalValue);
        
        const years = lastYear - firstYear + 1;
        console.log(' years', years);
        console.log('pre cagr: (finalValue / initialValue) ** (1 / years) : ', (finalValue / initialValue) );
        const cagr = ((finalValue / initialValue) ** (1 / years) - 1) * 100;
        console.log('typeof cagr', typeof cagr);
        return cagr;
    }
    
    // CAGR considering all years
    calculateCAGRWithZeros(data) {
        const years = Array.from(data.keys());
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
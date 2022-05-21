let previousDay = "";
new Date().toISOString().split('T')[0].split("-").forEach((date, index) => {                
    if (index === 2) {
        previousDay = (Number(date) - 1).toString();            
    }
});
const previousDate = new Date().toISOString().split('T')[0].substring(0, new Date().toISOString().split('T')[0].length-2) + previousDay;
const dataState = {        
    currency_api: {
        currency_rest: `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/${previousDate}/currencies/`,
        currency_support: "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies.json",
    }
}

export default dataState;
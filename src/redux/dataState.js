let dataState = {        
    currency_api: {
        currency_rest: !!`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/${new Date().toISOString().split('T')[0]}/currencies/` ? 
        `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/${new Date().toISOString().split('T')[0]}/currencies/` : 
        "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/",
        currency_support: "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies.json",
    }
}

export default dataState;
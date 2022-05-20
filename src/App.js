import React, { useEffect, useState } from "react";
import RateExChange from "./component/RateExChange.js";
import hector from "./images/hector-j-rivas-1FxMET2U5dU-unsplash.jpg";
import './scss/App.scss';

const background_image_style = {
  background: `url(${hector})no-repeat center`,
  backgroundSize: 'cover',
  backgroundAttachment: 'fixed'
}

const App = props => {  
    const currency_api = props.dataState.currency_api,
    currency_rest = props.dataState.currency_api.currency_rest,
    [currencyDate, updateCurrencyDate] = useState(null),
    fetchCurrenciesRestData = async (path) => {                
            const 
                url = `${path}usd/usd.json`,
                response = await fetch(url);

                if (response.ok) {
                    const 
                        data = await response.json();
                        updateCurrencyDate(data.date); 
                }
        }

        fetchCurrenciesRestData(currency_rest);


    return (
        <div className="layout">
        <main>
            <header className="header">
                <div className="header-background usd-img" style={background_image_style}></div>
                <div className="header-container">                        
                    <div className="container">
                        <h1>Currency Exchange Rate</h1>
                        <p>Last update: {currencyDate}</p>
                        <RateExChange currencyAPI={currency_api} />
                    </div>
                </div>
            </header>
            {/* <div className="content">

            </div> */}
        </main>
        {/* <footer className="footer">

        </footer> */}
        </div>
    );
}

export default App;

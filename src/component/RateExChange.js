import React, { useState, useEffect } from 'react';
import usd_img from "./../images/one-usd.png";
import uah_img from "./../images/one-uah.png";
import eur_img from "./../images/one-euro.png";

const imagesRate = {
    usd: usd_img,
    uah: uah_img,
    eur: eur_img,
};

const RateExChange = props => {
const 
    currencySupportUrl = props.currencyAPI.currency_support,
    currencyRestUrlPath = props.currencyAPI.currency_rest,    

    [currencyDisplayName, updateCurrencyDisplayName] = useState(null),
    fetchCurrencyDisplayName = async url => {
        const response = await fetch(url);         
        let temp_data = {};
            if (response.ok) {
                const data = await response.json();
                for (let [key, value] of Object.entries(data)) {
                    if (key === "usd" || key === "uah" || key === "eur") {
                        Object.assign(temp_data, {[key]: value});                
                    }
                }
                updateCurrencyDisplayName(temp_data);        
                temp_data = null;
            }
    },

    [quantityRateValue, updateQuantityRateValue] = useState(1),
    [currenciesRestData, updateCurrenciesRestData] = useState(null),
    fetchCurrenciesRestData = async (path, from, to) => {                
        if (from !== null &&  to !== null) {
            const 
                url = `${path}${from}/${to}.json`,
                response = await fetch(url);                
                if (response.ok) {
                    const 
                        data = await response.json();
                        updateCurrenciesRestData(data[to]);
                }
        } 
    },

    [selectToIsDisabled, updateSelectToIsDisabled] = useState(true),
    [selectFromValue, updateSelectFromValue] = useState(null),
    refSelectFrom = React.createRef(),
    handleSelectFrom = event => {
        const 
            fromValue = event.target.value;        
            updateSelectToIsDisabled(false);
            updateSelectFromValue(fromValue);
            fetchCurrenciesRestData(currencyRestUrlPath, fromValue, selectToValue);                              
    },

    [quantityIsDisabled, updateQuantityIsDisabled] = useState(true),
    [btnDisabled, updateBtnDisabled] = useState(true),
    [selectToValue, updateSelectToValue] = useState(null),
    refSelectTo = React.createRef(),
    handleSelectTo = event => {
        const 
            toValue = event.target.value;        
            updateQuantityIsDisabled(false);
            updateSelectToValue(toValue);
            updateBtnDisabled(false);
            fetchCurrenciesRestData(currencyRestUrlPath, selectFromValue, toValue);           
    },
    
    handleQuantity = event => {
        const 
            quantityValue = Number(event.target.value);
            quantityValue <= 0 ? updateQuantityRateValue(1) : updateQuantityRateValue(quantityValue);
    },
    
    handleSelectRevers = event => {                
        updateSelectFromValue(refSelectFrom.current.value = selectToValue);
        updateSelectToValue(refSelectTo.current.value = selectFromValue);
    },
    
    defaultOptionText = "Choose a currency...";

    useEffect(() => {
        fetchCurrencyDisplayName(currencySupportUrl)
    }, []);

    return (        
        <div className="currency-exchange">
            <div className="form-exchange">
                <label className="label">
                    <span className='label-item'>Select from</span>
                    <select name="select-from" defaultValue={"default"} onChange={handleSelectFrom} ref={refSelectFrom}>
                        <option value="default" disabled>{defaultOptionText}</option>
                        {!!currencyDisplayName ? Object.keys(currencyDisplayName).map((name, index) => {
                            return (
                                <option key={index} value={name}>
                                    {name.toUpperCase()}
                                </option>
                            )         
                        }) : ''}
                    </select>
                </label>
                <label className="label btn">
                <span className='label-item'>Revers</span>
                    <button className="btn-select-revers" onClick={handleSelectRevers} disabled={btnDisabled}>
                        <svg fill="#000000" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 26 26" width="26px" height="26px"><path d="M 12 0 L 12 2.25 C 6.503906 2.761719 2.1875 7.371094 2.1875 13 C 2.1875 15.933594 3.351563 18.582031 5.25 20.53125 L 7.96875 18.09375 C 6.660156 16.792969 5.84375 14.988281 5.84375 13 C 5.84375 9.390625 8.523438 6.398438 12 5.90625 L 12 8 L 18.40625 4 Z M 20.75 5.46875 L 18.0625 7.90625 C 19.371094 9.207031 20.15625 11.015625 20.15625 13 C 20.15625 16.613281 17.480469 19.574219 14 20.0625 L 14 18 L 7.59375 22 L 14 26 L 14 23.75 C 19.496094 23.238281 23.8125 18.628906 23.8125 13 C 23.8125 10.066406 22.648438 7.417969 20.75 5.46875 Z"/></svg>
                    </button>
                </label>
                <label className="label">
                    <span className='label-item'>Select to</span>
                    <select name="select-to" defaultValue={"default"} disabled={selectToIsDisabled} onChange={handleSelectTo} ref={refSelectTo}>
                        <option value="default" disabled>{defaultOptionText}</option>                        
                        {!!currencyDisplayName ? Object.keys(currencyDisplayName).map((name, index) => {
                            return (
                                <option key={index} value={name}>
                                    {name.toUpperCase()}
                                </option>
                            )
                        }) : ''}
                    </select>
                </label>
                <label className="label">
                    <span className='label-item'>Quantity</span>
                    <input className="input-item" name="currencies-quantity" type="number" value={quantityRateValue} disabled={quantityIsDisabled} onChange={handleQuantity} />
                </label>
                <label className="label result">
                    <span className="label-item">Exchange Rate</span>
                    <figure className="currency-result">                        
                        {!!currencyDisplayName ? Object.keys(currencyDisplayName).map((name, index) => {
                            fetchCurrenciesRestData(currencyRestUrlPath, selectFromValue, selectToValue);
                            if (selectToValue === name) {
                                return (
                                    <img key={index} src={window.location.origin + imagesRate[name]} />
                                )
                            }
                        }) : ''}
                        
                        <figcaption style={{color: "#b7b7b7"}}>
                            {!!currenciesRestData ? 
                                new Intl.NumberFormat(
                                    "en-US", {
                                    style: "currency", 
                                    currency: selectToValue, 
                                    currencyDisplay: "name"
                                }).format(quantityRateValue * Number(currenciesRestData))
                            : quantityRateValue}
                        </figcaption>
                    </figure>
                </label>
            </div>
        </div>
    );
}

export default RateExChange;
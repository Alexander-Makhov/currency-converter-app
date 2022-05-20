import React, { useState, useEffect } from 'react';

const RateExChange = props => {
    const 
        currencySupportUrl = props.currencyAPI.currency_support,
        currencyRestUrlPath = props.currencyAPI.currency_rest;
    
    const 
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
        }
        
        useEffect(() => {
            fetchCurrencyDisplayName(currencySupportUrl);
        }, []);

    const 
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
        }

    const 
        [selectToIsDisabled, updateSelectToIsDisabled] = useState(true),
        [selectFromValue, updateSelectFromValue] = useState(null),
        handleSelectFrom = event => {
            const 
                target = event.target,
                fromValue = target.value;        
                updateSelectToIsDisabled(false);
                updateSelectFromValue(fromValue);
                fetchCurrenciesRestData(currencyRestUrlPath, fromValue, selectToValue);        
        }

    const 
        [quantityIsDisabled, updateQuantityIsDisabled] = useState(true),
        [selectToValue, updateSelectToValue] = useState(null),
        handleSelectTo = event => {
            const 
                target = event.target,
                toValue = target.value;        
                updateQuantityIsDisabled(false);
                updateSelectToValue(toValue);
                fetchCurrenciesRestData(currencyRestUrlPath, selectFromValue, toValue);             
        },
        
        handleQuantity = event => {
            const 
                target = event.target,
                quantityValue = Number(target.value);
                quantityValue <= 0 ? updateQuantityRateValue(1) : updateQuantityRateValue(quantityValue);
        }

    return (        
        <div className="currency-exchange">
            <div className="form-exchange">
                <label className="label">
                    <span className='label-item'>Select from</span>
                    <select name="select-from" defaultValue={"default"} onChange={handleSelectFrom}>
                        <option value="default" disabled>Choose a currency...</option>
                        {!!currencyDisplayName ? Object.keys(currencyDisplayName).map((name, index) => {
                            if (selectToValue !== name) {
                                return (
                                    <option key={index} value={name}>
                                        {name.toUpperCase()}
                                    </option>
                                )
                            }                            
                        }) : ''}
                    </select>
                </label>
                <label className="label">
                    <span className='label-item'>Select to</span>
                    <select name="select-to" defaultValue={"default"} disabled={selectToIsDisabled} onChange={handleSelectTo}>
                        <option value="default" disabled>Choose a currency...</option>
                        {!!currencyDisplayName ? Object.keys(currencyDisplayName).map((name, index) => {
                            if (selectFromValue !== name) {
                                return (
                                    <option key={index} value={name}>
                                        {name.toUpperCase()}
                                    </option>
                                )
                            }            
                        }) : ''}
                    </select>
                </label>
                <label className="label">
                    <span className='label-item'>Quantity</span>
                    <input className="input-item" name="currencies-quantity" type="number" value={quantityRateValue} disabled={quantityIsDisabled} onChange={handleQuantity} />
                </label>
                <label className="label">
                    <span className="label-item">Exchange Rate</span>
                    {!!currenciesRestData ? 
                        new Intl.NumberFormat(
                            "en-US", {
                            style: "currency", 
                            currency: selectToValue, 
                            currencyDisplay: "name"
                        }).format(quantityRateValue * Number(currenciesRestData)) 
                    : quantityRateValue}
                </label>
            </div>
        </div>
    );
}

export default RateExChange;
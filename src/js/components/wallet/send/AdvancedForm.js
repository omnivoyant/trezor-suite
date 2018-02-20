/* @flow */
'use strict';

import React from 'react';
import Tooltip from 'rc-tooltip';

const AdvancedForm = (props: any): any => {

    const { 
        coin,
        token,
        gasPrice,
        gasLimit,
        data,
        errors,
        warnings,
        infos,
        advanced
    } = props.sendForm;

    const {
        toggleAdvanced,
        onGasPriceChange,
        onGasLimitChange,
        onDataChange
    } = props.sendFormActions;

    if (!advanced) return (
        <div className="advanced-container">
            <a className="advanced" onClick={ toggleAdvanced }>Advanced settings</a>
            { props.children }
        </div>
    );

    const gasLimitTooltip = (
        <div className="tooltip-wrapper">
            Gas limit is the amount of gas to send with your transaction.<br/>
            <span>TX fee = gas price * gas limit</span> &amp; is paid to miners for including your TX in a block.<br/>
            Increasing this number will not get your TX mined faster.<br/>
            Default value for sending ETH is <span>{ gasLimit } WEI.</span>
        </div>
    );

    const gasPriceTooltip = (
        <div className="tooltip-wrapper">
            Gas Price is the amount you pay per unit of gas.<br/>
            <span>TX fee = gas price * gas limit</span> &amp; is paid to miners for including your TX in a block.<br/>
            Higher the gas price = faster transaction, but more expensive. Default is <span>{ gasPrice } GWEI.</span><br/>
            <a className="green" href="https://myetherwallet.github.io/knowledge-base/gas/what-is-gas-ethereum.html" target="_blank">Read more</a>
        </div>
    );

    const dataTooltip = (
        <div className="tooltip-wrapper">
            Data is usually used when you send transactions to contracts.
        </div>
    );



    return (
        <div className="advanced-container opened">
            <a className="advanced" onClick={ toggleAdvanced }>Advanced settings</a>
            <div className="row gas-row">
                <div className="column">
                    <label>
                        Gas limit 
                        <Tooltip
                            arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
                            overlay={ gasLimitTooltip }
                            placement="top">
                            <span className="what-is-it"></span>
                        </Tooltip>
                    </label>
                    <input 
                        type="text"
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        value={ gasLimit }
                        onChange={ event => onGasLimitChange(event.target.value) } />
                    { errors.gasLimit ? (<span className="error">{ errors.gasLimit }</span>) : null }
                    { warnings.gasLimit ? (<span className="warning">{ warnings.gasLimit }</span>) : null }
                </div>
                <div className="column">
                    <label>
                        Gas price 
                        <Tooltip
                            arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
                            overlay={ gasPriceTooltip }
                            placement="top">
                            <span className="what-is-it"></span>
                        </Tooltip>
                    </label>
                    <input 
                        type="text"
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        value={ gasPrice }
                        onChange={ event => onGasPriceChange(event.target.value) } />
                    { errors.gasPrice ? (<span className="error">{ errors.gasPrice }</span>) : null }
                </div>
            </div>

            <div className="row">
                <label>
                    Data
                    <Tooltip
                        arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
                        overlay={ dataTooltip }
                        placement="top">
                        <span className="what-is-it"></span>
                    </Tooltip>
                </label>
                <textarea disabled={ coin !== token } value={ coin !== token ? '' : data } onChange={ event => onDataChange(event.target.value) }></textarea>
                { errors.data ? (<span className="error">{ errors.data }</span>) : null }
            </div>

            <div className="row">
                { props.children }
            </div>

            <ReactTooltip html={true} effect="solid" place="right" offset={{ bottom: 6, right: 24 }} />

        </div>
    )
}

export default AdvancedForm;
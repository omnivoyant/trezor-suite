import { useMemo } from 'react';
import { Control, Controller } from 'react-hook-form';

import { buildCurrencyOptions } from '@suite-common/wallet-utils';
import { Select } from '@trezor/components';

import {
    FORM_FIAT_CURRENCY_SELECT,
    FORM_FIAT_INPUT,
    FORM_OUTPUT_CURRENCY,
} from 'src/constants/wallet/coinmarket/form';
import { useCoinmarketFormContext } from 'src/hooks/wallet/coinmarket/form/useCoinmarketCommonForm';
import {
    CoinmarketAllFormProps,
    CoinmarketFormInputCurrencyProps,
} from 'src/types/coinmarket/coinmarketForm';
import { FiatCurrencyOption } from 'src/types/wallet/coinmarketCommonTypes';
import {
    getFiatCurrenciesProps,
    getSelectedCurrency,
    isCoinmarketBuyContext,
    isCoinmarketExchangeContext,
    isCoinmarketSellContext,
} from 'src/utils/wallet/coinmarket/coinmarketTypingUtils';
import { buildFiatOption } from 'src/utils/wallet/coinmarket/coinmarketUtils';

export const CoinmarketFormInputCurrency = ({
    isClean = true,
    width = 100,
}: CoinmarketFormInputCurrencyProps) => {
    const context = useCoinmarketFormContext();
    const { control, setAmountLimits, defaultCurrency } = context;
    const name = isCoinmarketBuyContext(context) ? FORM_FIAT_CURRENCY_SELECT : FORM_OUTPUT_CURRENCY;
    const currentCurrency = getSelectedCurrency(context);
    const fiatCurrencies = getFiatCurrenciesProps(context);
    const currencies = fiatCurrencies?.supportedFiatCurrencies ?? null;
    const options = useMemo(
        () =>
            currencies
                ? [...currencies]
                      .map(currency => buildFiatOption(currency))
                      .filter(currency => currency.value !== currentCurrency.value)
                : buildCurrencyOptions(currentCurrency),
        [currencies, currentCurrency],
    );

    const onChangeAdditional = (option: FiatCurrencyOption) => {
        if (isCoinmarketBuyContext(context)) {
            context.setValue(
                FORM_FIAT_INPUT,
                fiatCurrencies?.defaultAmountsOfFiatCurrencies?.get(option.value) ?? '',
            );
        }

        if (isCoinmarketExchangeContext(context) || isCoinmarketSellContext(context)) {
            context.form.helpers.onFiatCurrencyChange(option.value);
        }
    };

    return (
        <Controller
            name={name}
            defaultValue={defaultCurrency}
            control={control as Control<CoinmarketAllFormProps>}
            render={({ field: { onChange, value } }) => (
                <Select
                    value={value}
                    onChange={(selected: FiatCurrencyOption) => {
                        onChange(selected);
                        setAmountLimits(undefined);

                        onChangeAdditional(selected);
                    }}
                    options={options}
                    data-testid="@coinmarket/form/fiat-currency-select"
                    isClearable={false}
                    isClean={isClean}
                    size="small"
                    isSearchable
                    width={width}
                />
            )}
        />
    );
};

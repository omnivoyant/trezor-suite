import produce from 'immer';

import { deviceActions } from '@suite-common/wallet-core';

import * as walletSettingsActions from 'src/actions/settings/walletSettingsActions';
import { ACCOUNT_SEARCH } from 'src/actions/wallet/constants';
import { Action } from 'src/types/suite';
import { Account as AccountType } from 'src/types/wallet';

export interface State {
    coinFilter: AccountType['symbol'] | undefined;
    searchString: string | undefined;
}

export const initialState: State = {
    coinFilter: undefined,
    searchString: undefined,
};

const accountSearchReducer = (state: State = initialState, action: Action): State =>
    produce(state, draft => {
        switch (action.type) {
            case ACCOUNT_SEARCH.SET_SEARCH_STRING:
                draft.searchString = action.payload;
                break;
            case ACCOUNT_SEARCH.SET_COIN_FILTER:
                draft.coinFilter = action.payload;
                break;
            // reset coin filter on:
            // 1) disabling/enabling coins
            // 2) adding a new account is handled directly in add account modal, reacting on ACCOUNT.CREATE would cause resetting during initial accounts discovery
            case walletSettingsActions.changeNetworks.type: {
                if (walletSettingsActions.changeNetworks.match(action)) {
                    draft.coinFilter = undefined;
                    draft.searchString = undefined;
                }
                break;
            }

            // reset coin filter search
            case deviceActions.selectDevice.type:
                draft.searchString = undefined;
                break;

            // no default
        }
    });

export default accountSearchReducer;

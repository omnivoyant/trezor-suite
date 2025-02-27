import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Dimensions } from 'react-native';

import { CommonActions, RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import TrezorConnect from '@trezor/connect';
import { BoxSkeleton, Card, HStack, Text, VStack } from '@suite-native/atoms';
import {
    RootStackParamList,
    RootStackRoutes,
    Screen,
    ScreenSubHeader,
    StackNavigationProps,
    GoBackIcon,
} from '@suite-native/navigation';
import { AccountsList, OnSelectAccount } from '@suite-native/accounts';
import { AccountKey, TokenAddress } from '@suite-common/wallet-types';
import { Translation } from '@suite-native/intl';
import {
    AccountsRootState,
    DeviceRootState,
    selectAccountLabel,
    selectAccountNetworkSymbol,
    selectDeviceAccountKeyForNetworkSymbolAndAccountTypeWithIndex,
} from '@suite-common/wallet-core';
import { selectAccountTokenSymbol, TokensRootState } from '@suite-native/tokens';
import { CryptoIcon } from '@suite-native/icons';
import { prepareNativeStyle, useNativeStyles } from '@trezor/styles';

import { ReceiveAccount } from '../components/ReceiveAccount';

const SCREEN_WIDTH = Dimensions.get('window').width;

type ScreenSubHeaderContent = {
    accountKey?: AccountKey;
    tokenContract?: TokenAddress;
};

const cardStyle = prepareNativeStyle(utils => ({
    padding: utils.spacings.sp8,
}));

const LoadingReceiveAccount = () => {
    const { applyStyle } = useNativeStyles();

    return (
        <VStack spacing="sp32" alignItems="center" paddingHorizontal="sp8">
            <Card style={applyStyle(cardStyle)}>
                <BoxSkeleton width={SCREEN_WIDTH - 32} height={70} />
            </Card>
            <Card style={applyStyle(cardStyle)}>
                <VStack spacing="sp24" alignItems="center" paddingHorizontal="sp24">
                    <BoxSkeleton width={SCREEN_WIDTH - 80} height={200} />
                    <BoxSkeleton width={SCREEN_WIDTH - 80} height={48} borderRadius={24} />
                </VStack>
            </Card>
        </VStack>
    );
};

const ReceiveModalScreenSubHeader = ({ accountKey, tokenContract }: ScreenSubHeaderContent) => {
    const {
        params: { closeActionType },
    } = useRoute<RouteProp<RootStackParamList, RootStackRoutes.ReceiveModal>>();
    const navigation = useNavigation();
    const accountLabel = useSelector((state: AccountsRootState) =>
        selectAccountLabel(state, accountKey),
    );
    const symbol = useSelector((state: AccountsRootState) =>
        selectAccountNetworkSymbol(state, accountKey),
    );
    const tokenSymbol = useSelector((state: TokensRootState) =>
        selectAccountTokenSymbol(state, accountKey, tokenContract),
    );

    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', () => {
            // When leaving the screen, cancel the request for address on trezor device
            TrezorConnect.cancel();
        });

        return unsubscribe;
    }, [navigation]);

    return (
        <ScreenSubHeader
            content={
                <>
                    <Text variant="highlight">
                        <Translation
                            id="moduleReceive.screenTitle"
                            values={{ coinSymbol: symbol?.toUpperCase() }}
                        />
                    </Text>
                    <HStack spacing="sp8" alignItems="center">
                        {symbol && <CryptoIcon symbol={symbol} size="extraSmall" />}
                        {accountLabel && (
                            <Text variant="highlight">
                                {accountLabel}
                                {tokenSymbol && ` - ${tokenSymbol}`}
                            </Text>
                        )}
                    </HStack>
                </>
            }
            leftIcon={<GoBackIcon closeActionType={closeActionType} />}
        />
    );
};

export const ReceiveModalScreen = () => {
    const {
        params: {
            accountKey: routeAccountKey,
            tokenContract,
            networkSymbol: routeNetworkSymbol,
            accountType: routeAccountType,
            accountIndex: routeAccountIndex,
        },
    } = useRoute<RouteProp<RootStackParamList, RootStackRoutes.ReceiveModal>>();

    const foundAccountKey = useSelector((state: AccountsRootState & DeviceRootState) =>
        selectDeviceAccountKeyForNetworkSymbolAndAccountTypeWithIndex(
            state,
            routeNetworkSymbol,
            routeAccountType,
            routeAccountIndex,
        ),
    );

    const navigation =
        useNavigation<StackNavigationProps<RootStackParamList, RootStackRoutes.ReceiveModal>>();

    const accountKey = routeAccountKey ?? foundAccountKey;

    const handleSelectAccount: OnSelectAccount = ({
        account,
        tokenAddress: selectedTokenContract,
    }) => {
        navigation.dispatch({
            ...CommonActions.setParams({
                accountKey: account.key,
                tokenContract: selectedTokenContract,
            }),
        });
    };

    const isLoading =
        !accountKey && (routeNetworkSymbol !== undefined || routeAccountType !== undefined);
    const isSelecting = !isLoading && !accountKey;

    return (
        <Screen
            noTopPadding
            hasBottomInset={false}
            screenHeader={
                <ReceiveModalScreenSubHeader
                    accountKey={accountKey}
                    tokenContract={tokenContract}
                />
            }
        >
            {accountKey && <ReceiveAccount accountKey={accountKey} tokenContract={tokenContract} />}
            {isLoading && <LoadingReceiveAccount />}
            {isSelecting && <AccountsList onSelectAccount={handleSelectAccount} />}
        </Screen>
    );
};

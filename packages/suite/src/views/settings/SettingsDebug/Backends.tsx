import styled from 'styled-components';

import { getNetwork, NetworkSymbol } from '@suite-common/wallet-config';
import { selectNetworkBlockchainInfo } from '@suite-common/wallet-core';
import { ConnectionStatus } from '@suite-common/wallet-types';
import { Button } from '@trezor/components';
import { CoinLogo } from '@trezor/product-components';
import { typography } from '@trezor/theme';

import { SectionItem, StatusLight, Translation } from 'src/components/suite';
import { useDispatch, useSelector } from 'src/hooks/suite';
import { useBackendReconnection } from 'src/hooks/settings/backends';
import { openModal } from 'src/actions/suite/modalActions';
import { selectEnabledNetworks } from 'src/reducers/wallet/settingsReducer';

const CoinSection = styled.div`
    display: flex;
    flex: 1;
    gap: 16px;
    align-items: center;
    justify-content: space-between;

    > div {
        display: flex;
        gap: 8px;
        flex-direction: column;
    }
`;

const CoinCell = styled.div`
    display: flex;
    gap: 8px;
    align-items: center;
`;

const BackendRow = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;

    > :nth-child(2) {
        width: 200px;

        > * {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }

    > :last-child {
        width: 100px;
        display: flex;
        justify-content: end;
    }
`;

const Title = styled.div`
    ${typography.body}
`;

const Subtitle = styled.div<{ $error?: boolean }>`
    ${typography.hint}
    color: ${({ $error, theme }) => ($error ? theme.textAlertRed : theme.legacy.TYPE_LIGHT_GREY)};
`;

type BackendItemProps = ConnectionStatus & {
    identity?: string;
    symbol: NetworkSymbol;
    url?: string;
};

type CoinItemProps = { symbol: NetworkSymbol };

const BackendItem = ({
    symbol,
    identity,
    url,
    connected,
    error,
    reconnectionTime,
}: BackendItemProps) => {
    const { reconnect, isReconnecting, countdownSeconds } = useBackendReconnection(
        symbol,
        identity,
        reconnectionTime,
    );

    const subtitle =
        (countdownSeconds && (
            <Translation id="TR_BACKEND_RECONNECTING" values={{ time: countdownSeconds }} />
        )) ||
        (error ?? url);

    return (
        <BackendRow>
            <div>
                <StatusLight variant={connected ? 'primary' : 'destructive'} />
            </div>
            <div>
                <Title>{identity ?? 'Default'}</Title>
                <Subtitle $error={!!error}>{subtitle}</Subtitle>
            </div>
            <div>
                {!connected && (
                    <Button
                        size="tiny"
                        variant="tertiary"
                        isLoading={isReconnecting}
                        onClick={reconnect}
                    >
                        <Translation id="TR_CONNECT" />
                    </Button>
                )}
            </div>
        </BackendRow>
    );
};

const CoinItem = ({ symbol }: CoinItemProps) => {
    const { url, error, connected, reconnectionTime, identityConnections } = useSelector(state =>
        selectNetworkBlockchainInfo(state, symbol),
    );

    const dispatch = useDispatch();

    const onSettings = () => {
        dispatch(
            openModal({
                type: 'advanced-coin-settings',
                symbol,
            }),
        );
    };

    return (
        <SectionItem>
            <CoinSection>
                <div>
                    <CoinCell>
                        <CoinLogo symbol={symbol} />
                        <Title>{getNetwork(symbol).name}</Title>
                    </CoinCell>
                    <Button size="tiny" variant="tertiary" onClick={onSettings}>
                        <Translation id="TR_SETTINGS" />
                    </Button>
                </div>
                <div>
                    <BackendItem
                        symbol={symbol}
                        url={url}
                        connected={connected}
                        error={error}
                        reconnectionTime={reconnectionTime}
                    />
                    {Object.entries(identityConnections ?? {}).map(([identity, connection]) => (
                        <BackendItem
                            key={identity}
                            identity={identity}
                            symbol={symbol}
                            url={url}
                            {...connection}
                        />
                    ))}
                </div>
            </CoinSection>
        </SectionItem>
    );
};

export const Backends = () => {
    const enabledNetworks = useSelector(selectEnabledNetworks);

    return enabledNetworks.map(symbol => <CoinItem key={symbol} symbol={symbol} />);
};

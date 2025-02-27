import styled, { useTheme } from 'styled-components';

import { Icon } from '@trezor/components';
import { isZero } from '@suite-common/wallet-utils';

import { Translation } from 'src/components/suite/Translation';
import { useSelector } from 'src/hooks/suite';
import {
    selectCurrentCoinjoinBalanceBreakdown,
    selectCurrentCoinjoinSession,
} from 'src/reducers/wallet/coinjoinReducer';
import { selectSelectedAccount } from 'src/reducers/wallet/selectedAccountReducer';

import { CryptoAmountWithHeader } from './CryptoAmountWithHeader';

const BalanceContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    align-self: normal;
    gap: 12px;
    padding: 0 10px;
`;

const StyledCryptoAmountWithHeader = styled(CryptoAmountWithHeader)`
    flex-grow: 1;
    max-width: 50%;
    margin-bottom: -4px;
`;

const PrivateBalanceHeading = styled.span`
    color: ${({ theme }) => theme.legacy.TYPE_GREEN};
`;

// svg padding offset
// eslint-disable-next-line local-rules/no-override-ds-component
const CheckIcon = styled(Icon)`
    width: 15px;
    height: 15px;
`;

export const BalancePrivacyBreakdown = () => {
    const currentAccount = useSelector(selectSelectedAccount);
    const { anonymized, notAnonymized } = useSelector(selectCurrentCoinjoinBalanceBreakdown);
    const currentSession = useSelector(selectCurrentCoinjoinSession);

    const theme = useTheme();

    const hasSession = !!currentSession;

    const getBalanceHeader = () => {
        if (hasSession) {
            if (currentSession.paused) {
                return <Translation id="TR_ANONYMIZATION_PAUSED" />;
            }

            return <Translation id="TR_ANONYMIZING" />;
        }

        return <Translation id="TR_NOT_PRIVATE" />;
    };

    const getBalanceIcon = () => {
        if (hasSession) {
            if (currentSession.paused) {
                return <Icon name="pause" size={12} />;
            }

            return <Icon name="shuffle" size={15} />;
        }

        return <Icon name="close" size={15} />;
    };

    if (!currentAccount) {
        return null;
    }

    return (
        <BalanceContainer>
            <StyledCryptoAmountWithHeader
                header={getBalanceHeader()}
                headerIcon={getBalanceIcon()}
                value={notAnonymized}
                symbol={currentAccount?.symbol}
                color={!isZero(notAnonymized || '0') ? undefined : theme.legacy.TYPE_LIGHT_GREY}
            />

            <StyledCryptoAmountWithHeader
                header={
                    <PrivateBalanceHeading>
                        <Translation id="TR_PRIVATE" />
                    </PrivateBalanceHeading>
                }
                headerIcon={<CheckIcon name="check" size={19} color={theme.legacy.TYPE_GREEN} />}
                value={anonymized}
                symbol={currentAccount?.symbol}
                color={
                    !isZero(anonymized || '0')
                        ? theme.legacy.TYPE_GREEN
                        : theme.legacy.TYPE_LIGHT_GREY
                }
            />
        </BalanceContainer>
    );
};

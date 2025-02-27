import styled from 'styled-components';

import { spacingsPx } from '@trezor/theme';

import {
    CoinmarketTradeBuySellType,
    CoinmarketTradeDetailBuySellType,
    CoinmarketTradeType,
} from 'src/types/coinmarket/coinmarket';
import { Translation } from 'src/components/suite';
import { CoinmarketPaymentPlainType } from 'src/views/wallet/coinmarket/common/CoinmarketPaymentPlainType';

const PaymentInfoWrapper = styled.div`
    display: flex;
    color: ${({ theme }) => theme.textSubdued};
    gap: ${spacingsPx.xxs};
`;

interface CoinmarketFeaturedOffersPaymentInfoProps {
    quote: CoinmarketTradeDetailBuySellType;
    type: CoinmarketTradeType;
}

export const CoinmarketFeaturedOffersPaymentInfo = ({
    quote,
    type,
}: CoinmarketFeaturedOffersPaymentInfoProps) => (
    <PaymentInfoWrapper>
        <Translation
            id={`TR_COINMARKET_FEATURED_OFFER_PAYMENT_METHOD_${type.toUpperCase() as Uppercase<CoinmarketTradeBuySellType>}_LABEL`}
        />
        <CoinmarketPaymentPlainType
            method={quote.paymentMethod}
            methodName={quote.paymentMethodName}
        />
    </PaymentInfoWrapper>
);

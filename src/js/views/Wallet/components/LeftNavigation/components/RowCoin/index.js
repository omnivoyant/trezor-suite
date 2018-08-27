import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Icon from 'components/Icon';
import CoinLogo from 'components/CoinLogo';
import { FONT_SIZE, LEFT_NAVIGATION_ROW } from 'config/variables';
import colors from 'config/colors';
import Row from '../Row';


const CoinNameWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const RowCoinWrapper = styled.div`
    padding: ${LEFT_NAVIGATION_ROW.PADDING};
    height: 50px;
    display: block;
    font-size: ${FONT_SIZE.BASE};
    color: ${colors.TEXT_PRIMARY};
    &:hover {
        background-color: ${colors.GRAY_LIGHT};
    }
`;

const Left = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const IconWrapper = styled.div`
    margin-right: 10px;
`;

const LogoWrapper = styled.div`
    margin-right: 3px;
`;

const RowCoin = ({
    coin, iconLeft, iconRight,
}) => (
    <RowCoinWrapper>
        <Row>
            <Left>
                {iconLeft && (
                    <IconWrapper>
                        <Icon
                            icon={iconLeft.type}
                            size={iconLeft.size}
                            color={iconLeft.color}
                        />
                    </IconWrapper>
                )}
                <CoinNameWrapper>
                    <LogoWrapper>
                        <CoinLogo
                            coinNetwork={coin.network}
                            coinImg={coin.img}
                        />
                    </LogoWrapper>
                    <p>{coin.name}</p>
                </CoinNameWrapper>
            </Left>
            {iconRight && (
                <Icon
                    icon={iconRight.type}
                    size={iconRight.size}
                    color={iconRight.color}
                />
            )}
        </Row>
    </RowCoinWrapper>
);

const iconShape = {
    type: PropTypes.arrayOf(PropTypes.string).isRequired,
    color: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
};
RowCoin.propTypes = {
    coin: PropTypes.shape({
        name: PropTypes.string.isRequired,
        network: PropTypes.string.isRequired,
        img: PropTypes.string,
    }).isRequired,
    iconLeft: PropTypes.shape(iconShape),
    iconRight: PropTypes.shape(iconShape),
};

export default RowCoin;

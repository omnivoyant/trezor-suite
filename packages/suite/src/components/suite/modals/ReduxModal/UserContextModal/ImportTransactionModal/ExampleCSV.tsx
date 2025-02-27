import { useState } from 'react';

import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

import { Paragraph, Icon, motionAnimation } from '@trezor/components';
import { borders, spacingsPx, typography } from '@trezor/theme';

import { Translation } from 'src/components/suite';
import { useSelector, useTranslation } from 'src/hooks/suite';
import { selectIsLabelingAvailable } from 'src/reducers/suite/metadataReducer';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    padding-bottom: 16px;
`;

const ExpandWrapper = styled(motion.div)`
    width: 100%;
    background: ${({ theme }) => theme.legacy.BG_GREY};
    border-radius: ${borders.radii.xs};
    overflow: hidden;
    margin-top: 8px;
    padding: 12px;
    text-align: left;
    word-break: break-word;
`;

const ExpandButton = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${spacingsPx.xxs};
    color: ${({ theme }) => theme.textSubdued};
    ${typography.label}
    cursor: pointer;
`;

export const ExampleCSV = () => {
    const [isExpanded, setExpanded] = useState(false);
    const { account } = useSelector(state => state.wallet.selectedAccount);
    const isLabelingAvailable = useSelector(selectIsLabelingAvailable);
    const { translationString } = useTranslation();

    if (!account) return null;

    // for BTC get first two unused addresses
    // for ETH and XRP descriptor get twice (used in two examples)
    const addresses = account.addresses?.unused.slice(0, 2).map(a => a.address) || [
        account.descriptor,
        account.descriptor,
    ];

    return (
        <Wrapper>
            <ExpandButton
                onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    setExpanded(!isExpanded);
                }}
            >
                <Translation
                    id={
                        isExpanded
                            ? 'TR_IMPORT_CSV_MODAL_HIDE_EXAMPLE'
                            : 'TR_IMPORT_CSV_MODAL_SHOW_EXAMPLE'
                    }
                />

                <Icon size={16} name={!isExpanded ? 'chevronDown' : 'chevronUp'} />
            </ExpandButton>

            <AnimatePresence initial={false}>
                {isExpanded && (
                    <ExpandWrapper {...motionAnimation.expand}>
                        {/* CSV keys shouldn't be translated */}
                        <Paragraph typographyStyle="hint">
                            address,amount,currency{isLabelingAvailable && ',label'}
                        </Paragraph>
                        <Paragraph typographyStyle="hint">
                            {addresses[0]},0.31337,{account.symbol.toUpperCase()}
                            {isLabelingAvailable &&
                                `,${translationString('TR_SENDFORM_LABELING_EXAMPLE_1')}`}
                        </Paragraph>
                        <Paragraph typographyStyle="hint">
                            {addresses[1]},0.1,USD
                            {isLabelingAvailable &&
                                `,${translationString('TR_SENDFORM_LABELING_EXAMPLE_2')}`}
                        </Paragraph>
                    </ExpandWrapper>
                )}
            </AnimatePresence>
        </Wrapper>
    );
};

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import styled from 'styled-components';
import { motion } from 'framer-motion';

import { Card, motionEasing, Column } from '@trezor/components';
import { motionEasingStrings } from '@trezor/components/src/config/motion';
import { spacings, spacingsPx } from '@trezor/theme';
import { getNetworkFeatures } from '@suite-common/wallet-config';

import { useSendFormContext } from 'src/hooks/wallet';
import { useLayoutSize } from 'src/hooks/suite';

import { Address } from './Address';
import { Amount } from './Amount/Amount';
import { OpReturn } from './OpReturn';
import { TokenSelect } from './TokenSelect/TokenSelect';

const Container = styled.div<{ $height: number }>`
    height: ${({ $height }) => ($height ? `${$height}px` : 'auto')};
    transition: height 0.2s ${motionEasingStrings.transition};

    > div {
        display: flex;
        flex-direction: column;
        gap: ${spacingsPx.md};
    }
`;

interface OutputsProps {
    disableAnim?: boolean; // used in tests, with animations enabled react-testing-library can't find output fields
}

export const Outputs = ({ disableAnim }: OutputsProps) => {
    const [height, setHeight] = useState(0);
    const [hasRenderedOutputs, setHasRenderedOutputs] = useState(false);
    const size = useLayoutSize();

    const {
        outputs,
        formState: { errors },
        account: { symbol },
    } = useSendFormContext();

    const ref = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        setHeight(ref.current?.offsetHeight || 0);
    }, [outputs, errors.outputs, size]);

    // needed to have no entrance animation on the first render
    // for some reason the first render does not have all the outputs
    useEffect(() => {
        if (outputs.length) {
            setHasRenderedOutputs(true);
        }
    }, [outputs]);

    const areTokensSupported = getNetworkFeatures(symbol).includes('tokens');

    return (
        <Container $height={height || 0}>
            <div ref={ref}>
                {outputs.map((output, index) => (
                    <motion.div
                        layout
                        key={output.id}
                        initial={
                            index === 0 || !hasRenderedOutputs || disableAnim
                                ? undefined
                                : { scale: 0.8, opacity: 0 }
                        }
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                            duration: 0.2,
                            ease: motionEasing.transition,
                        }}
                    >
                        {areTokensSupported && <TokenSelect outputId={index} />}
                        <Card>
                            {output.type === 'opreturn' ? (
                                <OpReturn outputId={index} />
                            ) : (
                                <Column gap={spacings.md}>
                                    <Address
                                        output={outputs[index]}
                                        outputId={index}
                                        outputsCount={outputs.length}
                                    />
                                    <Amount output={outputs[index]} outputId={index} />
                                </Column>
                            )}
                        </Card>
                    </motion.div>
                ))}
            </div>
        </Container>
    );
};

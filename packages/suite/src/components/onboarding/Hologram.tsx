import { useRef } from 'react';

import styled from 'styled-components';

import { selectSelectedDevice } from '@suite-common/wallet-core';
import { getPackagingUrl } from '@suite-common/suite-utils';
import { DeviceAnimation, Banner, variables } from '@trezor/components';
import { TREZOR_RESELLERS_URL, TREZOR_SUPPORT_URL } from '@trezor/urls';
import { typography } from '@trezor/theme';
import { DeviceModelInternal } from '@trezor/connect';

import { Translation, TrezorLink } from 'src/components/suite';
import { useSelector } from 'src/hooks/suite';

const HologramSubHeading = styled.span`
    font-size: ${variables.FONT_SIZE.SMALL};
    font-weight: ${variables.FONT_WEIGHT.MEDIUM};
    margin-bottom: 16px;
`;

const AnimationWrapper = styled.div`
    margin: 8px 0;
`;

// eslint-disable-next-line local-rules/no-override-ds-component
const StyledWarning = styled(Banner)`
    ${typography.hint}

    a {
        color: ${({ theme }) => theme.backgroundAlertYellowBold};
        ${typography.hint}
    }
`;

export const Hologram = () => {
    const device = useSelector(selectSelectedDevice);
    const hologramRef = useRef<HTMLVideoElement>(null);

    const packagingUrl = getPackagingUrl(device);
    const isOldT2B1Packaging =
        device?.features?.internal_model === DeviceModelInternal.T2B1 &&
        (device.features.unit_packaging === undefined || device.features.unit_packaging === 0);

    return (
        <>
            <HologramSubHeading>
                <Translation id="TR_HOLOGRAM_STEP_SUBHEADING" />
                {isOldT2B1Packaging && (
                    <>
                        <br />
                        <Translation id="TR_HOLOGRAM_T2B1_NEW_SEAL" />
                    </>
                )}
            </HologramSubHeading>

            <AnimationWrapper>
                <DeviceAnimation
                    type="HOLOGRAM"
                    shape="ROUNDED-SMALL"
                    loop
                    width="100%"
                    deviceModelInternal={device?.features?.internal_model}
                    onVideoMouseOver={() => {
                        // If the video is placed in tooltip it stops playing after tooltip minimizes and won't start again
                        // As a quick workaround user can hover a mouse to play it again
                        hologramRef.current?.play();
                    }}
                    ref={hologramRef}
                    isOldT2B1Packaging={isOldT2B1Packaging}
                />
            </AnimationWrapper>

            <StyledWarning>
                <Translation
                    id="TR_SECURITY_CHECK_HOLOGRAM"
                    values={{
                        packaging: link => (
                            <TrezorLink href={packagingUrl} variant="underline">
                                {link}
                            </TrezorLink>
                        ),
                        reseller: link => (
                            <TrezorLink href={TREZOR_RESELLERS_URL} variant="underline">
                                {link}
                            </TrezorLink>
                        ),
                        support: link => (
                            <TrezorLink href={TREZOR_SUPPORT_URL} variant="underline">
                                {link}
                            </TrezorLink>
                        ),
                    }}
                />
            </StyledWarning>
        </>
    );
};

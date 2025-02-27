import { useLayoutEffect, useRef, useState } from 'react';

import styled, { css, useTheme } from 'styled-components';

import { Button, Icon, variables } from '@trezor/components';
import { notificationsActions, NotificationEntry } from '@suite-common/toast-notifications';
import { spacings } from '@trezor/theme';

import { NotificationRenderer, NotificationViewProps, Translation } from 'src/components/suite';
import { useDispatch } from 'src/hooks/suite';
import { getNotificationIcon, getVariantColor } from 'src/utils/suite/notification';

import { ToastNotificationVariant } from '../../../types/suite';

const Wrapper = styled.div<{ $variant: ToastNotificationVariant; $isTall: boolean }>`
    display: flex;
    align-items: ${({ $isTall }) => ($isTall ? 'start' : 'center')};
    font-size: ${variables.FONT_SIZE.SMALL};
    height: 100%;
    padding: ${({ $isTall }) => ($isTall ? '16px 16px 12px 12px' : '12px 16px 12px 12px')};
    border-left: 4px solid ${({ $variant }) => getVariantColor($variant)};
    word-break: break-word;
    max-width: 430px;
`;

const BodyWrapper = styled.div<{ $isTall: boolean }>`
    flex: 1;
    margin-top: ${({ $isTall }) => $isTall && '-4px'};
    margin-left: 14px;
`;

const Message = styled.div`
    font-weight: ${variables.FONT_WEIGHT.MEDIUM};
    color: ${({ theme }) => theme.legacy.TYPE_DARK_GREY};
`;

// eslint-disable-next-line local-rules/no-override-ds-component
const StyledButton = styled(Button)<{ $action: NotificationViewProps['action'] }>`
    ${({ $action }) =>
        (!$action?.position || $action.position === 'right') &&
        css`
            margin-left: 16px;
        `};

    ${({ $action }) =>
        $action?.position === 'bottom' &&
        css`
            margin-top: 12px;
            height: 32px;
        `};
`;

interface ToastNotificationProps extends NotificationViewProps {
    cancelable?: boolean;
    onCancel?: () => void;
}

const ToastNotification = ({
    icon,
    message,
    messageValues,
    action,
    variant,
    cancelable = true,
    onCancel,
    notification: { type, id },
}: ToastNotificationProps) => {
    const [isTall, setIsTall] = useState(false);
    const theme = useTheme();
    const dispatch = useDispatch();
    const wrapperRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const height = wrapperRef.current?.getBoundingClientRect().height ?? 0;

        // more than 2 lines of text
        if (height > 70) {
            setIsTall(true);
        }
    }, []);

    const dataTestBase = `@toast/${type}`;
    const defaultIcon = icon ?? getNotificationIcon(variant);

    const handleCancelClick = () => {
        dispatch(notificationsActions.close(id));
        onCancel?.();
    };

    const actionButton = action && (
        <StyledButton
            variant={action.variant || 'tertiary'}
            onClick={action.onClick}
            isFullWidth={action.position === 'bottom'}
            $action={action}
            size="tiny"
        >
            <Translation id={action.label} />
        </StyledButton>
    );

    return (
        <Wrapper
            data-testid={dataTestBase}
            data-testid-alt="@toast"
            $variant={variant}
            $isTall={isTall}
            ref={wrapperRef}
        >
            {defaultIcon && typeof defaultIcon === 'string' ? (
                <Icon name={defaultIcon} size={24} color={getVariantColor(variant)} />
            ) : (
                defaultIcon
            )}
            <BodyWrapper $isTall={isTall}>
                <Message>
                    <Translation id={message} values={messageValues} />
                </Message>

                {action?.position === 'bottom' && actionButton}
            </BodyWrapper>

            {(action?.position === 'right' || !action?.position) && actionButton}

            {cancelable && (
                <Icon
                    size={16}
                    name="close"
                    hoverColor={theme.legacy.TYPE_LIGHTER_GREY}
                    onClick={handleCancelClick}
                    data-testid={`${dataTestBase}/close`}
                    margin={{ left: spacings.md }}
                />
            )}
        </Wrapper>
    );
};

export const renderToast = (payload: NotificationEntry) => (
    <NotificationRenderer notification={payload} render={ToastNotification} />
);

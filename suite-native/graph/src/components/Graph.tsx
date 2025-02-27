import { useEffect, useMemo, useState } from 'react';
import { PixelRatio } from 'react-native';

import * as Haptics from 'expo-haptics';

import { GraphPoint, LineGraph } from '@suite-native/react-native-graph';
import { prepareNativeStyle, useNativeStyles } from '@trezor/styles';
import { Box, Loader } from '@suite-native/atoms';
import {
    FiatGraphPoint,
    GroupedBalanceMovementEvent,
    GroupedBalanceMovementEventPayload,
} from '@suite-common/graph';
import { Translation } from '@suite-native/intl';
import { TimerId } from '@trezor/type-utils';

import { getExtremaFromGraphPoints } from '../utils';
import { AxisLabel } from './AxisLabel';
import { GraphError } from './GraphError';
import { TransactionEventTooltip } from './TransactionEventTooltip';
import { SelectionDotWithLine } from './SelectionDotWithLine';
import { TransactionEvent } from './TransactionEvent';

type GraphProps<TGraphPoint extends GraphPoint> = {
    points: TGraphPoint[];
    loading?: boolean;
    onPointSelected?: (point: TGraphPoint) => void;
    onGestureEnd?: () => void;
    animated?: boolean;
    error?: string | null;
    onTryAgain: () => void;
    events?: GroupedBalanceMovementEvent[];
    loadingTakesLongerThanExpected?: boolean;
};

const GRAPH_HEIGHT = 250;

const graphWrapperStyle = prepareNativeStyle(_ => ({
    justifyContent: 'center',
    height: GRAPH_HEIGHT,
    alignItems: 'center',
}));

const graphMessageStyleContainer = prepareNativeStyle(_ => ({
    position: 'absolute',
    width: '100%',
    height: '90%',
    justifyContent: 'center',
    alignItems: 'center',
}));

const graphStyle = prepareNativeStyle(_ => ({
    alignSelf: 'center',
    height: GRAPH_HEIGHT,
    width: '100%',
}));

const triggerHaptics = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

const BASE_LINE_THICKNESS = 1.5;

const getAccessibilityLineThickness = () => {
    const fontScale = PixelRatio.getFontScale();

    return Math.max(BASE_LINE_THICKNESS, BASE_LINE_THICKNESS * fontScale);
};

export const Graph = <TGraphPoint extends FiatGraphPoint>({
    onPointSelected,
    onGestureEnd,
    onTryAgain,
    error,
    events,
    points = [],
    loading = false,
    animated = true,
    loadingTakesLongerThanExpected = false,
}: GraphProps<TGraphPoint>) => {
    const {
        applyStyle,
        utils: { colors },
    } = useNativeStyles();
    const [delayedLoading, setDelayedLoading] = useState(false);

    const arePointsEmpty = points.length <= 1;

    const areLabelsHidden = loading || !!error || arePointsEmpty;
    const showBlurredGraph = !loading && !!error && !loading;

    useEffect(() => {
        // We need to delay the loading a bit, because when switching between cached timeframes, it will break the
        // path interpolation animation.
        let timeout: TimerId;
        if (loading) {
            timeout = setTimeout(() => {
                setDelayedLoading(true);
            }, 0);
        } else {
            setDelayedLoading(false);
        }

        return () => {
            clearTimeout(timeout);
        };
    }, [loading]);

    const extremaFromGraphPoints = useMemo(() => getExtremaFromGraphPoints(points), [points]);
    const axisLabels = useMemo(() => {
        if (areLabelsHidden) return;
        if (extremaFromGraphPoints?.max && extremaFromGraphPoints?.min) {
            return {
                TopAxisLabel: () => (
                    <AxisLabel
                        x={extremaFromGraphPoints.max.x}
                        value={extremaFromGraphPoints.max.value}
                    />
                ),
                BottomAxisLabel: () => (
                    <AxisLabel
                        x={extremaFromGraphPoints.min.x}
                        value={extremaFromGraphPoints.min.value}
                    />
                ),
            };
        }
    }, [extremaFromGraphPoints, areLabelsHidden]);

    // For some reason, 16 feels better than 0
    const panGestureDelay = 16;

    return (
        <Box style={applyStyle(graphWrapperStyle)}>
            <LineGraph<GroupedBalanceMovementEventPayload>
                style={applyStyle(graphStyle, { loading, error })}
                points={points}
                color={colors.borderSecondary}
                animated={animated}
                verticalPadding={20}
                enablePanGesture
                SelectionDot={SelectionDotWithLine}
                TopAxisLabel={axisLabels?.TopAxisLabel}
                BottomAxisLabel={axisLabels?.BottomAxisLabel}
                onPointSelected={onPointSelected as any /* because of ExtendedGraphPoint */}
                onGestureEnd={onGestureEnd}
                panGestureDelay={panGestureDelay}
                events={events}
                EventComponent={TransactionEvent}
                EventTooltipComponent={TransactionEventTooltip}
                onEventHover={triggerHaptics}
                lineThickness={getAccessibilityLineThickness()}
                loading={delayedLoading}
                loadingLineColor={colors.borderDashed}
                blurOverlay={showBlurredGraph}
                showPlaceholder={arePointsEmpty}
            />
            {loading && (
                <Box style={applyStyle(graphMessageStyleContainer)}>
                    <Loader
                        title={
                            <Translation
                                id={
                                    loadingTakesLongerThanExpected
                                        ? 'graph.retrievengTakesLongerThanExpected'
                                        : 'graph.retrievingData'
                                }
                            />
                        }
                    />
                </Box>
            )}
            {error && !loading && (
                <Box style={applyStyle(graphMessageStyleContainer)}>
                    <GraphError error={error} onTryAgain={onTryAgain} />
                </Box>
            )}
        </Box>
    );
};

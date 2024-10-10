import { useCallback, useEffect } from 'react';

import { useNavigation } from '@react-navigation/native';
import * as Linking from 'expo-linking';

import {
    StackToStackCompositeNavigationProps,
    RootStackParamList,
    RootStackRoutes,
} from '@suite-native/navigation';
import { isDevelopOrDebugEnv } from '@suite-native/config';

type NavigationProp = StackToStackCompositeNavigationProps<
    RootStackParamList,
    RootStackRoutes.ConnectPopup,
    RootStackParamList
>;

const isConnectPopupUrl = (url: string): boolean => {
    if (isDevelopOrDebugEnv()) {
        if (url.startsWith('trezorsuitelite://connect')) return true;
        if (/^https:\/\/dev\.suite\.sldev\.cz\/connect\/(.*)\/deeplink(.*)$/g.test(url))
            return true;
    }
    if (/^https:\/\/connect\.trezor\.io\/9\/deeplink(.*)$/g.test(url)) return true;

    return false;
};

// TODO: will be necessary to handle if device is not connected/unlocked so we probably want to wait until user unlock device
// we already have some modals like biometrics or coin enabled which are waiting for device to be connected
export const useConnectPopupNavigation = () => {
    const navigation = useNavigation<NavigationProp>();

    const navigateToConnectPopup = useCallback(
        (url: string) => {
            const parsedUrl = Linking.parse(url);
            navigation.navigate(RootStackRoutes.ConnectPopup, { parsedUrl });
        },
        [navigation],
    );

    useEffect(() => {
        const navigateToInitalUrl = async () => {
            const currentUrl = await Linking.getInitialURL();
            if (currentUrl && isConnectPopupUrl(currentUrl)) {
                // eslint-disable-next-line no-console
                console.log('initial url', currentUrl);
                navigateToConnectPopup(currentUrl);
            }
        };
        navigateToInitalUrl();
    }, [navigateToConnectPopup]);

    useEffect(() => {
        // there could be when you open same deep link for second time and in that case it will be ignored
        // this could be probably handed by Linking.addEventListener
        const subscription = Linking.addEventListener('url', event => {
            // eslint-disable-next-line no-console
            console.log('url event received', event.url);
            navigateToConnectPopup(event.url);
        });

        return () => subscription?.remove();
    }, [navigateToConnectPopup]);
};

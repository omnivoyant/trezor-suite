import { DeviceModelInternal } from '@trezor/connect';

export const MAX_LABEL_LENGTH = 16;
export const DEFAULT_PASSPHRASE_PROTECTION = true;
export const DEFAULT_SKIP_BACKUP = true;

export const DEFAULT_STRENGTH: Record<DeviceModelInternal, number> = {
    [DeviceModelInternal.UNKNOWN]: 128, // just to have something
    [DeviceModelInternal.T1B1]: 256,
    [DeviceModelInternal.T2T1]: 128,
    [DeviceModelInternal.T2B1]: 128,
    [DeviceModelInternal.T3B1]: 128,
    [DeviceModelInternal.T3T1]: 128,
    [DeviceModelInternal.T3W1]: 128,
};

export const MAX_ROWS_PER_PAGE: Record<DeviceModelInternal, number> = {
    [DeviceModelInternal.UNKNOWN]: 7, // just to have something
    [DeviceModelInternal.T1B1]: 4,
    [DeviceModelInternal.T2T1]: 5,
    [DeviceModelInternal.T2B1]: 4,
    [DeviceModelInternal.T3B1]: 4,
    [DeviceModelInternal.T3T1]: 7,
    [DeviceModelInternal.T3W1]: 7, // TODO T3W1
};

export const MAX_CHARACTERS_ON_ROW: Record<DeviceModelInternal, number> = {
    [DeviceModelInternal.UNKNOWN]: 18, // just to have something
    [DeviceModelInternal.T1B1]: 21,
    [DeviceModelInternal.T2T1]: 17, // -1 for the space for the scrollbar (Trezor T only)
    [DeviceModelInternal.T2B1]: 18,
    [DeviceModelInternal.T3B1]: 18,
    [DeviceModelInternal.T3T1]: 18,
    [DeviceModelInternal.T3W1]: 18, // TODO T3W1
};

export const CHARACTER_OFFSET_FOR_CONTINUES_ARROW: Record<DeviceModelInternal, number> = {
    [DeviceModelInternal.UNKNOWN]: 4, // just to have something
    [DeviceModelInternal.T1B1]: 3,
    [DeviceModelInternal.T2T1]: 4,
    [DeviceModelInternal.T2B1]: 2,
    [DeviceModelInternal.T3B1]: 2,
    [DeviceModelInternal.T3T1]: 4,
    [DeviceModelInternal.T3W1]: 4, // TODO T3W1
};

export const CHARACTER_OFFSET_FOR_NEXT_ARROW: Record<DeviceModelInternal, number> = {
    [DeviceModelInternal.UNKNOWN]: 4, // just to have something
    [DeviceModelInternal.T1B1]: 0,
    [DeviceModelInternal.T2T1]: 4,
    [DeviceModelInternal.T2B1]: 2,
    [DeviceModelInternal.T3B1]: 2,
    [DeviceModelInternal.T3T1]: 4,
    [DeviceModelInternal.T3W1]: 4, // TODO T3W1
};

export const HAS_MONOCHROME_SCREEN: Record<DeviceModelInternal, boolean> = {
    [DeviceModelInternal.UNKNOWN]: false, // just to have something
    [DeviceModelInternal.T1B1]: true,
    [DeviceModelInternal.T2T1]: false,
    [DeviceModelInternal.T2B1]: true,
    [DeviceModelInternal.T3B1]: true,
    [DeviceModelInternal.T3T1]: false,
    [DeviceModelInternal.T3W1]: false,
};

// Include suite globals (as some dependencies from @suite can rely on them)
/// <reference path="../../suite/global.d.ts" />

type LogMessage = {
    date: Date;
    level: LogLevel;
    topic: string;
    text: string;
};

declare interface ILogger {
    /**
     * Exit the Logger (will correctly end the log file)
     */
    exit();
    /**
     * Error message (level: 1)
     * @param topic(string) - Log topic
     * @param message(string | string[]) - Message content(s)
     */
    error(topic: string, message: string | string[]);
    /**
     * Warning message (level: 2)
     * @param topic(string) - Log topic
     * @param message(string | string[]) - Message content(s)
     */
    warn(topic: string, message: string | string[]);
    /**
     * Info message (level: 3)
     * @param topic(string) - Log topic
     * @param message(string | string[]) - Message content(s)
     */
    info(topic: string, message: string | string[]);
    /**
     * Debug message (level: 4)
     * @param topic(string) - Log topic
     * @param message(string | string[]) - Message content(s)
     */
    debug(topic: string, message: string | string[]);
    /**
     * Log Level getter
     */
    level: LogLevel;
    /**
     * Log Level setter
     * @param level(LogLevel) - Log level
     */
    level;
    /**
     * Options getter.
     */
    config: Options;
    /**
     * Options setter.
     * @param options(Partial<Options>) - Log options
     */
    config;
    /**
     * If logs are stored in memory, return array of logs
     */
    getLog: () => LogMessage[];
}

// Globals
declare namespace globalThis {
    // eslint-disable-next-line no-var
    var logger: ILogger;
    // eslint-disable-next-line no-var
    var resourcesPath: string;
    // eslint-disable-next-line no-var
    var customProtocolUrl: string;
}

declare type BeforeRequestListener = (
    details: Electron.OnBeforeRequestListenerDetails,
) => Electron.CallbackResponse | undefined;

declare interface RequestInterceptor {
    onBeforeRequest(listener: BeforeRequestListener): void;
    offBeforeRequest(listener: BeforeRequestListener): void;
}

declare type WinBounds = {
    height: number;
    width: number;
};

declare type UpdateSettings = {
    // saving application version gives us ability to tell whether app got updated or not.
    /**
     * Duplicates and persists `app.getVersion()` most of the time except the first app start after an update.
     * In that case it's used to detect an update to display a success notification to the user.
     * Use `app.getVersion()` to get the current version of the app.
     */
    savedCurrentVersion?: string;
    allowPrerelease: boolean;
    isAutomaticUpdateEnabled: boolean;
};

declare type TorSettings = {
    running: boolean; // Tor should be enabled
    host: string; // Hostname of the tor process through which traffic is routed
    port: number; // Port of the Tor process through which traffic is routed
    controlPort: number; // Port of the Tor Control Port
    torDataDir: string; // Path of tor data directory
    useExternalTor: boolean; // Tor should use external daemon instead of the one built-in suite.
};

declare type BridgeSettings = {
    /**
     * Force suite not to start bridge on application startup
     */
    doNotStartOnStartup: boolean;
    /**
     * Should run trezord-go
     */
    legacy?: boolean;
    /**
     * Should run the new bridge?
     */
    newBridgeRollout?: number;
};

declare type TraySettings = {
    showOnTray: boolean;
};

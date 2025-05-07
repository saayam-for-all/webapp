import { EventEmitter } from 'node:events';
import type { MessageObject, StyleObject, Logger, LogLevel, PreprocessingRulesLoadResult, LogFiltersConfig } from './types';
import type { Writable } from 'node:stream';
import { AsyncLocalStorage } from 'node:async_hooks';
import { SecureValuesPreprocessor } from './secure-values-preprocessor';
export declare class Log extends EventEmitter implements Logger {
    level: LogLevel | string;
    prefixStyle: StyleObject;
    headingStyle: StyleObject;
    heading: string;
    stream: Writable;
    _asyncStorage: AsyncLocalStorage<Record<string, any>>;
    _colorEnabled?: boolean;
    _buffer: MessageObject[];
    _style: Record<LogLevel | string, StyleObject | undefined>;
    _levels: Record<LogLevel | string, number>;
    _disp: Record<LogLevel | string, number | string>;
    _id: number;
    _paused: boolean;
    _secureValuesPreprocessor: SecureValuesPreprocessor;
    private _history;
    private _maxRecordSize;
    constructor();
    get record(): MessageObject[];
    get maxRecordSize(): number;
    set maxRecordSize(value: number);
    private useColor;
    get asyncStorage(): AsyncLocalStorage<Record<string, any>>;
    updateAsyncStorage(contextInfo: Record<string, any>, replace: boolean): void;
    enableColor(): void;
    disableColor(): void;
    enableUnicode(): void;
    disableUnicode(): void;
    enableProgress(): void;
    disableProgress(): void;
    progressEnabled(): boolean;
    /**
     * Temporarily stop emitting, but don't drop
     */
    pause(): void;
    resume(): void;
    silly(prefix: string, message: any, ...args: any[]): void;
    verbose(prefix: string, message: any, ...args: any[]): void;
    debug(prefix: string, message: any, ...args: any[]): void;
    info(prefix: string, message: any, ...args: any[]): void;
    timing(prefix: string, message: any, ...args: any[]): void;
    http(prefix: string, message: any, ...args: any[]): void;
    notice(prefix: string, message: any, ...args: any[]): void;
    warn(prefix: string, message: any, ...args: any[]): void;
    error(prefix: string, message: any, ...args: any[]): void;
    silent(prefix: string, message: any, ...args: any[]): void;
    addLevel(level: string, n: number, style?: StyleObject, disp?: string): void;
    /**
     * Creates a log message
     * @param level
     * @param prefix
     * @param message message of the log which will be formatted using utils.format()
     * @param args additional arguments appended to the log message also formatted using utils.format()
     */
    log(level: LogLevel | string, prefix: string, message: any, ...args: any[]): void;
    /**
     * Loads the JSON file containing secure values replacement rules.
     * This might be necessary to hide sensitive values that may possibly
     * appear in Appium logs.
     * Each call to this method replaces the previously loaded rules if any existed.
     *
     * @param {string|string[]|LogFiltersConfig} rulesJsonPath The full path to the JSON file containing
     * the replacement rules. Each rule could either be a string to be replaced
     * or an object with predefined properties.
     * @throws {Error} If the given file cannot be loaded
     * @returns {Promise<PreprocessingRulesLoadResult>}
     */
    loadSecureValuesPreprocessingRules(rulesJsonPath: string | string[] | LogFiltersConfig): Promise<PreprocessingRulesLoadResult>;
    private emitLog;
    private _format;
    private write;
    private initDefaultLevels;
    private clearProgress;
    private showProgress;
}
export declare const GLOBAL_LOG: Log;
export default GLOBAL_LOG;
//# sourceMappingURL=log.d.ts.map
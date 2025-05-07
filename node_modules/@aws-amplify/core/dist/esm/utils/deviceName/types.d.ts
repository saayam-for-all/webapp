export interface NavigatorUA {
    readonly userAgentData?: NavigatorUAData;
}
interface NavigatorUABrandVersion {
    readonly brand: string;
    readonly version: string;
}
interface UADataValues {
    readonly brands?: NavigatorUABrandVersion[];
    readonly mobile?: boolean;
    readonly platform?: string;
    readonly architecture?: string;
    readonly bitness?: string;
    readonly formFactor?: string[];
    readonly model?: string;
    readonly platformVersion?: string;
    /** @deprecated in favour of fullVersionList */
    readonly uaFullVersion?: string;
    readonly fullVersionList?: NavigatorUABrandVersion[];
    readonly wow64?: boolean;
}
interface UALowEntropyJSON {
    readonly brands: NavigatorUABrandVersion[];
    readonly mobile: boolean;
    readonly platform: string;
}
interface NavigatorUAData extends UALowEntropyJSON {
    getHighEntropyValues(hints: string[]): Promise<UADataValues>;
    toJSON(): UALowEntropyJSON;
}
export {};

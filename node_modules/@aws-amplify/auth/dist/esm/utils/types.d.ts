export type OpenAuthSession = (url: string, redirectUrls: string[], preferPrivateSession?: boolean) => Promise<OpenAuthSessionResult | void>;
type OpenAuthSessionResultType = 'canceled' | 'success' | 'error';
export interface OpenAuthSessionResult {
    type: OpenAuthSessionResultType;
    error?: unknown;
    url?: string;
}
export interface AmplifyWebBrowser {
    openAuthSessionAsync(url: string, redirectUrls: string[], prefersEphemeralSession?: boolean): Promise<string | null>;
}
export {};

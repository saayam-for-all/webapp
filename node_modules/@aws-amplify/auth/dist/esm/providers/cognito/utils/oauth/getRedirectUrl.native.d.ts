/**
* - Validate there is always an appScheme (required), if not throw invalidAppSchemeException.
* - If a preferredRedirectUrl is given, validate it's in the configured list, if not throw invalidPreferredRedirectUrlException.
* - If preferredRedirectUrl is not given, use the appScheme which is present in the configured list.
@internal */
export declare function getRedirectUrl(redirects: string[], preferredRedirectUrl?: string): string;

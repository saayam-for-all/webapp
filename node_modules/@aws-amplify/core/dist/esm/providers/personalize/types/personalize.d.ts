export interface PersonalizeProviderConfig {
    Personalize: {
        trackingId: string;
        region: string;
        flushSize?: number;
        flushInterval?: number;
    };
}

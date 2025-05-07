export type IAnalyticsClient<T> = (events: T[]) => Promise<T[]>;
export interface EventBufferConfig {
    flushSize: number;
    flushInterval: number;
    bufferSize: number;
}

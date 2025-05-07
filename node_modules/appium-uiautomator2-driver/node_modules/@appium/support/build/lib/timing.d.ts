export default Timer;
export class Timer {
    _startTime: bigint | [number, number] | null;
    get startTime(): bigint | [number, number] | null;
    /**
     * Start the timer
     *
     * @return {Timer} The current instance, for chaining
     */
    start(): Timer;
    /**
     * Get the duration since the timer was started
     *
     * @return {Duration} the duration
     */
    getDuration(): Duration;
    toString(): string;
}
/**
 * Class representing a duration, encapsulating the number and units.
 */
export class Duration {
    constructor(nanos: any);
    _nanos: any;
    get nanos(): any;
    /**
     * Get the duration as nanoseconds
     *
     * @returns {number} The duration as nanoseconds
     */
    get asNanoSeconds(): number;
    /**
     * Get the duration converted into milliseconds
     *
     * @returns {number} The duration as milliseconds
     */
    get asMilliSeconds(): number;
    /**
     * Get the duration converted into seconds
     *
     * @returns {number} The duration fas seconds
     */
    get asSeconds(): number;
    toString(): string;
}
//# sourceMappingURL=timing.d.ts.map
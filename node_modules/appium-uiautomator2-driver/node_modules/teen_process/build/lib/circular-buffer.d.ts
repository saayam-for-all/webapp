export declare const MAX_BUFFER_SIZE: number;
export declare class CircularBuffer {
    private _buf;
    private _size;
    private _maxSize;
    constructor(maxSize?: number);
    get size(): number;
    get count(): number;
    add(item: Buffer): this;
    value(): Buffer;
    private _align;
}
//# sourceMappingURL=circular-buffer.d.ts.map
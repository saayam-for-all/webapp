export interface CRC32Checksum {
    checksumArrayBuffer: ArrayBuffer;
    checksum: string;
    seed: number;
}
export declare const calculateContentCRC32: (content: Blob | string | ArrayBuffer | ArrayBufferView, seed?: number) => Promise<CRC32Checksum>;

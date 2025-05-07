import { StorageUploadDataPayload } from '../../../../../../types';
export interface PartToUpload {
    partNumber: number;
    data: Blob | ArrayBuffer | string;
    size: number;
}
export declare const getDataChunker: (data: StorageUploadDataPayload, totalSize?: number) => Generator<PartToUpload, void, undefined>;

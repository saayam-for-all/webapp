import { DownloadDataInput } from '../../types';
import { StorageDownloadDataOutput, StorageItemWithKey, StorageItemWithPath } from '../../../../types';
import { DownloadDataInput as DownloadDataWithPathInputWithAdvancedOptions } from '../../../../internals/types/inputs';
export declare const downloadData: (input: DownloadDataInput | DownloadDataWithPathInputWithAdvancedOptions) => {
    cancel: (message?: string | undefined) => void;
    readonly state: import("../../../../types").TransferTaskState;
    result: Promise<StorageDownloadDataOutput<StorageItemWithKey | StorageItemWithPath>>;
};

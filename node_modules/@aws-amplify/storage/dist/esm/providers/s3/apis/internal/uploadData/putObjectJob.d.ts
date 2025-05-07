import { UploadDataInput } from '../../../types';
import { UploadDataInput as UploadDataWithPathInputWithAdvancedOptions } from '../../../../../internals/types/inputs';
import { ItemWithKey, ItemWithPath } from '../../../types/outputs';
/**
 * The input interface for UploadData API with only the options needed for single part upload.
 * It supports both legacy Gen 1 input with key and Gen2 input with path. It also support additional
 * advanced options for StorageBrowser.
 *
 * @internal
 */
export type SinglePartUploadDataInput = UploadDataInput | UploadDataWithPathInputWithAdvancedOptions;
/**
 * Get a function the returns a promise to call putObject API to S3.
 *
 * @internal
 */
export declare const putObjectJob: (uploadDataInput: SinglePartUploadDataInput, abortSignal: AbortSignal, totalLength: number) => () => Promise<ItemWithKey | ItemWithPath>;

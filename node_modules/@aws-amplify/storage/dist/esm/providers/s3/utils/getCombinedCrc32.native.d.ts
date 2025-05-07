import { StorageUploadDataPayload } from '../../../types';
/**
 * Calculates a combined CRC32 checksum for the given data.
 *
 * This function chunks the input data, calculates CRC32 for each chunk,
 * and then combines these checksums into a single value.
 *
 * @async
 * @param {StorageUploadDataPayload} data - The data to calculate the checksum for.
 * @param {number | undefined} size - The size of each chunk. If undefined, a default chunk size will be used.
 * @returns {Promise<string>} A promise that resolves to a string containing the combined CRC32 checksum
 *                            and the number of chunks, separated by a hyphen.
 */
export declare const getCombinedCrc32: (data: StorageUploadDataPayload, size: number | undefined) => Promise<string>;

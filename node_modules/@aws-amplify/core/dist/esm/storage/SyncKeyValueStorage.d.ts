import { SyncStorage } from '../types';
/**
 * @internal
 */
export declare class SyncKeyValueStorage implements SyncStorage {
    _storage?: Storage;
    constructor(storage?: Storage);
    get storage(): Storage;
    /**
     * This is used to set a specific item in storage
     * @param {string} key - the key for the item
     * @param {object} value - the value
     * @returns {string} value that was set
     */
    setItem(key: string, value: string): void;
    /**
     * This is used to get a specific key from storage
     * @param {string} key - the key for the item
     * This is used to clear the storage
     * @returns {string} the data item
     */
    getItem(key: string): string | null;
    /**
     * This is used to remove an item from storage
     * @param {string} key - the key being set
     * @returns {string} value - value that was deleted
     */
    removeItem(key: string): void;
    /**
     * This is used to clear the storage
     * @returns {string} nothing
     */
    clear(): void;
}

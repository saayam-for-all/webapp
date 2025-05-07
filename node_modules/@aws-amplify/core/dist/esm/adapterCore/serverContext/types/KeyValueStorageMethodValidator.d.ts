import { KeyValueStorageInterface } from '../../../types/storage';
export type KeyValueStorageMethodValidator = Partial<Record<keyof KeyValueStorageInterface, ValidatorFunction>>;
type ValidatorFunction = (...args: any[]) => Promise<boolean>;
export {};

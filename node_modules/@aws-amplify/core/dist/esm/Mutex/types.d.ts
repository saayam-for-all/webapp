export interface MutexInterface {
    acquire(): Promise<MutexInterface.Releaser>;
    runExclusive<T>(callback: MutexInterface.Worker<T>): Promise<T>;
    isLocked(): boolean;
}
export declare namespace MutexInterface {
    type Releaser = () => void;
    type Worker<T> = () => Promise<T> | T;
}

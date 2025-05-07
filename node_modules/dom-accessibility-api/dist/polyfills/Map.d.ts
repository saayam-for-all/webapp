declare global {
    class Map<K, V> {
        clear(): void;
        delete(key: K): boolean;
        forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: unknown): void;
        get(key: K): V | undefined;
        has(key: K): boolean;
        set(key: K, value: V): this;
        readonly size: number;
    }
}
export {};
//# sourceMappingURL=Map.d.ts.map
export function isWindows(): boolean;
export function isMac(): boolean;
export function isLinux(): boolean;
export function isOSWin64(): boolean;
export function arch(): Promise<"32" | "64" | undefined>;
export function macOsxVersion(): Promise<string>;
//# sourceMappingURL=system.d.ts.map
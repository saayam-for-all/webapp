interface InsertCssOptions {
    container?: HTMLElement;
    prepend?: boolean;
    nonce?: string;
}
export declare function insertCss(css: string, options?: InsertCssOptions): HTMLStyleElement;
export {};

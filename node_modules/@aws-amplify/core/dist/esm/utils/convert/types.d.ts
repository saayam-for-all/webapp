interface Base64ConvertOptions {
    urlSafe: boolean;
}
export interface Base64EncoderConvertOptions extends Base64ConvertOptions {
    skipPadding?: boolean;
}
export type Base64DecoderConvertOptions = Base64ConvertOptions;
export interface Base64Encoder {
    convert(input: Uint8Array | string, options?: Base64EncoderConvertOptions): string;
}
export interface Base64Decoder {
    convert(input: string, options?: Base64DecoderConvertOptions): string;
}
export {};

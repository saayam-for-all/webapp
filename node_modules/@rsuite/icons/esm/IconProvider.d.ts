export interface IconContextProps {
    classPrefix?: string;
    csp?: {
        /**
         * Content Security Policy nonce
         * https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce
         */
        nonce?: string;
    };
    /**
     * Disable inline styles
     * @default false
     */
    disableInlineStyles?: boolean;
}
export declare const IconContext: import("react").Context<IconContextProps>;
declare const _default: import("react").Provider<IconContextProps>;
export default _default;

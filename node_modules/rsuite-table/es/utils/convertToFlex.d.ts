export declare const verticalAlignMap: {
    top: string;
    middle: string;
    bottom: string;
};
export declare const alignMap: {
    left: string;
    center: string;
    right: string;
};
export declare function verticalAlignToAlignItems(verticalAlign: any): any;
export declare function alignToJustifyContent(align: any): any;
export default function convertToFlex(props: {
    verticalAlign?: string;
    align?: string;
}): React.CSSProperties;

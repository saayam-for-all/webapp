import type { DocumentType } from '../../runtime/bridge-types';
import type { ToolResultContent } from './ToolResultContent';
interface BytesImageSource {
    bytes: Uint8Array;
}
interface BytesDocumentSource {
    bytes: Uint8Array;
}
export interface ImageBlock {
    format: 'gif' | 'jpeg' | 'png' | 'webp';
    source: BytesImageSource;
}
export interface DocumentBlock {
    format: 'pdf' | 'csv' | 'doc' | 'docx' | 'xls' | 'xlsx' | 'html' | 'txt' | 'md';
    name: string;
    source: BytesDocumentSource;
}
export interface ToolUseBlock {
    toolUseId: string;
    name: string;
    input: DocumentType;
}
export interface ToolResultBlock {
    toolUseId: string;
    content: ToolResultContent[];
}
export {};

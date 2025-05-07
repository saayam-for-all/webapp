import type { AmPmType } from './types.js';
export declare function convert12to24(hour12: string | number, amPm: AmPmType): number;
export declare function convert24to12(hour24: string | number): [number, AmPmType];

export type CachedResponse = {
    method: string;
    path: string;
    response: Buffer | null;
    responseStateListener: EventEmitter | null | undefined;
};
/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export function handleIdempotency(req: import("express").Request, res: import("express").Response, next: any): Promise<any>;
import { EventEmitter } from 'events';
//# sourceMappingURL=idempotency.d.ts.map
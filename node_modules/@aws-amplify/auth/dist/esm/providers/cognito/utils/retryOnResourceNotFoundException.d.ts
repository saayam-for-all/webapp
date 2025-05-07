import { AuthTokenOrchestrator } from '../tokenProvider/types';
/**
 * It will retry the function if the error is a `ResourceNotFoundException` and
 * will clean the device keys stored in the storage mechanism.
 *
 */
export declare function retryOnResourceNotFoundException<F extends (...args: any[]) => any>(func: F, args: Parameters<F>, username: string, tokenOrchestrator: AuthTokenOrchestrator): Promise<ReturnType<F>>;

import { ListAllInput, ListPaginateInput } from '../types/inputs';
import { ListAllWithPathOutput, ListPaginateWithPathOutput } from '../../providers/s3';
/**
 * @internal
 */
export declare function list(input: ListAllInput): Promise<ListAllWithPathOutput>;
/**
 * @internal
 */
export declare function list(input: ListPaginateInput): Promise<ListPaginateWithPathOutput>;

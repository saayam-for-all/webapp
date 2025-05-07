import { PathAccess } from '../../types/credentials';
import { BucketInfo } from '../../../providers/s3/types/options';
export declare const resolveLocationsForCurrentSession: ({ buckets, isAuthenticated, identityId, userGroup, }: {
    buckets: Record<string, BucketInfo>;
    isAuthenticated: boolean;
    identityId?: string | undefined;
    userGroup?: string | undefined;
}) => PathAccess[];

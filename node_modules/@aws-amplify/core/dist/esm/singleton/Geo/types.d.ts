import { AtLeastOne } from '../types';
export interface LocationServiceConfig {
    LocationService: {
        region: string;
        maps?: {
            items: Record<string, unknown>;
            default: string;
        };
        searchIndices?: {
            items: string[];
            default: string;
        };
        geofenceCollections?: {
            items: string[];
            default: string;
        };
    };
}
export type GeoConfig = AtLeastOne<LocationServiceConfig>;

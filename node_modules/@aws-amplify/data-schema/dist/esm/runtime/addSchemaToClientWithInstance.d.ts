import { ClientExtensionsSSRCookies, ClientExtensionsSSRRequest } from './client';
import { BaseClient, ClientInternalsGetter } from './bridge-types';
export declare function addSchemaToClientWithInstance<T extends Record<any, any>>(client: BaseClient, params: any, getInternals: ClientInternalsGetter): BaseClient & (ClientExtensionsSSRCookies<T> | ClientExtensionsSSRRequest<T>);

import { ModelTypes } from '../../client';
import { BaseClient, ClientInternalsGetter, ServerClientGenerationParams } from '../../bridge-types';
export declare function generateModelsProperty<T extends Record<any, any> = never>(client: BaseClient, params: ServerClientGenerationParams, getInternals: ClientInternalsGetter): ModelTypes<T> | ModelTypes<never>;

import { Observable } from 'rxjs';
import { AmplifyContext, AuthModeStrategy, ErrorHandler, InternalSchema, ModelInstanceMetadata, ModelPredicate, SchemaModel } from '../../types';
declare class SyncProcessor {
    private readonly schema;
    private readonly syncPredicates;
    private readonly amplifyConfig;
    private readonly authModeStrategy;
    private readonly errorHandler;
    private readonly amplifyContext;
    private readonly typeQuery;
    private runningProcesses;
    constructor(schema: InternalSchema, syncPredicates: WeakMap<SchemaModel, ModelPredicate<any> | null>, amplifyConfig: Record<string, any>, authModeStrategy: AuthModeStrategy, errorHandler: ErrorHandler, amplifyContext: AmplifyContext);
    private generateQueries;
    private graphqlFilterFromPredicate;
    private retrievePage;
    private jitteredRetry;
    start(typesLastSync: Map<SchemaModel, [string, number]>): Observable<SyncModelPage>;
    stop(): Promise<void>;
}
export interface SyncModelPage {
    namespace: string;
    modelDefinition: SchemaModel;
    items: ModelInstanceMetadata[];
    startedAt: number;
    done: boolean;
    isFullSync: boolean;
}
export { SyncProcessor };

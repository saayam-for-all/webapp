import { ExclusiveStorage as Storage, Storage as StorageClass, StorageFacade } from '../storage/storage';
import { ModelInstanceCreator } from '../datastore/datastore';
import { InternalSchema, PersistentModel, PersistentModelConstructor, SchemaModel } from '../types';
import { TransformerMutationType } from './utils';
import { MutationEvent } from './index';
declare class MutationEventOutbox {
    private readonly schema;
    private readonly _MutationEvent;
    private readonly modelInstanceCreator;
    private readonly ownSymbol;
    private inProgressMutationEventId;
    constructor(schema: InternalSchema, _MutationEvent: PersistentModelConstructor<MutationEvent>, modelInstanceCreator: ModelInstanceCreator, ownSymbol: symbol);
    enqueue(storage: Storage, mutationEvent: MutationEvent): Promise<void>;
    dequeue(storage: StorageClass, record?: PersistentModel, recordOp?: TransformerMutationType): Promise<MutationEvent>;
    /**
     * Doing a peek() implies that the mutation goes "inProgress"
     *
     * @param storage
     */
    peek(storage: StorageFacade): Promise<MutationEvent>;
    getForModel<T extends PersistentModel>(storage: StorageFacade, model: T, userModelDefinition: SchemaModel): Promise<MutationEvent[]>;
    getModelIds(storage: StorageFacade): Promise<Set<string>>;
    private syncOutboxVersionsOnDequeue;
    private mergeUserFields;
    private removeTimestampFields;
}
export { MutationEventOutbox };

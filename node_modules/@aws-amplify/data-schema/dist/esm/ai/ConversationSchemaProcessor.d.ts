import { LambdaFunctionDefinition } from '@aws-amplify/data-schema-types';
import type { InternalConversationType } from './ConversationType';
export declare const createConversationField: (typeDef: InternalConversationType, typeName: string) => {
    field: string;
    functionHandler: LambdaFunctionDefinition;
};

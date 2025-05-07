import { AmplifyClassV6 } from '@aws-amplify/core';
import { ListAllOutput, ListAllWithPathOutput, ListPaginateOutput, ListPaginateWithPathOutput } from '../../types';
import { ListAllInput, ListPaginateInput } from '../../types/inputs';
import { ListInput as ListWithPathInputAndAdvancedOptions } from '../../../../internals/types/inputs';
export declare const list: (amplify: AmplifyClassV6, input: ListAllInput | ListPaginateInput | ListWithPathInputAndAdvancedOptions) => Promise<ListAllOutput | ListPaginateOutput | ListAllWithPathOutput | ListPaginateWithPathOutput>;

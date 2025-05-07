import { KinesisEventData } from '../../../types';
export interface RecordInput {
    streamName: string;
    partitionKey: string;
    data: KinesisEventData;
}

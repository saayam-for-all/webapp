import { KinesisEventData } from '../../../types';
export interface RecordInput {
    streamName: string;
    data: KinesisEventData;
}

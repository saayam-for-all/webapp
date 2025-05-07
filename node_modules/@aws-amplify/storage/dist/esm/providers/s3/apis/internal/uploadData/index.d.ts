import { SinglePartUploadDataInput } from './putObjectJob';
import { MultipartUploadDataInput } from './multipart';
export declare const uploadData: (input: SinglePartUploadDataInput | MultipartUploadDataInput) => import("../../../../../types").UploadTask<import("../../../types/outputs").ItemWithKey | import("../../../types/outputs").ItemWithPath>;

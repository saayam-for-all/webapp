import { Observable } from 'rxjs';
import { SchemaModel } from '../../bridge-types';
export declare function observeQueryFactory(models: any, model: SchemaModel): (arg?: any) => Observable<unknown>;

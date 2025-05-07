import { Observable } from 'rxjs';
interface ConnectionStatus {
    online: boolean;
}
export default class DataStoreConnectivity {
    private connectionStatus;
    private observer;
    private subscription;
    private timeout;
    constructor();
    status(): Observable<ConnectionStatus>;
    unsubscribe(): void;
    stop(): Promise<void>;
    socketDisconnected(): void;
}
export {};

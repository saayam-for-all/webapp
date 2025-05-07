import { Observable } from 'rxjs';
import { ConnectionState } from '../types/PubSub';
type LinkedConnectionState = 'connected' | 'disconnected';
type LinkedHealthState = 'healthy' | 'unhealthy';
interface LinkedConnectionStates {
    networkState: LinkedConnectionState;
    connectionState: LinkedConnectionState | 'connecting';
    intendedConnectionState: LinkedConnectionState;
    keepAliveState: LinkedHealthState;
}
export declare const CONNECTION_CHANGE: {
    readonly KEEP_ALIVE_MISSED: {
        readonly keepAliveState: "unhealthy";
    };
    readonly KEEP_ALIVE: {
        readonly keepAliveState: "healthy";
    };
    readonly CONNECTION_ESTABLISHED: {
        readonly connectionState: "connected";
    };
    readonly CONNECTION_FAILED: {
        readonly intendedConnectionState: "disconnected";
        readonly connectionState: "disconnected";
    };
    readonly CLOSING_CONNECTION: {
        readonly intendedConnectionState: "disconnected";
    };
    readonly OPENING_CONNECTION: {
        readonly intendedConnectionState: "connected";
        readonly connectionState: "connecting";
    };
    readonly CLOSED: {
        readonly connectionState: "disconnected";
    };
    readonly ONLINE: {
        readonly networkState: "connected";
    };
    readonly OFFLINE: {
        readonly networkState: "disconnected";
    };
};
export declare class ConnectionStateMonitor {
    /**
     * @private
     */
    private _linkedConnectionState;
    private _linkedConnectionStateObservable;
    private _linkedConnectionStateObserver;
    private _networkMonitoringSubscription?;
    private _initialNetworkStateSubscription?;
    constructor();
    /**
     * Turn network state monitoring on if it isn't on already
     */
    private enableNetworkMonitoring;
    /**
     * Turn network state monitoring off if it isn't off already
     */
    private disableNetworkMonitoring;
    /**
     * Get the observable that allows us to monitor the connection state
     *
     * @returns {Observable<ConnectionState>} - The observable that emits ConnectionState updates
     */
    get connectionStateObservable(): Observable<ConnectionState>;
    record(statusUpdates: Partial<LinkedConnectionStates>): void;
    private connectionStatesTranslator;
}
export {};

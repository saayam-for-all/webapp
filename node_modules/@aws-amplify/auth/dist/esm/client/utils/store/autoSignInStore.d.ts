type AutoSignInAction = {
    type: 'START';
} | {
    type: 'SET_USERNAME';
    value: string;
} | {
    type: 'SET_SESSION';
    value?: string;
} | {
    type: 'RESET';
};
interface AutoSignInState {
    active: boolean;
    username?: string;
    session?: string;
}
export declare const autoSignInStore: {
    getState(): AutoSignInState;
    dispatch(action: AutoSignInAction): void;
};
export {};

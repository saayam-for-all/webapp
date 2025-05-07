interface PointerMoveTrackerOptions {
    useTouchEvent?: boolean;
    onMove: (x: number, y: number, event: MouseEvent | TouchEvent) => void;
    onMoveEnd: (event: MouseEvent | TouchEvent) => void;
}
/**
 * Track mouse/touch events for a given element.
 */
export default class PointerMoveTracker {
    isDragStatus: boolean;
    useTouchEvent: boolean;
    animationFrameID: any;
    domNode: Element;
    onMove: any;
    onMoveEnd: any;
    eventMoveToken: any;
    eventUpToken: any;
    moveEvent: any;
    deltaX: number;
    deltaY: number;
    x: number;
    y: number;
    /**
     * onMove is the callback that will be called on every mouse move.
     * onMoveEnd is called on mouse up when movement has ended.
     */
    constructor(domNode: Element, { onMove, onMoveEnd, useTouchEvent }: PointerMoveTrackerOptions);
    isSupportTouchEvent(): boolean;
    getClientX(event: TouchEvent | MouseEvent): number;
    getClientY(event: TouchEvent | MouseEvent): number;
    /**
     * This is to set up the listeners for listening to mouse move
     * and mouse up signaling the movement has ended. Please note that these
     * listeners are added at the document.body level. It takes in an event
     * in order to grab inital state.
     */
    captureMoves(event: any): void;
    /**
     * These releases all of the listeners on document.body.
     */
    releaseMoves(): void;
    /**
     * Returns whether or not if the mouse movement is being tracked.
     */
    isDragging: () => boolean;
    /**
     * Calls onMove passed into constructor and updates internal state.
     */
    onDragMove: (event: MouseEvent | TouchEvent) => void;
    didDragMove: () => void;
    /**
     * Calls onMoveEnd passed into constructor and updates internal state.
     */
    onDragUp: (event: any) => void;
}
export {};

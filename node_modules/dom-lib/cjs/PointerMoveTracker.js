"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _on = _interopRequireDefault(require("./on.js"));

var _isEventSupported = _interopRequireDefault(require("./utils/isEventSupported.js"));

/**
 * Track mouse/touch events for a given element.
 */
var PointerMoveTracker = /*#__PURE__*/function () {
  /**
   * onMove is the callback that will be called on every mouse move.
   * onMoveEnd is called on mouse up when movement has ended.
   */
  function PointerMoveTracker(domNode, _ref) {
    var _this = this;

    var onMove = _ref.onMove,
        onMoveEnd = _ref.onMoveEnd,
        _ref$useTouchEvent = _ref.useTouchEvent,
        useTouchEvent = _ref$useTouchEvent === void 0 ? true : _ref$useTouchEvent;
    this.isDragStatus = false;
    this.useTouchEvent = true;
    this.animationFrameID = null;
    this.domNode = void 0;
    this.onMove = null;
    this.onMoveEnd = null;
    this.eventMoveToken = null;
    this.eventUpToken = null;
    this.moveEvent = null;
    this.deltaX = 0;
    this.deltaY = 0;
    this.x = 0;
    this.y = 0;

    this.isDragging = function () {
      return _this.isDragStatus;
    };

    this.onDragMove = function (event) {
      var x = _this.getClientX(event);

      var y = _this.getClientY(event);

      _this.deltaX += x - _this.x;
      _this.deltaY += x - _this.y;

      if (_this.animationFrameID === null) {
        // The mouse may move faster then the animation frame does.
        // Use `requestAnimationFrame` to avoid over-updating.
        _this.animationFrameID = requestAnimationFrame(_this.didDragMove);
      }

      _this.x = x;
      _this.y = y;
      _this.moveEvent = event;

      if (event.cancelable) {
        event.preventDefault();
      }
    };

    this.didDragMove = function () {
      _this.animationFrameID = null;

      _this.onMove(_this.deltaX, _this.deltaY, _this.moveEvent);

      _this.deltaX = 0;
      _this.deltaY = 0;
    };

    this.onDragUp = function (event) {
      var _this$onMoveEnd;

      if (_this.animationFrameID) {
        _this.didDragMove();
      }

      (_this$onMoveEnd = _this.onMoveEnd) === null || _this$onMoveEnd === void 0 ? void 0 : _this$onMoveEnd.call(_this, event);
    };

    this.domNode = domNode;
    this.onMove = onMove;
    this.onMoveEnd = onMoveEnd;
    this.useTouchEvent = useTouchEvent;
  }

  var _proto = PointerMoveTracker.prototype;

  _proto.isSupportTouchEvent = function isSupportTouchEvent() {
    return this.useTouchEvent && (0, _isEventSupported["default"])('touchstart');
  };

  _proto.getClientX = function getClientX(event) {
    var _touches;

    return this.isSupportTouchEvent() ? (_touches = event.touches) === null || _touches === void 0 ? void 0 : _touches[0].clientX : event.clientX;
  };

  _proto.getClientY = function getClientY(event) {
    var _touches2;

    return this.isSupportTouchEvent() ? (_touches2 = event.touches) === null || _touches2 === void 0 ? void 0 : _touches2[0].clientY : event.clientY;
  }
  /**
   * This is to set up the listeners for listening to mouse move
   * and mouse up signaling the movement has ended. Please note that these
   * listeners are added at the document.body level. It takes in an event
   * in order to grab inital state.
   */
  ;

  _proto.captureMoves = function captureMoves(event) {
    if (!this.eventMoveToken && !this.eventUpToken) {
      if (this.isSupportTouchEvent()) {
        this.eventMoveToken = (0, _on["default"])(this.domNode, 'touchmove', this.onDragMove, {
          passive: false
        });
        this.eventUpToken = (0, _on["default"])(this.domNode, 'touchend', this.onDragUp, {
          passive: false
        });
        (0, _on["default"])(this.domNode, 'touchcancel', this.releaseMoves);
      } else {
        this.eventMoveToken = (0, _on["default"])(this.domNode, 'mousemove', this.onDragMove);
        this.eventUpToken = (0, _on["default"])(this.domNode, 'mouseup', this.onDragUp);
      }
    }

    if (!this.isDragStatus) {
      this.deltaX = 0;
      this.deltaY = 0;
      this.isDragStatus = true;
      this.x = this.getClientX(event);
      this.y = this.getClientY(event);
    }

    if (event.cancelable) {
      event.preventDefault();
    }
  }
  /**
   * These releases all of the listeners on document.body.
   */
  ;

  _proto.releaseMoves = function releaseMoves() {
    if (this.eventMoveToken) {
      this.eventMoveToken.off();
      this.eventMoveToken = null;
    }

    if (this.eventUpToken) {
      this.eventUpToken.off();
      this.eventUpToken = null;
    }

    if (this.animationFrameID !== null) {
      cancelAnimationFrame(this.animationFrameID);
      this.animationFrameID = null;
    }

    if (this.isDragStatus) {
      this.isDragStatus = false;
      this.x = 0;
      this.y = 0;
    }
  }
  /**
   * Returns whether or not if the mouse movement is being tracked.
   */
  ;

  return PointerMoveTracker;
}();

exports["default"] = PointerMoveTracker;
module.exports = exports.default;
'use client';
"use strict";

exports.__esModule = true;
exports.TREE_DEPTH = exports.TRANSITION_DURATION = exports.SORT_TYPE = exports.SCROLLBAR_WIDTH = exports.SCROLLBAR_MIN_WIDTH = exports.ROW_HEIGHT = exports.ROW_HEADER_HEIGHT = exports.RESIZE_MIN_WIDTH = exports.PARENT_KEY = exports.LAYER_WIDTH = exports.EXPANDED_KEY = exports.CELL_PADDING_HEIGHT = exports.BEZIER = void 0;
var LAYER_WIDTH = exports.LAYER_WIDTH = 30;
var SCROLLBAR_MIN_WIDTH = exports.SCROLLBAR_MIN_WIDTH = 14;
var SCROLLBAR_WIDTH = exports.SCROLLBAR_WIDTH = 10;
var CELL_PADDING_HEIGHT = exports.CELL_PADDING_HEIGHT = 26;
var RESIZE_MIN_WIDTH = exports.RESIZE_MIN_WIDTH = 20;
var SORT_TYPE = exports.SORT_TYPE = {
  DESC: 'desc',
  ASC: 'asc'
};
var ROW_HEIGHT = exports.ROW_HEIGHT = 46;
var ROW_HEADER_HEIGHT = exports.ROW_HEADER_HEIGHT = 40;

// transition-duration (ms)
var TRANSITION_DURATION = exports.TRANSITION_DURATION = 1000;
// transition-timing-function (ease-out)
var BEZIER = exports.BEZIER = 'cubic-bezier(0, 0, .58, 1)';

// An attribute value added to the data row to identify whether it is expanded, used in Tree.
var EXPANDED_KEY = exports.EXPANDED_KEY = Symbol('expanded');

// An attribute value added for the data row, identifying the key of the parent node, used in Tree.
var PARENT_KEY = exports.PARENT_KEY = Symbol('parent');

// The attribute value added for the data row, which identifies the depth of the node (the number of parent nodes),
// and is used in the Tree.
var TREE_DEPTH = exports.TREE_DEPTH = Symbol('treeDepth');
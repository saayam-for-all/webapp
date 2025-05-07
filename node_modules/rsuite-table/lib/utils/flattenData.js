'use client';
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports["default"] = void 0;
var _extends3 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _constants = require("../constants");
/**
 * Flatten the tree data with parent association recorded on each node
 * @param tree tree data
 */
function flattenData(tree, parent) {
  return tree.reduce(function (acc, node) {
    var _extends2;
    // Create a new flattened node with parent association
    var flattened = (0, _extends3["default"])({}, node, (_extends2 = {}, _extends2[_constants.PARENT_KEY] = parent, _extends2));

    // Add the flattened node and its flattened children (if any) to the result array
    acc.push.apply(acc, [flattened].concat(node.children ? flattenData(node.children, flattened) : []));
    return acc;
  }, []);
}
var _default = exports["default"] = flattenData;
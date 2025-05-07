'use client';
"use strict";

exports.__esModule = true;
exports["default"] = void 0;
var _constants = require("../constants");
/**
 * Get all parent nodes of the given node in the flattened data
 * @param node target node
 */
function findAllParents(node, rowKey) {
  var parents = [];
  var current = node[_constants.PARENT_KEY];

  // Iterate up through the parent chain and add each parent to the result array
  while (current) {
    parents.push(current[rowKey]);
    current = current[_constants.PARENT_KEY];
  }
  return parents;
}
var _default = exports["default"] = findAllParents;
'use client';
import { PARENT_KEY } from '../constants';
/**
 * Get all parent nodes of the given node in the flattened data
 * @param node target node
 */
function findAllParents(node, rowKey) {
  var parents = [];
  var current = node[PARENT_KEY];

  // Iterate up through the parent chain and add each parent to the result array
  while (current) {
    parents.push(current[rowKey]);
    current = current[PARENT_KEY];
  }
  return parents;
}
export default findAllParents;
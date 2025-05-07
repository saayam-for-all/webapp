'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import { PARENT_KEY } from '../constants';
/**
 * Flatten the tree data with parent association recorded on each node
 * @param tree tree data
 */
function flattenData(tree, parent) {
  return tree.reduce(function (acc, node) {
    var _extends2;
    // Create a new flattened node with parent association
    var flattened = _extends({}, node, (_extends2 = {}, _extends2[PARENT_KEY] = parent, _extends2));

    // Add the flattened node and its flattened children (if any) to the result array
    acc.push.apply(acc, [flattened].concat(node.children ? flattenData(node.children, flattened) : []));
    return acc;
  }, []);
}
export default flattenData;
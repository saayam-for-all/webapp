/**
 * Check whether a row(tree) node should be expanded.
 * @param expandedRowKeys An array of all expanded nodes.
 * @param parentKeys All parent nodes of the current node
 * @returns boolean
 */
export default function shouldShowRowByExpanded<Key>(expandedRowKeys?: readonly Key[], parentKeys?: readonly Key[]): boolean;

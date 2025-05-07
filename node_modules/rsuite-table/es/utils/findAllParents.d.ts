import type { RowDataType, RowKeyType } from '../@types/common';
/**
 * Get all parent nodes of the given node in the flattened data
 * @param node target node
 */
declare function findAllParents<Row extends RowDataType, Key>(node: Row, rowKey: RowKeyType): Key[];
export default findAllParents;

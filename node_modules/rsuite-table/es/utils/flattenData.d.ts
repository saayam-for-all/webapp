import type { RowDataType } from '../@types/common';
/**
 * Flatten the tree data with parent association recorded on each node
 * @param tree tree data
 */
declare function flattenData<Row extends RowDataType<Row>>(tree: readonly Row[], parent?: Row): Row[];
export default flattenData;

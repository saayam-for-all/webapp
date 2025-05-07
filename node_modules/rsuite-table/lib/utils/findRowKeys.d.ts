import { RowDataType, RowKeyType } from '../@types/common';
export default function findRowKeys<Row extends RowDataType, Key>(rows: readonly Row[], rowKey?: RowKeyType, expanded?: boolean): Key[];

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  rowsPerPage,
  totalRows,
}) {
  return (
    <mock-pagination
      currentPage={currentPage}
      totalPages={totalPages}
      rowsPerPage={rowsPerPage}
      totalRows={totalRows}
    />
  );
}

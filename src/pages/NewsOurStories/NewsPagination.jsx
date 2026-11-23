import PropTypes from "prop-types";

export default function NewsPagination({
  currentPage,
  totalPages,
  onPageChange,
  t,
  isRtl,
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="news-pagination" aria-label={t("PAGINATION_LABEL")}>
      <button
        type="button"
        className="news-pagination-button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <span aria-hidden="true">{isRtl ? "›" : "‹"}</span>
        {t("PAGINATION_PREVIOUS")}
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          className={`news-pagination-button ${
            page === currentPage ? "news-pagination-active" : ""
          }`}
          aria-label={t("PAGINATION_PAGE", { page })}
          aria-current={page === currentPage ? "page" : undefined}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        className="news-pagination-button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        {t("PAGINATION_NEXT")}
        <span aria-hidden="true">{isRtl ? "‹" : "›"}</span>
      </button>
    </nav>
  );
}

NewsPagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  isRtl: PropTypes.bool.isRequired,
};

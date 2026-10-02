export default function Pagination({ page, pageCount, total, pageSize, onChange }) {
  if (total <= pageSize) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <nav className="pager" aria-label="Pagination">
      <p className="muted" aria-live="polite">
        Showing {from} to {to} of {total}
      </p>
      <div className="pager-buttons">
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          disabled={page === 1}
          onClick={() => onChange(page - 1)}
        >
          Previous
        </button>
        <span className="pager-page">
          Page {page} of {pageCount}
        </span>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          disabled={page === pageCount}
          onClick={() => onChange(page + 1)}
        >
          Next
        </button>
      </div>
    </nav>
  );
}

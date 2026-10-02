import { useState } from "react";

/**
 * Client-side paging. `resetKey` sends the user back to page 1 when filters or sorting change.
 */
export function usePagination(rows, resetKey, pageSize = 10) {
  const [state, setState] = useState({ key: resetKey, page: 1 });

  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const requested = state.key === resetKey ? state.page : 1;
  const page = Math.min(requested, pageCount);

  return {
    page,
    pageCount,
    total: rows.length,
    pageSize,
    pageRows: rows.slice((page - 1) * pageSize, page * pageSize),
    setPage: (next) => setState({ key: resetKey, page: next }),
  };
}

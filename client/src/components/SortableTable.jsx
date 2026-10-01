/**
 * columns: [{ key, label, sortable?, render?(row), align? }]
 * Sorting is controlled by the parent through sortBy, order and onSort(key).
 */
export default function SortableTable({
  columns,
  rows,
  rowKey,
  sortBy,
  order,
  onSort,
  caption,
}) {
  return (
    <div className="table-wrap">
      <table>
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => {
              const active = sortBy === column.key;
              const ariaSort = active
                ? order === "asc"
                  ? "ascending"
                  : "descending"
                : "none";

              return (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={column.sortable ? ariaSort : undefined}
                  className={column.align === "end" ? "num" : undefined}
                >
                  {column.sortable ? (
                    <button
                      type="button"
                      className={`sort-btn${active ? " active" : ""}`}
                      onClick={() => onSort(column.key)}
                    >
                      {column.label}
                      <span className="sort-arrow" aria-hidden="true">
                        {active ? (order === "asc" ? "↑" : "↓") : "↕"}
                      </span>
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)}>
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={column.align === "end" ? "num" : undefined}
                  data-label={column.label}
                >
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

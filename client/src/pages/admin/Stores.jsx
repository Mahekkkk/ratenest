import { useState } from "react";
import Alert from "../../components/Alert";
import EmptyState from "../../components/EmptyState";
import Field from "../../components/Field";
import Loading from "../../components/Loading";
import Modal from "../../components/Modal";
import PageHeader from "../../components/PageHeader";
import SortableTable from "../../components/SortableTable";
import StarRating from "../../components/StarRating";
import { useAsync } from "../../hooks/useAsync";
import { useDebounce } from "../../hooks/useDebounce";
import { usePagination } from "../../hooks/usePagination";
import { useToast } from "../../hooks/useToast";
import Pagination from "../../components/Pagination";
import { getAdminStores } from "../../services/api";
import AddStoreForm from "./AddStoreForm";

const COLUMNS = [
  { key: "name", label: "Name", sortable: true },
  { key: "email", label: "Email", sortable: true, render: (row) => <span className="cell-wrap">{row.email}</span> },
  { key: "address", label: "Address", sortable: true, render: (row) => <span className="cell-wrap">{row.address}</span> },
  { key: "rating", label: "Rating", sortable: true, render: (row) => <StarRating value={row.overall_rating} /> },
];

export default function AdminStores() {
  const [filters, setFilters] = useState({ name: "", email: "", address: "" });
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [adding, setAdding] = useState(false);
  const debounced = useDebounce(filters);

  const { data, error, loading, reload } = useAsync(
    () => getAdminStores({ ...debounced, sortBy, order }),
    [debounced, sortBy, order],
  );

  const handleFilter = (event) =>
    setFilters((previous) => ({ ...previous, [event.target.name]: event.target.value }));

  const handleSort = (key) => {
    if (key === sortBy) setOrder((previous) => (previous === "asc" ? "desc" : "asc"));
    else {
      setSortBy(key);
      setOrder("asc");
    }
  };

  const pager = usePagination(data ? data.data : [], JSON.stringify([debounced, sortBy, order]));
  const { notify } = useToast();
  const filtering = Object.values(debounced).some(Boolean);

  return (
    <>
      <PageHeader
        title="Stores"
        description="Every store on the platform with its overall rating."
        actions={
          <button type="button" className="btn btn-primary" onClick={() => setAdding(true)}>
            Add store
          </button>
        }
      />

      <div className="filters mb-5">
        <Field label="Name" name="name" value={filters.name} onChange={handleFilter} placeholder="Filter by name" />
        <Field label="Email" name="email" value={filters.email} onChange={handleFilter} placeholder="Filter by email" />
        <Field label="Address" name="address" value={filters.address} onChange={handleFilter} placeholder="Filter by address" />
      </div>

      <Alert>{error}</Alert>
      {!data && loading && <Loading label="Loading stores" />}

      {data && data.data.length === 0 && (
        <EmptyState title={filtering ? "No stores match these filters" : "No stores yet"}>
          {filtering ? "Clear a filter or try a shorter search." : "Add the first store to get started."}
        </EmptyState>
      )}

      {pager.total > 0 && (
        <SortableTable
          caption="Stores"
          columns={COLUMNS}
          rows={pager.pageRows}
          rowKey={(row) => row.id}
          sortBy={sortBy}
          order={order}
          onSort={handleSort}
        />
      )}
      <Pagination {...pager} onChange={pager.setPage} />

      <Modal open={adding} title="Add store" onClose={() => setAdding(false)}>
        <AddStoreForm
          onCreated={() => {
            setAdding(false);
            notify("Store created.");
            reload();
          }}
        />
      </Modal>
    </>
  );
}

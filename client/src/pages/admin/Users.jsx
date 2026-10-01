import { useState } from "react";
import { Link } from "react-router-dom";
import Alert from "../../components/Alert";
import EmptyState from "../../components/EmptyState";
import Field from "../../components/Field";
import Loading from "../../components/Loading";
import Modal from "../../components/Modal";
import PageHeader from "../../components/PageHeader";
import SortableTable from "../../components/SortableTable";
import { useAsync } from "../../hooks/useAsync";
import { useDebounce } from "../../hooks/useDebounce";
import { getAdminUsers } from "../../services/api";
import { ROLE_LABELS } from "../../utils/validation";
import AddUserForm from "./AddUserForm";

const COLUMNS = [
  { key: "name", label: "Name", sortable: true },
  { key: "email", label: "Email", sortable: true, render: (row) => <span className="cell-wrap">{row.email}</span> },
  { key: "address", label: "Address", sortable: true, render: (row) => <span className="cell-wrap">{row.address}</span> },
  { key: "role", label: "Role", sortable: true, render: (row) => <span className="badge">{ROLE_LABELS[row.role]}</span> },
  {
    key: "store",
    label: "Store",
    render: (row) => (row.role === "STORE_OWNER" ? row.store_name || <span className="muted">No store</span> : <span className="muted">None</span>),
  },
  {
    key: "actions",
    label: "Details",
    render: (row) => <Link to={`/admin/users/${row.id}`}>View {row.name.split(" ")[0]}</Link>,
  },
];

export default function AdminUsers() {
  const [filters, setFilters] = useState({ name: "", email: "", address: "", role: "" });
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [adding, setAdding] = useState(false);
  const debounced = useDebounce(filters);

  const { data, error, loading, reload } = useAsync(
    () => getAdminUsers({ ...debounced, sortBy, order }),
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

  const filtering = Object.values(debounced).some(Boolean);

  return (
    <>
      <PageHeader
        title="Users"
        description="Normal users, store owners and administrators."
        actions={
          <button type="button" className="btn btn-primary" onClick={() => setAdding(true)}>
            Add user
          </button>
        }
      />

      <div className="filters mb-5">
        <Field label="Name" name="name" value={filters.name} onChange={handleFilter} placeholder="Filter by name" />
        <Field label="Email" name="email" value={filters.email} onChange={handleFilter} placeholder="Filter by email" />
        <Field label="Address" name="address" value={filters.address} onChange={handleFilter} placeholder="Filter by address" />
        <Field as="select" label="Role" name="role" value={filters.role} onChange={handleFilter}>
          <option value="">All roles</option>
          <option value="USER">User</option>
          <option value="STORE_OWNER">Store owner</option>
          <option value="ADMIN">Administrator</option>
        </Field>
      </div>

      <Alert>{error}</Alert>
      {!data && loading && <Loading label="Loading users" />}

      {data && data.data.length === 0 && (
        <EmptyState title={filtering ? "No users match these filters" : "No users yet"}>
          {filtering ? "Clear a filter or try a shorter search." : "Add the first user to get started."}
        </EmptyState>
      )}

      {data && data.data.length > 0 && (
        <SortableTable
          caption="Users"
          columns={COLUMNS}
          rows={data.data}
          rowKey={(row) => `${row.id}-${row.store_id ?? "none"}`}
          sortBy={sortBy}
          order={order}
          onSort={handleSort}
        />
      )}

      <Modal open={adding} title="Add user" onClose={() => setAdding(false)}>
        <AddUserForm
          onCreated={() => {
            setAdding(false);
            reload();
          }}
        />
      </Modal>
    </>
  );
}

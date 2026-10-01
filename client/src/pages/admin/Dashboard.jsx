import { Link } from "react-router-dom";
import Alert from "../../components/Alert";
import Loading from "../../components/Loading";
import PageHeader from "../../components/PageHeader";
import { useAsync } from "../../hooks/useAsync";
import { getAdminDashboard } from "../../services/api";

export default function AdminDashboard() {
  const { data, error, loading } = useAsync(getAdminDashboard);

  const stats = data && [
    { label: "Total users", value: data.data.totalUsers },
    { label: "Total stores", value: data.data.totalStores },
    { label: "Ratings submitted", value: data.data.totalRatings },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Platform totals at a glance."
        actions={
          <>
            <Link className="btn btn-secondary" to="/admin/users">
              Manage users
            </Link>
            <Link className="btn btn-primary" to="/admin/stores">
              Manage stores
            </Link>
          </>
        }
      />
      <Alert>{error}</Alert>
      {loading && !data && <Loading label="Loading totals" />}
      {stats && (
        <div className="stats">
          {stats.map((stat) => (
            <div className="stat" key={stat.label}>
              <p className="stat-label">{stat.label}</p>
              <p className="stat-value">{stat.value}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

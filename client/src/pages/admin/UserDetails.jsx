import { Link, useParams } from "react-router-dom";
import Alert from "../../components/Alert";
import Loading from "../../components/Loading";
import PageHeader from "../../components/PageHeader";
import StarRating from "../../components/StarRating";
import { useAsync } from "../../hooks/useAsync";
import { getAdminUserById } from "../../services/api";
import { ROLE_LABELS } from "../../utils/validation";

export default function AdminUserDetails() {
  const { id } = useParams();
  const { data, error, loading } = useAsync(() => getAdminUserById(id), [id]);
  const user = data?.data;

  return (
    <>
      <PageHeader
        title={user ? user.name : "User details"}
        actions={
          <Link className="btn btn-secondary" to="/admin/users">
            Back to users
          </Link>
        }
      />
      <Alert>{error}</Alert>
      {loading && !data && <Loading label="Loading user" />}
      {user && (
        <dl className="panel details">
          <dt>Name</dt>
          <dd>{user.name}</dd>
          <dt>Email</dt>
          <dd>{user.email}</dd>
          <dt>Address</dt>
          <dd>{user.address}</dd>
          <dt>Role</dt>
          <dd>
            <span className="badge">{ROLE_LABELS[user.role]}</span>
          </dd>
          {user.role === "STORE_OWNER" && (
            <>
              <dt>Store</dt>
              <dd>{user.store_name || <span className="muted">No store assigned</span>}</dd>
              {user.store_name && (
                <>
                  <dt>Store rating</dt>
                  <dd>
                    <StarRating value={user.store_rating} />
                  </dd>
                </>
              )}
            </>
          )}
        </dl>
      )}
    </>
  );
}

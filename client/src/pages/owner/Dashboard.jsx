import Alert from "../../components/Alert";
import EmptyState from "../../components/EmptyState";
import Loading from "../../components/Loading";
import PageHeader from "../../components/PageHeader";
import SortableTable from "../../components/SortableTable";
import StarRating from "../../components/StarRating";
import { useAsync } from "../../hooks/useAsync";
import { getOwnerDashboard } from "../../services/api";

const formatDate = (value) =>
  new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

const RATING_COLUMNS = [
  { key: "user_name", label: "User", render: (row) => row.user_name },
  { key: "user_email", label: "Email", render: (row) => <span className="cell-wrap">{row.user_email}</span> },
  { key: "store_name", label: "Store" },
  { key: "rating", label: "Rating", render: (row) => <StarRating value={row.rating} /> },
  { key: "created_at", label: "Rated on", align: "end", render: (row) => formatDate(row.created_at) },
];

export default function OwnerDashboard() {
  const { data, error, loading } = useAsync(getOwnerDashboard);

  if (loading && !data) return <Loading label="Loading your store" />;
  if (error) return <Alert>{error}</Alert>;

  const { stores, ratings } = data.data;

  return (
    <>
      <PageHeader
        title="My store"
        description="Average rating and the users who rated your store."
      />

      {stores.length === 0 ? (
        <EmptyState title="No store is assigned to you">
          Ask an administrator to link your account to a store.
        </EmptyState>
      ) : (
        <div className="stack">
          <section aria-labelledby="stores-h">
            <h2 id="stores-h" className="mb-5">
              Average rating
            </h2>
            <div className="stats">
              {stores.map((store) => {
                const count = ratings.filter((row) => row.store_id === store.id).length;

                return (
                  <div className="stat" key={store.id}>
                    <p className="stat-label">{store.name}</p>
                    <p className="stat-value">{Number(store.average_rating).toFixed(1)}</p>
                    <StarRating value={store.average_rating} showNumber={false} />
                    <p className="muted">
                      {count} {count === 1 ? "rating" : "ratings"}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          <section aria-labelledby="ratings-h">
            <h2 id="ratings-h" className="mb-5">
              Ratings received
            </h2>
            {ratings.length === 0 ? (
              <EmptyState title="No ratings yet">
                Ratings from users will appear here as soon as they submit them.
              </EmptyState>
            ) : (
              <SortableTable
                caption="Ratings received for your stores"
                columns={RATING_COLUMNS}
                rows={ratings}
                rowKey={(row) => `${row.store_id}-${row.user_id}`}
              />
            )}
          </section>
        </div>
      )}
    </>
  );
}

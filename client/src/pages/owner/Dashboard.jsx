import Alert from "../../components/Alert";
import AreaChart from "../../components/charts/AreaChart";
import BarList from "../../components/charts/BarList";
import ColumnChart from "../../components/charts/ColumnChart";
import Gauge from "../../components/charts/Gauge";
import StatTile from "../../components/charts/StatTile";
import EmptyState from "../../components/EmptyState";
import Loading from "../../components/Loading";
import SortableTable from "../../components/SortableTable";
import StarRating from "../../components/StarRating";
import { useAsync } from "../../hooks/useAsync";
import { useAuth } from "../../hooks/useAuth";
import { getOwnerDashboard } from "../../services/api";
import { formatDay, ratingsToDays, SCORES } from "../../utils/chartData";

const formatDate = (value) =>
  new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

const RATING_COLUMNS = [
  { key: "user_name", label: "User" },
  { key: "user_email", label: "Email", render: (row) => <span className="cell-wrap">{row.user_email}</span> },
  { key: "store_name", label: "Store" },
  { key: "rating", label: "Rating", render: (row) => <StarRating value={row.rating} /> },
  { key: "created_at", label: "Rated on", align: "end", render: (row) => formatDate(row.created_at) },
];

export default function OwnerDashboard() {
  const { user } = useAuth();
  const { data, error, loading } = useAsync(getOwnerDashboard);

  if (loading && !data) return <Loading label="Loading your store" />;
  if (error) return <Alert>{error}</Alert>;

  const { stores, ratings } = data.data;

  if (stores.length === 0) {
    return (
      <EmptyState title="No store is assigned to you">
        Ask an administrator to link your account to a store.
      </EmptyState>
    );
  }

  const total = ratings.length;
  const average = total ? ratings.reduce((sum, row) => sum + Number(row.rating), 0) / total : 0;
  const fiveStarShare = total ? (ratings.filter((row) => Number(row.rating) === 5).length / total) * 100 : 0;
  const days = ratingsToDays(ratings);
  const weekTotal = days.slice(-7).reduce((sum, day) => sum + day.value, 0);
  const title = stores.length === 1 ? stores[0].name : `${stores.length} stores`;

  return (
    <>
      <div className="dash-hero">
        <div>
          <p className="dash-date">Store owner dashboard</p>
          <h1>{title}</h1>
        </div>
        <StarRating value={average} />
      </div>

      <div className="dash-grid">
        <section className="panel span-4" aria-labelledby="avg-h">
          <div className="panel-head">
            <h2 id="avg-h">Average rating</h2>
            <span className="muted">
              {total} {total === 1 ? "rating" : "ratings"}
            </span>
          </div>
          <Gauge value={average} label="Average rating" />
        </section>

        <div className="span-4">
          <StatTile
            tone="accent"
            label="Ratings received"
            value={total}
            spark={days.map((day) => day.value)}
            note={`${weekTotal} in the last 7 days`}
          />
        </div>
        <div className="span-4">
          <StatTile
            label="Share of 5 star ratings"
            value={fiveStarShare}
            suffix="%"
            note="Percent of all ratings"
          />
        </div>

        <section className="panel span-7" aria-labelledby="trend-h">
          <div className="panel-head">
            <h2 id="trend-h">Ratings over time</h2>
            <span className="muted">Last 14 days</span>
          </div>
          <AreaChart
            title="Ratings received per day"
            points={days.map((day) => ({ label: formatDay(day.date), value: day.value }))}
          />
        </section>

        <section className="panel span-5" aria-labelledby="dist-h">
          <div className="panel-head">
            <h2 id="dist-h">Rating breakdown</h2>
            <span className="muted">{user.name.split(" ")[0]}&apos;s store</span>
          </div>
          <ColumnChart
            title="Number of ratings for each score from 1 to 5"
            items={SCORES.map((score) => ({
              label: `${score}★`,
              value: ratings.filter((row) => Number(row.rating) === score).length,
            }))}
          />
        </section>

        {stores.length > 1 && (
          <section className="panel span-12" aria-labelledby="stores-h">
            <div className="panel-head">
              <h2 id="stores-h">Your stores</h2>
            </div>
            <BarList
              max={5}
              items={stores.map((store) => ({
                label: store.name,
                value: Number(store.average_rating),
                display: Number(store.average_rating).toFixed(1),
              }))}
            />
          </section>
        )}

        <section className="span-12" aria-labelledby="ratings-h">
          <h2 id="ratings-h" className="mb-5">
            Ratings received
          </h2>
          {total === 0 ? (
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
    </>
  );
}

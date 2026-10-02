import { Link } from "react-router-dom";
import Alert from "../../components/Alert";
import AreaChart from "../../components/charts/AreaChart";
import BarList from "../../components/charts/BarList";
import ColumnChart from "../../components/charts/ColumnChart";
import StackedBar from "../../components/charts/StackedBar";
import StatTile from "../../components/charts/StatTile";
import Loading from "../../components/Loading";
import { useAsync } from "../../hooks/useAsync";
import { useAuth } from "../../hooks/useAuth";
import { getAdminDashboard } from "../../services/api";
import { fillDays, formatDay, scoreCounts } from "../../utils/chartData";

const ROLE_SEGMENTS = [
  { role: "USER", label: "Users", color: "var(--cat-1)" },
  { role: "STORE_OWNER", label: "Store owners", color: "var(--cat-2)" },
  { role: "ADMIN", label: "Administrators", color: "var(--cat-3)" },
];

const today = new Date().toLocaleDateString(undefined, {
  weekday: "long",
  month: "long",
  day: "numeric",
});

export default function AdminDashboard() {
  const { user } = useAuth();
  const { data, error, loading } = useAsync(getAdminDashboard);
  const stats = data?.data;

  let body = null;

  if (stats) {
    const days = fillDays(stats.ratingsPerDay);
    const roleCounts = new Map(stats.usersByRole.map((row) => [row.role, Number(row.count)]));
    const weekTotal = days.slice(-7).reduce((sum, day) => sum + day.value, 0);

    body = (
      <div className="dash-grid">
        <div className="span-4">
          <StatTile
            tone="accent"
            label="Ratings submitted"
            value={stats.totalRatings}
            spark={days.map((day) => day.value)}
            note={`${weekTotal} in the last 7 days`}
          />
        </div>
        <div className="span-4">
          <StatTile label="Registered users" value={stats.totalUsers} note="All roles" />
        </div>
        <div className="span-4">
          <StatTile label="Stores listed" value={stats.totalStores} note="Rated or not yet rated" />
        </div>

        <section className="panel span-8" aria-labelledby="trend-h">
          <div className="panel-head">
            <h2 id="trend-h">Ratings per day</h2>
            <span className="muted">Last 14 days</span>
          </div>
          <AreaChart
            title="Ratings submitted per day"
            points={days.map((day) => ({ label: formatDay(day.date), value: day.value }))}
          />
        </section>

        <section className="panel span-4" aria-labelledby="roles-h">
          <div className="panel-head">
            <h2 id="roles-h">Who is on the platform</h2>
          </div>
          <StackedBar
            title="Accounts by role"
            segments={ROLE_SEGMENTS.map((segment) => ({
              label: segment.label,
              color: segment.color,
              value: roleCounts.get(segment.role) || 0,
            }))}
          />
        </section>

        <section className="panel span-5" aria-labelledby="dist-h">
          <div className="panel-head">
            <h2 id="dist-h">How people rate</h2>
            <span className="muted">Ratings per score</span>
          </div>
          <ColumnChart
            title="Number of ratings for each score from 1 to 5"
            items={scoreCounts(stats.ratingsByScore).map((item) => ({
              label: `${item.score}★`,
              value: item.count,
            }))}
          />
        </section>

        <section className="panel span-7" aria-labelledby="top-h">
          <div className="panel-head">
            <h2 id="top-h">Top rated stores</h2>
            <Link to="/admin/stores">All stores</Link>
          </div>
          {stats.topStores.length === 0 ? (
            <p className="muted">No store has been rated yet.</p>
          ) : (
            <BarList
              max={5}
              items={stats.topStores.map((store) => ({
                label: store.name,
                value: Number(store.average),
                display: Number(store.average).toFixed(1),
                note: `${store.ratingCount} ${Number(store.ratingCount) === 1 ? "rating" : "ratings"}`,
              }))}
            />
          )}
        </section>
      </div>
    );
  }

  return (
    <>
      <div className="dash-hero">
        <div>
          <p className="dash-date">{today}</p>
          <h1>Welcome back, {user.name.split(" ")[0]}</h1>
        </div>
        <div className="page-actions">
          <Link className="btn btn-secondary" to="/admin/users">
            Manage users
          </Link>
          <Link className="btn btn-primary" to="/admin/stores">
            Manage stores
          </Link>
        </div>
      </div>
      <Alert>{error}</Alert>
      {loading && !data && <Loading label="Loading dashboard" />}
      {body}
    </>
  );
}

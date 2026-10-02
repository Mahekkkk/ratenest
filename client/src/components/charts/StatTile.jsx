import CountUp from "../CountUp";
import { useInView } from "../../hooks/useInView";

const W = 120;
const H = 36;

function Sparkline({ values, play }) {
  const max = Math.max(...values, 1);
  const x = (i) => 3 + (i / Math.max(values.length - 1, 1)) * (W - 6);
  const y = (v) => H - 4 - (v / max) * (H - 10);
  const d = values.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");

  return (
    <svg className={`spark${play ? " in" : ""}`} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      <path d={d} pathLength="1" />
      <circle cx={x(values.length - 1)} cy={y(values[values.length - 1])} r="3.5" />
    </svg>
  );
}

/** Headline figure: label, counted-up value and an optional trend sparkline. */
export default function StatTile({ label, value, decimals = 0, suffix = "", spark, note, tone }) {
  const [ref, inView] = useInView({ threshold: 0.4 });

  return (
    <div className={`tile${tone ? ` tile-${tone}` : ""}`} ref={ref}>
      <p className="tile-label">{label}</p>
      <p className="tile-value">
        <CountUp to={Number(value)} decimals={decimals} start={inView} />
        {suffix}
      </p>
      <div className="tile-foot">
        {note && <span className="muted">{note}</span>}
        {spark && <Sparkline values={spark} play={inView} />}
      </div>
    </div>
  );
}

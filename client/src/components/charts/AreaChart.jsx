import { useState } from "react";
import { useInView } from "../../hooks/useInView";

const W = 640;
const H = 240;
const M = { l: 36, r: 20, t: 16, b: 30 };
const PLOT_W = W - M.l - M.r;
const PLOT_H = H - M.t - M.b;

/**
 * Single-series area/line chart. points: [{ label, value }].
 * Draws in once visible; hover shows a crosshair and tooltip. A table view is included for screen readers.
 */
export default function AreaChart({ points, unit = "ratings", title }) {
  const [ref, inView] = useInView({ threshold: 0.3 });
  const [hover, setHover] = useState(null);

  const max = Math.max(...points.map((point) => point.value), 1);
  const yMax = Math.max(4, Math.ceil(max / 4) * 4);
  const x = (index) => M.l + (points.length < 2 ? 0 : (index / (points.length - 1)) * PLOT_W);
  const y = (value) => M.t + PLOT_H - (value / yMax) * PLOT_H;

  const line = points.map((point, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(point.value).toFixed(1)}`).join(" ");
  const area = `${line} L${x(points.length - 1)} ${M.t + PLOT_H} L${x(0)} ${M.t + PLOT_H} Z`;
  const ticks = [0, 1, 2, 3, 4].map((step) => (yMax / 4) * step);
  const last = points[points.length - 1];
  const active = hover === null ? null : points[hover];

  const handleMove = (event) => {
    const box = event.currentTarget.getBoundingClientRect();
    const px = ((event.clientX - box.left) / box.width) * W;
    const index = Math.round(((px - M.l) / PLOT_W) * (points.length - 1));
    setHover(Math.min(Math.max(index, 0), points.length - 1));
  };

  return (
    <figure className={`chart${inView ? " in" : ""}`} ref={ref}>
      {title && <figcaption className="chart-title">{title}</figcaption>}
      <div className="chart-box" onPointerMove={handleMove} onPointerLeave={() => setHover(null)}>
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${title || "Chart"}: ${points.map((p) => `${p.label} ${p.value}`).join(", ")}`}>
          {ticks.map((tick) => (
            <g key={tick}>
              <line className="grid" x1={M.l} x2={W - M.r} y1={y(tick)} y2={y(tick)} />
              <text className="axis" x={M.l - 8} y={y(tick) + 4} textAnchor="end">
                {tick}
              </text>
            </g>
          ))}
          {points.map((point, i) =>
            (i % 3 === 0 && points.length - 1 - i >= 2) || i === points.length - 1 ? (
              <text key={point.label} className="axis" x={x(i)} y={H - 8} textAnchor={i === 0 ? "start" : i === points.length - 1 ? "end" : "middle"}>
                {point.label}
              </text>
            ) : null,
          )}
          <path className="area" d={area} />
          <path className="line" d={line} pathLength="1" />
          {active && <line className="crosshair" x1={x(hover)} x2={x(hover)} y1={M.t} y2={M.t + PLOT_H} />}
          <circle className="end-dot" cx={x(points.length - 1)} cy={y(last.value)} r="5" />
          {active && <circle className="end-dot" cx={x(hover)} cy={y(active.value)} r="5" />}
        </svg>
        {active && (
          <div className="chart-tip" style={{ left: `${(x(hover) / W) * 100}%`, top: `${(y(active.value) / H) * 100}%` }}>
            <strong>{active.value}</strong> {unit}
            <span>{active.label}</span>
          </div>
        )}
      </div>
      <table className="sr-only">
        <caption>{title}</caption>
        <thead>
          <tr>
            <th>Day</th>
            <th>{unit}</th>
          </tr>
        </thead>
        <tbody>
          {points.map((point) => (
            <tr key={point.label}>
              <td>{point.label}</td>
              <td>{point.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

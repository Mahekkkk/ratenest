import { useState } from "react";
import { useInView } from "../../hooks/useInView";

const W = 420;
const H = 220;
const M = { l: 32, r: 8, t: 22, b: 30 };
const BAR = 24;

/** Rounded only at the data end (top), square on the baseline. */
const barPath = (cx, top, bottom) => {
  const left = cx - BAR / 2;
  const right = cx + BAR / 2;
  const r = Math.min(4, Math.max(bottom - top, 0));
  if (bottom - top <= 0) return "";
  return `M${left} ${bottom} V${top + r} Q${left} ${top} ${left + r} ${top} H${right - r} Q${right} ${top} ${right} ${top + r} V${bottom} Z`;
};

/** items: [{ label, value }]. Columns grow from the baseline when scrolled into view. */
export default function ColumnChart({ items, title, unit = "ratings" }) {
  const [ref, inView] = useInView({ threshold: 0.3 });
  const [hover, setHover] = useState(null);

  const max = Math.max(...items.map((item) => item.value), 1);
  const yMax = Math.max(4, Math.ceil(max / 4) * 4);
  const band = (W - M.l - M.r) / items.length;
  const plotH = H - M.t - M.b;
  const y = (value) => M.t + plotH - (value / yMax) * plotH;
  const ticks = [0, 1, 2, 3, 4].map((step) => (yMax / 4) * step);

  return (
    <figure className={`chart${inView ? " in" : ""}`} ref={ref}>
      {title && <figcaption className="chart-title">{title}</figcaption>}
      <div className="chart-box">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${title}: ${items.map((i) => `${i.label} ${i.value}`).join(", ")}`}>
          {ticks.map((tick) => (
            <g key={tick}>
              <line className="grid" x1={M.l} x2={W - M.r} y1={y(tick)} y2={y(tick)} />
              <text className="axis" x={M.l - 8} y={y(tick) + 4} textAnchor="end">
                {tick}
              </text>
            </g>
          ))}
          {items.map((item, i) => {
            const cx = M.l + band * i + band / 2;
            return (
              <g key={item.label} onPointerEnter={() => setHover(i)} onPointerLeave={() => setHover(null)}>
                <rect className="hit" x={cx - band / 2} y={M.t} width={band} height={plotH} />
                <path
                  className={`col${hover === i ? " hot" : ""}`}
                  d={barPath(cx, y(item.value), y(0))}
                  style={{ "--i": i }}
                />
                {item.value > 0 && (
                  <text className="value" x={cx} y={y(item.value) - 6} textAnchor="middle" style={{ "--i": i }}>
                    {item.value}
                  </text>
                )}
                <text className="axis" x={cx} y={H - 8} textAnchor="middle">
                  {item.label}
                </text>
              </g>
            );
          })}
        </svg>
        {hover !== null && (
          <div className="chart-tip" style={{ left: `${((M.l + band * hover + band / 2) / W) * 100}%`, top: `${(y(items[hover].value) / H) * 100}%` }}>
            <strong>{items[hover].value}</strong> {unit}
            <span>{items[hover].label}</span>
          </div>
        )}
      </div>
    </figure>
  );
}

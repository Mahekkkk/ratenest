import { useInView } from "../../hooks/useInView";

/** Part-to-whole as one horizontal stacked bar with 2px gaps and a legend. segments: [{ label, value, color }]. */
export default function StackedBar({ segments, title }) {
  const [ref, inView] = useInView({ threshold: 0.3 });
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);

  return (
    <figure className={`chart${inView ? " in" : ""}`} ref={ref}>
      {title && <figcaption className="chart-title">{title}</figcaption>}
      <div className="stacked" role="img" aria-label={segments.map((s) => `${s.label} ${s.value}`).join(", ")}>
        {segments
          .filter((segment) => segment.value > 0)
          .map((segment, i) => (
            <span
              key={segment.label}
              title={`${segment.label}: ${segment.value}`}
              style={{ "--grow": segment.value / total, "--color": segment.color, "--i": i }}
            />
          ))}
      </div>
      <ul className="legend">
        {segments.map((segment) => (
          <li key={segment.label}>
            <span className="legend-key" style={{ "--color": segment.color }} aria-hidden="true" />
            <span>{segment.label}</span>
            <strong>{segment.value}</strong>
            <span className="muted">{total ? Math.round((segment.value / total) * 100) : 0}%</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}

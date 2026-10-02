import { useInView } from "../../hooks/useInView";

/** Ranked horizontal bars. items: [{ label, value, display, note }]. Bars grow in turn once visible. */
export default function BarList({ items, max, title }) {
  const [ref, inView] = useInView({ threshold: 0.3 });
  const top = max ?? Math.max(...items.map((item) => item.value), 1);

  return (
    <figure className={`chart${inView ? " in" : ""}`} ref={ref}>
      {title && <figcaption className="chart-title">{title}</figcaption>}
      <ol className="barlist">
        {items.map((item, i) => (
          <li key={item.label}>
            <div className="barlist-head">
              <span className="barlist-label">{item.label}</span>
              {item.note && <span className="muted">{item.note}</span>}
            </div>
            <div className="barlist-row">
              <span className="barlist-track" aria-hidden="true">
                <span style={{ "--w": item.value / top, "--i": i }} />
              </span>
              <span className="barlist-value">{item.display ?? item.value}</span>
            </div>
          </li>
        ))}
      </ol>
    </figure>
  );
}

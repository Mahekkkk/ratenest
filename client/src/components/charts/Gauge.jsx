import CountUp from "../CountUp";
import { useInView } from "../../hooks/useInView";

const R = 80;
const ARC = `M ${100 - R} 100 A ${R} ${R} 0 0 1 ${100 + R} 100`;

/** Half-circle meter for a 0 to max score. The arc sweeps and the number counts up when visible. */
export default function Gauge({ value, max = 5, label }) {
  const [ref, inView] = useInView({ threshold: 0.4 });
  const share = Math.min(Math.max(Number(value) / max, 0), 1);

  return (
    <div className={`gauge${inView ? " in" : ""}`} ref={ref} style={{ "--share": share }}>
      <svg viewBox="0 0 200 116" role="img" aria-label={`${label}: ${Number(value).toFixed(1)} out of ${max}`}>
        <path className="gauge-track" d={ARC} pathLength="1" />
        <path className="gauge-fill" d={ARC} pathLength="1" />
      </svg>
      <div className="gauge-read">
        <span className="gauge-number">
          <CountUp to={Number(value)} start={inView} />
        </span>
        <span className="gauge-of">out of {max}</span>
      </div>
    </div>
  );
}

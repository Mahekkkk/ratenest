import { useEffect, useState } from "react";
import { prefersReducedMotion } from "../hooks/useInView";

/** Counts from 0 to `to` once `start` is true. Shows the final value straight away for reduced motion. */
export default function CountUp({ to, start, decimals = 1, duration = 1200 }) {
  const [reduced] = useState(prefersReducedMotion);
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start || reduced) return undefined;

    let frame;
    const begin = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - begin) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(to * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start, reduced, to, duration]);

  return <>{(reduced ? to : value).toFixed(decimals)}</>;
}

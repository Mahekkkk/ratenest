import { useInView } from "../hooks/useInView";

/** Fades and lifts its content into place when scrolled into view. `delay` is in ms. */
export default function Reveal({ as: Tag = "div", delay = 0, className = "", children, ...rest }) {
  const [ref, inView] = useInView();

  return (
    <Tag
      ref={ref}
      className={`reveal${inView ? " in" : ""} ${className}`.trim()}
      style={{ "--d": `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

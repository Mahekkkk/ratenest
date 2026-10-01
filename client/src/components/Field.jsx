import { useId } from "react";

/**
 * Labelled form control. `as` picks input (default), textarea or select.
 * Errors render below the control and are linked with aria-describedby.
 */
export default function Field({
  label,
  error,
  hint,
  as: Control = "input",
  children,
  className = "",
  ...controlProps
}) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [error && errorId, hint && hintId].filter(Boolean).join(" ");

  return (
    <div className={`field ${className}`.trim()}>
      <label htmlFor={id}>{label}</label>
      <Control
        id={id}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={describedBy || undefined}
        {...controlProps}
      >
        {children}
      </Control>
      {hint && !error && (
        <p className="field-hint" id={hintId}>
          {hint}
        </p>
      )}
      {error && (
        <p className="field-error" id={errorId}>
          {error}
        </p>
      )}
    </div>
  );
}

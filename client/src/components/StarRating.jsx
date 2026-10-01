const STAR_PATH =
  "M12 2.5l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.6l-5.9 3.1 1.2-6.6L2.5 9.5l6.6-.9z";

const STARS = [1, 2, 3, 4, 5];

function Star({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d={STAR_PATH} />
    </svg>
  );
}

/** Read-only rating. Supports fractions (4.3 fills 4 stars and 30% of the fifth). */
export default function StarRating({ value, showNumber = true }) {
  const rating = Number(value) || 0;
  const fill = `${Math.min(Math.max(rating / 5, 0), 1) * 100}%`;

  return (
    <span className="stars">
      <span className="stars-track" role="img" aria-label={`${rating.toFixed(1)} out of 5`}>
        {STARS.map((n) => (
          <Star key={n} className="star star-empty" />
        ))}
        <span className="stars-fill" style={{ width: fill }}>
          {STARS.map((n) => (
            <Star key={n} className="star star-full" />
          ))}
        </span>
      </span>
      {showNumber && (
        <span className="stars-number">{rating ? rating.toFixed(1) : "No ratings yet"}</span>
      )}
    </span>
  );
}

/** Interactive 1 to 5 picker built as a radio group so it works with the keyboard. */
export function RatingInput({ value, onChange, disabled, label = "Your rating" }) {
  return (
    <div className="rating-input" role="radiogroup" aria-label={label}>
      {STARS.map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          disabled={disabled}
          className={n <= (value || 0) ? "on" : ""}
          onClick={() => onChange(n)}
        >
          <Star className="star" />
        </button>
      ))}
    </div>
  );
}

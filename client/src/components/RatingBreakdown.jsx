/** Horizontal bars showing how many ratings each score (5 down to 1) received. */
export default function RatingBreakdown({ ratings }) {
  const total = ratings.length;
  const counts = [5, 4, 3, 2, 1].map((score) => ({
    score,
    count: ratings.filter((row) => Number(row.rating) === score).length,
  }));

  return (
    <ul className="breakdown" aria-label="Number of ratings per score">
      {counts.map(({ score, count }) => (
        <li key={score}>
          <span className="breakdown-score">
            {score} {score === 1 ? "star" : "stars"}
          </span>
          <span className="breakdown-bar" aria-hidden="true">
            <span style={{ width: total ? `${(count / total) * 100}%` : "0%" }} />
          </span>
          <span className="breakdown-count">{count}</span>
        </li>
      ))}
    </ul>
  );
}

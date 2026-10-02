const dayKey = (date) => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
};

/** Last `days` calendar days ending today, with zero for days that have no data. */
export function fillDays(rows, days = 14) {
  const counts = new Map(rows.map((row) => [row.day, Number(row.count)]));
  const result = [];

  for (let offset = days - 1; offset >= 0; offset--) {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    const key = dayKey(date);
    result.push({ key, date, value: counts.get(key) || 0 });
  }

  return result;
}

/** Same as fillDays, built from rating rows that carry a created_at timestamp. */
export function ratingsToDays(ratings, days = 14) {
  const counts = {};

  ratings.forEach((row) => {
    const key = dayKey(new Date(row.created_at));
    counts[key] = (counts[key] || 0) + 1;
  });

  return fillDays(
    Object.entries(counts).map(([day, count]) => ({ day, count })),
    days,
  );
}

export const formatDay = (date) =>
  date.toLocaleDateString(undefined, { month: "short", day: "numeric" });

export const SCORES = [1, 2, 3, 4, 5];

export function scoreCounts(rows) {
  const map = new Map(rows.map((row) => [Number(row.rating), Number(row.count)]));
  return SCORES.map((score) => ({ score, count: map.get(score) || 0 }));
}

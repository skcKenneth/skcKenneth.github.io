const DAILY_LIMIT = 100;

export function createQuotaTable(sql) {
  sql.exec(`CREATE TABLE IF NOT EXISTS quota (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    utc_day TEXT NOT NULL,
    used INTEGER NOT NULL
  )`);
}

export function reserveQuestion(sql, now = new Date()) {
  const today = now.toISOString().slice(0, 10);
  // The single conditional mutation reserves a slot before any AI inference.
  const reservations = sql.exec(`
    INSERT INTO quota (id, utc_day, used) VALUES (1, ?, 1)
    ON CONFLICT (id) DO UPDATE SET
      used = CASE WHEN quota.utc_day = excluded.utc_day THEN quota.used + 1 ELSE 1 END,
      utc_day = excluded.utc_day
    WHERE quota.utc_day < excluded.utc_day
      OR (quota.utc_day = excluded.utc_day AND quota.used < ?)
    RETURNING used
  `, today, DAILY_LIMIT).toArray();

  const tomorrow = Date.parse(`${today}T00:00:00Z`) + 86_400_000;
  return {
    admitted: reservations.length === 1,
    retryAfter: Math.ceil((tomorrow - now.getTime()) / 1000),
  };
}

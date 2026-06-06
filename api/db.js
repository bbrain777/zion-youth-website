const { neon } = require("@neondatabase/serverless");

function getSqlClient() {
  const connectionString =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL;

  if (!connectionString) {
    const error = new Error("Database connection string is missing.");
    error.statusCode = 503;
    throw error;
  }

  return neon(connectionString);
}

async function ensureTables() {
  const sql = getSqlClient();

  await sql`
    CREATE TABLE IF NOT EXISTS member_applications (
      id SERIAL PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      country TEXT NOT NULL,
      city TEXT NOT NULL,
      member_type TEXT NOT NULL,
      interest TEXT NOT NULL,
      goals TEXT NOT NULL,
      availability TEXT,
      status TEXT NOT NULL DEFAULT 'new',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      organization TEXT,
      reason TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
}

function requireFields(body, fields) {
  const missing = fields.filter((field) => !String(body[field] || "").trim());
  if (missing.length) {
    const error = new Error(`Missing required field(s): ${missing.join(", ")}`);
    error.statusCode = 400;
    throw error;
  }
}

function sendError(response, error) {
  const status = error.statusCode || 500;
  const isConfigError =
    status === 503 ||
    /DATABASE|POSTGRES|database|connection|connect|fetch failed/i.test(error.message || "");

  response.status(isConfigError ? 503 : status).json({
    error: isConfigError
      ? "Database is not connected yet. Add a Neon/Postgres DATABASE_URL environment variable in Vercel, then redeploy."
      : error.message || "Unexpected server error.",
  });
}

module.exports = {
  ensureTables,
  getSqlClient,
  requireFields,
  sendError,
};

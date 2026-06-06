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

CREATE INDEX IF NOT EXISTS member_applications_email_idx
  ON member_applications (email);

CREATE INDEX IF NOT EXISTS member_applications_status_idx
  ON member_applications (status);

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

CREATE INDEX IF NOT EXISTS contact_messages_status_idx
  ON contact_messages (status);

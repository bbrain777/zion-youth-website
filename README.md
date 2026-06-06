# ZION Youth Development Initiative

Responsive NGO website for ZION Youth with member sign-up and contact forms backed by Vercel serverless API routes.

## Pages

- `index.html` - mission, priorities, programs, and member access.
- `about.html` - organization story, values, and governance structure.
- `programs.html` - program pillars and participation model.
- `join.html` - member, volunteer, mentor, partner, and donor sign-up form.
- `donate.html` - donor interest and support areas.
- `contact.html` - partnership and inquiry form.

## Database Setup

The API routes use `@neondatabase/serverless` and expect a Postgres-compatible `DATABASE_URL`.

1. In Vercel, open the `zion-youth-website` project.
2. Go to `Storage` or the Vercel Marketplace.
3. Create or connect a Neon/Postgres database.
4. Make sure Vercel adds `DATABASE_URL` to Production, Preview, and Development.
5. Redeploy the site.

The tables are created automatically on first form submission. The manual schema is also available in:

`db/schema.sql`

## API Routes

- `POST /api/members` saves member applications to `member_applications`.
- `POST /api/contact` saves contact messages to `contact_messages`.

These routes intentionally do not store passwords. Member access is handled as an application/onboarding workflow. If full account login is needed later, add a real auth provider such as Clerk, Supabase Auth, or Auth.js rather than storing raw passwords.

## Local Notes

This site is mostly static HTML/CSS/JS. Vercel runs the API routes in production.

```bash
npm install
vercel dev
```

Without Postgres environment variables, the forms will show a database connection message instead of saving.

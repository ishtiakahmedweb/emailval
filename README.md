# Veriflow

**Industrial-grade email verification SaaS** — AI-powered spam trap detection, typo correction, and sender score protection.

Built with Next.js 16, Supabase, Drizzle ORM, Stripe, Upstash, Tailwind CSS v4, and shadcn/ui.

## Features

- **Real-time email verification** — Single email lookup via API or dashboard
- **Bulk processing** — Upload CSVs and verify thousands of emails asynchronously
- **AI-powered detection** — Spam trap identification, typo suggestion, role-based detection
- **Webhook delivery** — Receive verification results via HTTP callbacks with automatic retries
- **API keys** — Secure, scoped API keys for programmatic access
- **Billing & credits** — Stripe subscription management with usage-based credits
- **Rate limiting** — Upstash-based rate limiting on API routes

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Database | Supabase (Postgres) |
| ORM | Drizzle ORM |
| Auth | Supabase Auth |
| Payments | Stripe |
| Rate Limiting | Upstash Redis |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Language | TypeScript |

## Getting Started

### Prerequisites

- Node.js 20+
- Supabase project
- Stripe account
- Upstash Redis instance

### Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Upstash
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Auth
RESEND_API_KEY=           # Transactional emails
```

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database

Migrations are in `supabase/migrations/`. Apply to your Supabase project:

```bash
npx drizzle-kit migrate
```

## API

### Verify an email

```http
POST /api/v1/verify
X-API-Key: vf_xxxxx
Content-Type: application/json

{ "email": "user@example.com" }
```

### Response

```json
{
  "email": "user@example.com",
  "state": "deliverable",
  "score": 0.98,
  "stages": {
    "format": { "valid": true },
    "dns": { "hasMx": true, "mxRecords": ["mx.example.com"] },
    "smtp": { "status": "success" },
    "spamTrap": { "isSpamTrap": false, "confidence": 0.02 }
  },
  "latencyMs": 245
}
```

### Webhooks

Configure webhooks in the dashboard to receive verification results as they complete.

## Project Structure

```
src/
├── app/
│   ├── (marketing)/    # Public marketing pages
│   ├── api/v1/         # REST API routes
│   ├── auth/           # Auth pages (login, signup, etc.)
│   └── dashboard/      # Authenticated dashboard
├── components/
│   ├── dashboard/      # Dashboard UI components
│   ├── icons/          # SVG icon components
│   ├── marketing/      # Marketing page sections
│   └── ui/             # shadcn/ui primitives
├── lib/
│   ├── ai/             # AI verification stages
│   ├── db/             # Drizzle schema + client
│   ├── engine/         # Verification pipeline engine
│   ├── stripe/         # Stripe integration
│   ├── supabase/       # Supabase client helpers
│   └── webhook/        # Webhook delivery system
```

## License

MIT

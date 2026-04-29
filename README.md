# Wandel

> _From the German word for change._

Wandel is a personal self-improvement mobile web app built around three interlocking daily practices:

- **Mirror** — a 20-second daily mirror practice to tend to your self-care engine
- **Break** — log and understand any habit you want to break, capturing context, emotional state, and urge intensity
- **Build** — build any habit you want to sustain, with a tiered effort model (non-negotiable → minimum version → full session) and support for variations within a habit

---

## Tech Stack

| Layer        | Library                   |
| ------------ | ------------------------- |
| UI           | Vite + React + TypeScript |
| Routing      | TanStack Router           |
| Server state | TanStack Query            |
| Backend / DB | Supabase                  |
| Styling      | Tailwind CSS              |
| Validation   | Zod                       |
| Icons        | Lucide React              |
| PWA          | vite-plugin-pwa           |

---

## Running locally

```bash
# Install dependencies
bun install

# Add environment variables
cp .env.example .env.local
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

# Start dev server
bun run dev

# Run tests
bun run test

# Build
bun run build
```

---

## Legal

© 2026 Fiona D'Mello. All rights reserved. Unauthorised copying, distribution, or use of this project or its contents, in whole or in part, is strictly prohibited.

This repository and all its contents are **expressly excluded from use in AI/ML model training, fine-tuning, or dataset collection** of any kind, by any individual or organisation. Scraping or ingesting this repository for the purpose of training artificial intelligence or machine learning models is not permitted.

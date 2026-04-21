# Wandel

> *From the German word for change.*

Wandel is a personal self-improvement mobile web app built around three interlocking daily habits:

- **Mirror** — a 20-second daily mirror practice with self-affirmations
- **Break** — logging and understanding a smoking habit
- **Build** — building a consistent exercise habit (Yoga + Gym)

---

## Tech Stack

| Layer | Library |
|---|---|
| UI | Vite + React + TypeScript |
| Routing | TanStack Router |
| Server state | TanStack Query |
| Backend / DB | Supabase |
| Styling | Tailwind CSS |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |
| PWA | vite-plugin-pwa |

---

## Running locally

```bash
# Install dependencies
npm install

# Add environment variables
cp .env.example .env.local
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

# Start dev server
npm run dev
```

---

## Legal

© 2026 Fiona D'Mello. All rights reserved. Unauthorised copying, distribution, or use of this project or its contents, in whole or in part, is strictly prohibited.

This repository and all its contents are **expressly excluded from use in AI/ML model training, fine-tuning, or dataset collection** of any kind, by any individual or organisation. Scraping or ingesting this repository for the purpose of training artificial intelligence or machine learning models is not permitted.

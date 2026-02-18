# The Decision Code

Embeddable assessment tool and minimal API for collecting user responses and delivering personalized results.

## Contents

- **[Funnel-Strategy.md](Funnel-Strategy.md)** – Strategy overview and positioning
- **[READINESS-CHECK-DESIGN.md](READINESS-CHECK-DESIGN.md)** – Assessment dimensions, questions, scoring formula
- **decision-code/** – Static embeddable assessment (HTML, CSS, JS). See [decision-code/EMBEDDING.md](decision-code/EMBEDDING.md) for iframe/script embedding
- **api/** – Serverless handler for submissions (Resend or GoHighLevel, optional Supabase). See [api/README.md](api/README.md).
- **netlify/** – Netlify function wrapper; use when deploying to Netlify.

## Deploy on Netlify

1. Connect this repo to Netlify (Site settings → Build & deploy → Connect repository).
2. **Build:** Leave build command empty (or use a simple command). **Publish directory:** `.` (root). Netlify will serve the repo and run functions from `netlify/functions/`.
3. **Environment variables:** In Netlify → Site settings → Environment variables, add the same vars as in [api/README.md](api/README.md) (e.g. `EMAIL_PROVIDER`, `GHL_API_KEY`, `GHL_LOCATION_ID`, `GHL_CUSTOM_FIELD_SCORE_ID`, `GHL_CUSTOM_FIELD_RESULT_ID`, etc.).
4. **Submit endpoint:** After deploy, your API is at `https://<your-site>.netlify.app/.netlify/functions/submit-assessment`. Set `SUBMIT_ENDPOINT` in [decision-code/config.js](decision-code/config.js) to that URL, or override when embedding (see [decision-code/EMBEDDING.md](decision-code/EMBEDDING.md)).

Visiting the site root `/` redirects to `/decision-code/`. The old path `/readiness-check/` redirects to `/decision-code/` for backwards compatibility. To change that, edit [netlify.toml](netlify.toml).

## Deploy on Vercel (alternative)

1. Set `SUBMIT_ENDPOINT` to your API URL.
2. Deploy the `api/` folder to Vercel and set env vars per [api/README.md](api/README.md).
3. Host the `decision-code/` folder (e.g. on Vercel as static or on Netlify).

No build step required for the assessment (plain HTML/CSS/JS).

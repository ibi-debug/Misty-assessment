# Embedding the Misty Assessment

The assessment is a static page (HTML + CSS + JS). You can embed it on any landing page in two ways.

---

## 1. Iframe (simplest)

Host the contents of the `readiness-check/` folder at a URL (e.g. `https://yourdomain.com/readiness-check/` or a path on your Vercel/Netlify deploy). Then on your landing page:

```html
<iframe
  src="https://yourdomain.com/readiness-check/"
  title="Misty Assessment"
  width="100%"
  height="800"
  style="border: none; min-height: 800px;"
  loading="lazy"
></iframe>
```

**Wire-up:** The page inside the iframe uses `config.js`. Before you deploy, set `SUBMIT_ENDPOINT` in `readiness-check/config.js` to your API URL (e.g. `https://your-project.vercel.app/api/submit-assessment`). The iframe will then POST to that endpoint when the form is submitted.

---

## 2. Script + container (single-page feel)

If you prefer the assessment to render inside your existing page (no iframe), you can load the form markup via JS and inject it into a container. The assessment is currently built as a full page; to embed as a widget you would:

1. Copy `readiness-check/index.html` body content (from `<main id="readiness-check-root">` through `</main>`) into a JS string or template, or serve it as a fragment and fetch it.
2. On your landing page, include a container and scripts **in this order**:

```html
<div id="readiness-check-root"></div>

<script>
  window.READINESS_CHECK_CONFIG = {
    SUBMIT_ENDPOINT: 'https://your-project.vercel.app/api/submit-assessment'
  };
</script>
<link rel="stylesheet" href="https://yourdomain.com/readiness-check/styles.css">
<script src="https://yourdomain.com/readiness-check/app.js"></script>
```

3. Either inject the form HTML into `#readiness-check-root` with a small loader script, or use the full `index.html` in an iframe (option 1). Option 1 is recommended unless you need the assessment fully in-page for design reasons.

---

## Setting the submit endpoint

- **Iframe:** Edit `readiness-check/config.js` and set `SUBMIT_ENDPOINT` to your deployed API URL. Deploy the readiness-check folder with that change.
- **Override before script:** Define `window.READINESS_CHECK_CONFIG = { SUBMIT_ENDPOINT: 'https://...' };` in a script tag **before** loading `app.js`. The app uses this when present.

---

## API contract (for custom backends)

If you don’t use the provided serverless function, your endpoint must:

- Accept **POST** with **Content-Type: application/json**.
- Body shape: `{ name, email, phone, answers, resultType, resultCopy }` where `answers` is an object with keys `q1`–`q10` (values `"A"`|`"B"`|`"C"`|`"D"`). `resultType` is one of `pausedYes`|`overthinkingYes`|`almostYes`|`activatedYes`. `resultCopy` is the full result text for that archetype.
- Return **200** with a JSON body (e.g. `{ "ok": true }`) on success so the front-end shows the thank-you message. Return **4xx/5xx** and the front-end will show a generic error.

You can then process the payload (e.g. send the “what your score means” email yourself, store in your CRM, etc.).

/**
 * Readiness check config. Set SUBMIT_ENDPOINT to your deployed API URL so form submissions are sent there.
 * Examples:
 *   - Netlify:  'https://your-site.netlify.app/.netlify/functions/submit-readiness-check'
 *   - Vercel:   'https://your-project.vercel.app/api/submit-readiness-check'
 *   - Local:    'http://localhost:3000/api/submit-readiness-check'
 * If empty, the submit button will show a config error. When embedding, you can override this by
 * defining READINESS_CHECK_CONFIG before loading app.js (see EMBEDDING.md).
 */
(function (global) {
  global.READINESS_CHECK_CONFIG = {
    SUBMIT_ENDPOINT: 'http://localhost:3000/api/submit-readiness-check'
  };
})(typeof window !== 'undefined' ? window : this);

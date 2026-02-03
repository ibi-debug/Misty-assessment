/**
 * Assessment config. Set SUBMIT_ENDPOINT to your deployed API URL so form submissions are sent there.
 * Default: relative path so on Netlify the form POSTs to the same site's function (no "Failed to fetch").
 * Override when embedding or for local dev (see EMBEDDING.md).
 */
(function (global) {
  var origin = typeof window !== 'undefined' && window.location ? window.location.origin : '';
  global.READINESS_CHECK_CONFIG = {
    // Same-origin Netlify function; for local dev run "netlify dev" or override SUBMIT_ENDPOINT
    SUBMIT_ENDPOINT: origin ? origin + '/.netlify/functions/submit-assessment' : ''
  };
})(typeof window !== 'undefined' ? window : this);

/**
 * Serverless handler for Boss-Free Readiness Check submissions.
 * Expects: POST body { name, email, phone, dimensions, totalScore }.
 *
 * Email / CRM:
 * - Resend: RESEND_API_KEY, EMAIL_FROM. Sends the results email directly.
 * - GoHighLevel: GHL_API_KEY, GHL_LOCATION_ID, GHL_WORKFLOW_ID. Creates contact, adds to workflow;
 *   your GHL workflow sends the results email (use merge fields for score/result).
 *
 * Set EMAIL_PROVIDER=resend (default) or EMAIL_PROVIDER=ghl.
 * Optional: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY for storage.
 */

const THRESHOLD = 15;
// GHL v2 API (v1 rest.gohighlevel.com is deprecated; v2 uses Lead Connector)
const GHL_API_BASE = 'https://services.leadconnectorhq.com';
const GHL_API_VERSION = '2021-07-28';

function sanitizeString(str, maxLen = 500) {
  if (str == null || typeof str !== 'string') return '';
  return str.trim().slice(0, maxLen);
}

function validateBody(body) {
  const name = sanitizeString(body.name, 200);
  const email = sanitizeString(body.email, 254);
  const phone = sanitizeString(body.phone, 50);
  if (!name || !email || !phone) {
    return { ok: false, status: 400, message: 'Missing or invalid name, email, or phone.' };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, status: 400, message: 'Invalid email address.' };
  }
  const dimensions = body.dimensions;
  const totalScore = typeof body.totalScore === 'number' ? body.totalScore : parseFloat(body.totalScore);
  if (typeof dimensions !== 'object' || dimensions === null || typeof totalScore !== 'number' || isNaN(totalScore)) {
    return { ok: false, status: 400, message: 'Missing or invalid dimensions or totalScore.' };
  }
  return { ok: true, name, email, phone, dimensions, totalScore };
}

function getResultCopy(totalScore) {
  if (totalScore >= THRESHOLD) {
    return (
      'If you scored 15 or above, you\'re not dissatisfied — you\'re under-leveraged. ' +
      'Your results suggest you have room to explore leverage, options, and impact alongside your current life.'
    );
  }
  return (
    'Your score suggests you\'re in a season where stability or clarity in one area might matter most. ' +
    'There\'s no single right score — this is just a snapshot. When the time is right, you\'ll know.'
  );
}

async function sendEmail(resendApiKey, from, to, subject, html) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${resendApiKey}`,
    },
    body: JSON.stringify({ from, to, subject, html }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Resend error: ${res.status} ${text}`);
  }
}

function splitName(fullName) {
  const name = (fullName || '').trim();
  const space = name.indexOf(' ');
  if (space <= 0) return { firstName: name || 'Contact', lastName: '' };
  return { firstName: name.slice(0, space), lastName: name.slice(space + 1) };
}

function ghlHeaders(apiKey) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
    Version: GHL_API_VERSION,
  };
}

async function upsertGhlContact(apiKey, locationId, payload, resultCopy, customFieldScoreId, customFieldResultId) {
  const { firstName, lastName } = splitName(payload.name);
  const body = {
    locationId,
    firstName,
    lastName,
    email: payload.email,
    phone: payload.phone || '',
  };
  if (customFieldScoreId || customFieldResultId) {
    body.customFields = [];
    if (customFieldScoreId) body.customFields.push({ id: customFieldScoreId, value: String(payload.totalScore) });
    if (customFieldResultId) body.customFields.push({ id: customFieldResultId, value: resultCopy });
  }
  // Upsert: create or update by email (respects location "Allow Duplicate Contact" setting)
  const res = await fetch(`${GHL_API_BASE}/contacts/upsert`, {
    method: 'POST',
    headers: ghlHeaders(apiKey),
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`GHL upsert contact: ${res.status} ${text}`);
  }
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (_) {
    throw new Error(`GHL upsert contact: invalid response ${text.slice(0, 200)}`);
  }
  const contactId = (data.contact && data.contact.id) || data.id || (data.data && data.data.id);
  if (!contactId) {
    throw new Error(`GHL upsert contact: no contact id in response ${text.slice(0, 300)}`);
  }
  return contactId;
}

async function addGhlContactTags(apiKey, contactId, tags) {
  if (!tags || !tags.length) return;
  const res = await fetch(`${GHL_API_BASE}/contacts/${contactId}/tags`, {
    method: 'POST',
    headers: ghlHeaders(apiKey),
    body: JSON.stringify({ tags }),
  });
  if (!res.ok) {
    const text = await res.text();
    console.warn('GHL add tags:', res.status, text);
  }
}

async function addGhlContactToWorkflow(apiKey, contactId, workflowId) {
  const res = await fetch(`${GHL_API_BASE}/contacts/${contactId}/workflow/${workflowId}`, {
    method: 'POST',
    headers: ghlHeaders(apiKey),
    body: JSON.stringify({}),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`GHL add to workflow: ${res.status} ${text}`);
  }
}

async function storeSubmission(supabaseUrl, supabaseKey, payload) {
  const res = await fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/readiness_submissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      dimensions: payload.dimensions,
      total_score: payload.totalScore,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('Supabase insert error:', res.status, text);
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let payload;
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const validated = validateBody(body);
    if (!validated.ok) {
      return res.status(validated.status).json({ error: validated.message });
    }
    payload = validated;
  } catch (e) {
    return res.status(400).json({ error: 'Invalid JSON body.' });
  }

  const copy = getResultCopy(payload.totalScore);
  const emailProvider = (process.env.EMAIL_PROVIDER || 'resend').toLowerCase();

  if (emailProvider === 'ghl') {
    const ghlApiKey = process.env.GHL_API_KEY || process.env.GHL_ACCESS_TOKEN;
    const ghlLocationId = process.env.GHL_LOCATION_ID;
    const ghlWorkflowId = process.env.GHL_WORKFLOW_ID;
    if (!ghlApiKey || !ghlLocationId) {
      console.error('GHL: set GHL_API_KEY, GHL_LOCATION_ID');
      return res.status(500).json({ error: 'Server configuration error.' });
    }
    const ghlCustomFieldScoreId = process.env.GHL_CUSTOM_FIELD_SCORE_ID || '';
    const ghlCustomFieldResultId = process.env.GHL_CUSTOM_FIELD_RESULT_ID || '';
    try {
      const contactId = await upsertGhlContact(
        ghlApiKey,
        ghlLocationId,
        payload,
        copy,
        ghlCustomFieldScoreId || null,
        ghlCustomFieldResultId || null
      );
      await addGhlContactTags(ghlApiKey, contactId, ['Readiness Check']);
      if (ghlWorkflowId) {
        await addGhlContactToWorkflow(ghlApiKey, contactId, ghlWorkflowId);
      }
    } catch (err) {
      console.error('GHL error:', err.message || err);
      const msg = err && err.message ? String(err.message).slice(0, 200) : 'Unknown error';
      return res.status(500).json({
        error: 'Failed to send results. Please try again.',
        detail: msg,
      });
    }
  } else {
    const resendApiKey = process.env.RESEND_API_KEY;
    const emailFrom = process.env.EMAIL_FROM || 'Boss-Free Readiness <onboarding@resend.dev>';
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not set');
      return res.status(500).json({ error: 'Server configuration error.' });
    }
    const subject = 'Your Boss-Free Readiness results';
    const html = `
    <p>Hi ${sanitizeString(payload.name).replace(/</g, '&lt;')},</p>
    <p>Thanks for taking the readiness check. Here’s what your score means:</p>
    <p>${copy.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
    <p>No pitch — just clarity. When you’re ready to explore next steps, we’ll be here.</p>
    <p>— Boss-Free Blueprint</p>
  `;
    try {
      await sendEmail(resendApiKey, emailFrom, payload.email, subject, html);
    } catch (err) {
      console.error('Email send failed:', err);
      return res.status(500).json({ error: 'Failed to send results. Please try again.' });
    }
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (supabaseUrl && supabaseKey) {
    await storeSubmission(supabaseUrl, supabaseKey, payload);
  }

  return res.status(200).json({ ok: true, message: 'Results sent.' });
}

/**
 * Serverless handler for The Decision Code submissions.
 * Expects: POST body { name, email, phone, answers, resultType, resultCopy }.
 * (10 multiple-choice questions → one of 4 decision states.)
 *
 * Email / CRM:
 * - Resend: RESEND_API_KEY, EMAIL_FROM. Sends the results email directly.
 * - GoHighLevel: GHL_API_KEY, GHL_LOCATION_ID, GHL_WORKFLOW_ID. Creates contact, adds to workflow;
 *   your GHL workflow sends the results email (use merge fields for readiness_score = resultType, readiness_result = resultCopy).
 *
 * Set EMAIL_PROVIDER=resend (default) or EMAIL_PROVIDER=ghl.
 * Optional: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY for storage.
 */

// GHL v2 API (v1 rest.gohighlevel.com is deprecated; v2 uses Lead Connector)
const GHL_API_BASE = 'https://services.leadconnectorhq.com';
const GHL_API_VERSION = '2021-07-28';

const RESULT_TYPE_LABELS = {
  pausedYes: 'The Paused Yes',
  overthinkingYes: 'The Overthinking Yes',
  almostYes: 'The Almost Yes',
  activatedYes: 'The Activated Yes',
};

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
  const answers = body.answers;
  const resultType = sanitizeString(body.resultType, 50);
  const resultCopy = typeof body.resultCopy === 'string' ? body.resultCopy : '';
  if (typeof answers !== 'object' || answers === null) {
    return { ok: false, status: 400, message: 'Missing or invalid answers.' };
  }
  if (!resultType || !resultCopy) {
    return { ok: false, status: 400, message: 'Missing or invalid resultType or resultCopy.' };
  }
  return { ok: true, name, email, phone, answers, resultType, resultCopy };
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
  const scoreLabel = RESULT_TYPE_LABELS[payload.resultType] || payload.resultType;
  const body = {
    locationId,
    firstName,
    lastName,
    email: payload.email,
    phone: payload.phone || '',
  };
  if (customFieldScoreId || customFieldResultId) {
    body.customFields = [];
    if (customFieldScoreId) body.customFields.push({ id: customFieldScoreId, value: scoreLabel });
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

async function removeGhlContactTags(apiKey, contactId, tags) {
  if (!tags || !tags.length) return;
  const res = await fetch(`${GHL_API_BASE}/contacts/${contactId}/tags`, {
    method: 'DELETE',
    headers: ghlHeaders(apiKey),
    body: JSON.stringify({ tags }),
  });
  if (!res.ok) {
    const text = await res.text();
    console.warn('GHL remove tags:', res.status, text);
  }
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
  const res = await fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/assessment_submissions`, {
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
      answers: payload.answers,
      result_type: payload.resultType,
      result_copy: payload.resultCopy,
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

  const copy = payload.resultCopy;
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
      // Remove then re-add tag so "Contact Tag Added" fires every time (including resubmits)
      await removeGhlContactTags(ghlApiKey, contactId, ['The Decision Code']);
      await addGhlContactTags(ghlApiKey, contactId, ['The Decision Code']);
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
    const emailFrom = process.env.EMAIL_FROM || 'The Decision Code <onboarding@resend.dev>';
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not set');
      return res.status(500).json({ error: 'Server configuration error.' });
    }
    const subject = 'Your decision profile — The Decision Code';
    const copyEscaped = copy.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0; padding:0; font-family: 'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #f0f0f0; background-color: #000000;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px; background-color: #0d0d0d; border-radius: 12px; border: 1px solid rgba(178, 148, 82, 0.4);">
          <tr>
            <td style="padding: 28px 32px 24px 32px; border-bottom: 1px solid rgba(178, 148, 82, 0.35);">
              <h1 style="margin: 12px 0 0 0; font-size: 24px; font-weight: 700; color: #f0f0f0; letter-spacing: 0.02em; font-family: Georgia, serif;">Your decision profile</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 28px 32px 0 32px;">
              <p style="margin:0 0 16px 0; font-size: 17px; font-weight: 600; color: #f0f0f0;">Hi ${sanitizeString(payload.name).replace(/</g, '&lt;')},</p>
              <p style="margin:0 0 24px 0; font-size: 16px; color: #a8a8a8; line-height: 1.65;">Thanks for taking The Decision Code. Here's your decision profile:</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px 24px 32px;">
              <div style="background-color: rgba(255,255,255,0.04); border-radius: 12px; border-left: 3px solid #b29452; padding: 20px 24px; font-size: 15px; line-height: 1.65; color: #f0f0f0; white-space: pre-wrap;">${copyEscaped}</div>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px 32px 32px;">
              <p style="margin:0 0 24px 0; font-size: 16px; color: #a8a8a8; line-height: 1.65;">No pitch — just clarity. When you're ready to explore next steps, we'll be here.</p>
            </td>
          </tr>
        </table>
        <p style="margin: 28px 0 0 0; font-size: 12px; color: #666;">You received this because you completed The Decision Code.</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
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

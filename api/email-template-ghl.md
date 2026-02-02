# GoHighLevel workflow – results email template

Copy the template below into your GHL workflow **Send Email** (or **Send Template Email**) action. Replace the placeholders with your actual merge fields (e.g. `{{contact.first_name}}`, or your custom field merge tags for Readiness Score and Readiness Result).

---

## Subject line

```
Your Boss-Free Readiness results
```

Or with name: `Your readiness results, {{contact.first_name}}`

---

## HTML body (better design)

Use this in the **HTML body** field of your GHL Send Email action. Inline styles keep it consistent across email clients.

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Readiness Results</title>
</head>
<body style="margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a232e; background-color: #f0f4f8;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f4f8; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">
          <tr>
            <td style="padding: 32px 32px 24px 32px; border-bottom: 1px solid #eef2f6;">
              <p style="margin:0; font-size: 12px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #0d7ea0;">Boss-Free Blueprint</p>
              <h1 style="margin: 8px 0 0 0; font-size: 22px; font-weight: 700; color: #1a232e;">Your readiness results</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 28px 32px 0 32px;">
              <p style="margin:0 0 20px 0; font-size: 17px; color: #1a232e;">Hi {{contact.first_name}},</p>
              <p style="margin:0 0 24px 0; font-size: 16px; color: #5c6b7a;">Thanks for taking the readiness check. Here's what your score means.</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px 24px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f9fc; border-radius: 8px; border: 1px solid #c5e8f0;">
                <tr>
                  <td style="padding: 20px 24px;">
                    <p style="margin:0 0 4px 0; font-size: 12px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: #0d7ea0;">Your score</p>
                    <p style="margin:0; font-size: 28px; font-weight: 700; color: #0a647d;">{{contact.readiness_score}}</p>
                    <p style="margin: 12px 0 0 0; font-size: 14px; line-height: 1.6; color: #1a232e;">{{contact.readiness_result}}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px 32px 32px;">
              <p style="margin:0 0 24px 0; font-size: 16px; color: #5c6b7a;">No pitch — just clarity. When you're ready to explore next steps, we'll be here.</p>
              <p style="margin:0; font-size: 15px; font-weight: 600; color: #1a232e;">— Boss-Free Blueprint</p>
            </td>
          </tr>
        </table>
        <p style="margin: 24px 0 0 0; font-size: 12px; color: #8b99a6;">You received this because you completed the Boss-Free Readiness Check.</p>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## Plain text (if GHL uses plain text)

```
Hi {{contact.first_name}},

<p>Thanks for taking the readiness check. Here’s what your score means:</p>

Your score: {{contact.readiness_score}}

{{contact.readiness_result}}

<p>No pitch — just clarity. When you’re ready to explore next steps, we’ll be here.</p>

<p>— Boss-Free Blueprint</p>
```

---

## Plain text (if GHL uses plain text)

```
Hi {{contact.first_name}},

Thanks for taking the readiness check. Here's what your score means:

Your score: {{contact.readiness_score}}

{{contact.readiness_result}}

No pitch — just clarity. When you're ready to explore next steps, we'll be here.

— Boss-Free Blueprint
```

---

## Merge fields in GHL

- **Name:** Use your contact first-name field, e.g. `{{contact.first_name}}` or `{{contact.name}}`.
- **Readiness Score:** Use the merge field for your custom field “Readiness Score”. In GHL it may appear as `{{contact.readiness_score}}` or under Contact → Custom Fields when you insert merge field.
- **Readiness Result:** Use the merge field for your custom field “Readiness Result”, e.g. `{{contact.readiness_result}}`.

If your GHL template builder shows custom fields by ID, use the merge tag it gives you for:
- Readiness Score (ID: `Oa9hReGWuAnVS2jhXfBP`)
- Readiness Result (ID: `whZMIzlBx7lbIBjti2IG`)

The API writes the numeric score and the “what your score means” paragraph into those fields when it creates the contact, so they will appear in the email once the workflow runs.

# GoHighLevel workflow – Misty Assessment results email template

Copy the template below into your GHL workflow **Send Email** (or **Send Template Email**) action. Replace the placeholders with your actual merge fields (e.g. `{{contact.first_name}}`, or your custom field merge tags for Assessment Score and Assessment Result).

---

## Subject line

```
Your Misty Assessment results 🎯
```

Or with name: `Your assessment results, {{contact.first_name}}`

---

## HTML body (Misty brand: dark, gold, magenta)

Use this in the **HTML body** field of your GHL Send Email action. Matches the assessment: black background, cream text, gold accents, magenta signature. Inline styles for email clients.

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Misty Assessment Results</title>
</head>
<body style="margin:0; padding:0; font-family: 'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #f0f0f0; background-color: #000000;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px; background-color: #0d0d0d; border-radius: 12px; border: 1px solid rgba(178, 148, 82, 0.4);">
          <tr>
            <td style="padding: 28px 32px 24px 32px; border-bottom: 1px solid rgba(178, 148, 82, 0.35);">
              <p style="margin:0; font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #b29452;">Misty</p>
              <h1 style="margin: 12px 0 0 0; font-size: 24px; font-weight: 700; color: #f0f0f0; letter-spacing: 0.02em; font-family: Georgia, serif;">Your decision profile</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 28px 32px 0 32px;">
              <p style="margin:0 0 16px 0; font-size: 17px; font-weight: 600; color: #f0f0f0;">Hi {{contact.first_name}},</p>
              <p style="margin:0 0 24px 0; font-size: 16px; color: #a8a8a8; line-height: 1.65;">Thanks for taking the Say Yes Decision Filter. Here's your decision profile.</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px 24px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(255,255,255,0.04); border-radius: 12px; border-left: 3px solid #b29452;">
                <tr>
                  <td style="padding: 20px 24px;">
                    <p style="margin:0 0 4px 0; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #b29452;">Your result</p>
                    <p style="margin:0; font-size: 22px; font-weight: 700; color: #f0f0f0; font-family: Georgia, serif;">{{contact.readiness_score}}</p>
                    <p style="margin: 14px 0 0 0; font-size: 14px; line-height: 1.65; color: #f0f0f0;">{{contact.readiness_result}}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px 32px 32px;">
              <p style="margin:0 0 24px 0; font-size: 16px; color: #a8a8a8; line-height: 1.65;">No pitch — just clarity. When you're ready to explore next steps, we'll be here.</p>
              <p style="margin:0; font-size: 15px; font-weight: 700; color: #d12e6b;">— Misty</p>
            </td>
          </tr>
        </table>
        <p style="margin: 28px 0 0 0; font-size: 12px; color: #666;">You received this because you completed the Misty Assessment.</p>
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

Thanks for taking the assessment. Here's what your score means:

Your score: {{contact.readiness_score}}

{{contact.readiness_result}}

No pitch — just clarity. When you're ready to explore next steps, we'll be here.

— Misty
```

---

## Merge fields in GHL

- **Name:** Use your contact first-name field, e.g. `{{contact.first_name}}` or `{{contact.name}}`.
- **Readiness Score:** Use the merge field for your custom field “Readiness Score”. In GHL it may appear as `{{contact.readiness_score}}` or under Contact → Custom Fields when you insert merge field.
- **Readiness Result:** Use the merge field for your custom field “Readiness Result”, e.g. `{{contact.readiness_result}}`.

If your GHL template builder shows custom fields by ID, use the merge tag it gives you for:
- Readiness Score (ID: `vsUeR56sUm1BUos3PQm3`)
- Readiness Result (ID: `7neRXzoH0XeNKjVSgbmJ`)

The API writes the numeric score and the “what your score means” paragraph into those fields when it creates the contact, so they will appear in the email once the workflow runs.

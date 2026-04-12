# GoHighLevel workflow – The Decision Code results email template

Copy the template below into your GHL workflow **Send Email** (or **Send Template Email**) action. Replace the placeholders with your actual merge fields (e.g. `{{contact.first_name}}`, or your custom field merge tags for Assessment Score and Assessment Result).

**Brand:** Misty Lavertu — cream (#faf8f5), paper (#f5f2ef), burgundy accent (#691818), editorial typography. Inline styles for email clients.

---

## Subject line

```
Your Decision Code results
```

Or with name: `Your decision profile, {{contact.first_name}}`

---

## HTML body

Use this in the **HTML body** field of your GHL Send Email action.

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Decision Code Results</title>
</head>
<body style="margin:0; padding:0; font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 16px; line-height: 1.65; color: #1a1a1a; background-color: #faf8f5;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #faf8f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background-color: #f5f2ef; border: 1px solid rgba(26,26,26,0.12);">
          <tr>
            <td style="padding: 28px 32px 24px 32px; border-bottom: 1px solid rgba(26,26,26,0.12);">
              <p style="margin:0 0 6px 0; font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #691818;">The Decision Code</p>
              <h1 style="margin: 0; font-size: 28px; font-weight: 500; color: #1a1a1a; letter-spacing: -0.02em; font-family: Georgia, 'Times New Roman', serif; line-height: 1.1;">Your decision profile</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 28px 32px 0 32px;">
              <p style="margin:0 0 16px 0; font-size: 17px; font-weight: 600; color: #1a1a1a;">Hi {{contact.first_name}},</p>
              <p style="margin:0 0 24px 0; font-size: 16px; color: #4a342e; line-height: 1.65;">Thanks for taking The Decision Code. Here's your decision profile.</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px 24px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #faf8f5; border: 1px solid rgba(26,26,26,0.12); border-left: 3px solid #691818;">
                <tr>
                  <td style="padding: 20px 24px;">
                    <p style="margin:0 0 4px 0; font-size: 11px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #691818;">Your result</p>
                    <p style="margin:0; font-size: 24px; font-weight: 500; color: #1a1a1a; font-family: Georgia, 'Times New Roman', serif; line-height: 1.1;">{{contact.readiness_score}}</p>
                    <p style="margin: 14px 0 0 0; font-size: 15px; line-height: 1.65; color: #1a1a1a;">{{contact.readiness_result}}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px 32px 32px;">
              <p style="margin:0 0 24px 0; font-size: 16px; color: #4a342e; line-height: 1.65;">No pitch — just clarity. When you're ready to explore next steps, we'll be here.</p>
            </td>
          </tr>
        </table>
        <p style="margin: 28px 0 0 0; font-size: 12px; color: #4a342e; letter-spacing: 0.12em; text-transform: uppercase;">&copy; 2026 Misty Lavertu · Decision-Led Leadership</p>
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

Thanks for taking The Decision Code. Here's your decision profile.

Your result: {{contact.readiness_score}}

{{contact.readiness_result}}

No pitch — just clarity. When you're ready to explore next steps, we'll be here.

— Misty Lavertu
Decision-Led Leadership
```

---

## Merge fields in GHL

- **Name:** Use your contact first-name field, e.g. `{{contact.first_name}}` or `{{contact.name}}`.
- **Readiness Score:** Use the merge field for your custom field "Readiness Score". In GHL it may appear as `{{contact.readiness_score}}` or under Contact → Custom Fields when you insert merge field.
- **Readiness Result:** Use the merge field for your custom field "Readiness Result", e.g. `{{contact.readiness_result}}`.

If your GHL template builder shows custom fields by ID, use the merge tag it gives you for:
- Readiness Score (ID: `vsUeR56sUm1BUos3PQm3`)
- Readiness Result (ID: `7neRXzoH0XeNKjVSgbmJ`)

The API writes the score label and the result paragraph into those fields when it creates the contact, so they will appear in the email once the workflow runs.

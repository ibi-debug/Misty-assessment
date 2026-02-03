# Misty Assessment API

Serverless handler for the Misty Assessment. Deploy to Vercel (or use the `api/` folder with a Vercel-compatible host).

## How results are sent

Choose one:

- **Resend** (default) — API sends the results email directly. Set `EMAIL_PROVIDER=resend` (or omit it) and configure Resend below.
- **GoHighLevel** — API creates a contact in GHL and adds them to a workflow; your workflow in GHL sends the results email. Set `EMAIL_PROVIDER=ghl` and configure GHL below.

## Environment variables

### Resend (default)

| Variable | Required | Description |
|----------|----------|-------------|
| `EMAIL_PROVIDER` | No | Set to `resend` (default) to send email via Resend |
| `RESEND_API_KEY` | Yes (if Resend) | Resend API key for sending result emails |
| `EMAIL_FROM` | No | Sender address, e.g. `Misty Assessment <results@yourdomain.com>`. Defaults to Resend onboarding address |

### GoHighLevel

| Variable | Required | Description |
|----------|----------|-------------|
| `EMAIL_PROVIDER` | Yes | Set to `ghl` to use GoHighLevel |
| `GHL_API_KEY` or `GHL_ACCESS_TOKEN` | Yes | GoHighLevel API key (Private Integration Token or OAuth access token) |
| `GHL_LOCATION_ID` | Yes | Your GHL location (sub-account) ID |
| `GHL_WORKFLOW_ID` | No | If set, API adds the contact to this workflow. If not set, use a "Contact Created" trigger instead (see GoHighLevel setup). |
| `GHL_CUSTOM_FIELD_SCORE_ID` | No | Custom field ID in GHL for “Readiness Score” (so your email template can use it) |
| `GHL_CUSTOM_FIELD_RESULT_ID` | No | Custom field ID in GHL for “Readiness Result” (the “what your score means” text) |

### Optional storage

| Variable | Required | Description |
|----------|----------|-------------|
| `SUPABASE_URL` | No | Supabase project URL — if set with `SUPABASE_SERVICE_ROLE_KEY`, submissions are stored |
| `SUPABASE_SERVICE_ROLE_KEY` | No | Service role key for Supabase (required if you use storage) |

## Optional: Supabase storage

To store submissions, create this table in Supabase (SQL Editor):

```sql
create table if not exists assessment_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  answers jsonb not null,
  result_type text not null,
  result_copy text not null,
  created_at timestamptz default now()
);

-- Optional: enable RLS and allow service role only (no public insert)
alter table assessment_submissions enable row level security;

create policy "Service role can insert"
  on assessment_submissions for insert
  to service_role
  with check (true);

create policy "Service role can select"
  on assessment_submissions for select
  to service_role
  using (true);
```

Then set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in your deployment environment.

---

## GoHighLevel setup

### How GHL gets the results

The workflow does not receive the results in a separate call. **The API sends the score and result text when it creates the contact**, by writing them into the contact's **custom fields**:

1. Your serverless API receives the submission (name, email, phone, answers, resultType, resultCopy).
2. The front-end sends the decision profile result (one of four archetypes: The Paused Yes, The Overthinking Yes, The Almost Yes, The Activated Yes) and the full result copy.
3. It creates a contact in GHL in **one** request that includes name, email, phone, tag `Misty Assessment`, and (if you set the env vars) **custom field values**: Readiness Score = result type label (e.g. "The Paused Yes"), Readiness Result = full result copy.
4. It adds that contact to your workflow.
5. The workflow runs (e.g. "Contact Added to Workflow"). The "Send Email" action uses **merge fields** that read from the contact — e.g. `{{Contact.Readiness Score}}` and `{{Contact.Readiness Result}}`. Those values are the ones we just saved on the contact in step 3.

So GHL gets the results because they are **stored on the contact as custom field values** when the contact is created. The workflow email template uses the contact's merge fields to display them.

### When `EMAIL_PROVIDER=ghl`, the API:

1. Creates a contact in GoHighLevel with name, email, phone, tag `Misty Assessment`, and (if you set them) custom fields for score and result text.
2. If `GHL_WORKFLOW_ID` is set: adds that contact to that workflow. If not set: only creates the contact.

Your workflow in GHL should send the “results” email when a contact is added. For example:

1. In GHL, create a workflow with trigger **“Contact Added to Workflow”** (this workflow).
2. Add an action **“Send Email”** (or “Send Template Email”). In the email body use merge fields for the contact’s name and, if you created custom fields, the score and result (e.g. your GHL merge field for the custom field).
3. Copy the workflow ID from the workflow URL or settings and set `GHL_WORKFLOW_ID`.

To pass the score and result text into the email:

1. In GHL, create two custom fields for contacts (e.g. “Readiness Score” and “Readiness Result”) and note their IDs.
2. Set `GHL_CUSTOM_FIELD_SCORE_ID` and `GHL_CUSTOM_FIELD_RESULT_ID` to those IDs.
3. In your workflow email template, use the merge fields for those custom fields.

**API:** The handler uses the GoHighLevel **v2** API (`https://services.leadconnectorhq.com`, `Version: 2021-07-28`). Use a **Private Integration Token** (Sub-Account) or the location’s OAuth access token.

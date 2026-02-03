# Misty Assessment – Design Spec

This document defines the assessment dimensions, question copy, scale, and scoring formula. Change these values here to tweak the assessment without touching code.

---

## Scale

- **Per question:** 1–5 (Strongly disagree → Strongly agree).
- **Labels:** 1 = Strongly disagree, 2 = Disagree, 3 = Neutral, 4 = Agree, 5 = Strongly agree.

---

## Dimensions and Questions

### 1. Income flexibility

*Can they sustain a dip or invest in a side path?*

| # | Question |
|---|----------|
| 1.1 | I could adjust my spending for 6–12 months to pursue something new without jeopardizing my family’s security. |
| 1.2 | I have some savings or flexibility that would allow me to invest time or money in a side path. |
| 1.3 | My household could tolerate a temporary dip in income if it meant building toward something I believe in. |

### 2. Time autonomy

*Control over calendar and focus time.*

| # | Question |
|---|----------|
| 2.1 | I have at least 5–10 hours per week I could redirect toward something new without harming my current commitments. |
| 2.2 | I have some control over when and where I work (schedule, location, or both). |
| 2.3 | I could protect a few hours each week for learning or building something alongside my current role. |

### 3. Skill leverage

*Using existing skills for impact/income.*

| # | Question |
|---|----------|
| 3.1 | My skills could create value in more than one context (e.g. my employer and a side project or community). |
| 3.2 | I have experience or expertise that others would pay for or benefit from outside my current job. |
| 3.3 | I’m curious about ways to use what I already know in new settings rather than starting from zero. |

### 4. Risk tolerance

*Comfort with optionality, not recklessness.*

| # | Question |
|---|----------|
| 4.1 | I’m open to building something alongside my current role rather than an all-or-nothing leap. |
| 4.2 | I’m willing to try something new even if it might not work out. |
| 4.3 | I prefer exploring options and optionality over waiting for a single “perfect” moment. |

### 5. Mission alignment

*“Is this the ceiling?” fit.*

| # | Question |
|---|----------|
| 5.1 | I think about impact and optionality even when my current situation is generally fine. |
| 5.2 | I sometimes wonder whether there’s more I could do with my skills and time. |
| 5.3 | I’m drawn to the idea of building something that matters to me, not just earning a paycheck. |

**Total questions:** 15 (about 5–7 minutes at a calm pace).

---

## Scoring formula

1. **Per dimension:** Average of that dimension’s question responses (1–5). Round to one decimal if needed.
2. **Total score:** Sum of the five dimension averages.
   - **Range:** 5 (minimum) to 25 (maximum).
3. **Threshold (from strategy):** **15+** = “You’re not dissatisfied — you’re under-leveraged.”

### Example

- Income flexibility: 4.0  
- Time autonomy: 3.7  
- Skill leverage: 4.3  
- Risk tolerance: 3.3  
- Mission alignment: 4.0  
- **Total:** 19.3 → 15+, so message: “under-leveraged, not dissatisfied.”

---

## Result message (email)

- **If totalScore >= 15:** “If you scored 15 or above, you’re not dissatisfied — you’re under-leveraged.”
- **If totalScore < 15:** Short, neutral interpretation (e.g. “Your score suggests you’re in a season where stability or clarity in one area might matter most. There’s no single right score.”). No pitch; validation only.

---

## Payload sent to backend

```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "dimensions": {
    "incomeFlexibility": 4.0,
    "timeAutonomy": 3.7,
    "skillLeverage": 4.3,
    "riskTolerance": 3.3,
    "missionAlignment": 4.0
  },
  "totalScore": 19.3
}
```

Dimension keys must match the IDs used in the front-end (see `app.js`).

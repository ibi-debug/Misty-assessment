# The Decision Code (Design Spec)

This document defines the assessment questions, answer options, scoring, and result copy. Based on [Assessment.md](Assessment.md).

---

## Overview

- **Name:** The Decision Code Assessment
- **Format:** 10 multiple-choice questions, one option per question (A, B, C, or D).
- **Result:** One of 4 decision states (archetypes), determined by majority of answers.
- **Answer mapping:** A = Paused Yes, B = Overthinking Yes, C = Almost Yes, D = Activated Yes.

---

## Questions and Options

| # | Question | A (Paused) | B (Overthinking) | C (Almost) | D (Activated) |
|---|----------|------------|------------------|------------|---------------|
| 1 | An opportunity lights you up. 48 hours later, you're: | Still excited but haven't moved | Researching alternatives or gathering more info | Planning when you'll start | Already taking action |
| 2 | Right now, the biggest thing slowing your momentum is: | Fear of choosing wrong | Feeling like you need more clarity first | Starting things you don't finish | Honestly? Not much—I'm moving |
| 3 | Which statement lands hardest? | "I know what I want but I'm waiting to feel certain" | "I keep refining the plan instead of executing it" | "I start strong but lose steam" | "I move even when it's messy" |
| 4 | After making a big decision, you typically feel: | Relief... followed by doubt | Mentally exhausted | Energized... then pulled in other directions | Grounded and clear |
| 5 | When something doesn't work right away, your instinct is to: | Question whether you made the right call | Reopen the decision and reconsider options | Delay or deprioritize the next step | Adjust your approach and keep going |
| 6 | Someone asks about your big goal. You: | Keep it vague or say "I'm exploring" | Explain the concept but not what you're doing | Talk about your plan | Talk about what you're already building |
| 7 | How many decisions are you currently sitting on? | Too many to count | A few major ones | One that keeps coming back up | Very few—I decide quickly |
| 8 | Your relationship with confidence is: | I'm capable, but I wait for the "right time" | I trust logic more than intuition | I believe in myself but hesitate anyway | Confidence comes from taking action |
| 9 | Which sentence hits you in the chest? | "I'm waiting until I feel ready" | "I need to understand this better first" | "I know what to do—I just haven't done it" | "I decide, then I figure it out" |
| 10 | Finish this sentence instinctively: If I fully trusted myself, I would: | Stop waiting for permission | Decide faster and stop second-guessing | Actually follow through | Go all in without hesitation |

---

## Scoring

1. **Collect answers:** For each question, the user selects A, B, C, or D.
2. **Count:** Sum how many times the user chose A, B, C, and D across all 10 questions.
3. **Result:** The archetype with the **highest count** is the user's result. On a tie, use order of precedence: Paused > Overthinking > Almost > Activated (or pick first by array order).

Result types (keys for API):

- `pausedYes` — The Paused Yes
- `overthinkingYes` — The Overthinking Yes
- `almostYes` — The Almost Yes
- `activatedYes` — The Activated Yes

---

## Result Copy (for email and GHL)

Full copy for each archetype is in [Assessment.md](Assessment.md). The front-end and API use the same blocks; decode HTML entities (e.g. `&#39;` → `'`, `&quot;` → `"`) for plain text.

---

## Payload sent to backend

```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "answers": {
    "q1": "A",
    "q2": "B",
    "q3": "D",
    "q4": "A",
    "q5": "C",
    "q6": "D",
    "q7": "B",
    "q8": "D",
    "q9": "D",
    "q10": "D"
  },
  "resultType": "activatedYes",
  "resultCopy": "Full paragraph(s) for the assigned archetype…"
}
```

- **answers:** One of "A"|"B"|"C"|"D" per question q1–q10.
- **resultType:** One of `pausedYes` | `overthinkingYes` | `almostYes` | `activatedYes`.
- **resultCopy:** Full result text for that archetype (used in email and GHL custom field).

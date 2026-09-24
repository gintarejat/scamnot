# Scamnot: Crypto Job Scam Investigator

> An OSINT agent that investigates a company, job listing or URL across 7 areas using live web search. It returns a flagged/clear/unverified finding per area with sources. **The analyst gives the verdict**, and the tool exports an evidence report as a PDF.

**Live:** [scamnot.vercel.app](https://scamnot.vercel.app) · [How to use](https://scamnot.vercel.app/#how-to-use) · [Place in the AML OS](https://scamnot.vercel.app/#place-in-aml-os)

Part of the **[AML Operating System](https://ajatauaml.com/aml-operating-system.html)** · Layer 3, Customer lifecycle, and Layer 4, Control systems (adverse media).

---

## What it is

| | |
|---|---|
| **Category** | **AI agent** (read-only): the model decides what to search, runs web searches and compiles structured findings |
| **Users** | Job seekers checking an offer, and analysts doing a first-pass counterparty / KYB OSINT check |
| **Output** | 7-area evidence file with sources, a risk level, a human verdict stamp, and a PDF |

## Architecture

```
Browser (index.html, vanilla JS)
 ├─ Tabs: Case File (the tool) · How To Use · Place in AML OS
 ├─ Inputs: subject (company / job / URL) + optional supporting evidence
 ├─ runAgent(): request loop (up to 25 requests) → /api/claude
 │     resumes pause_turn when the server-side web search hits its limit
 ├─ parseReport(): extracts the JSON findings
 ├─ Renders the 7 step cards, sources, risk level
 ├─ Verdict buttons → stamp
 └─ jsPDF export
          │
Vercel serverless  api/claude.js
          ├─ in-memory rate limit: 5 investigations / IP / hour
          └─ adds ANTHROPIC_API_KEY → Anthropic Messages API
                (model claude-sonnet-4-6, max_tokens 8000,
                 web_search tool)
```

**The 7 areas (as the code runs them):**

| # | Area | Looks for |
|---|---|---|
| 01 | Job Listing Scan | unrealistic pay, vague role, free email, pressure |
| 02 | Company Registration | registry entry, date, directors, active/dissolved |
| 03 | Address Verification | residential / virtual office / commercial |
| 04 | Web Presence | domain age, cloned content |
| 05 | Personnel Background | verifiable recruiters / CEO profiles |
| 06 | Contact Method | WhatsApp/Telegram hiring, free-mail, mass CC |
| 07 | Adverse Media | "[company] scam / fraud / fake job" |

## What is code and what is AI

| Step | Done by |
|---|---|
| Choosing searches, reading pages, judging each area | **AI** (web search tool) |
| Status per area (flagged / clear / unknown) | **AI** |
| **Overall risk level (HIGH / MEDIUM / LOW)** | **AI.** Planned: a weighted score computed by code. |
| Rendering, case number, rate limit, PDF | **Code** |
| Verdict (Scam / Legitimate) | **Human** |

## AI inventory

| Field | Value |
|---|---|
| Purpose | Gather and summarise public information about a company or job offer |
| Data in | Subject text and optional evidence the user pastes |
| Data out | JSON: 7 findings, flags, sources, riskLevel, investigatorNote |
| Model | `claude-sonnet-4-6` with the Anthropic web search tool |
| Autonomy level | **Read-only**: searches the public web and changes nothing |
| Human gate | Verdict buttons. The analyst confirms or clears. |

## Known limitations

1. **No sanctions or PEP screening.** The code doesn't check any sanctions or PEP list, and the AML OS map shows both as not built. Planned.
2. **The AI sets the risk level.** It isn't reproducible: the same input can give a different level on a re-run.
3. **The model writes the source URLs itself** inside the JSON, so a URL can be wrong. Open them before relying on a finding. Planned: take them from the actual search results instead.
4. **Registry, domain age and address are checked by web search, not by APIs,** so results depend on what the search surfaces.
5. **The rate limit is in-memory,** so it resets when Vercel starts a new instance. The proxy also forwards the request body as-is, so a caller can choose the model and parameters; only the rate limit restricts it.
6. **Web search costs** are billed per search on top of tokens. Check current pricing.

Long investigations are handled: web search runs on Anthropic's side, and when its server-side loop reaches its limit the API stops with `pause_turn`. The browser loop sends the turn back unchanged and the API resumes it, within the 25-request cap.

## Setup

```bash
git clone https://github.com/gintarejat/scamnot
# Vercel → Environment Variables:
ANTHROPIC_API_KEY=sk-ant-...
```
The web search tool must be enabled for your Anthropic organisation (it's a console setting; check the current docs). No build step.

## Roadmap

A computed weighted score; a deterministic layer (Companies House API, RDAP, MX, OpenSanctions) before the agent; a narrower agent role (adverse-media entity resolution); a KYB mode; evidence pack v2; a re-check with a diff against the last run.

---
*Results are leads, not findings of fact. Not legal advice. Built by Gintarė Jatautytė · [ajatauaml.com](https://ajatauaml.com)*

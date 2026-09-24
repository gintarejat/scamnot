# ScamNot: AI-Powered Fraud Investigation Tool

**Live demo:** [scamnot.vercel.app](https://scamnot.vercel.app)

An interactive, AI-driven investigation tool for AML analysts, financial crime investigators, and compliance professionals. An AI agent runs live web searches across **7 investigation areas** and returns sourced findings for a company, job listing or URL. It is built for crypto job scams and first-pass counterparty checks. The analyst makes the call.

Built on Anthropic's Claude API. Deployed serverless via Vercel. Part of the [ajatau compliance automation suite](https://ajatauaml.com).

---

## The Problem It Solves

Fraud investigations are manual, scattered, and slow. Analysts check corporate registries, domain records, adverse media and social profiles separately. Most job scams use the same playbook: identity cloning, address mismatches, off-platform contact, upfront payment requests. The tool gathers that public evidence in one pass so the analyst can judge the pattern.

---

## The 7 investigation areas

The agent searches the web and reports on seven areas. For each one it returns a status (flagged / clear / unverified), a short summary, details, specific flags and source links.

| # | Area | What the agent looks for |
|---|---|---|
| 01 | **Job Listing Scan** | Company, role, salary, platform, email domain. Flags: unrealistic pay, vague role, free email, pressure tactics. |
| 02 | **Company Registration** | Registry entry (e.g. Companies House): registration date, address, directors, active or dissolved. Flags: recently registered, dissolved, not found. |
| 03 | **Address Verification** | Registered or listed address: residential, commercial or virtual office. |
| 04 | **Web Presence** | Website, domain age, cloned content, quality. |
| 05 | **Personnel Background** | Named recruiters or executives: verifiable profiles and industry history. Flags: thin, new or fake profiles. |
| 06 | **Contact Methods** | Mass-CC emails, WhatsApp/Telegram hiring, free email domains. |
| 07 | **Adverse Media** | Searches such as "[company] scam", "[company] fraud", "[company] fake job". |

The agent also suggests an overall risk level (HIGH / MEDIUM / LOW) and a short investigator note. **The verdict is not automatic:** the analyst reads the evidence and clicks *Confirm: Scam / Fraud* or *Clear: Appears Legitimate*.

---

## The case that started it: the WhiteBridge teardown (worked by hand)

A real employment scam circulated on LinkedIn, WeWorkRemotely, and RemoteOK offering "Junior Crypto Analyst & Trader" at $70k–$90k.

**Investigation output:**
- 🚩 **OpSec:** All recipients visible in CC field (mass target list, not recruitment)
- 🚩 **KYB:** Registered address ≠ website address. Corporate registry mismatch.
- 🚩 **Identity Cloning:** Company name identical to unrelated legitimate business. Hijacking search reputation.
- 🚩 **Digital Forensics:** Website is direct clone of Bear Bull Traders. Founder photos copied. Name changed from "Andrew Aziz" → "Aiden Razi."
- 🚩 **Communication:** HR contact via WhatsApp/Telegram only (no official email escalation path).
- 🚩 **Financial Ask:** "Send screenshot proving you have $200 in crypto before training starts."

**Verdict:** SCAM. No job. No company. Data harvesting operation designed to move conversations off-platform and extract funds.

**The point:** separate red flags cluster into a coherent fraud pattern. Each flag alone is suspicious; together they're diagnostic. This manual investigation is what the tool was built to speed up.

---

## Architecture

```
Browser (index.html, vanilla JS, jsPDF)
 ├─ Inputs: subject + optional supporting evidence
 ├─ runAgent(): request loop (up to 25 iterations) → /api/claude
 ├─ Parses the JSON findings and renders the 7 cards with sources
 ├─ Human verdict buttons → stamp
 └─ PDF export
        │
Vercel serverless  api/claude.js
 ├─ In-memory rate limit: 5 investigations per IP per hour
 └─ Adds ANTHROPIC_API_KEY → Anthropic Messages API
      model: claude-sonnet-4-6 · max_tokens: 8000 · Anthropic web search tool
```

**Data:** no database, no user accounts. Investigations are not stored by the app. The subject and any pasted evidence are sent to the Anthropic API.

---

## Deployment (Vercel)

1. Import the GitHub repo into Vercel.
2. Settings → Environment Variables → add `ANTHROPIC_API_KEY`.
3. Make sure web search is enabled for your Anthropic organisation (console setting).
4. Deploy. No build step: `index.html` is served as-is and `api/claude.js` runs as a serverless function.

---

## Usage

1. Open [scamnot.vercel.app](https://scamnot.vercel.app).
2. Enter the company, job listing or URL; optionally paste the email text, salary or where you found it.
3. Click **▶ Initiate Investigation** and wait while the agent searches (usually one to a few minutes).
4. Read each area's findings and open the sources.
5. Give your verdict and download the PDF report.

No signup, no stored data.

---

## Limitations

- **The AI suggests the risk level.** It is not a computed score and can differ between runs.
- **Source links are written by the model** in its answer. Open them before relying on a finding.
- **No sanctions or PEP list screening,** and no direct registry, WHOIS or blockchain API. Everything comes from web search results.
- **Rate limit is in-memory,** so it resets when Vercel starts a new instance.
- **Cost:** each run can use up to 8,000 output tokens plus several web searches, which are billed separately. Check current Anthropic pricing.
- OSINT is portfolio-grade, not a production compliance control.

---

## Files

- `index.html` — the whole application
- `api/claude.js` — Vercel proxy with rate limit
- `package.json`

---

## Author

**Gintarė Jatautytė** — AML analyst (25 months, Tier 1 Nordic bank) and AI compliance tool builder

**LinkedIn:** [gintare-jatautyte](https://www.linkedin.com/in/gintare-jatautyte-11a507397/)  
**Portfolio:** [ajatauaml.com](https://ajatauaml.com)  
**Email:** gintare@ajatauaml.com

---

## License

MIT (open source, use freely)

---

**Last updated:** 24 September 2026

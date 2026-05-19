# ScamNot: AI-Powered Fraud Investigation Tool

**Live demo:** [scamnot.vercel.app](https://scamnot.vercel.app)

An interactive, AI-driven investigation tool for AML analysts, financial crime investigators, and compliance professionals. Applies a **7-area structured methodology** to deconstruct sophisticated employment scams, synthetic identities, and crypto fraud through automated OSINT and Enhanced Due Diligence.

Built on Anthropic's Claude API. Deployed serverless via Vercel. Part of the [ajatau compliance automation suite](https://ajatauaml.com).

---

## The Problem It Solves

Fraud investigations are manual, scattered, and slow. Analysts cross-reference corporate registries, domain WHOIS records, adverse media, social media profiles, blockchain data, and regulatory databases—separately. Most scams use the same playbook: identity cloning, address mismatches, communication typology shifts, upfront payment requests. The pattern is recognizable. The tool recognizes it.

---

## The 7-Area Methodology

ScamNot structures investigations across seven linked areas:

1. **Operational Security (OpSec):** How the scam distributes itself (mass email lists, public job boards, LinkedIn recruitment spam). Red flag: visibility patterns that scale.
2. **Know Your Business (KYB) & Corporate Registry:** Does the registered entity match the claimed entity? Address alignment? Domain registration timeline? Jurisdiction mismatch?
3. **Digital Identity & Cloning:** Is the claimed person real? Do their credentials match across platforms? Are they cloning a legitimate person's photos, LinkedIn profile, or company structure?
4. **Website & Digital Forensics:** Is the site a copy-paste of a legitimate competitor? Reverse image search. CSS/source code cloning. Domain age vs. claimed business age.
5. **Communication Typologies:** How does the scammer communicate? Off-platform shifts (WhatsApp, Telegram before diligence complete)? Urgency language? Formal tone breaks?
6. **Financial Ask Patterns:** Does the request make sense? Upfront payment from candidates? Unusual fee structures? Crypto-only payment?
7. **Corroboration & Red Flag Weighting:** Which red flags cluster? Do they form a coherent scam pattern, or isolated oddities?

---

## Live Case Study: The WhiteBridge Teardown

A real employment scam circulated on LinkedIn, WeWorkRemotely, and RemoteOK offering "Junior Crypto Analyst & Trader" at $70k–$90k.

**Investigation output:**
- 🚩 **OpSec:** All recipients visible in CC field (mass target list, not recruitment)
- 🚩 **KYB:** Registered address ≠ website address. Corporate registry mismatch.
- 🚩 **Identity Cloning:** Company name identical to unrelated legitimate business. Hijacking search reputation.
- 🚩 **Digital Forensics:** Website is direct clone of Bear Bull Traders. Founder photos copied. Name changed from "Andrew Aziz" → "Aiden Razi."
- 🚩 **Communication:** HR contact via WhatsApp/Telegram only (no official email escalation path).
- 🚩 **Financial Ask:** "Send screenshot proving you have $200 in crypto before training starts."

**Verdict:** SCAM. No job. No company. Data harvesting operation designed to move conversations off-platform and extract funds.

**The point:** Seven discrete red flags cluster into a coherent fraud pattern. Each flag alone is suspicious. Together, they're diagnostic.

---

## Architecture

**Frontend:** Single-page HTML/CSS/JS artifact. Interactive form input. Real-time investigation flow.

**AI Engine:** Anthropic Claude API (`claude-opus-4-6` or `claude-sonnet-4-6`). Structures unstructured scam data. Generates investigation summaries with chain-of-thought reasoning.

**Backend:** Serverless via Vercel. Proxy file pattern (`api/investigate.js` or similar) routes API calls securely without exposing client-side keys.

**Data:** No persistence. Investigations are ephemeral (client-side processing). No database. No user accounts.

---

## Deployment (Vercel)

**Time:** 60–90 minutes from local repo to global edge deployment.

**Steps:**

1. **Initialize repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: ScamNot investigation tool"
   git branch -M main
   git remote add origin https://github.com/gintarejat/scamnot.git
   git push -u origin main
   ```

2. **Set up Vercel proxy** (if API calls needed from frontend)
   - Create `api/investigate.js` or `vercel.json` rewrite rules
   - Route frontend requests to Anthropic API without exposing `ANTHROPIC_API_KEY`
   - Example proxy pattern:
     ```javascript
     // api/investigate.js
     export default async function handler(req, res) {
       const { message } = req.body;
       const response = await fetch('https://api.anthropic.com/v1/messages', {
         method: 'POST',
         headers: {
           'x-api-key': process.env.ANTHROPIC_API_KEY,
           'content-type': 'application/json',
         },
         body: JSON.stringify({
           model: 'claude-opus-4-6',
           max_tokens: 2048,
           messages: [{ role: 'user', content: message }],
         }),
       });
       return res.status(200).json(response);
     }
     ```

3. **Configure environment**
   - Connect GitHub repo to Vercel dashboard
   - Settings → Environment Variables
   - Add `ANTHROPIC_API_KEY`
   - Deploy

4. **Test**
   - Open live URL
   - Test investigation flow
   - Verify Claude API responses render correctly

---

## Usage

1. **Open the tool:** [scamnot.vercel.app](https://scamnot.vercel.app)
2. **Input scam data:** Paste job posting, email, website URL, company name, or any fraud indicator
3. **Run investigation:** Tool applies 7-area methodology automatically
4. **Review output:** See structured findings, red flag weighting, and final verdict

**No signup. No data stored. No tracking.**

---

## Technical Notes

**API Integration:**
- Calls are synchronous (request → Claude processes → response renders)
- Timeout: 30 seconds (typical Claude response <10 seconds)
- Rate limiting: Set via Upstash Redis or Vercel edge middleware (10 req/IP/hour recommended to control costs)

**Cost:**
- Anthropic API is token-based. Typical investigation: 500–2,000 tokens (~$0.01–$0.05 per run)
- To minimize cost, consider storing investigation templates locally and only calling Claude for novel patterns

**Limitations:**
- No real-time blockchain lookups (would require Chainalysis/TRM Labs API integration—premium cost)
- No live web scraping (would require additional infrastructure)
- OSINT is demo-grade (suitable for interview/portfolio, not production compliance)

---

## Why This Tool Exists

This is a portfolio piece demonstrating:
- **AML domain knowledge** (fraud typology, OSINT, EDD)
- **AI integration** (Claude API, chain-of-thought reasoning, real-time processing)
- **Full-stack capability** (frontend UX, backend proxy, deployment)
- **Practitioner perspective** (built by someone who actually did investigations, not an ML engineer guessing)

It is not positioned as a commercial product. It is proof that I can take a domain problem (fraud investigation is slow) and build an interactive AI solution in <100 lines of code.

---

## Files

- `index.html` — Main application (single-file artifact)
- `api/investigate.js` — Vercel proxy (if deployed on Vercel)
- `vercel.json` — Deployment config

---

## Author

**Gintarė Jatautytė** — AML Officer (2 years Nordic Tier-1 bank) + AI compliance tool builder

**LinkedIn:** [gintare-jatautyte](https://www.linkedin.com/in/gintare-jatautyte-11a507397/)  
**Portfolio:** [ajatauaml.com](https://ajatauaml.com)  
**Email:** gintare@ajatauaml.com

---

## License

MIT (open source, use freely)

---

**Last updated:** 18 May 2026

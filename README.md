# Chat Forensics — Conversational Diagnostics & Relational Forensics

An AI-powered conversational diagnostics web application that analyzes messaging histories (WhatsApp iOS/Android, Telegram, iMessage, and text paste) to decode power dynamics, response latencies, initiation ratios, and the exact moments conversations shift.

## Key Features

1. **Deterministic Forensics Engine (Client-Side & Private):**
   - **Initiation Ratio:** Who starts threads after a lull (>4h gap).
   - **Response Latency:** Median and average response times.
   - **Word Volume Disparity:** Essay writer vs. one-line responder ratio.
   - **Double-Text Chasing:** Tracks consecutive follow-up messages sent into silence.
   - **Night Owl Index:** Messages sent between 11 PM and 5 AM.
   - **Curiosity Metric:** Question frequency per participant.

2. **Psychological Diagnostic Report:**
   - **Executive Verdict & Headline:** Direct, candid assessment of the relational dynamic.
   - **Power Balance & Leverage:** Quantitative breakdown of who holds leverage and why.
   - **The Inflection Point:** Highlights the exact week or period the conversational energy and responsiveness changed.
   - **Behavioral Patterns:** Contextual analysis of micro-tactics (e.g. *Conversational Life Support*, *Paced Detachment*, *The Monologue Trap*).
   - **Red & Green Flags:** Explicit side-by-side behavioral indicators.
   - **Actionable Guidance:** Tailored recommendations for both participants plus "The Bottom Line".

3. **Dual Execution Mode:**
   - **Instant Offline Mode:** Runs 100% locally with zero API keys or network requests using deterministic heuristics.
   - **Generative AI Mode:** Connects to Gemini 2.5 Flash via free API key entered directly in the web UI settings or `.env`.

4. **1-Click Preloaded Case Files:**
   - *The Fading Situationship* (Alex & Jordan)
   - *The One-Sided Friendship* (Sam & Taylor)
   - *Balanced Long-Term Best Friends* (Elena & Marcus)

5. **Shareable Social Story Card:**
   - Generates a sleek 9:16 card ready to share on Instagram Stories, TikTok, or Twitter.

## Getting Started

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev
```

Visit `http://localhost:5173` in your browser.

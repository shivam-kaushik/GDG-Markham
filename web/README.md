# TodoMarkham web prototype

Community event marketplace for Markham with Maple, an agentic event guide.

## Run

```bash
npm install
npm run dev          # site on http://localhost:5173
npm run server       # agent server on http://localhost:8787 (optional)
npm test             # unit tests
```

## How Maple works

Maple has two modes behind one chat. The chat shows which one is active ("Offline AI mode" or "AI live").

| | Offline AI mode (default) | Live AI mode |
|---|---|---|
| Needs | nothing | `GEMINI_API_KEY` in `web/.env`, and `npm run server` |
| Understanding | multilingual keyword lexicon in `src/agent/lexicon.ts` (en, yue, zh, ta, fa) | Gemini reads free text in any language |
| Tools | `src/agent/tools.ts` | the same tools, via Gemini function calling (`server/agentLoop.ts`) |
| Replies | translated templates | written by the model in the person's language |
| Events shown | only events returned by a tool | only events returned by a tool |

Copy `.env.example` to `.env` and add a key to switch to live mode. The server loop is covered by tests that use a stand-in model. It has not been run against the real Gemini API yet.

### Tools the agent can call
`search_events`, `rank_for_user`, `get_trending`, `get_event_details`, `transit_options`, and `propose_profile_update` (live mode only; the app asks the person to confirm before saving).

### Guardrails
- Scores come from code (`src/lib/scoring.ts`), not from the model. The model explains; it does not rank.
- Access evidence has three states: confirmed, estimated, unknown. Unknown never means "no".
- Disability needs are saved only after the person taps "Yes, save", or when they answer during onboarding, where every understood item appears as a chip they can remove.
- Maple never infers a condition the person did not state.

### Question planner
`src/agent/planner.ts` picks the next onboarding question by trying every answer and measuring how much the top five picks change. The question that changes them most is asked first.

### Voice
Uses the browser's Web Speech API in the person's language (`en-CA`, `yue-Hant-HK`, `zh-CN`, `ta-IN`, `fa-IR`). The transcript is sent as a normal message. Replies can be read aloud. Support depends on the browser; typing always works.

## Sample data
Events, ratings, reviews and conversations are made up (`src/data`). Venues are real places.

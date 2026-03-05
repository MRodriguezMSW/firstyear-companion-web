# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Create production build
npm run lint     # Run ESLint
npm start        # Start production server
```

No test framework is configured.

Requires `OPENAI_API_KEY` in `.env.local`.

## Architecture

Next.js 15 App Router application (TypeScript, React 19, Tailwind CSS 4).

**User flow:** `/` → `/onboarding/welcome` → `/onboarding/consent` → `/onboarding/identity` → `/onboarding/timeline` → `/onboarding/checkin` → `/chat`

All onboarding pages are `"use client"` components. Onboarding data is currently not persisted — it ends at the check-in page and the user proceeds to chat without carrying that context forward.

### Chat system

`app/chat/page.tsx` — Client component that maintains:
- `messages[]` — full conversation history sent to the API each turn
- `state` — conversation progression object `{ mode, topic, stage }` sent to and returned from the API
- `chips` — contextual quick-reply buttons returned by the API each turn

`app/api/chat/route.ts` — POST endpoint that wraps OpenAI (`gpt-4.1-mini`, `response_format: json_object`). Returns `{ reply, suggestions, state }`. The system prompt enforces trauma-informed tone, anti-loop conversation progression, and structured chip generation. A second guardrail system message is injected each turn to prevent the model from repeating its last question.

The chat client enforces a minimum 800ms delay before displaying the AI response to simulate natural typing pacing.

### Design conventions

- Dark slate theme: `slate-950` / `slate-900` backgrounds, `slate-100` text, `ring-white/10` borders
- All interactive surfaces use `ring-1 ring-white/10` — keep new UI consistent
- Chips render only after the latest assistant message; they clear on send

# Anthropic — Wall of Pride

A community-powered wall of support for Anthropic's decision to refuse the Pentagon's demands to remove AI safety guardrails.

**Live at [anthropic-wall-of-pride.vercel.app](https://anthropic-wall-of-pride.vercel.app)**

## What happened

The Pentagon demanded Anthropic remove two safety guardrails — the ban on AI-driven mass domestic surveillance and the requirement for human oversight on autonomous weapons. Anthropic refused. They were designated a "supply chain risk," and President Trump ordered all federal agencies to stop using their technology.

> "We cannot in good conscience accede to their request." — Dario Amodei, CEO of Anthropic

This page collects the tweets of people who stood with Anthropic.

## Features

- 43 curated tweets from industry leaders, politicians, journalists, and community members
- Anyone can submit their support tweet via the form — submissions are auto-reviewed by LLM and added to the wall
- Dynamic OG image for Twitter/social card previews
- Dark theme, 4-column masonry grid, responsive design

## Tech stack

- Single HTML file (no framework)
- Vercel serverless functions for the API
- Upstash Redis for storing community submissions
- OpenRouter (Gemini Flash) for auto-reviewing submissions
- Twitter embed widgets via `twttr.widgets.createTweet()`
- `@vercel/og` for dynamic OG image generation

## Development

```bash
npm install
npm run dev
```

Requires environment variables:
- `KV_REST_API_URL` — Upstash Redis REST URL
- `KV_REST_API_TOKEN` — Upstash Redis REST token
- `OPENROUTER_API_KEY` — OpenRouter API key for LLM review

## Credits

Made by [Aditya](https://x.com/adityavsc) with Claude.

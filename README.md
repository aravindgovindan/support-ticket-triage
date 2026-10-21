# Ticket Triage

A tiny web app that reads a support ticket and tells you its **category** and **urgency**.

Paste the ticket text into a textbox, hit submit, and the result appears below.

> **Note:** This is a hobby project for learning to work with [Jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev) and for sharpening my product management skills. It is not production software: no auth, no database, no error-handling polish.

## What it does

1. You enter the text of a support ticket.
2. The server sends it to an AI model for classification.
3. The UI shows the ticket's category and urgency.

Nothing is stored. Each request is handled and forgotten.

## Tech stack

- **Frontend:** React + TypeScript (Vite)
- **Backend:** Node.js + Express
- **AI:** [Jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev) by TypeSafe AI, a "System One" model that returns typed, structured decisions with confidence scores, plus [OpenRouter](https://openrouter.ai/) for LLM access

## Project structure

```
ticket-triage/
├── client/    # React UI: textbox, submit button, result section
└── server/    # Express API: POST /api/triage
```

## Running locally

```bash
# Backend
cd server
npm install
npm run dev

# Frontend (in a second terminal)
cd client
npm install
npm run dev
```

Create `server/.env` with your API keys (never commit this file):

```
OPENROUTER_API_KEY=your-key-here
JEV_API_KEY=your-key-here
```

## Status

Early stage. The UI is built with a placeholder result. API wiring and the Jev/OpenRouter integration come next.

## Goals

- Get hands-on with Jev and structured, probabilistic decisions
- Practice scoping, prioritizing, and shipping a small product end to end

## Ideas for later

- Store tickets and results (likely MongoDB)
- Show Jev's confidence scores in the UI
- Compare Jev against an OpenRouter LLM on the same tickets
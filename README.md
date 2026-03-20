# AI Text Summarizer

A minimal React web app built with **Vite** and **Tailwind CSS** that takes unstructured text and generates a structured, AI-powered summary using the **Google Gemini API** (`gemini-2.5-flash`).

![App Screenshot](./screenshot.png)

---

## Features

- 📝 **Concise Summary** — 2–3 sentence distillation of any input text
- 🔑 **Key Points** — three bullet-point takeaways
- 🎭 **Sentiment Badge** — positive / neutral / negative, color-coded

---

## Setup & Run

### 1. Install dependencies

```bash
npm install
```

### 2. Configure your API key

Create a `.env` file in the project root (use `.env.example` as a reference):

```bash
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

> Get a free API key at [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).  
> The `VITE_` prefix is required — Vite only exposes environment variables with this prefix to the browser bundle.

### 3. Start the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Design Decisions & AI Prompting

### Stack Choice
I chose **React + Vite + Tailwind CSS** over the original CLI approach to deliver a better user experience within the 1–2 hour time constraint. Vite offers near-instant HMR, and Tailwind keeps styling fast and consistent without a custom stylesheet overhead.

### Prompt Engineering
The model is instructed to return **only a raw JSON object** with no markdown, no code fences, and no surrounding text:

```json
{
  "summary": "...",
  "keyPoints": ["...", "...", "..."],
  "sentiment": "positive | neutral | negative"
}
```

Enforcing a strict schema makes frontend parsing deterministic and eliminates the need for complex response post-processing. A small cleanup step strips any accidental markdown fences in case the model deviates.

---

## Honest Trade-offs

> **Time constraint: 1–2 hours**

Due to the strict time limit, I made the **conscious decision to call the Gemini API directly from the React frontend** to deliver a working UI quickly.

**In a real production environment, this is not the correct approach.** The API key would be securely held in a **Node.js/Express backend**, which would:
- Proxy the Gemini request server-side, keeping the key out of the browser bundle
- Add rate limiting, input validation, and request logging
- Allow the frontend to remain fully decoupled from any AI provider specifics

This trade-off was made deliberately and with full awareness of the security implications.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| React 18 + Vite | UI framework & dev server |
| Tailwind CSS | Utility-first styling |
| `@google/genai` | Gemini API SDK |

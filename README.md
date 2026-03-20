# AI Text Summarizer CLI

A Node.js command-line tool that takes unstructured text and uses the **Gemini 2.5 Flash** API to return a clean, structured summary — including a one-sentence summary, three key points, and a sentiment classification.

---

## Setup & Installation

**1. Clone the repository and install dependencies:**

```bash
git clone https://github.com/your-username/ai-text-summarizer.git
cd ai-text-summarizer
npm install
```

**2. Create your `.env` file:**

```bash
cp .env.example .env
```

Then open `.env` and add your Gemini API key:

```
GEMINI_API_KEY=your_api_key_here
```

> Get a free API key at [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

---

## Usage

### From a text file

Pass any `.txt` file as an argument:

```bash
node index.js sample.txt
```

### Via stdin (pipe)

You can also pipe text directly from the terminal:

```bash
echo "Your text here" | node index.js
```

Or pipe from another command:

```bash
cat article.txt | node index.js
```

The tool will validate your input, call the Gemini API, and print a formatted summary to the console.

---

## Design Decisions & Prompt Engineering

### Model Choice: Gemini 2.5 Flash

I chose **Gemini 2.5 Flash** specifically for its combination of speed and reasoning capability. For a CLI tool where the user is waiting on a response, latency matters — Flash delivers high-quality results without the wait of heavier models.

### Strict JSON Output via Prompt Engineering

The core challenge with using an LLM for structured data is getting reliable, parseable output. I addressed this by designing the prompt to be explicit and restrictive:

- The model is instructed to return **only a raw JSON object** — no markdown fences, no preamble, no explanation.
- The required schema (`summary`, `keyPoints`, `sentiment`) is defined directly in the prompt with typed constraints (e.g., `sentiment` must be exactly one of `positive`, `neutral`, `negative`).
- As a safety net, the code also strips any accidental markdown code fences (` ```json `) before parsing, so the tool degrades gracefully even if the model misbehaves.

This approach keeps the parsing logic simple and the output predictable.

---

## Trade-offs & Scope

This tool was built within a strict **1–2 hour time limit**, so I made deliberate scoping decisions:

- **Prioritized a robust, working CLI** with clean error handling over building a web UI or a polished front-end. Every failure mode — missing API key, file not found, empty input, invalid JSON from the model — surfaces a clear, actionable error message.
- **Skipped CI/CD pipelines and automated tests.** With more time, I'd add a Jest test suite and a GitHub Actions workflow for linting and testing on push.
- **Single-file input only.** With more time, I would add **batch file processing** — accepting multiple file paths as arguments and summarizing each one in sequence, which is a natural extension of the current architecture.

The goal was a clean, honest implementation that demonstrates the core skill clearly, rather than a feature-bloated prototype.

---

## Example Output

```
<!-- Paste your terminal output here -->
```

---

## Requirements

- Node.js v18 or later (required for native ESM and async iterators)
- A valid Gemini API key

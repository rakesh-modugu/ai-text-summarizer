import { useState } from "react";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

const SENTIMENT_STYLES = {
  positive: {
    badge: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300",
    dot: "bg-emerald-500",
    label: "Positive",
  },
  negative: {
    badge: "bg-red-100 text-red-700 ring-1 ring-red-300",
    dot: "bg-red-500",
    label: "Negative",
  },
  neutral: {
    badge: "bg-slate-100 text-slate-600 ring-1 ring-slate-300",
    dot: "bg-slate-400",
    label: "Neutral",
  },
};

export default function App() {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleSummarize = async () => {
    if (!inputText.trim()) {
      setError("Please enter some text to summarize.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const prompt = `Analyze the following text and respond ONLY with a valid JSON object in this exact shape, with no markdown, no code fences, and no extra text:
{
  "summary": "A concise 2-3 sentence summary of the text.",
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3"],
  "sentiment": "positive | neutral | negative"
}

Text to analyze:
"""
${inputText}
"""`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const raw = response.text.trim();
      // Strip accidental markdown fences if the model adds them
      const cleaned = raw.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
      const parsed = JSON.parse(cleaned);
      setResult(parsed);
    } catch (err) {
      setError(
        err instanceof SyntaxError
          ? "The model returned an unexpected format. Please try again."
          : `Something went wrong: ${err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const sentimentKey = result?.sentiment?.toLowerCase();
  const sentimentStyle =
    SENTIMENT_STYLES[sentimentKey] ?? SENTIMENT_STYLES.neutral;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col items-center px-4 py-16">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 tracking-wide uppercase">
          ✦ Powered by Gemini
        </div>
        <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight mb-2">
          AI Text Summarizer
        </h1>
        <p className="text-slate-500 text-base max-w-md mx-auto">
          Paste any article, essay, or block of text and get an instant
          structured summary with key insights.
        </p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8 flex flex-col gap-5">
        {/* Textarea */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="input-text"
            className="text-sm font-semibold text-slate-700"
          >
            Your Text
          </label>
          <textarea
            id="input-text"
            rows={8}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your article, essay, or any block of text here…"
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
          />
          <span className="text-xs text-slate-400 text-right">
            {inputText.length} characters
          </span>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            <span className="mt-0.5">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSummarize}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 text-sm transition-all duration-200 shadow-md shadow-indigo-200"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                />
              </svg>
              Processing…
            </>
          ) : (
            "✦ Summarize Text"
          )}
        </button>
      </div>

      {/* Results Card */}
      {result && (
        <div className="w-full max-w-3xl mt-6 bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8 flex flex-col gap-7 animate-fade-in">
          {/* Summary */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">📝</span>
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                Summary
              </h2>
            </div>
            <p className="text-slate-700 text-base leading-relaxed bg-slate-50 rounded-xl p-4 border border-slate-100">
              {result.summary}
            </p>
          </div>

          <hr className="border-slate-100" />

          {/* Key Points */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🔑</span>
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                Key Points
              </h2>
            </div>
            <ul className="flex flex-col gap-2.5">
              {result.keyPoints?.map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 mt-0.5 h-5 w-5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-slate-700 text-sm leading-relaxed">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <hr className="border-slate-100" />

          {/* Sentiment */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🎭</span>
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                Sentiment
              </h2>
            </div>
            <span
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-semibold ${sentimentStyle.badge}`}
            >
              <span
                className={`h-2 w-2 rounded-full ${sentimentStyle.dot}`}
              />
              {sentimentStyle.label}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

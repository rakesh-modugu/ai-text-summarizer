// index.js - Simple AI Text Summarizer CLI

import dotenv from "dotenv";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

// check API key
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.log("Error: Please add GEMINI_API_KEY in .env file");
  process.exit(1);
}

// read input from file
function readFile(filePath) {
  if (!filePath) {
    console.log("Usage: node index.js <file.txt>");
    process.exit(1);
  }

  if (!fs.existsSync(filePath)) {
    console.log("File not found");
    process.exit(1);
  }

  return fs.readFileSync(filePath, "utf-8");
}

// create prompt
function createPrompt(text) {
  return `
Analyze this text and return ONLY JSON:

{
  "summary": "one sentence",
  "keyPoints": ["point1", "point2", "point3"],
  "sentiment": "positive | neutral | negative"
}

Text:
${text}
`;
}

// print output
function printOutput(data) {
  console.log("\n===== RESULT =====\n");
  console.log("Summary:");
  console.log(data.summary);

  console.log("\nKey Points:");
  data.keyPoints.forEach((p, i) => {
    console.log(`${i + 1}. ${p}`);
  });

  console.log("\nSentiment:");
  console.log(data.sentiment);
}

// main function
async function main() {
  const filePath = process.argv[2];
  const text = readFile(filePath);

  const ai = new GoogleGenAI({ apiKey });

  try {
    const res = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: createPrompt(text),
    });

    let output = res.text.trim();

    // remove markdown if exists
    output = output.replace(/```json|```/g, "").trim();

    const data = JSON.parse(output);

    printOutput(data);
  } catch (error) {
    console.log("Something went wrong:", error.message);
  }
}

main();
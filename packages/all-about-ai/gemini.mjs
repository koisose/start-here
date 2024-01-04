import { GoogleGenerativeAI } from "@google/generative-ai";
import ky from "ky";
async function listModel(API_KEY) {
  const response = await ky
    .get(
      "https://generativelanguage.googleapis.com/v1beta/models?key=" + API_KEY,
    )
    .json();
  return response;
}
export async function textGenerate(API_KEY, prompt) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const allModel = await listModel(API_KEY);
  const geminiProTokenLimit = allModel.models[3].inputTokenLimit;
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const { totalTokens } = await model.countTokens(prompt);
  if (totalTokens <= geminiProTokenLimit) {
    const result = await model.generateContentStream(prompt);
    return result.stream;
  }
}

async function run() {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: "Hello, I have 2 dogs in my house.",
      },
      {
        role: "model",
        parts: "Great to meet you. What would you like to know?",
      },
    ],
    generationConfig: {
      maxOutputTokens: 100,
    },
  });

  const msg = "How many paws are in my house?";

  const result = await chat.sendMessage(msg);
  const response = await result.response;
  const text = response.text();
  console.log(text);
}

import express from "express";
import ViteExpress from "vite-express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

// eslint-disable-next-line no-undef
const geminiApiKey = process.env["GEMINI_API_KEY"];
const genAI = new GoogleGenerativeAI(geminiApiKey);

app.get("/message", (_, res) => res.send("Hello from express!"));

app.post("/api/generateResponseToText", async (req, res) => {
  const { prompt } = req.body;

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  res.json({ text });
});

app.post("/api/flashGenerateResponseToTextAndImage", async (req, res) => {
  const { prompt, imageData, mimeType } = req.body;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

  const result = await model.generateContent([
    prompt,
    { inlineData: { data: imageData, mimeType: mimeType } },
  ]);
  const response = result.response;
  const text = response.text();
  res.json({ text });
});

app.post("/api/proGenerateResponseToTextAndImage", async (req, res) => {
  const { prompt, imageData, mimeType } = req.body;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

  const result = await model.generateContent([
    prompt,
    { inlineData: { data: imageData, mimeType: mimeType } },
  ]);
  const response = result.response;
  const text = response.text();
  res.json({ text });
});



// eslint-disable-next-line no-undef
const port = process.env.NODE_ENV === "production" ? 8080 : 3000;

ViteExpress.listen(app, port, () => console.log("Server is listening..."));

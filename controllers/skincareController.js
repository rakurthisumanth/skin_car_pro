import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import genAI from "../config/geminiai.js";
import dotenv from "dotenv";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Correct path to skincareData.json
const dataPath = path.resolve(__dirname, "../models/skincareData.json");

const skincareData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

export const getSkincareAdvice = async (req, res) => {
  try {
    const { skinType, moisturizer, problem } = req.body;

    // Rule-based part
    let ruleAdvice =
      skincareData[skinType]?.general || "No base advice available.";
    let problemAdvice =
      skincareData[skinType]?.problems[problem] ||
      "No specific problem advice found.";

    let combinedAdvice = `Based on rules:
- General: ${ruleAdvice}
- Problem: ${problemAdvice}
- Current moisturizer: ${moisturizer}
    `;

    // Gemini AI part
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are a professional skincare expert. 
User info: 
- Skin type: ${skinType} 
- Moisturizer: ${moisturizer} 
- Problem: ${problem}

Rule-based advice: 
${combinedAdvice}

Please generate a natural skincare recommendation.`;

    const result = await model.generateContent(prompt);
    const aiText = result.response.text();

    res.json({
      rule_based: combinedAdvice,
      ai_response: aiText
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong with Gemini AI." });
  }
};

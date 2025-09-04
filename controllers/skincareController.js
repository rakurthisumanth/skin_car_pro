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
    const {
      skinType,
      moisturizer,
      problem,
      oilyMorning, // yes/no
      tightAfterWash, // yes/no
      waterIntake, // 0-2, 3-5, 6-8, 8+
      currentProducts, // array of ["cleanser", "toner", "serum", ...]
      sleepHours, // <4, 4-6, 6-8, 8+
      skinGoal, // Radiant, Hydration, Oil Control, Anti-aging, Even Tone
    } = req.body;

    // ✅ Rule-based part (still uses your skincareData object)
    let ruleAdvice =
      skincareData[skinType]?.general || "No base advice available.";
    let problemAdvice =
      skincareData[skinType]?.problems?.[problem] ||
      "No specific problem advice found.";

    let combinedAdvice = `Based on rules:
- General: ${ruleAdvice}
- Problem: ${problemAdvice}
- Current moisturizer: ${moisturizer}
    `;

    // ✅ Build user answers from questionnaire
    let questionnaire = `
Additional Questions:
1) Do you feel your skin is oily in the morning? -> ${oilyMorning}
2) Does your skin feel tight after washing? -> ${tightAfterWash}
3) How many glasses of water do you drink daily? -> ${waterIntake}
4) What products are you currently using? -> ${currentProducts?.join(", ") || "None"}
5) How many hours of sleep do you have? -> ${sleepHours}
6) What's your skin goal? -> ${skinGoal}
    `;

    // ✅ AI prompt
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are a professional skincare expert. 
User info: 
- Skin type: ${skinType} 
- Moisturizer: ${moisturizer} 
- Problem: ${problem}

Rule-based advice: 
${combinedAdvice}

User questionnaire answers:
${questionnaire}

👉 Please generate a natural, personalized skincare recommendation considering BOTH the rule-based advice and the questionnaire answers.
`;

    const result = await model.generateContent(prompt);
    const aiText = result.response.text();

    res.json({
      rule_based: combinedAdvice,
      questionnaire: questionnaire,
      ai_response: aiText,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong with Gemini AI." });
  }
};


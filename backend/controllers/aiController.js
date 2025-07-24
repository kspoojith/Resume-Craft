import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';

export const enhanceLatex = async (req, res) => {
  const { latexCode, clsCode, prompt } = req.body;
  if (!latexCode || !prompt) {
    return res.status(400).json({ message: 'Missing LaTeX or prompt' });
  }

  try {
    const COHERE_API_KEY = process.env.COHERE_API_KEY;
    let userPrompt = `Enhance this LaTeX resume with the following prompt:\n${prompt}\nResume LaTeX:\n${latexCode}`;
    if (clsCode) {
      userPrompt += `\n\nResume CLS file:\n${clsCode}`;
    }
    const systemPrompt = `
You are a LaTeX resume expert.
Only modify the LaTeX code as requested in the prompt.
Do NOT add explanations, comments, or extra text.
Return only valid, compilable LaTeX code (and .cls if provided).
Preserve all structure and packages unless the prompt says otherwise.
`;

    const response = await axios.post(
      "https://api.cohere.ai/v1/chat",
      {
        model: "command-r-plus", // or "command" for free tier
        message: userPrompt,
        chat_history: [
          { role: "SYSTEM", message: systemPrompt }
        ],
        temperature: 0.2,
        max_tokens: 2048
      },
      {
        headers: {
          "Authorization": `Bearer ${COHERE_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    // Extract the code from the response
    const aiContent = response.data.text || response.data.message || response.data.generations?.[0]?.text || "";
    // Optionally, extract only the code block if markdown is returned
    const latexMatch = aiContent.match(/```latex([\s\S]*?)```/i);
    const enhancedLatex = latexMatch ? latexMatch[1].trim() : aiContent.trim();

    res.json({ latexCode: enhancedLatex });
  } catch (error) {
    console.error('Cohere API error:', error?.response?.data || error.message);
    res.status(500).json({ message: 'AI enhancement failed', error: error?.response?.data || error.message });
  }
};

export const analyzeResume = async (req, res) => {
  const { latexCode, title } = req.body;
  if (!latexCode) return res.status(400).json({ message: "Missing LaTeX code" });

  try {
    const COHERE_API_KEY = process.env.COHERE_API_KEY;
    const prompt = `
You are an ATS (Applicant Tracking System) and career expert.
Analyze the following resume (in LaTeX) and provide:
- An ATS score (0-100) based on how well it would pass automated screening.
- A list of 5 job titles this candidate is a good fit for.
- A list of 5 keywords or skills to add or improve for better ATS results.
- A 2-3 sentence summary of the resume's strengths and weaknesses.

Return your answer as a JSON object with keys: atsScore, suggestedJobs, keywords, summary.

Resume Title: ${title}
Resume LaTeX:
${latexCode}
`;

    const response = await axios.post(
      "https://api.cohere.ai/v1/chat",
      {
        model: "command-r-plus", // or "command" for free tier
        message: prompt,
        temperature: 0.2,
        max_tokens: 1024
      },
      {
        headers: {
          "Authorization": `Bearer ${COHERE_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    // Try to parse JSON from the AI's response
    let data = response.data.text || response.data.message || response.data.generations?.[0]?.text || "";
    try {
      data = JSON.parse(data);
    } catch {
      // fallback: try to extract JSON from text
      const match = data.match(/\{[\s\S]*\}/);
      data = match ? JSON.parse(match[0]) : {};
    }

    res.json(data);
  } catch (error) {
    console.error("AI analysis error:", error?.response?.data || error.message);
    res.status(500).json({ message: "AI analysis failed", error: error?.response?.data || error.message });
  }
};

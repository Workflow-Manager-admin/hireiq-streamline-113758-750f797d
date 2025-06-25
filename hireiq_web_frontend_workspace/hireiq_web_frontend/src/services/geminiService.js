import axios from 'axios';

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Helper to form Gemini API request
async function callGeminiAPI(prompt) {
  try {
    const res = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] }
    );
    const text = res.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return text;
  } catch (err) {
    return '';
  }
}

// PUBLIC_INTERFACE
export async function parseResumeAI(resumeText, jobDescription) {
  const prompt = `You are an AI resume assistant. Given the following resume and job description, extract and summarize key skills and experience a recruiter might want.\nResume:\n${resumeText}\nJob Description:\n${jobDescription}`;
  return callGeminiAPI(prompt);
}

// PUBLIC_INTERFACE
export async function scoreResumeAI(resumeText, jobDescription) {
  const prompt = `As a recruitment AI, provide a numeric match score (0-100) and a short justification based on how well this resume matches the job description:\nResume:\n${resumeText}\nJob:\n${jobDescription}\nRespond with "Score: X/100\nExplanation: ..."`;
  return callGeminiAPI(prompt);
}

// PUBLIC_INTERFACE
export async function generateInterviewQuestionsAI(jobDescription, resumeText) {
  const prompt = `Generate 5 tailored interview questions for this candidate based on the following job description and their resume:\nJob Description:\n${jobDescription}\nResume:\n${resumeText}`;
  return callGeminiAPI(prompt);
}

// PUBLIC_INTERFACE
export async function generateFeedbackAI(interviewNotes, jobDescription) {
  const prompt = `Write concise, constructive feedback for a candidate, given these notes from the interview and the job requirements:\nInterview Notes:\n${interviewNotes}\nJob Description:\n${jobDescription}`;
  return callGeminiAPI(prompt);
}

import { GoogleGenAI } from "@google/genai";

export const getGeminiModel = () => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
  return ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Hello",
  });
};

export const generateDoseAdvice = async (profile: any, query: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Você é o assistente "Dose na Medida" do app Erva na Medida. 
    O usuário tem o seguinte perfil: ${JSON.stringify(profile)}.
    Pergunta do usuário: ${query}
    Forneça orientações sobre dosagem segura, redução de danos e integração com bem-estar/treino. 
    Seja profissional, empático e focado em saúde.`,
  });
  return response.text;
};

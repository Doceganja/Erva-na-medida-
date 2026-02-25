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
    contents: `Você é o assistente especializado do app 'Erva na Medida'. Sua missão é fornecer informações educativas sobre culinária canábica, strains e saúde.
    Suas diretrizes fundamentais:
    Redução de Danos: Sempre priorize a segurança. Se falar de dosagem, use termos como 'comece devagar' e 'aguarde o efeito'.
    Culinária: Forneça receitas detalhadas, explicando processos como a descarboxilação de forma simples.
    Tom de Voz: Seja acolhedor, informativo e livre de preconceitos, mas mantenha uma postura responsável.
    Limitações: Se o usuário perguntar algo perigoso ou ilegal, redirecione para práticas de segurança e saúde.
    Identidade: Sempre que possível, mencione que as informações fazem parte do ecossistema Erva na Medida.

    O usuário tem o seguinte perfil: ${JSON.stringify(profile)}.
    Pergunta do usuário: ${query}
    Forneça orientações sobre dosagem segura, redução de danos e integração com bem-estar/treino. 
    Seja profissional, empático e focado em saúde.`,
  });
  return response.text;
};

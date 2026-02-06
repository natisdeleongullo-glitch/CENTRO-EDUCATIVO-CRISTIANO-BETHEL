
import { GoogleGenAI, Type } from "@google/genai";
import { Student } from "../types";

// Always use process.env.API_KEY directly for initialization as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAcademicInsights = async (students: Student[]) => {
  const prompt = `Analiza los siguientes datos de estudiantes y proporciona un reporte de alertas tempranas. 
  Identifica estudiantes en riesgo de deserción o bajo rendimiento.
  Estudiantes: ${JSON.stringify(students.map(s => ({ name: s.name, grade: s.grade, attendance: s.attendance, average: s.averageGrade })))}
  
  Responde en formato JSON con una lista de alertas. Cada alerta debe tener: "estudiante", "riesgo" (Alto, Medio, Bajo), "razon" y "recomendacion".`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              estudiante: { type: Type.STRING },
              riesgo: { type: Type.STRING },
              razon: { type: Type.STRING },
              recomendacion: { type: Type.STRING }
            },
            required: ["estudiante", "riesgo", "razon", "recomendacion"]
          }
        }
      }
    });

    // Use .text property directly
    const text = response.text;
    if (text) {
      return JSON.parse(text);
    }
    return [];
  } catch (error) {
    console.error("Error fetching AI insights:", error);
    return [];
  }
};

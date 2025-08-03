import { GoogleGenAI } from "@google/genai";
import { promptTemplate } from "./prompts";
import { generatePDF, convertTextToHTML, generateTimestampedFilename } from "./pdfGenerator";
import { mockJson } from "./mockJson";

// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_KEY = 'AIzaSyBV6Stqb93oXaJh0UNlOwnY1cC8hpOtOBE';

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function generateReport(data: any, filename?: string) {
  const prompt = promptTemplate
    .replace("{0}", JSON.stringify(data))
    .replace("[Current Date]", new Date().toLocaleDateString());

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  
  const reportText = response.text;
  if (!reportText) {
    throw new Error('No response text received from Gemini API');
  }
  console.log(reportText);

  // Convert the report text to HTML format
  const htmlContent = convertTextToHTML(reportText);

  // Use provided filename or generate a default one
  const finalFilename = filename || generateTimestampedFilename('patient-sentiment-report');

  try {
    await generatePDF(htmlContent, finalFilename);
    return finalFilename; // Return the filename used
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    throw error;
  }
}
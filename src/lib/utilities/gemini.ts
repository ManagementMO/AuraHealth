import { GoogleGenAI } from "@google/genai";
import { promptTemplate } from "./prompts";
import { generatePDF, convertTextToHTML, generateTimestampedFilename } from "./pdfGenerator";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function generateReport(data: any) {
  const prompt = promptTemplate.replace("{0}", JSON.stringify(data));

  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    contents: prompt,
  });
  
  const reportText = response.text;
  if (!reportText) {
    throw new Error('No response text received from Gemini API');
  }
  console.log(reportText);

  // Convert the report text to HTML format
  const htmlContent = convertTextToHTML(reportText);

  // Generate timestamped filename
  const filename = generateTimestampedFilename('patient-sentiment-report');

  try {
    await generatePDF(htmlContent, filename);
  } catch (error) {
    console.error('Failed to generate PDF:', error);
  }
}
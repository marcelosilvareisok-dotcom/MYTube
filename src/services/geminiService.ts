import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getRecommendedVideos(currentVideoTitle: string, allVideos: any[]) {
  const model = "gemini-3-flash-preview";
  const prompt = `Given the current video title "${currentVideoTitle}", and a list of available videos: ${JSON.stringify(allVideos.map(v => ({ id: v.id, title: v.title })))}, recommend the top 3 most relevant video IDs. Return only a JSON array of IDs.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ parts: [{ text: prompt }] }],
    });

    const text = response.text;
    const match = text.match(/\[.*\]/s);
    if (match) {
      return JSON.parse(match[0]);
    }
    return [];
  } catch (error) {
    console.error("AI Recommendation error:", error);
    return [];
  }
}

export async function generateThumbnailSuggestion(title: string, description: string) {
  const model = "gemini-3-flash-preview";
  const prompt = `Suggest a visual description for a YouTube thumbnail for a video titled "${title}" with description "${description}". Keep it short and descriptive.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ parts: [{ text: prompt }] }],
    });
    return response.text;
  } catch (error) {
    console.error("AI Thumbnail suggestion error:", error);
    return "A vibrant and engaging scene related to the video content.";
  }
}

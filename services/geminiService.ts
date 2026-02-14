import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, StudioSettings, Environment } from "../types";

// Helper to remove the data URL prefix for the API
const stripBase64Prefix = (base64: string) => {
  return base64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
};

const getMimeType = (base64: string) => {
  const match = base64.match(/^data:(image\/\w+);base64,/);
  return match ? match[1] : 'image/jpeg';
};

export const generateTryOnImage = async (
  personImage: string,
  itemImages: string[],
  settings: StudioSettings
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const personData = stripBase64Prefix(personImage);
    const personMime = getMimeType(personImage);

    // Prepare all item parts
    const itemParts = itemImages.map((img) => ({
      inlineData: {
        mimeType: getMimeType(img),
        data: stripBase64Prefix(img)
      }
    }));

    // Using gemini-3-pro-image-preview for high quality generation
    const model = "gemini-3-pro-image-preview";

    // Handle Custom Background Logic
    let backgroundDesc = settings.environment;
    if (settings.environment === Environment.CUSTOM && settings.customEnvironment) {
      backgroundDesc = settings.customEnvironment as any;
    }

    // Construct Advanced Prompt
    const texturePrompt = settings.enhanceTexture ? "Make fabric textures (wool, silk, leather, denim) extremely detailed and tactile." : "";
    const grainPrompt = settings.filmGrain ? "Add subtle analog film grain for a cinematic texture." : "Ensure clean, noise-free digital image quality.";
    const beautyPrompt = settings.beautyFilter ? "Apply professional high-end skin retouching while maintaining natural pores." : "Keep skin texture raw and realistic.";

    const prompt = `
      Create a high-fashion, professional photoshoot image.
      
      SUBJECT REFERENCE:
      - The person in the FIRST image is the subject.
      - PRESERVE: Facial identity, skin tone, body shape, and hair style exactly.
      
      WARDROBE STYLING:
      - Dress the subject in the item(s) provided in the subsequent images.
      - FIT: Ensure the clothing fits naturally on the subject's body pose.
      - ${texturePrompt}
      
      CAMERA & LENS SETUP:
      - Focal Length: ${settings.focalLength}.
      - Aperture: ${settings.depthOfField}.
      - Perspective: Matches the focal length choice (e.g. compression for telephoto, distortion for wide).
      
      POSING & ACTION:
      - Pose: ${settings.pose}.
      - Expression: Professional model expression matching the vibe.
      
      LIGHTING & ATMOSPHERE:
      - Lighting Setup: ${settings.lighting}.
      - Environment: ${backgroundDesc}.
      - Color Grading: ${settings.colorGrade}.
      
      POST-PROCESSING:
      - ${grainPrompt}
      - ${beautyPrompt}
      - Quality: 4K, Editorial Standard.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { inlineData: { mimeType: personMime, data: personData } },
          ...itemParts,
          { text: prompt }
        ]
      },
      config: {
        imageConfig: {
          imageSize: "1K", // High quality
          aspectRatio: settings.aspectRatio // Uses the new aspect ratio setting
        }
      }
    });

    // Extract image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image generated.");
  } catch (error) {
    console.error("Generation error:", error);
    throw error;
  }
};

export const analyzeFashionMatch = async (
  generatedImage: string,
  originalPersonImage: string
): Promise<AnalysisResult> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const model = "gemini-3-pro-preview";
    
    const genData = stripBase64Prefix(generatedImage);
    const orgData = stripBase64Prefix(originalPersonImage);

    const prompt = `
      Act as a high-end fashion editor. 
      Analyze the generated outfit image compared to the original person.
      
      Provide a JSON response:
      {
        "critique": "Professional critique of the fit, styling, and visual impact.",
        "rating": 8,
        "matchScore": 85,
        "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
      }
    `;

    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/png', data: orgData } }, 
          { inlineData: { mimeType: 'image/png', data: genData } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            critique: { type: Type.STRING },
            rating: { type: Type.NUMBER },
            matchScore: { type: Type.NUMBER },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No analysis returned");
    
    return JSON.parse(text) as AnalysisResult;

  } catch (error) {
    console.error("Analysis error:", error);
    return {
      critique: "Analysis currently unavailable.",
      rating: 0,
      matchScore: 0,
      suggestions: []
    };
  }
};

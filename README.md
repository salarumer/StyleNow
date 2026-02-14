# LuxeFit AI Stylist

LuxeFit AI Stylist is a Next-Gen virtual try-on application powered by Google's **Gemini 3 Pro** multimodal models. It acts as your personal AI fashion designer, allowing you to visualize how specific clothing items or accessories look on you and providing professional stylistic analysis.

## Features

*   **Virtual Try-On**: Upload a photo of yourself and an item (shirt, glasses, gloves, etc.), and the AI will realistically composite the item onto your photo.
*   **Multi-Angle Generation**: View the result from different perspectives (Front, Side, Closeup, Full Body, Back) without needing new source photos.
*   **AI Fashion Critic**: Get a detailed "Stylist's Verdict" analyzing the fit, color coordination, and overall aesthetic. The AI provides a match score (0-100%) and actionable suggestions.
*   **Smart Analysis Caching**: The fashion analysis runs once per outfit combination. changing angles generates new visuals but preserves the initial stylistic critique to save time and resources.
*   **Drag & Drop Interface**: Easily drag images from your desktop directly into the upload zones.

## Tech Stack

*   **Frontend**: React 19 (via ESM), Tailwind CSS
*   **AI Models**:
    *   `gemini-3-pro-image-preview`: For high-fidelity image generation and manipulation.
    *   `gemini-3-pro-preview`: For deep reasoning and fashion analysis.
*   **SDK**: Google GenAI SDK (`@google/genai`)

## Setup & Usage

1.  **API Key**: This app requires a Google Cloud Project with the Gemini API enabled.
    *   When you launch the app, you will be prompted to select your API Key via the Google AI Studio integration.
    *   *Note: Using Gemini 3 Pro image generation requires a paid/billing-enabled project.*

2.  **Running the App**:
    *   This project is designed to run in a browser-based environment that supports ES modules (like StackBlitz, Replit, or a local Vite setup).
    *   Simply open `index.html` via a local server.

3.  **How to use**:
    *   **Step 1**: Drag & drop or upload a photo of a person.
    *   **Step 2**: Drag & drop or upload a photo of an item (e.g., a leather jacket).
    *   **Step 3**: Click "Try On Now".
    *   **Step 4**: Read the analysis and click the angle buttons (Side, Closeup, etc.) to see different views.

## Metadata

*   **Permissions**: Access to local file system for uploads (handled via browser standard input). Camera permission is not required.

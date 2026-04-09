# Segregates Rights-Detection-System ♻️

An advanced, full-stack AI Waste Classification application designed to optimize recycling accuracy and environmental sustainability. 

## Features
- **Intelligent Classification:** Uses Google's Gemini-3 Flash AI via secure proxy to categorize waste into WET, DRY, or HAZARD bins.
- **Multimodal Inputs:** Seamlessly analyzes items via text search, live webcam capture, or local image file uploads.
- **Data Persistence:** Built-in `localStorage` saves your historical scans and automatically maps your environmental impact.
- **Analytics Dashboard:** Visualizes your waste categorization trends dynamically using Recharts.
- **Secure Prototype Authentication:** Shields the application with an aesthetic glassmorphic login barrier.

## Tech Stack
- **Frontend:** React 19, Vite, Tailwind CSS v4, Framer Motion, TypeScript
- **Backend:** Node.js, Express.js
- **AI Integration:** `@google/genai` (Gemini API)
- **Data Visualization:** Recharts
- **Icons:** Lucide React

## Local Development
To run this application locally, you will need two terminals running simultaneously to serve the API proxy and the client interface.

**1. Setup Environment Variables**
Create a `.env` file in your root folder:
```bash
GEMINI_API_KEY="Your-Google-Gemini-Key-Here"
APP_URL="http://localhost:3000"
```

**2. Start the Backend API (Terminal 1)**
```bash
npm run server
```
*(This launches the Express proxy on port 3001, protecting your AI key from the client bundle).*

**3. Start the Frontend (Terminal 2)**
```bash
npm run dev
```

Visit `http://localhost:3000` to interact with the prototype.

## Security Overview
This architecture ensures your `GEMINI_API_KEY` never leaks to the browser. All AI prompts are executed completely Server-Side in `server/classify.ts`, and the Vite proxy safely redirects frontend fetch calls.

import "dotenv/config";
import express from "express";
import { classifyByText, classifyByImage } from "./classify";

const app = express();
const PORT = parseInt(process.env.PORT || "3001", 10);

// Parse JSON bodies — 10 MB limit to handle base64-encoded camera images
app.use(express.json({ limit: "10mb" }));

// ---------------------------------------------------------------------------
// POST /api/classify/text
// Body: { "text": "banana peel" }
// Returns: WasteResult JSON
// ---------------------------------------------------------------------------
app.post("/api/classify/text", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string" || !text.trim()) {
      res.status(400).json({ error: "Missing or empty 'text' field." });
      return;
    }

    const result = await classifyByText(text.trim());
    res.json(result);
  } catch (err: any) {
    console.error("[/api/classify/text] Error:", err?.message || err);
    res.status(500).json({ error: "Classification failed. Please try again." });
  }
});

// ---------------------------------------------------------------------------
// POST /api/classify/image
// Body: { "image": "data:image/jpeg;base64,/9j/4AAQ..." }
// Returns: WasteResult JSON
// ---------------------------------------------------------------------------
app.post("/api/classify/image", async (req, res) => {
  try {
    const { image } = req.body;

    if (!image || typeof image !== "string") {
      res.status(400).json({ error: "Missing or invalid 'image' field." });
      return;
    }

    const result = await classifyByImage(image);
    res.json(result);
  } catch (err: any) {
    console.error("[/api/classify/image] Error:", err?.message || err);
    res.status(500).json({ error: "Image classification failed. Please try again." });
  }
});

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`✅ SegregateRight API server running on http://localhost:${PORT}`);
});

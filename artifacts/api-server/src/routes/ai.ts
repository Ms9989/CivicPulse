import { Router } from "express";
import { ai } from "@workspace/integrations-gemini-ai";
import { db } from "@workspace/db";
import { complaintsTable } from "@workspace/db";
import { desc } from "drizzle-orm";

const router = Router();

router.post("/ai/analyze", async (req, res) => {
  try {
    const { title, description, location } = req.body;

    if (!title || !description || !location) {
      return res.status(400).json({ error: "Title, description, and location required" });
    }

    const existing = await db.select({
      id: complaintsTable.id,
      title: complaintsTable.title,
      description: complaintsTable.description,
    }).from(complaintsTable).orderBy(desc(complaintsTable.createdAt)).limit(30);

    const prompt = `You are an AI civic decision support system. Analyze this complaint and return ONLY valid JSON.

Complaint:
Title: ${title}
Description: ${description}
Location: ${location}

Existing complaints (for duplicate detection):
${existing.map(c => `ID ${c.id}: ${c.title} - ${c.description.slice(0, 100)}`).join("\n") || "None"}

Return this exact JSON:
{
  "category": "Road/Water/Electricity/Sanitation/Traffic/Other",
  "severity": "critical/high/medium/low",
  "priority": "critical/high/medium/low",
  "department": "Road Department/Water Department/Electricity/Sanitation/Traffic",
  "impactScore": 0.0-10.0,
  "duplicateProbability": 0.0-1.0,
  "recommendedCrew": 1-20,
  "equipmentRequired": ["item1"],
  "estimatedResponseTime": "e.g. 2-4 hours",
  "recommendation": "brief action",
  "similarComplaints": []
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { maxOutputTokens: 8192, responseMimeType: "application/json" },
    });

    const text = response.text ?? "{}";
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const analysis = JSON.parse(cleaned);

    return res.json(analysis);
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "AI analysis failed" });
  }
});

export default router;

import { Router } from "express";
import { db } from "@workspace/db";
import { complaintsTable } from "@workspace/db";
import { eq, like, and, desc, count, sql } from "drizzle-orm";
import { ai } from "@workspace/integrations-gemini-ai";

const router = Router();

async function runAIAnalysis(title: string, description: string, location: string, existingComplaints: { title: string; description: string; id: number }[]) {
  const prompt = `You are an AI civic decision support system. Analyze the following complaint and return ONLY valid JSON with no markdown, no code blocks, no extra text.

Complaint:
Title: ${title}
Description: ${description}
Location: ${location}

Existing complaints in system (for duplicate detection):
${existingComplaints.slice(0, 20).map(c => `ID ${c.id}: ${c.title} - ${c.description.slice(0, 100)}`).join("\n") || "None"}

Return this exact JSON structure:
{
  "category": "Road/Water/Electricity/Sanitation/Traffic/Other",
  "severity": "critical/high/medium/low",
  "priority": "critical/high/medium/low",
  "department": "Road Department/Water Department/Electricity/Sanitation/Traffic",
  "impactScore": 0.0-10.0,
  "duplicateProbability": 0.0-1.0,
  "recommendedCrew": 1-20,
  "equipmentRequired": ["item1", "item2"],
  "estimatedResponseTime": "e.g. 2-4 hours",
  "recommendation": "brief action recommendation",
  "similarComplaints": [list of IDs of similar complaints from existing list, empty array if none]
}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: { maxOutputTokens: 8192, responseMimeType: "application/json" },
  });

  const text = response.text ?? "{}";
  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(cleaned);
}

router.get("/complaints", async (req, res) => {
  try {
    const { status, priority, department, search, page = "1", limit = "20" } = req.query as Record<string, string>;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const offset = (pageNum - 1) * limitNum;

    const conditions = [];
    if (status) conditions.push(eq(complaintsTable.status, status));
    if (priority) conditions.push(eq(complaintsTable.priority, priority));
    if (department) conditions.push(eq(complaintsTable.department, department));
    if (search) conditions.push(like(complaintsTable.title, `%${search}%`));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, totalResult] = await Promise.all([
      db.select().from(complaintsTable)
        .where(where)
        .orderBy(desc(complaintsTable.createdAt))
        .limit(limitNum)
        .offset(offset),
      db.select({ count: count() }).from(complaintsTable).where(where),
    ]);

    return res.json({
      data,
      total: totalResult[0]?.count ?? 0,
      page: pageNum,
      limit: limitNum,
    });
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/complaints", async (req, res) => {
  try {
    const { title, description, location, landmark, ward, imageUrl } = req.body;

    if (!title || !description || !location) {
      return res.status(400).json({ error: "Title, description, and location are required" });
    }

    // Get existing complaints for duplicate detection
    const existing = await db.select({
      id: complaintsTable.id,
      title: complaintsTable.title,
      description: complaintsTable.description,
    }).from(complaintsTable).limit(50).orderBy(desc(complaintsTable.createdAt));

    // Run AI analysis
    let aiAnalysis = null;
    let category = null;
    let severity = null;
    let priority = null;
    let department = null;
    let impactScore = null;
    let duplicateCount = 0;

    try {
      aiAnalysis = await runAIAnalysis(title, description, location, existing);
      category = aiAnalysis.category;
      severity = aiAnalysis.severity;
      priority = aiAnalysis.priority;
      department = aiAnalysis.department;
      impactScore = aiAnalysis.impactScore;
      duplicateCount = aiAnalysis.similarComplaints?.length ?? 0;
    } catch (aiErr) {
      req.log.warn({ err: aiErr }, "AI analysis failed, continuing without it");
    }

    const [complaint] = await db.insert(complaintsTable).values({
      title,
      description,
      location,
      landmark: landmark || null,
      ward: ward || null,
      imageUrl: imageUrl || null,
      status: "pending",
      priority,
      category,
      department,
      severity,
      impactScore,
      duplicateCount,
      aiAnalysis,
    }).returning();

    return res.status(201).json(complaint);
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/complaints/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [complaint] = await db.select().from(complaintsTable).where(eq(complaintsTable.id, id)).limit(1);

    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    return res.json(complaint);
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/complaints/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status, priority, department, ward } = req.body;

    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (status !== undefined) updates.status = status;
    if (priority !== undefined) updates.priority = priority;
    if (department !== undefined) updates.department = department;
    if (ward !== undefined) updates.ward = ward;

    const [updated] = await db.update(complaintsTable)
      .set(updates)
      .where(eq(complaintsTable.id, id))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    return res.json(updated);
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/complaints/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(complaintsTable).where(eq(complaintsTable.id, id));
    return res.status(204).send();
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/complaints/:id/analyze", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [complaint] = await db.select().from(complaintsTable).where(eq(complaintsTable.id, id)).limit(1);

    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    const existing = await db.select({
      id: complaintsTable.id,
      title: complaintsTable.title,
      description: complaintsTable.description,
    }).from(complaintsTable).limit(50);

    const analysis = await runAIAnalysis(complaint.title, complaint.description, complaint.location, existing.filter(c => c.id !== id));

    await db.update(complaintsTable).set({
      aiAnalysis: analysis,
      category: analysis.category,
      severity: analysis.severity,
      priority: analysis.priority,
      department: analysis.department,
      impactScore: analysis.impactScore,
      duplicateCount: analysis.similarComplaints?.length ?? 0,
      updatedAt: new Date(),
    }).where(eq(complaintsTable.id, id));

    return res.json(analysis);
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

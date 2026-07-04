import { Router } from "express";
import { db } from "@workspace/db";
import { departmentsTable, complaintsTable } from "@workspace/db";
import { eq, desc, count, sql } from "drizzle-orm";

const router = Router();

router.get("/departments", async (req, res) => {
  try {
    const depts = await db.select().from(departmentsTable).orderBy(departmentsTable.name);

    const result = await Promise.all(depts.map(async (dept) => {
      const [pending] = await db.select({ count: count() })
        .from(complaintsTable)
        .where(sql`${complaintsTable.department} = ${dept.name} AND ${complaintsTable.status} != 'resolved'`);

      const [resolved] = await db.select({ count: count() })
        .from(complaintsTable)
        .where(sql`${complaintsTable.department} = ${dept.name} AND ${complaintsTable.status} = 'resolved'`);

      return {
        ...dept,
        pendingCount: pending?.count ?? 0,
        resolvedCount: resolved?.count ?? 0,
        avgPriority: null,
      };
    }));

    return res.json(result);
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/departments/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [dept] = await db.select().from(departmentsTable).where(eq(departmentsTable.id, id)).limit(1);

    if (!dept) {
      return res.status(404).json({ error: "Department not found" });
    }

    const [pending] = await db.select({ count: count() })
      .from(complaintsTable)
      .where(sql`${complaintsTable.department} = ${dept.name} AND ${complaintsTable.status} != 'resolved'`);

    const [resolved] = await db.select({ count: count() })
      .from(complaintsTable)
      .where(sql`${complaintsTable.department} = ${dept.name} AND ${complaintsTable.status} = 'resolved'`);

    const recentComplaints = await db.select()
      .from(complaintsTable)
      .where(eq(complaintsTable.department, dept.name))
      .orderBy(desc(complaintsTable.createdAt))
      .limit(10);

    const pendingCount = pending?.count ?? 0;
    const resolvedCount = resolved?.count ?? 0;
    const total = pendingCount + resolvedCount;
    const performanceScore = total > 0 ? Math.round((resolvedCount / total) * 100) : 0;

    return res.json({
      ...dept,
      pendingCount,
      resolvedCount,
      avgPriority: null,
      recentComplaints,
      performanceScore,
      weeklyResolved: resolvedCount,
    });
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
